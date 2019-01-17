package com.hancomee.web.controller;

import com.boosteel.nativedb.NativeDB;
import com.boosteel.nativedb.core.ResultSetAccess;
import com.boosteel.nativedb.core.anno.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.sql.Statement;
import java.util.List;
import java.util.Map;

//@Controller
@RequestMapping("nabook")
public class NaBookController {

    public NativeDB db = new NativeDB(
            "jdbc:mariadb://115.23.187.44:3306/hancomee?useOldAliasMetadataBehavior=true",
            "root", "ko9984");
    SQL sql;

    @PostConstruct
    public void ready() {
        sql = db.createRepository(SQL.class);
    }

    @RequestMapping()
    public String intro() {
        return "nabook/main.html";
    }

    @RequestMapping(value="save", method = RequestMethod.POST)
    @ResponseBody
    public int save(@RequestBody Map<String, Object> map) {
        return sql.save(map);
    }


    @RequestMapping(value="section/{id}/{section}", method = RequestMethod.PUT)
    @ResponseBody
    public int save(@PathVariable("id") String id, @PathVariable("section") String section) {
        return sql.setSection(id, section);
    }

    @RequestMapping(value="update", method = RequestMethod.POST)
    @ResponseBody
    public int update(@RequestBody Map<String, Object> map) {
        return sql.update(map);
    }

    public boolean exists(String url) {
        return sql.exists(url) != 0;
    }

    public Integer search(String news, String title) {
        return sql.search(news, title);
    }

    public int check(int id) {
        return sql.check(id);
    }

    @RequestMapping("paths")
    @ResponseBody
    public List<String> paths() {
        return sql.paths();
    }


    @RequestMapping("sections")
    @ResponseBody
    public List<Map<String, Object>> sections() {
        return sql.sections();
    }

    @RequestMapping("list")
    @ResponseBody
    public List<Map<String, Object>> list() {
        return sql.list();
    }

    public interface SQL {

        @Insert(value = "na_book2", lastId = true)
        int save(Map<String, Object> map);

        @Save("DELETE FROM na_book2 WHERE id = :id{i}")
        int delete(@Value("id") Object id);

        @Selector("SELECT COUNT(id) FROM na_book2 WHERE url = :url")
        int exists(@Value("url") String url);

        @Selector("SELECT this.id FROM na_book2 this WHERE this.news = :news AND this.subject LIKE :%subject%")
        Integer search(@Value("news") String news, @Value("subject") String url);

        @Save("UPDATE na_book2 SET chk = 1 WHERE id = :id{i}")
        int check(@Value("id") Object id);


        @Save("UPDATE na_book2 SET section = :section WHERE id = :id{i}")
        int setSection(@Value("id") Object id, @Value("section") String section);

        @Selector("SELECT this.news FROM na_book2 this GROUP BY this.news")
        List<String> paths();

        @Selector("SELECT * FROM na_book2 as this WHERE " +
                "datetime BETWEEN '2013-01-01' AND '2015-12-31' " +
                "ORDER BY this.news DESC, this.datetime DESC")
        List<Map<String, Object>> list();

        @Selector("SELECT section name, COUNT(id) count FROM na_book2 this GROUP BY this.section")
        List<Map<String, Object>> sections();

        @Update(value = "na_book2")
        int update(Map<String, Object> map);

    }
}
