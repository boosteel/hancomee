package com.hancomee.web.controller;

import com.hancomee.util.DB;
import com.hancomee.util.SQL;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("secret/gallery")
public class Gallery {

    DB db= new DB("jdbc:mariadb://localhost:3306/hancomee", "root", "ko9984");


    @RequestMapping()
    public String intro() {
        return "secret/gallery.html";
    }


    @RequestMapping("values")
    @ResponseBody
    public Values values(Query query) throws Exception {
        String[] sql = query.SQL();
        return new Values(
                db.execute(sql[0], (rs) -> SQL.readAll(rs)),
                db.execute(sql[1], (rs) -> rs.getLong(1)),
                query.page,
                query.size
        );
    }

    // 폴더
    @RequestMapping("paths")
    @ResponseBody
    public List<String> paths() throws Exception {
        return db.executeAll("SELECT path FROM secret_gallery GROUP BY path ORDER BY path",
                (rs, i) -> {
                    return rs.getString("path");
                });
    }

    // 가장 최근 수정한 것
    @RequestMapping("paths/latest")
    @ResponseBody
    public List<String> latest() throws Exception {
        return db.executeAll("SELECT path FROM secret_gallery GROUP BY path ORDER BY uploadTime",
                (rs, i) -> {
                    return rs.getString("path");
                });
    }


    // 업데이트
   @RequestMapping(value = "update/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public int update(
            @PathVariable("id") long id,
            @RequestBody Map<String, String> req
    ) throws Exception {
        return db.update("UPDATE secret_gallery SET " + req.get("prop") + " = " + req.get("value") + " WHERE id = " + id);
    }



    public static class Query {

        private int page = 1;
        private int size = 300;

        private String path = "gallery";
        private String search = "";
        private int favorite = 0;
        private boolean blind = false;
        private int shot = 0;
        private String tag = "";

        private String order = ">datetime";


        public int getPage() {
            return page;
        }

        public Query setPage(int page) {
            this.page = page;
            return this;
        }

        public int getSize() {
            return size;
        }

        public Query setSize(int size) {
            this.size = size;
            return this;
        }

        public String getPath() {
            return path;
        }

        public Query setPath(String path) {
            this.path = path.replaceAll("^[\\s|\\/]+", "");
            return this;
        }

        public String getSearch() {
            return search;
        }

        public Query setSearch(String search) {
            this.search = search;
            return this;
        }

        public int getFavorite() {
            return favorite;
        }

        public Query setFavorite(int favorite) {
            this.favorite = favorite;
            return this;
        }

        public boolean isBlind() {
            return blind;
        }

        public Query setBlind(boolean blind) {
            this.blind = blind;
            return this;
        }

        public int getShot() {
            return shot;
        }

        public Query setShot(int shot) {
            this.shot = shot;
            return this;
        }

        public String getTag() {
            return tag;
        }

        public Query setTag(String tag) {
            this.tag = tag;
            return this;
        }

        public String getOrder() {
            return order;
        }

        public Query setOrder(String order) {
            this.order = order;
            return this;
        }

        public String[] SQL() {

            String from = "FROM secret_gallery WHERE path LIKE '" + path + "%'";

            if (!search.isEmpty()) {

                // 유저검색
                if (search.startsWith("@"))
                    from += " AND user LIKE '%" + search.substring(1) + "%'";
                else
                    from += " AND title LIKE '%" + search + "%'";
            }

            from += " AND favorite >= " + favorite;
            from += " AND blind = " + blind;
            from += " AND shot >= " + shot;

            if (!tag.isEmpty())
                from += " AND tags LIKE '%" + tag + "%'";

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
            if(count % size != 0) totalPages++;
            this.page = page;
        }
    }
}
