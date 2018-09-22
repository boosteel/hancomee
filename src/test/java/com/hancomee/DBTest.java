package com.hancomee;

import com.fasterxml.jackson.databind.deser.DataFormatReaders;
import com.hancomee.util.DB;
import com.hancomee.util.Patterns;
import com.hancomee.util.SQL;
import com.hancomee.util.db.TableInfo;
import com.hancomee.web.WebApplication;
import com.hancomee.web.controller.AudioBay;
import com.zaxxer.hikari.HikariConfig;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.sql.DataSource;
import java.sql.*;
import java.util.*;
import java.util.Date;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class DBTest {

    DB db = new DB("jdbc:mariadb://115.23.187.44:3306/hellofunc", "root", "ko9984");

    Set<Connection> cons = new HashSet<>();

    public TableInfo customer = TableInfo.create("hancomee_customer", db),
            work = TableInfo.create("hancomee_work", db),
            workItem = TableInfo.create("hancomee_workitem", db),
            workFile = TableInfo.create("hancomee_workfile", db);

    @Test
    public void test() throws Exception {

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

    private <T> T out(T obj) {
        System.out.println(obj);
        return obj;
    }
}
