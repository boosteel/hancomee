package com.hancomee.web.controller;

import com.hancomee.util.DB;
import com.hancomee.util.SQL;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.sql.DriverManager;
import java.util.Map;

@Controller
@RequestMapping("util")
public class UtilController {

    @RequestMapping(value = {"{name}", "{name}/*"})
    public String intro(@PathVariable("name") String name) {
        return "/util/" + name + ".html";
    }

}
