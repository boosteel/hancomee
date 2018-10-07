package com.hancomee.web.controller.work;

import com.hancomee.util.DB;
import com.hancomee.util.SQL;
import com.hancomee.web.controller.support.PageRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.PostConstruct;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Controller
@RequestMapping("hancomee/list")
public class ListController {

    @Autowired
    _WorkCommon workCommon;

    @Autowired
    DB workDB;

    private String listSelect;

    // 리스트값 SELECT 부분 설정
    @PostConstruct
    public void post() {
        List<String> select = new ArrayList<>();
        select.addAll(workCommon.work.selectPrefix("w.%"));
        select.addAll(workCommon.customer.selectPrefix("c.% as 'customer.%'"));
        select.addAll(workCommon.workFile.selectPrefix("wf.% as 'draft.%'"));
        listSelect = "SELECT " + String.join(", ", select);
    }

    // hancomee_work INNER JOIN hancomee_customer
    @RequestMapping()
    @ResponseBody
    public Object values(Query query) throws Exception {
        return workDB.doWorkR((con) -> {
            return new ListResult(query.page, query.size, query.state)
                    .setArray(workDB.execute(con, query.StateSQL(), this::parseState))
                    .setValues(workDB.execute(con, query.SQL(listSelect), SQL::readAllJSON));
        });
    }

    @RequestMapping("state")
    @ResponseBody
    public int[][] state(Query query) throws Exception {
        /*
         *  갯수가 0일 경우에는 결과컬럼이 생략된다.
         *  따라서 배열 기본값을 0으로 모두 잡아놓은 상태에서 state값을 배열 인덱스로 취한다.
         *  결국 생략되는 결과는 0으로 집계되는 형태다.
         */
        return workDB.execute(query.StateSQL(), this::parseState);
    }

    private int[][] parseState(ResultSet rs) throws Exception {
        int[] count = {0, 0, 0, 0, 0, 0, 0}, total = {0, 0, 0, 0, 0, 0, 0};
        int index;
        while (rs.next()) {
            index = rs.getInt("state");
            count[index] = rs.getInt("v");
            total[index] = rs.getInt("t");
        }

        return new int[][]{count, total};
    }

    public static class Query {

        private int page = 1;
        private int size = 10;

        private int state = 0;

        private String customerName = "";
        private String title = "";

        private String order = "<datetime";

        public void setSize(int size) {
            this.size = size;
        }

        public void setState(int state) {
            this.state = state;
        }

        public void setCustomerName(String customerName) {
            this.customerName = customerName;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public void setOrder(String order) {
            this.order = order;
        }

        public void setPage(int page) {
            this.page = page;
        }

        // work 가지고 오기
        public String SQL(String listSelect) {

            String from = " FROM hancomee_work w " +
                    "INNER JOIN hancomee_customer c ON w.customer_id = c.id " +
                    "LEFT OUTER JOIN hancomee_workitem i ON w.id = i.work_id " +
                    "LEFT OUTER JOIN hancomee_workfile_draft p ON p.item_id = i.id " +
                    "LEFT OUTER JOIN hancomee_workfile wf ON p.id = wf.id ",
                    where = where("WHERE w.state = " + state);

            return listSelect + from + where + " GROUP BY w.id " + orderBy() + limit(page, size);
        }

        // 현황내역 가지고 오기
        public String StateSQL() {
            return "SELECT w.state, COUNT(*) v, SUM(w.total) t " +
                    "FROM hancomee_work w INNER JOIN hancomee_customer c ON w.customer_id = c.id " +
                    where("WHERE 1") + " GROUP BY state";
        }

        public String where(String where) {
            if (!customerName.isEmpty())
                where += " AND c.name LIKE '%" + customerName + "%'";

            if (!title.isEmpty())
                where += " AND w.title LIKE '%" + title + "%'";
            return where;
        }


        private String orderBy() {
            String sql = " ORDER BY " + order.replaceAll("^<|>", "");
            return order.startsWith(">") ? sql + " DESC" : sql;
        }

        private String limit(int page, int size) {
            return "  LIMIT " + ((page - 1) * size) + ", " + size;
        }
    }


    public static class ListResult {
        public int state;

        public int page;
        public int size;
        public int totalPages;
        public int totalElements;

        public int[] price;
        public int[] count;

        public Object values;

        public ListResult(int page, int size, int state) {
            this.page = page;
            this.size = size;
            this.state = state;
        }

        public ListResult setArray(int[][] values) {
            this.totalElements = (this.count = values[0])[this.state];

            totalPages = totalElements / size;
            if(totalElements % size != 0) totalPages++;

            this.price = values[1];
            return this;
        }

        public ListResult setValues(Object obj) {
            this.values = obj == null ? Collections.EMPTY_LIST : obj;
            return this;
        }
    }
}
