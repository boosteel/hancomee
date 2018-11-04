package com.hancomee.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("hancomee")
public class HancomeeController {


    @RequestMapping()
    public String intro() {
        return "hancomee/main.html";
    }


}
