package com.hancomee.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("util")
public class UtilController {

    @RequestMapping(value = {"{name}", "{name}/*"})
    public String intro(@PathVariable("name") String name) {
        return "/util/" + name + ".html";
    }

}
