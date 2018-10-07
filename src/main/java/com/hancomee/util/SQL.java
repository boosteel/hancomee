package com.hancomee.util;

import com.hancomee.util.db.NamedPreparedStatementFactory;
import com.hancomee.util.db.NamedTuple;

import java.sql.*;
import java.util.*;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.hancomee.util.DataConverter.exp_to_sql;

public class SQL {


    /*
     *  Map이 가지고 있는 properties를 이용해 SQL을 작성한다.
     *  Map의 value값이 가진 Java타입에 따라 SQL 데이터타입이 결정된다.
     */
    public static final String insert(String tableName, Map<String, Object> value) {
        List<Map<String, Object>> values = new ArrayList<>();
        values.add(value);
        return insert(tableName, values);
    }

    public static final String insert(String tableName, List<Map<String, Object>> values) {
        Set<String> keys = values.get(0).keySet();
        StringBuffer buf = new StringBuffer("INSERT INTO ")
                .append(tableName)
                .append(" (")
                .append(columns(keys))
                .append(") values ");
        return values(keys, values, buf).toString();
    }


    /*
     *   WHERE id = {val} 로만 업데이트 할때 쓴다.
     *   value는 반드시 id를 가지고 있어야 한다.
     */
    public static final String update(String tableName, Map<String, Object> value) {

        Object id = value.get("id");
        value.remove("id");

        if (id == null)
            throw new RuntimeException("반드시 {id}를 가지고 있어야 합니다.");

        StringBuffer buf = new StringBuffer("UPDATE ")
                .append(tableName)
                .append(" SET ");

        for (Map.Entry<String, Object> entry : value.entrySet()) {
            buf.append(entry.getKey()).append(" = ").append(DataConverter.sql_by_jType(entry.getValue())).append(", ");
        }

        return buf.delete(buf.length() - 2, buf.length())
                .append(" WHERE id = " + id)        // 이거 없으면 진짜 개좆되는 수가 있다.
                .toString();
    }


    // ****************

    public static final String selectPrefix(String str, String prefix) {
        prefix = prefix + ".";
        return prefix + str.replaceAll("\\s+", ", " + prefix);
    }


    // 컬럼명 기재
    public static StringBuffer columns(Iterable<String> keys) {
        return columns(keys, new StringBuffer());
    }

    public static StringBuffer columns(Iterable<String> keys, StringBuffer buffer) {
        return buffer.append(String.join(", ", keys));
    }


    // values 이하 작성
    public static StringBuffer values(Map<String, Object> values) {
        return values(values.keySet(), values, new StringBuffer());
    }

    public static StringBuffer values(Set<String> keys, Map<String, Object> values) {
        return values(keys, values, new StringBuffer());
    }

    public static StringBuffer values(Map<String, Object> values, StringBuffer buffer) {
        return values(values.keySet(), values, buffer);
    }

    public static StringBuffer values(Set<String> keys, Map<String, Object> values, StringBuffer buffer) {
        buffer.append("(");
        for (String key : keys) {
            buffer.append(DataConverter.sql_by_jType(values.get(key))).append(",");
        }
        buffer.delete(buffer.length() - 1, buffer.length()).append(")");
        return buffer;
    }

    // 여러개
    public static StringBuffer values(Set<String> keys, List<Map<String, Object>> values, StringBuffer buffer) {
        for (Map<String, Object> v : values)
            values(keys, v, buffer).append(", ");
        return buffer.delete(buffer.length() - 2, buffer.length());
    }


