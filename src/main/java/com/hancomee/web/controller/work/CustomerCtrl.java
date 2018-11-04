package com.hancomee.web.controller.work;

import com.boosteel.nativedb.NativeDB;
import com.boosteel.nativedb.core.ResultSetAccess;
import com.hancomee.web.controller.support.PageRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("hancomee/customer")
public class CustomerCtrl {


    @Autowired
    NativeDB workDB;

    @RequestMapping("get/{id}")
    @ResponseBody
    public Object get(@PathVariable("id") int id) throws Exception {
        return workDB.execute("SELECT * FROM hancomee_customer WHERE id = " + id, ResultSetAccess::readJSON);
    }

    @RequestMapping("values")
    @ResponseBody
    public PageRequest values(Query query) throws Exception {
        String[] sql = query.SQL();
        return new PageRequest(
                workDB.execute(sql[0], ResultSetAccess::readAllJSON),
                workDB.execute(sql[1], 0l, (rs) -> rs.getLong(1)),
                query.page,
                query.size
        );
    }


    // id  cost  file_len  item_len  memo_len  price  total  vat
    // datetime  state  text  title  updatetime  uuid  customer_id
    // activetime  name
    public static class Query {

        private int page = 1;
        private int size = 100;

        private String name = "";
        private String memo = "";

        private String order = "<datetime";

        public void setPage(int page) {
            this.page = page;
        }

        public String[] SQL() {

            String from = "FROM hancomee_customer c WHERE 1";

            if (!name.isEmpty())
                from += " AND c.name LIKE '%" + name + "%'";

            if (!memo.isEmpty())
                from += " AND w.title LIKE '%" + memo + "%'";

            return new String[]{
                    "SELECT c* " + from + orderBy() + limit(page, size),
                    "SELECT COUNT(*) " + from
            };
        }

        private String orderBy() {
            String sql = " ORDER BY " + order.replaceAll("^<|>", "");
            return order.startsWith(">") ? sql + " DESC" : sql;
        }

        private String limit(int page, int size) {
            return "  LIMIT " + ((page - 1) * size) + ", " + size;
        }

    }
}
