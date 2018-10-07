package com.hancomee.util.db;

import com.hancomee.util.DB;
import com.hancomee.util.Loop;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.stream.Collectors;

public class TableInfo {

    private String name;
    private List<String> columnNames = new ArrayList<>();
    private List<String> columnTypes = new ArrayList<>();
    private String createSQL;

    private TableInfo(String name) {
        this.name = name;
    }

    public List<String> selectPrefix(String str) {
        return columnNames.stream().map((r) -> str.replaceAll("%", r)).collect(Collectors.toList());
    }

    public String updateSQL(String id) {
        StringBuffer buf = new StringBuffer("UPDATE ").append(this.name).append(" SET ");
        buf.append(
                String.join(", ", Loop.reduce(columnNames, new ArrayList<>(), (name, list, i) -> {
                    if(!id.equals(name)) list.add(name + " = :" + name);
                }))
        );
        buf.append(" WHERE ").append(id).append(" = :").append(id);
        return buf.toString();
    }

    public String insertSQL(String id) {
        Set<String> names = Loop.reduce(columnNames, new HashSet<>(), (n,l,i) -> {
            if(!id.equals(n)) l.add(n);
        });
        return
                new StringBuffer("INSERT INFO ").append(this.name).append(" ")
                .append("(").append(String.join(", ", names)).append(") VALUES ")
                .append("(:").append(String.join(", :", names)).append(")")
                .toString();

    }

    public static final TableInfo create(String name, DB db) {
        return db.execute("SELECT COLUMN_NAME, DATA_TYPE " +
                        "FROM INFORMATION_SCHEMA.COLUMNS where TABLE_NAME='" + name + "' GROUP BY COLUMN_NAME",
                (rs) -> {
                    TableInfo info = new TableInfo(name);
                    while (rs.next()) {
                        info.columnNames.add(rs.getString("COLUMN_NAME"));
                        info.columnTypes.add(rs.getString("DATA_TYPE"));
                    }
                    return info;
                });
    }

}
