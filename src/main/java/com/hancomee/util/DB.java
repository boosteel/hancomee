package com.hancomee.util;

import sun.swing.BakedArrayList;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class DB {

    public static Connection createCon(String url, String user, String password) {
        try {
            Class.forName("com.mysql.jdbc.Driver");
            return DriverManager.getConnection(url, user, password);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    private Connection con;
    private String url;
    private String user;
    private String password;

    public DB(String url, String user, String password) {
        this.url = url;
        this.user = user;
        this.password = password;
    }

    public <T> T execute(String sql, ACCEPT_RS<T> e) throws Exception {
        try (Statement s = getCon().createStatement();
             ResultSet rs = s.executeQuery(sql)) {
            if (rs.next())
                return e.execute(rs);
            else return null;
        }
    }

    public <T> List<T> executeAll(String sql, EXECUTE_RETURN<T> e) throws Exception {
        List<T> list = new ArrayList<>();
        T r = null;
        try (Statement s = getCon().createStatement();
             ResultSet rs = s.executeQuery(sql)) {
            int i = 0;
            while (rs.next())
                if ((r = e.execute(rs, i)) != null) list.add(r);
        }
        return list;
    }

    public DB executeAll(String sql, EXECUTE e) throws Exception {
        try (Statement s = getCon().createStatement();
             ResultSet rs = s.executeQuery(sql)) {
            int i = 0;
            while (rs.next())
                e.execute(rs, i);
        }
        return this;
    }

    public int update(String sql) throws SQLException {
        try (Statement s = getCon().createStatement()) {
            return s.executeUpdate(sql);
        }
    }

    public long save(String tableName, List<Map<String, Object>> values) throws Exception {
        String sql = SQL.insert(tableName, values);
        try (Statement s = getCon().createStatement()) {
            return s.executeUpdate(sql);
        }
    }

    public Connection getCon() {
        try {
            if (con == null || con.isClosed())
                con = createCon(url, user, password);
        } catch (SQLException e) {}
        return con;
    }

    public interface ACCEPT_RS<T> {
        T execute(ResultSet rs) throws Exception;
    }

    public interface EXECUTE {
        void execute(ResultSet rs, int index) throws Exception;
    }

    public interface EXECUTE_RETURN<T> {
        T execute(ResultSet rs, int index) throws Exception;
    }
}
