package com.hancomee.web.controller;

import com.hancomee.util.DB;
import com.hancomee.util.HTTP;
import com.hancomee.util.Patterns;
import com.hancomee.util.SQL;
import com.hancomee.web.domain.BayBean;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.sql.DriverManager;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Controller
@RequestMapping("calendar")
public class CalendarCtrl {

    // new DB("jdbc:mariadb://localhost:3306/hancomee", "root", "ko9984");
    // new DB("jdbc:mysql://localhost:3306/boosteel", "boosteel", "ko916304");
    DB db = new DB("jdbc:mariadb://localhost:3306/hancomee", "root", "ko9984");

    @RequestMapping()
    public String intro() {
        return "calendar.html";
    }


    @RequestMapping(value = "get")
    @ResponseBody
    public Object get(@RequestParam("sd") String sd, @RequestParam("ed") String ed) throws Exception {
        return db.execute("SELECT * FROM calendar WHERE date BETWEEN '" +
                sd + "' AND '" + ed + "'", (rs) -> SQL.readAll(rs, SQL::convertJSON));
    }


    @RequestMapping(method = RequestMethod.PUT)
    @ResponseBody
    public Object save(@RequestBody Map<String, Object> value) throws Exception {

        Object id = value.get("id");
        // save
        if (id == null) {
            db.update(SQL.insert("calendar", value));
            id = db.execute("SELECT LAST_INSERT_ID() ", (rs) -> rs.getObject(1));
        }
        // update
        else {
            db.update(SQL.update("calendar", value));
        }

        return id;
    }

    @RequestMapping(value = "{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public void delete(@PathVariable("id") int id) throws Exception {
        db.update("DELETE FROM calendar WHERE id = " + id);
    }


}
