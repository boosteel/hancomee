package com.hancomee.util;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class SQL {


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
            buf.append(entry.getKey()).append(" = ").append(convert(entry.getValue())).append(", ");
        }

        return buf.delete(buf.length() - 2, buf.length())
                .append(" WHERE id = " + id)
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
            buffer.append(convert(values.get(key))).append(",");
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


    // 먼저 rs.next() 이후에 넣어줘야 한다.
    public static final List<Map<String, Object>> readAll(ResultSet rs) throws Exception {
        return readAll(rs, SQL::convert);
    }

    public static final List<Map<String, Object>> readAllJSON(ResultSet rs) throws Exception {
        return readAll(rs, SQL::convertJSON);
    }

    public static final List<Map<String, Object>> readAll(ResultSet rs, CONVERT_HANDLER handler) throws Exception {
        List<Map<String, Object>> result = new ArrayList<>();

        if(rs.next()) {
            ResultSetMetaData meta = rs.getMetaData();
            do {
                result.add($read(rs, meta, handler));
            } while (rs.next());
        }
        return result;
    }

    public static final Map<String, Object> readJSON(ResultSet rs) throws Exception {
        return read(rs, SQL::convertJSON);
    }

    public static final Map<String, Object> read(ResultSet rs) throws Exception {
        return read(rs, SQL::convert);
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


    // java type ==> sql type
    public static String convert(Object val) {
        if (val == null) return "null";

        Class<?> clazz = val.getClass();

        if (CharSequence.class.isAssignableFrom(clazz))
            return "'" + val.toString().replaceAll("'", "\\\\'") + "'";

        if (Date.class.isAssignableFrom(clazz))
            return "'" + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format((Date) val) + "'";

        return val.toString();
    }


    // sql type ==> java type
    public static Object convertJSON(ResultSet rs, String dataType, int index) throws Exception {
        switch (dataType) {
            case "TIMESTAMP":
            case "DATETIME":
            case "DATE":
            case "TIME":
            case "YEAR":
                Timestamp stamp = rs.getTimestamp(index);
                return stamp == null ? null : stamp.getTime();
            default:
                return convert(rs, dataType, index);
        }
    }

    public static Object convert(ResultSet rs, String dataType, int index) throws Exception {
        switch (dataType) {
            case "TINYINT":
            case "SMALLINT":
            case "MEDIUMINT":
            case "INT":
            case "INTEGER":
                return rs.getInt(index);
            case "BIGINT":
                return rs.getLong(index);
            case "BIT":
            case "BOOL":
            case "BOOLEAN":
                return rs.getBoolean(index);
            case "DECIMAL":
            case "DEC":
            case "NUMERIC":
            case "FIXED":
                return rs.getBigDecimal(index);
            case "DOUBLE":
            case "DOUBLE PRECISION":
                return rs.getDouble(index);
            case "FLOAT":
                return rs.getFloat(index);
            case "TIMESTAMP":
            case "DATETIME":
            case "DATE":
            case "TIME":
            case "YEAR":
                Timestamp stamp = rs.getTimestamp(index);
                return stamp == null ? null : new Date(stamp.getTime());
            default:
                return rs.getString(index);
        }
    }


    private static final Pattern p = Pattern.compile("\\{(.*?)\\}");

    public static final  Function<Map<String, Object>, String> dynamicSQL(String sql) {
        List<Function<Map<String, Object>, String>> list = new ArrayList<>();
        Matcher m = p.matcher(sql);

        int pos = 0, s;

        while (m.find()) {
            if ((s = m.start()) != pos) {
                String r = sql.substring(pos, s);
                list.add((a) -> r);
            }

            String k = m.group(1);
            list.add((map) -> {
                Object v = map.get(k);
                if (v == null) throw new RuntimeException("{" + k + "} 값이 없습니다.");
                return SQL.convert(v);
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


    public interface CONVERT_HANDLER {
        Object convert(ResultSet rs, String dataType, int index) throws Exception;
    }


}
