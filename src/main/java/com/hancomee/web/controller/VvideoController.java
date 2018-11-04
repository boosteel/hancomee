package com.hancomee.web.controller;

import com.boosteel.nativedb.NativeDB;
import com.boosteel.nativedb.core.ResultSetAccess;
import com.hancomee.web.controller.support.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("secret/vvideo")
public class VvideoController {

    NativeDB db = new NativeDB("jdbc:mariadb://localhost:3306/hancomee", "root", "ko9984");


    @RequestMapping()
    public String intro() {
        return "secret/vvideo.html";
    }


    @RequestMapping("values")
    @ResponseBody
    public PageRequest values(Query query) throws Exception {
        String[] sql = query.SQL();
        return new PageRequest(
                db.execute(sql[0], ResultSetAccess::readAllJSON),
                db.execute(sql[1], 0l, (rs) -> rs.getLong(1)),
                query.page,
                query.size
        );
    }

    // 폴더
    @RequestMapping("paths")
    @ResponseBody
    public List<String> paths() throws Exception {
        return db.execute("SELECT path FROM vvideo GROUP BY path ORDER BY path",
                new ArrayList<>(),
                (rs, i) -> rs.getString("path"));
    }


    // 체크
    @RequestMapping("pick")
    @ResponseBody
    public int pick() throws Exception {
        return db.execute("SELECT COUNT(*) FROM vvideo WHERE pick = true",
                0,
                (rs) -> rs.getInt(1));
    }

    @RequestMapping(value = "pick", method = RequestMethod.DELETE)
    @ResponseBody
    public void pick_() throws Exception {
        db.save("UPDATE vvideo SET pick = 0");
    }

    // 업데이트
    @RequestMapping(value = "update/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public int update(
            @PathVariable("id") long id,
            @RequestBody Map<String, String> req
    ) throws Exception {

        List<String> result = new ArrayList<>();

        for (Map.Entry entry : req.entrySet())
            result.add(entry.getKey() + " = " + entry.getValue());

        if (result.isEmpty()) return -1;

        return db.update("UPDATE vvideo SET " + String.join(", ", result) + " WHERE id = " + id);
    }

    public static class Query {

        private int page = 1;
        private int size = 100;

        private boolean pick = false;
        private boolean blind = false;
        private int favorite = 0;
        private int shot = 0;

        private String title = "";
        private String path = "";
        private String tag = "";

        private String order = "id";


        public void setPage(int page) {
            this.page = page;
        }

        public void setSize(int size) {
            this.size = size;
        }

        public void setBlind(boolean blind) {
            this.blind = blind;
        }

        public void setFavorite(int favorite) {
            this.favorite = favorite;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public void setPath(String path) {
            this.path = path;
        }

        public void setTag(String tag) {
            this.tag = tag;
        }

        public void setOrder(String order) {
            this.order = order;
        }

        public void setPick(boolean pick) {
            this.pick = pick;
        }

        public void setShot(int shot) {
            this.shot = shot;
        }

        public String[] SQL() {

            String from = "FROM vvideo WHERE blind = " + blind + " AND favorite >= " + favorite;

            if (!path.isEmpty())
                from += " AND path LIKE '" + path + "%'";

            if (!title.isEmpty())
                from += " AND title LIKE '%" + title + "%'";

            if (!tag.isEmpty())
                from += " AND tag LIKE '%" + tag + "%'";

            if (pick) {
                from += " AND pick = 1";
            }

            if (shot > 0) {
                from += " AND shot >= " + shot;
            }

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
}
