package com.hancomee.web.controller;

import com.hancomee.util.db.DB;
import com.hancomee.util.db.ResultSetAccess;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("jinyeosoo")
public class JinyeosooController {

    DB db = new DB("jdbc:mariadb://localhost:3306/hancomee", "root", "ko9984");

    @RequestMapping()
    public String intro() {
        return "jinyeosoo/intro.html";
    }

    @RequestMapping("{id}")
    public String page() {
        return "jinyeosoo/page.html";
    }

}
