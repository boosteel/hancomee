package com.hancomee.web.controller.work;

import com.hancomee.util.db.DB;
import com.hancomee.web.controller.support.WorkList;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class _WorkManager {

    private DB db = new DB("jdbc:mariadb://115.23.187.44:3306/hancomee", "root", "ko9984");
    private _WorkSQL SQL;

    public _WorkManager() {
        SQL = db.createRepository(_WorkSQL.class);
    }


    @Bean
    public DB db() {
        return this.db;
    }



    // 작업 리스트 가지고 오기
    public WorkList getWorkList(Map<String, String> query) {
        return db.doStmtR(stmt ->
                SQL.list(stmt, new WorkList(query), query)
                        .setArray(parseState(SQL.state(stmt, query))));
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



    public Map<String, Object> getWork(String uuid) {
        return db.doStmtR(stmt -> {

            // work, work.customer
            Map<String, Object>
                    result = new HashMap<>(),
                    work = SQL.getWork(stmt, uuid);
            Object id = work.get("id");

            // work.ref
            work.put("refs", SQL.getRefs(stmt, id));
            work.put("memo", SQL.getMemos(stmt, id));

            // workItem
            List<Map<String, Object>> items = SQL.getItems(stmt, id);

            // workItem.draft,  workItem.print
            for (Map<String, Object> m : items) {
                id = m.get("id");
                m.put("draft", SQL.getDrafts(stmt, id));
                m.put("print", SQL.getPrints(stmt, id));
            }

            result.put("work", work);
            result.put("items", items);
            return result;
        });
    }




    public List<Map<String, Object>> searchCustomer(String key) {
        return db.doStmtR(stmt -> SQL.customerSearch(stmt, key));
    }

    // 참고파일 추가하기
    public int addRef(int workId, Map<String, Object> fileData) {
        return db.doStmtR(stmt -> {
            int id = SQL.insertFile(stmt, fileData);
            SQL.insertRef(stmt, id, workId);
            SQL.refreshRef(stmt, workId);
            return id;
        });
    }

    public void deleteRef(int id) {
        db.doStmt(stmt-> SQL.deleteRef(stmt, id));
    }
    public void deletePrint(int id) {
        db.doStmt(stmt-> SQL.deletePrint(stmt, id));
    }
    public void deleteDraft(int id) {
        db.doStmt(stmt-> SQL.deleteDraft(stmt, id));
    }

    // 인쇄파일 추가하기
    public int addPrint(int itemId, Map<String, Object> fileData) {
        return db.doStmtR(stmt -> {
            int id = SQL.insertFile(stmt, fileData);
            SQL.insertPrint(stmt, id, itemId);
            return id;
        });
    }

    // 시안파일 추가하기
    public int addDraft(int itemId, Map<String, Object> fileData) {
        return db.doStmtR(stmt -> {
            int id = SQL.insertFile(stmt, fileData);
            SQL.insertDraft(stmt, id, itemId);
            return id;
        });
    }


    /*
     *   작업 아이템 추가, 수정
     */
    public int saveItem(Object workId, Map<String, Object> itemData) {
        return db.doStmtR(stmt -> {
            Object id = itemData.get("id");

            // id 유무에 따라 Insert or Update
            if (id == null) itemData.put("id", id = SQL.insertItem(stmt, itemData, workId));
            else SQL.updateItem(stmt, itemData, workId);

            // hancomee_work의 item_len 등을 갱신한다.
            SQL.refreshWorkItem(stmt, SQL.itemValue(stmt, workId), workId);

            return Integer.parseInt(id.toString());
        });
    }

    /*
     *  작업 아이템 지우기
     */
    public void removeItem(int itemId) {
        db.doStmt(stmt -> {
            // print, draft도 모두 지움
            SQL.deleteAllDraft(stmt, itemId);
            SQL.deleteAllPrint(stmt, itemId);

            String workId = SQL.getWorkId(stmt, itemId);
            SQL.deleteWorkItem(stmt, itemId);
            // hancomee_work의 item_len 등을 갱신한다.
            SQL.refreshWorkItem(stmt, SQL.itemValue(stmt, workId), workId);
        });
    }


    public int saveMemo(Object workId, Map<String, Object> memoData) {
        return db.doStmtR(stmt -> {
            Object id = memoData.get("id");
            if (id == null) id = SQL.insertMemo(stmt, memoData, workId);
            else SQL.updateMemo(stmt, id, memoData.get("value"));
            SQL.refreshMemo(stmt, workId);
            return Integer.parseInt(id.toString());
        });
    }

    public void removeMemo(Object memoId) {
        db.doStmt(stmt -> SQL.deleteMemo(stmt, memoId));
    }

    /*
     *  작업 추가하기
     *  반환값은 uuid
     *
     *  폴더도 미리 만들어놓는다.
     *
     */
    private static final Path ROOT = Paths.get("D:\\work");
    public String addWork(int customerId, String title) {
        return db.doStmtR(stmt -> {
            // 2018-1000065
            String uuid = SQL.createUUID(stmt),
                    year = uuid.substring(0, 4),
                    month = uuid.substring(5, 7),
                    num = uuid.substring(7, uuid.length());

            // 폴더 생성
            Files.createDirectories(ROOT.resolve(year).resolve(month).resolve(num));

            SQL.insertWork(stmt, uuid, customerId, title);
            return uuid;
        });
    }


    public _WorkManager saveWork(Map<String, String> dataMap) {
        db.doStmt(stmt -> SQL.updateWork(stmt, dataMap));
        return this;
    }

    // 작업 아예 삭제하기
    public _WorkManager removeWork(int workId) {

        db.doStmt(stmt -> {
            // 모든 메모 삭제
            SQL.deleteAllMemo(stmt, workId);
            // 모든 파일 삭제
            SQL.deleteAllRef(stmt, workId);
            // 모든 아이템 삭제
            SQL.deleteAllWorkItem(stmt, workId);

            SQL.deleteWork(stmt, workId);
        });

        return this;
    }
}
