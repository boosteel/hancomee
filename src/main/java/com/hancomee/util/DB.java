package com.hancomee.util;

import com.hancomee.util.db.TableInfo;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.jdbc.core.JdbcTemplate;
import sun.swing.BakedArrayList;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class DB {


    public static DataSource createDataSource(String url, String user, String password) {
        return createDataSource(url, user, password, "org.mariadb.jdbc.Driver");
    }

    public static DataSource createDataSource(String url, String user, String password, String className) {
        DataSourceBuilder c = DataSourceBuilder.create();
        c.driverClassName(className);
        c.password(password);
        c.username(user);
        c.url(url);
        return c.build();
    }

    public DataSource dataSource;
    private String url;
    private String user;
    private String password;

    public DB(String url, String user, String password) {
        this(createDataSource(url, user, password));
    }

    public DB(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public void doWork(DoWork doWork) {
        try (Connection con = getCon()) {
            doWork.accept(con);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public <T> T doWork(DoWorkR<T> doWork) {
        try (Connection con = getCon()) {
            return doWork.accept(con);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public <T> T execute(String sql, ACCEPT_RS<T> e) {
        try (Connection con = getCon()) {
            return execute(con, sql, e);
        } catch (Exception a) {
            throw new RuntimeException(a);
        }
    }

    public void execute(String sql, ACCEPT e) {
        try (Connection con = getCon()) {
            execute(con, sql, e);
        } catch (Exception a) {
            throw new RuntimeException(a);
        }
    }

    public void execute(Connection con, String sql, ACCEPT e) {
        try (Statement s = con.createStatement();
             ResultSet rs = s.executeQuery(sql)) {
            e.execute(rs);
        } catch (Exception a) {
            throw new RuntimeException(a);
        }
    }

    public <T> T execute(Connection con, String sql, ACCEPT_RS<T> e) {
        try (Statement s = con.createStatement();
             ResultSet rs = s.executeQuery(sql)) {
            return e.execute(rs);
        } catch (Exception a) {
            throw new RuntimeException(a);
        }
    }


    // 여러가지 값을 가지고 올때
    public <T> List<T> execute(String sql, List<T> list, EXECUTE_RETURN<T> e) {
        try (Connection con = getCon()) {
            return execute(con, sql, list, e);
        } catch (Exception a) {
            throw new RuntimeException(a);
        }
    }

    public <T> List<T> execute(Connection con, String sql, List<T> list, EXECUTE_RETURN<T> e) {
        try (Statement s = con.createStatement();
             ResultSet rs = s.executeQuery(sql)) {
            int len = 0;
            while (rs.next())
                list.add(e.execute(rs, len++));
            return list;
        } catch (Exception a) {
            throw new RuntimeException(a);
        }
    }

    // 하나의 값만 가지고 올때
    public <T> T execute(String sql, T defaultValue, ACCEPT_RS<T> e) {
        try (Connection con = getCon()) {
            return execute(con, sql, defaultValue, e);
        } catch (Exception a) {
            throw new RuntimeException(a);
        }
    }

    public <T> T execute(Connection con, String sql, T defaultValue, ACCEPT_RS<T> e) {
        try (Statement s = con.createStatement();
             ResultSet rs = s.executeQuery(sql)) {
            return rs.next() ? e.execute(rs) : defaultValue;
        } catch (Exception a) {
            throw new RuntimeException(a);
        }
    }

    /*public <T> List<T> executeAll(String sql, EXECUTE_RETURN<T> e) {
        try(Connection con = getCon()) {
            return executeAll(con, sql, e);
        } catch (Exception a) {
            throw new RuntimeException(a);
        }
    }
    public <T> List<T> executeAll(Connection con, String sql, EXECUTE_RETURN<T> e) {
        List<T> list = new ArrayList<>();
        T r = null;
        try (Statement s = con.createStatement();
             ResultSet rs = s.executeQuery(sql)) {
            int i = 0;
            while (rs.next())
                if ((r = e.execute(rs, i)) != null) list.add(r);
        } catch (Exception a) {
            throw new RuntimeException(a);
        }
        return list;
    }

    public DB executeAll(String sql, EXECUTE e) {
        try (Connection con = getCon();
             Statement s = con.createStatement();
             ResultSet rs = s.executeQuery(sql)) {
            int i = 0;
            while (rs.next())
                e.execute(rs, i);
        } catch (Exception a) {
            throw new RuntimeException(a);
        }
        return this;
    }*/


    public TableInfo getTableInfo(String tableName) {
        return TableInfo.create(tableName, this);
    }

    public int update(String sql) throws SQLException {
        try (Connection con = getCon();
             Statement s = con.createStatement();) {
            return s.executeUpdate(sql);
        }
    }

    public long save(String sql) {
        try (Connection con = getCon();
             Statement s = con.createStatement()) {
            return s.executeUpdate(sql);
        } catch (Exception a) {
            throw new RuntimeException(a);
        }
    }

    public long save(String tableName, List<Map<String, Object>> values) {
        String sql = SQL.insert(tableName, values);
        try (Connection con = getCon();
             Statement s = con.createStatement()) {
            return s.executeUpdate(sql);
        } catch (Exception a) {
            throw new RuntimeException(a);
        }
    }

    public Connection getCon() {
        try {
            return this.dataSource.getConnection();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public interface ACCEPT {
        void execute(ResultSet rs) throws Exception;
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

    public interface DoWork {
        void accept(Connection con) throws Exception;
    }

    public interface DoWorkR<T> {
        T accept(Connection con) throws Exception;
    }
}
