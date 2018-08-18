package com.hancomee.util;

import java.security.SecureRandom;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.*;

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

    public static final List<Map<String, Object>> readAll(ResultSet rs, CONVERT_HANDLER handler) throws Exception {
        List<Map<String, Object>> result = new ArrayList<>();
        Map<String, Object> map = null;
        ResultSetMetaData meta = null;
        int len = -1;

        do {
            result.add(map = new LinkedHashMap<>());
            meta = rs.getMetaData();
            len = meta.getColumnCount() + 1;
            while (len-- > 1) {
                map.put(meta.getColumnLabel(len),
                        handler.convert(rs, meta.getColumnTypeName(len),
                                len));
            }
        }
        while (rs.next());

        return result;
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
                return rs.getTimestamp(index).getTime();
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
                return new Date(rs.getTimestamp(index).getTime());
            default:
                return rs.getString(index);
        }
    }


    public static final class ValueMap {
        public Map<String, Object> map = new LinkedHashMap<>();

        public ValueMap put(String key, Object value) {
            map.put(key, value);
            return this;
        }
    }

    public interface CONVERT_HANDLER {
        Object convert(ResultSet rs, String dataType, int index) throws Exception;
    }
}
