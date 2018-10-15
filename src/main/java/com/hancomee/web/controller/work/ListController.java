package com.hancomee.web.controller.work;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller
@RequestMapping("hancomee/list")
public class ListController {

    @Autowired
    _WorkManager sql;

    // hancomee_work INNER JOIN hancomee_customer
    @RequestMapping()
    @ResponseBody
    public Object values(@RequestParam Map<String, String> query) throws Exception {
        return sql.getWorkList(query);
    }

}
