package com.hancomee.web.controller.work;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@Controller
@RequestMapping("hancomee/db")
public class DBController {


    @Autowired
    _WorkManager sql;

    // ***************************** 거래처 ************************************* //
    @RequestMapping(value = "customer", method = RequestMethod.POST)
    @ResponseBody
    public Object customer(@RequestBody Map<String, Object> map) throws Exception {
        return null;
    }


    // 거래처 이름 검색
    @RequestMapping(value = "customer/search/{key}")
    @ResponseBody
    public Object customer(@PathVariable("key") String key) throws Exception {
        return sql.searchCustomer(key);
    }

    // ***************************** 아이템 ************************************* //
    @RequestMapping(value = "item/{workId}", method = RequestMethod.POST)
    @ResponseBody
    public Object item(@PathVariable("workId") String workId, @RequestBody Map<String, Object> map) throws Exception {
        return sql.saveItem(workId, map);
    }

    @RequestMapping(value = "item/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public void item(@PathVariable("id") int id) throws Exception {
        sql.removeItem(id);
    }


    // *************************  파일 **************************
    @RequestMapping(value = "ref/{workId}", method = RequestMethod.POST)
    @ResponseBody
    public Object ref(@PathVariable("workId") int workId,
                      @RequestBody Map<String, Object> map) throws Exception {
        return sql.addRef(workId, map);
    }

    @RequestMapping(value = "ref/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public void ref(@PathVariable("id") int id) throws Exception {
        sql.deleteRef(id);
    }

    @RequestMapping(value = "print/{itemId}", method = RequestMethod.POST)
    @ResponseBody
    public Object print(@PathVariable("itemId") int itemId,
                      @RequestBody Map<String, Object> map) throws Exception {
        return sql.addPrint(itemId, map);
    }

    @RequestMapping(value = "print/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public void print(@PathVariable("id") int id) throws Exception {
        sql.deletePrint(id);
    }

    @RequestMapping(value = "draft/{itemId}", method = RequestMethod.POST)
    @ResponseBody
    public Object draft(@PathVariable("itemId") int itemId,
                      @RequestBody Map<String, Object> map) throws Exception {
        return sql.addDraft(itemId, map);
    }

    @RequestMapping(value = "draft/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public void draft(@PathVariable("id") int id) throws Exception {
        sql.deleteDraft(id);
    }


    // ***************************** 메모 ************************************* //
    @RequestMapping(value = "memo/{workId}", method = RequestMethod.POST)
    @ResponseBody
    public Object memo(@PathVariable("workId") String workId, @RequestBody Map<String, Object> map) throws Exception {
        return sql.saveMemo(workId, map);

    }

    @RequestMapping(value = "memo/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public void memo(@PathVariable("id") long id) throws Exception {
        sql.removeMemo(id);

    }

}
