package com.hancomee;

import com.hancomee.util.DB;
import com.hancomee.util.SQL;
import com.hancomee.util.db.*;
import com.hancomee.util.db.anno.Query;
import com.hancomee.util.db.anno.Save;
import com.hancomee.util.db.anno.Value;
import com.hancomee.util.db.anno.Stmt;
import com.hancomee.util.reflect.DataBean;
import com.hancomee.web.controller.work.domain.Customer;
import org.junit.Test;

import java.sql.*;
import java.util.*;
import java.util.Date;

public class DBTest {

    DB db = new DB("jdbc:mariadb://115.23.187.44:3306/hancomee", "root", "ko9984");

    Set<Connection> cons = new HashSet<>();

    public TableInfo customer = TableInfo.create("hancomee_customer", db),
            work = TableInfo.create("hancomee_work", db),
            workItem = TableInfo.create("hancomee_workitem", db),
            workFile = TableInfo.create("hancomee_workfile", db);

    @Test
    public void test() throws Exception {

        Magic m = RepositoryFactory.createRepository(Magic.class, db.dataSource);
        Customer customer = new Customer();
        customer.address = "asdfasdfasdf";
        customer.biz_con = "뚠따";
        customer.id = 10;

        DataBean db = DataBean.getBeanData(Customer.class);
        out(db.dynamicUpdate("hancomee_customer", customer));
    }

    public static class Work {
        int id;
        String name;
        @Override
        public String toString() {
            return id + " / " + name;
        }
    }

    public static class M {
        long datetime;
    }


    public interface Magic {


        @Query("SELECT * FROM test1 $ WHERE $.name LIKE :%name%")
        Work get(Work work);

        @Save
        @Query("UPDATE test1 SET name = '뿐따' WHERE id = 1")
        void workMemo();

        @Query("INSERT INTO test1 (old, datetime, name) VALUES (:old[i], :datetime[d], :name)")
        long test(Connection con, @Value("datetime") Date date, @Value("old") int old, @Value("name") String name);

        @Stmt("INSERT INTO test1 (old, datetime, name) VALUES (:old[i], :datetime[d], :name)")
        long test2(Connection con, @Value("datetime") Date date, @Value("old") int old, @Value("name") String name);
    }

    public void memo_len() throws Exception {
        class D {
            long id;
            String updateTime;

            public D(long id, String updateTime) {
                this.id = id;
                this.updateTime = updateTime;
            }

            @Override
            public String toString() {
                return this.updateTime;
            }
        }

        db.doStmt((s, c) -> {
            Set<D> set = SQL.reduce(s.executeQuery("SELECT id, updatetime FROM hancomee_work"),
                    new HashSet<>(),
                    (l, rs, i) -> {
                        l.add(new D(rs.getLong("id"), rs.getString("updatetime")));
                    });

            for (D d : set) {
                s.executeUpdate("UPDATE hancomee_work SET memo_len = " +
                        db.getInt(s, "SELECT COUNT(id) FROM hancomee_workmemo WHERE work_id = " + d.id) +
                        " WHERE id = " + d.id);
            }

        }, false);
    }


    private <T> T out(T obj) {
        System.out.println(obj);
        return obj;
    }
}
