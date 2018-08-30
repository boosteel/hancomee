package com.hancomee.web.controller;

import com.hancomee.util.DB;
import com.hancomee.util.SQL;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
@RequestMapping("hancomee")
public class HancomeeController {

    @RequestMapping()
    public String intro() {
        return "hancomee/main.html";
    }


}
