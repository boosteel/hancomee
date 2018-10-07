package com.hancomee.web.controller.work;

import com.hancomee.util.DB;
import com.hancomee.util.SQL;
import com.hancomee.util.db.NamedPrepareStatement;
import com.hancomee.util.db.NamedPreparedStatementFactory;
import com.hancomee.util.db.anno.Query;
import com.hancomee.util.db.RepositoryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;


@Controller
@RequestMapping("hancomee/db")
public class DBController {

    @Autowired
    _WorkCommon workCommon;

    @Autowired
    DB workDB;

    Queries queries;

    public interface Queries {

        @Query("SELECT name, owner, address FROM hancomee_customer WHERE name LIKE :%name%")
        NamedPrepareStatement customerSearch(Connection con);

        @Query("INSERT INTO hancomee_workmemo (value, datetime, work_id) VALUES " +
                "(:value, :datetime, :work_id[i])")
        NamedPrepareStatement memoSave(Connection con);

        @Query("UPDATE hancomee_workmemo SET value = :value WHERE id = :id[i]")
        NamedPrepareStatement memoUpdate(Connection con);

        @Query("UPDATE hancomee_work SET memo_len = " +
                "(SELECT count(id) FROM hancomee_workmemo WHERE work_id = :id[i]) " +
                "WHERE id = :id[i]")
        NamedPrepareStatement memoRefresh(Connection con);

        @Query("SELECT COUNT(id) count, SUM(price) price, SUM(total) total, SUM(vat) vat " +
                "FROM hancomee_workitem WHERE work_id = :id[i]")
        Map<String, Object> itemValue(Connection con);


        @Query("UPDATE hancomee_work SET count = :count[i], price = :price[i], total = :total[i], " +
                "vat = :vat[i] WHERE id = :id[i]")
        Map<String, Object> workItemRefresh(Connection con);

    }

    Map<String, NamedPreparedStatementFactory> factories = new HashMap<>();

    String
            customer_search = "SELECT name, owner, address FROM hancomee_customer WHERE name LIKE :%name%",
            memo_save = "INSERT INTO hancomee_workmemo (value, datetime, work_id) VALUES " +
                    "(:value, :datetime, :work_id[i])",
            memo_update = "UPDATE hancomee_workmemo SET value = :value WHERE id = :id[i]",
            work_item_values = "SELECT COUNT(id) count, SUM(price) price, SUM(total) total, SUM(vat) vat " +
                    "FROM hancomee_workitem WHERE work_id = :id[i]";

    SQL.DQuery
            MEMO_SAVE = SQL.dynamicSQL(memo_save),
            MEMO_UPDATE = SQL.dynamicSQL(memo_update),
            CUSTOMER_SAVE, CUSTOMER_UPDATE;



    NamedPreparedStatementFactory
            CUSTOMER_SEARCH = SQL.newPrepared(customer_search),
            WORK_ITEM_VALUES = SQL.newPrepared(work_item_values);

    @PostConstruct
    public void post() throws Exception {
        queries = RepositoryFactory.createRepository(Queries.class, null);
    }

    public NamedPrepareStatement find(String key, Connection con) {
        return factories.get(key).create(con);
    }

    // ***************************** 거래처 ************************************* //
    @RequestMapping(value = "customer", method = RequestMethod.POST)
    @ResponseBody
    public Object customer(@RequestBody Map<String, Object> map) throws Exception {
        return workDB.doStmtR((s, c) -> {
            Object id = map.get("id");
            if (id == null) {
                id = workDB.save(s, SQL.insert("hancomee_customer", map), true);
            } else
                workDB.update(SQL.update("hancomee_customer", map));
            return id;
        }, false);
    }


    // 거래처 이름 검색
    @RequestMapping(value = "customer/search/{key}")
    @ResponseBody
    public Object customer(@PathVariable("key") String key) throws Exception {
        return workDB.doWorkR(con -> {
            return CUSTOMER_SEARCH.create(con).setValue("name", key).doWorkR((pstmt, self) -> {
                return SQL.reduce(pstmt.executeQuery(), new ArrayList<>(), (list, rs, i) -> {
                    Map map = new HashMap<>();
                    map.put("address", rs.getString("address"));
                    map.put("name", rs.getString("name"));
                    map.put("owner", rs.getString("owner"));
                    list.add(map);
                });
            });
        });
    }
    /*@RequestMapping(value = "customer/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public void customer(@PathVariable("id") long id) throws Exception {
        workDB.doStmt(s -> {
            workDB.update("DELETE FROM hancomee_customer WHERE id = " + id);
        }, false);

    }*/

    // ***************************** 아이템 ************************************* //
    @RequestMapping(value = "item", method = RequestMethod.POST)
    @ResponseBody
    public Object item(@RequestBody Map<String, Object> map) throws Exception {
        Map<String, Object> result = new HashMap<>();
        return workDB.doStmtR((s, c) -> {
            Object id = map.get("id");
            /*if (id == null) {
                id = workDB.save(s, SQL.insert("hancomee_workitem", map), true);
                WORK_MEMO_U.newInstance(c).setValue("id", map.get("work_id")).doWork((p, u) -> p.executeUpdate());
            } else
                workDB.update(SQL.update("hancomee_workitem", map));*/
            return id;
        }, false);

    }

    @RequestMapping(value = "item/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public void item(@PathVariable("id") long id) throws Exception {
        workDB.doStmt((s, c) -> {
            long workid = workDB.getLong(s, "SELECT work_id FROM hancomee_workitem WHERE id = " + id);
            workDB.update("DELETE FROM hancomee_workitem WHERE id = " + id);
            workDB.update("UPDATE hancomee_work SET item_len = item_len - 1 WHERE id = " + workid);
        }, false);

    }

    // ***************************** 메모 ************************************* //
    @RequestMapping(value = "memo", method = RequestMethod.POST)
    @ResponseBody
    public Object memo(@RequestBody Map<String, Object> map) throws Exception {
        return workDB.doStmtR((s, c) -> {
            Object id = map.get("id");
            if (id == null) {
                id = workDB.save(s, MEMO_SAVE.apply(map), true);
                s.executeUpdate("UPDATE hancomee_work SET memo_len = memo_len + 1 WHERE id = " +
                        map.get("work_id"));
            } else
                workDB.update(MEMO_UPDATE.apply(map));
            return id;
        }, false);

    }

    @RequestMapping(value = "memo/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public void memo(@PathVariable("id") long id) throws Exception {
        workDB.doStmt((s, c) -> {
            long workid = workDB.getLong(s, "SELECT work_id FROM hancomee_workmemo WHERE id = " + id);
            workDB.update("DELETE FROM hancomee_workmemo WHERE id = " + id);
            workDB.update("UPDATE hancomee_work SET memo_len = memo_len - 1 WHERE id = " + workid);
        }, false);

    }

}
