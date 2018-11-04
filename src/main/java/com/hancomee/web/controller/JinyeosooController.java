package com.hancomee.web.controller;

import com.boosteel.nativedb.NativeDB;
import com.boosteel.nativedb.core.anno.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.sql.Statement;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("jinyeosoo")
public class JinyeosooController {

    private NativeDB db = new NativeDB("jdbc:mariadb://115.23.187.44:3306/hancomee", "root", "ko9984");
    private SQL sql;

    public JinyeosooController() {
        System.out.println("----------------------------------------------------------------------" + db);
        sql = db.createRepository(SQL.class);
    }

    @RequestMapping()
    public String intro() {
        return "jinyeosoo/main.html";
    }


    // ***************************************  고객정보   *************************************** //
    @RequestMapping(value = "customer/{key}")
    @ResponseBody
    public List<Map<String, Object>> customer(@PathVariable("key") String key) {
        return sql.searchByName(key);
    }

    @RequestMapping(value = "customers")
    @ResponseBody
    public List<Map<String, Object>> customerList() {
        return sql.customerList();
    }


    @RequestMapping(value = "customer/get/{id}")
    @ResponseBody
    public Object saveCustomer(@PathVariable("id") Object id) {
        return sql.customer(id);
    }

    @RequestMapping(value = "customer", method = RequestMethod.POST)
    @ResponseBody
    public int saveCustomer(@RequestBody Map<String, Object> params) {
        return params.get("id") == null ? sql.saveCustomer(params) : sql.updateCustomer(params);
    }

    // ***************************************  관리내역   *************************************** //
    @RequestMapping(value = "managing", method = RequestMethod.POST)
    @ResponseBody
    public Object saveManaging(@RequestBody Map<String, Object> params) {
        Object id = params.get("id");
        if(id == null) id = sql.saveManaging(params);
        else sql.updateManaging(params);
        return id;
    }

    @RequestMapping(value = "managing/{customerId}")
    @ResponseBody
    public List<Map<String, Object>> managing(@PathVariable("customerId") Object key) {
        return sql.managingList(key);
    }

    @RequestMapping(value = "managing/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public Object deleteManaging(@PathVariable("id") Object id) {
        return sql.deleteManaging(id);
    }

    // ***************************************  결제정보   *************************************** //
    @RequestMapping(value = "account", method = RequestMethod.POST)
    @ResponseBody
    public Object saveAccount(@RequestBody Map<String, Object> params) {
        return db.doStmtR(stmt -> {
            Object id = params.get("id");
            // save
            if (id == null) id = sql.saveAccount(stmt, params);
            else sql.updateAccount(stmt, params);

            sql.refreshAccount(stmt, params.get("customer_id"));

            return id;
        });

    }

    @RequestMapping(value = "account/{customerId}/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public void deleteAccount(@PathVariable("customerId") Object customerId, @PathVariable("id") Object id) {
        db.doStmt(stmt -> {
            sql.deleteAccount(stmt, id);
            sql.refreshAccount(stmt,customerId);
        });
    }

    @RequestMapping(value = "customer/account/{customerId}")
    @ResponseBody
    public Object accountData(@PathVariable("customerId") Object id) {
        return sql.accountData(id);
    }

    @RequestMapping(value = "account/{customerId}")
    @ResponseBody
    public List<Map<String, Object>> account(@PathVariable("customerId") Object key) {
        return sql.accountList(key);
    }

    public interface SQL {

        @Selector("SELECT * FROM jinyeosoo_customer this ORDER BY this.datetime DESC")
        List<Map<String, Object>> customerList();

        @Selector("SELECT this.id, this.name, this.birth, this.mobile FROM jinyeosoo_customer this WHERE this.name LIKE :name%")
        List<Map<String, Object>> searchByName(@Value("name") String name);

        @Selector("SELECT * FROM jinyeosoo_customer this WHERE this.id = :id{i}")
        Map<String, Object> customer(@Value("id") Object name);

        @Insert(value = "jinyeosoo_customer", lastId = true)
        int saveCustomer(Map<String, Object> map);

        @Update(value = "jinyeosoo_customer")
        int updateCustomer(Map<String, Object> map);

        // ***************************************  관리정보   *************************************** //
        @Selector("SELECT * FROM jinyeosoo_managing this WHERE this.customer_id = :id{i} ORDER BY this.datetime DESC")
        List<Map<String, Object>> managingList(@Value("id") Object name);

        @Update(value = "jinyeosoo_managing")
        int updateManaging(Map<String, Object> map);

        @Insert(value = "jinyeosoo_managing", lastId = true)
        int saveManaging(Map<String, Object> map);

        @Save("DELETE FROM jinyeosoo_managing WHERE id = :id{i}")
        int deleteManaging(@Value("id") Object id);


        // ***************************************  결제정보   *************************************** //
        @Selector("SELECT * FROM jinyeosoo_account this WHERE this.customer_id = :id{i} ORDER BY this.datetime DESC")
        List<Map<String, Object>> accountList(@Value("id") Object name);

        @Update(value = "jinyeosoo_account")
        int updateAccount(Statement stmt, Map<String, Object> map);

        @Insert(value = "jinyeosoo_account", lastId = true)
        int saveAccount(Statement stmt, Map<String, Object> map);

        @Save("DELETE FROM jinyeosoo_account WHERE id = :id{i}")
        int deleteAccount(Statement stmt, @Value("id") Object id);

        @Selector("SELECT account_type type, SUM(money) sum, COUNT(money) count FROM jinyeosoo_account this " +
                "WHERE this.customer_id = :id{i} GROUP BY this.account_type")
        List<Map<String, Object>> accountData(@Value("id") Object obj);


        // 고객정보에 있는 결제합산 내역 갱신하기
        @Save(value = "UPDATE jinyeosoo_customer c " +
                "INNER JOIN " +
                "(SELECT :id{i} id, IFNULL(SUM(money), 0) sum, IFNULL(COUNT(id), 0) count " +
                "FROM jinyeosoo_account WHERE customer_id = :id{i} ) as t USING(id) " +
                "SET c.account_total = t.sum, c.account_count = t.count " +
                "WHERE id = :id{i}")
        void refreshAccount(Statement stmt, @Value("id") Object id);
    }
}
