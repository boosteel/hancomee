package com.hancomee.util.db;

import com.hancomee.util.DB;

import java.util.ArrayList;
import java.util.List;
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
