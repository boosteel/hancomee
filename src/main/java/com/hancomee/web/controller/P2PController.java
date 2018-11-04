package com.hancomee.web.controller;

import com.boosteel.nativedb.NativeDB;
import com.boosteel.nativedb.core.ResultSetAccess;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("secret/p2p")
public class P2PController {

    NativeDB db = new NativeDB("jdbc:mariadb://localhost:3306/hancomee", "root", "ko9984");


    @RequestMapping()
    public String intro() {
        return "secret/p2p.html";
    }


    @RequestMapping("values")
    @ResponseBody
    public Values values(Query query) throws Exception {
        String[] sql = query.SQL();
        return new Values(
                db.execute(sql[0], ResultSetAccess::readAllJSON),
                db.execute(sql[1], 0l, (rs) -> rs.getLong(1)),
                query.page,
                query.size
        );
    }


    // 업데이트
    @RequestMapping(value = "visited/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public int visited(@PathVariable("id") long id) throws Exception {
        return db.update("UPDATE p2p SET visited = true WHERE id = " + id);
    }

    // 업데이트
    @RequestMapping(value = "good/{id}/{val}", method = RequestMethod.PUT)
    @ResponseBody
    public int good(@PathVariable("id") long id, @PathVariable("val") boolean val) throws Exception {
        return db.update("UPDATE p2p SET good = " + val + " WHERE id = " + id);
    }


    public static class Query {

        private int page = 1;
        private int size = 300;

        private String site = "";
        private String search = "";
        private boolean good;
        private String order = "id";

        public Query setPage(int page) {
            this.page = page;
            return this;
        }

        public Query setSize(int size) {
            this.size = size;
            return this;
        }

        public Query setSite(String site) {
            this.site = site;
            return this;
        }

        public Query setSearch(String search) {
            this.search = search;
            return this;
        }

        public Query setGood(boolean good) {
            this.good = good;
            return this;
        }

        public Query setOrder(String order) {
            this.order = order;
            return this;
        }

        public String[] SQL() {

            String from = "FROM p2p WHERE blind = 0";

            if(!site.isEmpty()) from = " AND site = '" + site + "'";

            if (!search.isEmpty()) {
                from += " AND title LIKE '%" + search + "%'";
            }

            if(good)
                from += " AND good = true";

            return new String[]{
                    "SELECT * " + from + orderBy() + limit(page, size),
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

    static class Values {
        public List<Map<String, Object>> values;
        public long count;
        public long totalPages;
        public int page;

        Values(List<Map<String, Object>> values, long count, int page, int size) {
            this.values = values;
            this.count = count;
            totalPages = count / size;
            if (count % size != 0) totalPages++;
            this.page = page;
        }
    }
}
