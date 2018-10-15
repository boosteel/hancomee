package com.hancomee.web.controller.work;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("hancomee/view")
public class ViewController {


    @Autowired
    _WorkManager sql;


    @RequestMapping("{uuid}")
    @ResponseBody
    public Object values(@PathVariable("uuid") String uuid) throws Exception {
        return sql.getWork(uuid);
    }

}
