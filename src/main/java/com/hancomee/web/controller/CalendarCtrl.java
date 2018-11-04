package com.hancomee.web.controller;

import com.boosteel.nativedb.NativeDB;
import com.boosteel.nativedb.core.ResultSetAccess;
import com.boosteel.nativedb.core.SQL;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
@RequestMapping("calendar")
public class CalendarCtrl {

    // new DB("jdbc:mariadb://localhost:3306/hancomee", "root", "ko9984");
    // new DB("jdbc:mysql://localhost:3306/boosteel", "boosteel", "ko916304");
    NativeDB db = new NativeDB("jdbc:mariadb://localhost:3306/hancomee", "root", "ko9984");

    @RequestMapping()
    public String intro() {
        return "calendar.html";
    }


    @RequestMapping(value = "get")
    @ResponseBody
    public Object get(@RequestParam("sd") String sd, @RequestParam("ed") String ed) throws Exception {
        return db.execute("SELECT * FROM calendar WHERE date BETWEEN '" +
                sd + "' AND '" + ed + "'", ResultSetAccess::readAllJSON);
    }


    @RequestMapping(method = RequestMethod.PUT)
    @ResponseBody
    public Object save(@RequestBody Map<String, Object> value) throws Exception {

        Object id = value.get("id");
        // save
        if (id == null) {
            db.update(SQL.insert("calendar", value));
            id = db.execute("SELECT LAST_INSERT_ID() ", null,
                    (rs) -> rs.getObject(1));
        }
        // update
        else {
            //db.update(SQL.update("calendar", value));
        }

        return id;
    }

    @RequestMapping(value = "{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public void delete(@PathVariable("id") int id) throws Exception {
        db.update("DELETE FROM calendar WHERE id = " + id);
    }


}
