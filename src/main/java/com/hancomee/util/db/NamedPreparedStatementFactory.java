package com.hancomee.util.db;

import java.sql.Connection;
import java.util.*;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class NamedPreparedStatementFactory {

    private String sql;
    private List<NamedTuple> order;
    private LinkedHashMap<String, Function<Object, String>> map = new LinkedHashMap<>();

    // private constructor
    public NamedPreparedStatementFactory(String sql, List<NamedTuple> order) {
        this.sql = sql;
        this.order = order;
    }

    public NamedPrepareStatement create(Connection con) {
        return new NamedPrepareStatement(con, sql, order);
    }

    public LinkedHashMap<String, Function<Object, String>> getMap() {
        return map;
    }

    public String getSql() {
        return sql;
    }
}
