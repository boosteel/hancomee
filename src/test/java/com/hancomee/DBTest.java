package com.hancomee;

import com.hancomee.util.DB;
import com.hancomee.util.SQL;
import org.junit.Test;

import javax.sql.DataSource;
import java.sql.*;
import java.util.*;
import java.util.Date;

public class DBTest {

    @Test
    public void test() throws Exception {
        Connection con = getCon();

        //out(SQL.readAll(con.createStatement().executeQuery("SELECT * FROM secret_media")));

        DB db = new DB("jdbc:mysql://183.111.100.230:3306/boosteel", "boosteel", "ko916304");
        db.execute("SHOW TABLES", (rs) -> {
            out(rs.getString(1));
            return null;
        });

        /*Statement st = con.createStatement();
        Map<String, Object> map = new HashMap<>();
        map.put("favorite", 1);
        map.put("title", "울랄ㄹ랄''ㅁㄴㅇㄹ'ㅁㄴㅇㄹ");
        map.put("user", "이히히랄라");
        map.put("dateTime", new Date());
        map.put("filename", "mag'''ic");
        map.put("path", "/asdf/asdf/asdf/");
        map.put("filetype", "jpg");
        map.put("uploadTime", new Date());
        map.put("blind", true);

        String sql = SQL.insert("secret_media", map);
        st.executeQuery(sql);*/
    }

    public Connection getCon() throws SQLException {
        return DriverManager.getConnection("jdbc:mariadb://localhost:3306/hancomee", "root", "ko9984");
    }

    public List<LinkedHashMap<String, Object>> read(ResultSet rs) throws SQLException {

        List<LinkedHashMap<String, Object>> list = new ArrayList<>();
        LinkedHashMap<String, Object> result = null;
        ResultSetMetaData meta = null;

        while (rs.next()) {
            list.add(result = new LinkedHashMap<>());
            meta = rs.getMetaData();
            int i = 1, count = meta.getColumnCount() + 1;
            for (; i < count; i++) {
                result.put(meta.getColumnLabel(i), $read(rs, meta.getColumnTypeName(i), i));
            }
        }
        return list;

    }


    // my
    public Object $read(ResultSet rs, String dataType, int index) throws SQLException {
        switch (dataType) {
            case "BIT":
            case "TINYINT":
            case "SMALLINT":
            case "MEDIUMINT":
            case "INT":
            case "INTEGER":
                return rs.getInt(index);
            case "BIGINT":
                return rs.getLong(index);
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
            case "DATE":
            case "DATETIME":
            case "TIMESTAMP":
            case "TIME":
            case "YEAR":
                return rs.getDate(index);
            default:
                return rs.getString(index);
        }
    }

    private<T> T out(T obj) {
        System.out.println(obj);
        return obj;
    }
}
