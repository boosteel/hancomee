package com.hancomee.web.controller.work;

import com.hancomee.util.DB;
import com.hancomee.util.SQL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.PostConstruct;
import java.sql.ResultSet;
import java.util.*;
import java.util.function.Function;

import static com.hancomee.util.SQL.dynamicSQL;

@Controller
@RequestMapping("hancomee/view")
public class ViewController {

    @Autowired
    _WorkCommon workCommon;

    @Autowired
    DB db;

    Function<Map<String, Object>, String>
            SQL_work,
            SQL_refs,
            SQL_items,
            SQL_draft,
            SQL_print,
            SQL_memo;

    // 리스트값 SELECT 부분 설정
    @PostConstruct
    public void post() {

        List<String> select = new ArrayList<>();
        select.addAll(workCommon.work.selectPrefix("w.%"));
        select.addAll(workCommon.customer.selectPrefix("c.% as 'customer.%'"));

        String STR_work = "SELECT " + String.join(", ", select) + " FROM hancomee_work w " +
                "INNER JOIN hancomee_customer c ON w.customer_id = c.id " +
                "WHERE w.uuid = {uuid}",
                STR_refs = "SELECT * FROM hancomee_workfile f INNER JOIN hancomee_workfile_ref r USING(id) WHERE r.work_id = {id}",
                STR_items = "SELECT * FROM hancomee_workitem WHERE work_id = {id}",
                STR_draft = "SELECT * FROM hancomee_workfile f INNER JOIN hancomee_workfile_draft r USING(id) WHERE r.item_id = {id}",
                STR_print = "SELECT * FROM hancomee_workfile f INNER JOIN hancomee_workfile_print r USING(id) WHERE r.item_id = {id}",
                STR_memo = "SELECT * FROM hancomee_workmemo WHERE work_id = {id}";

        SQL_work = dynamicSQL(STR_work);
        SQL_refs = dynamicSQL(STR_refs);
        SQL_items = dynamicSQL(STR_items);
        SQL_draft = dynamicSQL(STR_draft);
        SQL_print = dynamicSQL(STR_print);
        SQL_memo = dynamicSQL(STR_memo);

    }

    // hancomee_work INNER JOIN hancomee_customer
    @RequestMapping("{uuid}")
    @ResponseBody
    public Object values(@PathVariable("uuid") String uuid) throws Exception {

        Map<String, Object> k = new HashMap<>();
        k.put("uuid", uuid);
        k.put("work", null);
        k.put("items", null);

        return db.doWork((con) -> {

            // work, work.customer
            Map<String, Object> result = db.execute(con, SQL_work.apply(k), SQL::readJSON);

            if (result.get("id") == null) {
                return k;
            }

            // work.ref
            result.put("refs", db.execute(con, SQL_refs.apply(result), SQL::readAllJSON));
            result.put("memo", db.execute(con, SQL_memo.apply(result), SQL::readAllJSON));

            // workItem
            List<Map<String, Object>>
                    items = db.execute(con, SQL_items.apply(result), SQL::readAllJSON);

            // workItem.draft,  workItem.print
            for (Map<String, Object> m : items) {
                m.put("draft", db.execute(con, SQL_draft.apply(m), SQL::readAllJSON));
                m.put("print", db.execute(con, SQL_print.apply(m), SQL::readAllJSON));
            }

            k.put("work", result);
            k.put("items", items);
            return k;
        });
    }

}