    public static final <T> T reduce(ResultSet rs, T d, ReduceHandlerR<T> handler) {
        int index = 0;
        try {
            while (rs.next())
                d = handler.accept(d, rs, index++);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return d;
    }

    public static final <T> T reduce(ResultSet rs, T d, ReduceHandler<T> handler) {
        int index = 0;
        try {
            while (rs.next())
                handler.accept(d, rs, index++);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return d;
    }

    // 먼저 rs.next() 이후에 넣어줘야 한다.
    public static final List<Map<String, Object>> readAll(ResultSet rs) throws Exception {
        return readAll(rs, DataConverter::data_by_dType);
    }

    public static final List<Map<String, Object>> readAllJSON(ResultSet rs) throws Exception {
        return readAll(rs, DataConverter::convertJSON);
    }

    public static final List<Map<String, Object>> readAll(ResultSet rs, CONVERT_HANDLER handler) throws Exception {
        List<Map<String, Object>> result = new ArrayList<>();

        if (rs.next()) {
            ResultSetMetaData meta = rs.getMetaData();
            do {
                result.add($read(rs, meta, handler));
            } while (rs.next());
        }
        return result;
    }

    public static final Map<String, Object> readJSON(ResultSet rs) throws Exception {
        return read(rs, DataConverter::convertJSON);
    }

    public static final Map<String, Object> read(ResultSet rs) throws Exception {
        return read(rs, DataConverter::data_by_dType);
    }

    public static final Map<String, Object> read(ResultSet rs, CONVERT_HANDLER handler) throws Exception {
        return rs.next() ? $read(rs, rs.getMetaData(), handler) : Collections.EMPTY_MAP;
    }

    private static final Map<String, Object> $read(ResultSet rs, ResultSetMetaData meta, CONVERT_HANDLER handler) throws Exception {
        Map<String, Object> map = new HashMap<>(), target;
        int len = meta.getColumnCount() + 1;
        String label = null;
        String[] labels;

        while (len-- > 1) {

            // .으로 이루어진 건 하위맵으로
            target = map;
            label = meta.getColumnLabel(len);
            labels = label.split("\\.");

            int i = 0, l = labels.length - 1;
            for (; i < l; i++) {
                if (target.get(labels[i]) == null)
                    target.put(labels[i], new HashMap<>());
                target = (Map<String, Object>) target.get(label = labels[i]);
            }

            label = labels[i];

            target.put(
                    label,
                    handler.convert(rs, meta.getColumnTypeName(len), len)
            );
        }
        return map;
    }








    // ************************************** SQL 작성용  ************************************** //

    private static final Pattern
            p = Pattern.compile(":([^:\\s,()]+)");


    /*
     *  preparedStatement의 ?를 :name으로 사용하기 위한 parsing 로직
     *
     */
    public static NamedPreparedStatementFactory newPrepared(String sql) {

        StringBuffer buf = new StringBuffer();
        List<NamedTuple> order = new ArrayList<>();

        Matcher m = p.matcher(sql);
        int index = 1, t1;

        while (m.find()) {

            // :name ==> ?
            m.appendReplacement(buf, "?");

            String val = m.group(1), type = "";

            // 타입이 있을 경우
            if ((t1 = val.indexOf("[")) != -1) {
                type = val.substring(t1 + 1, val.indexOf("]"));
                val = val.substring(0, t1);
            }
            // like
            else if (val.contains("%")) {
                if (val.startsWith("%")) {
                    if (val.endsWith("%")) {
                        type = "%like%";
                    } else type = "%like";
                } else {
                    type = "like%";
                }

                val = val.replaceAll("%", "");

            }

            order.add(new NamedTuple(val, index++, type));
        }

        m.appendTail(buf);
        sql = buf.toString();

        return new NamedPreparedStatementFactory(sql, order);
    }


    public static final DQuery dynamicSQL(String sql) {
        List<Function<Map<String, Object>, String>> list = new ArrayList<>();
        Matcher m = p.matcher(sql);

        int pos = 0, s, t1;

        while (m.find()) {
            if ((s = m.start()) != pos) {
                String r = sql.substring(pos, s);
                list.add((a) -> r);
            }

            final String group = m.group(1), val, type;

            // 타입이 있을 경우
            if ((t1 = group.indexOf("[")) != -1) {
                val = group.substring(0, t1);
                type = group.substring(t1 + 1, group.indexOf("]"));
            }
            // like
            else if (group.contains("%")) {
                if (group.startsWith("%")) {
                    type = group.endsWith("%") ? "%like%" : "%like";
                } else {
                    type = "like%";
                }
                val = group.replaceAll("%", "");
            } else {
                val = group;
                type = "varchar";
            }

            list.add((map) -> {
                Object v = Access.read(map, val);
                if (v == null) throw new RuntimeException("{" + val + "} 값이 없습니다.");
                return exp_to_sql(type, v);
            });

            pos = m.end();
        }

        if (pos < sql.length()) {
            String r = sql.substring(pos);
            list.add((map) -> r);
        }

        return (map) -> {
            StringBuilder builder = new StringBuilder();
            for (Function<Map<String, Object>, String> h : list)
                builder.append(h.apply(map));
            return builder.toString();
        };
    }

    public interface ReduceHandler<T> {
        void accept(T t, ResultSet rs, int index) throws Exception;
    }

    public interface ReduceHandlerR<T> {
        T accept(T t, ResultSet rs, int index) throws Exception;
    }

    public interface CONVERT_HANDLER {
        Object convert(ResultSet rs, String dataType, int index) throws Exception;
    }

    public interface DQuery {
        String apply(Map<String, Object> map);
    }

}
