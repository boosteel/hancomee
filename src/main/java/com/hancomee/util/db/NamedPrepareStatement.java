package com.hancomee.util.db;

import com.hancomee.util.DataConverter;
import com.hancomee.util.reflect.DataBean;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class NamedPrepareStatement {

    public PreparedStatement pstmt;
    private String sql;
    private List<NamedTuple> values;
    private Map<String, List<NamedTuple>> map;

    public NamedPrepareStatement(Connection con, String sql, List<NamedTuple> values) {
        try {
            pstmt = con.prepareStatement(sql);
            this.sql = sql;
            this.values = values;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    private Map<String, List<NamedTuple>> getMap() {
        if (map == null) {
            map = new HashMap<>();
            for (NamedTuple nt : values) {
                List<NamedTuple> l = map.get(nt.name);
                if (l == null) {
                    map.put(nt.name, l = new ArrayList<>());
                }
                l.add(nt);
            }
        }
        return map;
    }


    // 값 입력
    public NamedPrepareStatement setValue(String key, Object val) throws SQLException {
        List<NamedTuple> list = getMap().get(key);
        if (list == null)
            throw new RuntimeException(key + "는 등록되지 않은 key입니다.");
        for (NamedTuple index : list)
            DataConverter.setPstmt(pstmt, index.index, index.type, val);
        return this;
    }

    public NamedPrepareStatement set(Object obj) {
        String className = obj.getClass().getName();
        return className.equals("java.util.Map") ?
                setValue((Map<String, Object>) obj) :
                setValue(obj, className);
    }

    private NamedPrepareStatement setValue(Map<String, Object> map) {
        try {
            for (NamedTuple index : values)
                DataConverter.setPstmt(pstmt, index.index, index.type, map.get(index.name));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return this;
    }


    private NamedPrepareStatement setValue(Object obj, String className) {
        try {
            DataBean bd = DataBean.getBeanData(className);
            for (NamedTuple index : values)
                DataConverter.setPstmt(pstmt, index.index, index.type, bd.get(obj, index.name));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return this;
    }

    public <T> T doWorkR(RunR<T> run) {
        try (PreparedStatement u = pstmt) {
            return run.run(u, this);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void doWork(Run run) {
        try (PreparedStatement u = pstmt) {
            run.run(u, this);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void close() {
        try {
            pstmt.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public interface RunR<T> {
        T run(PreparedStatement ps, NamedPrepareStatement context) throws Exception;
    }
    public interface Run {
        void run(PreparedStatement ps, NamedPrepareStatement context) throws Exception;
    }
}
