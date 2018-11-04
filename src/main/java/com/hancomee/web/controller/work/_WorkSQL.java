package com.hancomee.web.controller.work;

import com.boosteel.nativedb.NativeDB;
import com.boosteel.nativedb.core.anno.*;
import com.hancomee.web.controller.support.WorkList;

import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;
import java.util.Map;

public interface _WorkSQL {

    static final String
            WORK_MEMO = "hancomee_workmemo",
            WORK_ITEM = "hancomee_workitem";


    /*
     *  ************************************ 작업 리스트 ************************************
     */
    @PageList(list="SELECT * FROM hancomee_work this " +
            "INNER JOIN hancomee_customer customer ON this.customer_id = customer.id " +
            "LEFT OUTER JOIN hancomee_workitem _item ON this.id = _item.work_id " +
            "LEFT OUTER JOIN hancomee_workfile_draft _draft ON _draft.item_id = _item.id " +
            "LEFT OUTER JOIN hancomee_workfile draft ON _draft.id = draft.id " +
            "WHERE this.state = :state{i} [AND this.title LIKE :%title%] [AND customer.name LIKE :%name%] " +
            "GROUP BY this.id",
            count = "SELECT COUNT(this.id) FROM hancomee_work this " +
                    "INNER JOIN hancomee_customer customer ON this.customer_id = customer.id " +
                    "WHERE this.state = :state{i} [AND this.title LIKE :%title%] [AND customer.name LIKE :%name%]")
    WorkList list(Statement con, WorkList pager, Map<String, String> params);

    @Selector("SELECT this.state, COUNT(this.id) v, SUM(this.total) t " +
            "FROM hancomee_work this INNER JOIN hancomee_customer c ON this.customer_id = c.id " +
            "WHERE 1 [AND c.name LIKE :%name%] [AND this.title LIKE :%title%] GROUP BY this.state")
    ResultSet state(Statement stmt, Map<String, String> params);


    /*
     *  ************************************ 작업 상세 ************************************
     */
    @Selector("SELECT * FROM hancomee_work this " +
            "INNER JOIN hancomee_customer customer ON this.customer_id = customer.id " +
            "WHERE this.uuid = :uuid")
    Map<String, Object> getWork(Statement stmt, @Value("uuid") String uuid);

    @Selector("SELECT * FROM hancomee_workitem this WHERE this.work_id = :id{i}")
    List<Map<String, Object>> getItems(Statement stmt, @Value("id") Object workId);

    @Selector("SELECT * FROM hancomee_workfile this INNER JOIN hancomee_workfile_ref _r USING(id) WHERE _r.work_id = :id{i}")
    List<Map<String, Object>> getRefs(Statement stmt, @Value("id") Object workId);

    @Selector("SELECT * FROM hancomee_workfile this INNER JOIN hancomee_workfile_draft _r USING(id) WHERE _r.item_id = :id{i}")
    List<Map<String, Object>> getDrafts(Statement stmt, @Value("id") Object itemId);

    @Selector("SELECT * FROM hancomee_workfile this INNER JOIN hancomee_workfile_print _r USING(id) WHERE _r.item_id = :id{i}")
    List<Map<String, Object>> getPrints(Statement stmt, @Value("id") Object itemId);

    @Selector("SELECT * FROM hancomee_workmemo this WHERE this.work_id = :id{i}")
    List<Map<String, Object>> getMemos(Statement stmt, @Value("id") Object workId);

    /*
     *  ************************************ 작업 생성 & 수정 ************************************
     */
    @Selector("SELECT work_uuid2()")
    String createUUID(Statement statement);

    @Save(value = "INSERT INTO hancomee_work (customer_id, uuid, title) " +
            "VALUES (:customer_id, :uuid, :title)",
            lastId = true)
    int insertWork(Statement stmt, @Value("uuid") String uuid,
                   @Value("customer_id") int customerId,
                   @Value("title") String title);

    @Update(value = "hancomee_work", where = "id = :id{i}")
    int updateWork(Statement stmt, Map<String, String> dataMap);

    // ************************ 거래처 ************************ //
    @Selector("SELECT name, owner, address FROM hancomee_customer WHERE name LIKE :%name%")
    List<Map<String, Object>> customerSearch(Statement stmt, @Value("name") Object name);

    @Insert(value = "hancomee_customer", lastId = true)
    int insertCustomer(Statement stmt, Map<String, Object> dataMap);

    @Update(value = "hancomee_customer", where = "id = :id{i}")
    int updateCustomer(Statement stmt, Map<String, String> dataMap);

    // ************************ 작업메모 ************************ //
    @Insert(value = WORK_MEMO, lastId = true)
    int insertMemo(Statement stmt, Map<String, Object> map, @Value("work_id") Object workId);

    @Save("UPDATE " + WORK_MEMO + " SET value = :value WHERE id = :id")
    int updateMemo(Statement stmt, @Value("id") Object id, @Value("value") Object value);

    @Save("DELETE FROM " + WORK_MEMO + " WHERE id = :id{i}")
    int deleteMemo(Statement stmt, @Value("id") Object id);

    @Save("DELETE FROM " + WORK_MEMO + " WHERE work_id = :id{i}")
    int deleteAllMemo(Statement stmt, @Value("id") Object workId);

    @Save("UPDATE hancomee_work SET memo_len = " +
            "(SELECT count(id) FROM hancomee_workmemo WHERE work_id = :id{i}) " +
            "WHERE id = :id{i}")
    int refreshMemo(Statement stmt, @Value("id") Object workId);

    // ************************ 모든 파일 업로드 ************************ //
    @Insert(value = "hancomee_workfile", lastId = true)
    int insertFile(Statement stmt, Map<String, Object> map);

    // ************************ 인쇄파일 ************************ //
    @Insert(value = "hancomee_workfile_print", lastId = false)
    int insertPrint(Statement stmt, @Value("id") Object id, @Value("item_id") Object itemId);

    @Save("DELETE v, file FROM hancomee_workfile_print v " +
            "INNER JOIN hancomee_workfile file USING(id) WHERE v.id = :id{i}")
    int deletePrint(Statement stmt, @Value("id") Object id);

    @Save("DELETE v, file FROM hancomee_workfile_print v " +
            "INNER JOIN hancomee_workfile file USING(id) WHERE v.item_id = :id{i}")
    int deleteAllPrint(Statement stmt, @Value("id") Object itemId);

    // ************************ 시안파일 ************************ //
    @Insert(value = "hancomee_workfile_draft", lastId = false)
    int insertDraft(Statement stmt, @Value("id") Object id, @Value("item_id") Object itemId);

    @Save("DELETE v, file FROM hancomee_workfile_draft v " +
            "INNER JOIN hancomee_workfile file USING(id) WHERE v.id = :id{i}")
    int deleteDraft(Statement stmt, @Value("id") Object id);

    @Save("DELETE v, file FROM hancomee_workfile_draft v " +
            "INNER JOIN hancomee_workfile file USING(id) WHERE v.item_id = :id{i}")
    int deleteAllDraft(Statement stmt, @Value("id") Object itemId);

    // ************************ 참고파일 ************************ //
    @Save("UPDATE hancomee_work SET file_len = " +
            "(SELECT count(id) FROM hancomee_workfile_ref WHERE work_id = :id{i}) " +
            "WHERE id = :id{i}")
    int refreshRef(Statement stmt, @Value("id") Object workId);

    @Insert(value = "hancomee_workfile_ref", lastId = false)
    int insertRef(Statement stmt, @Value("id") Object id, @Value("work_id") Object workId);

    @Save("DELETE v, file FROM hancomee_workfile_ref v " +
            "INNER JOIN hancomee_workfile file USING(id) WHERE v.id = :id{i}")
    int deleteRef(Statement stmt, @Value("id") Object refId);

    @Save("DELETE v, file FROM hancomee_workfile_ref v " +
            "INNER JOIN hancomee_workfile file USING(id) WHERE v.work_id = :id{i}")
    int deleteAllRef(Statement stmt, @Value("id") Object workId);

    // ************************ 작업 아이템 ************************ //
    @Selector("SELECT COUNT(id) item_len, SUM(price) price, SUM(total) total, SUM(vat) vat " +
            "FROM hancomee_workitem WHERE work_id = :id{i}")
    Map<String, Object> itemValue(Statement stmt, @Value("id") Object workId);

    @Save("DELETE item, f1, f2, print, draft FROM hancomee_workitem item " +
            "LEFT OUTER JOIN hancomee_workfile_print print ON item.id = print.item_id " +
            "LEFT OUTER JOIN hancomee_workfile f2 ON f2.id = print.id " +
            "LEFT OUTER JOIN hancomee_workfile_draft draft ON item.id = draft.item_id " +
            "LEFT OUTER JOIN hancomee_workfile f1 ON f1.id = draft.id " +
            "WHERE item.id = :id{i}")
    int deleteWorkItem(Statement stmt, @Value("id") Object itemId);

    @Save("DELETE item, f1, f2, print, draft FROM hancomee_workitem item " +
            "LEFT OUTER JOIN hancomee_workfile_print print ON item.id = print.item_id " +
            "LEFT OUTER JOIN hancomee_workfile f2 ON f2.id = print.id " +
            "LEFT OUTER JOIN hancomee_workfile_draft draft ON item.id = draft.item_id " +
            "LEFT OUTER JOIN hancomee_workfile f1 ON f1.id = draft.id " +
            "WHERE item.work_id = :id{i}")
    int deleteAllWorkItem(Statement stmt, @Value("id") Object workId);

    @Selector("SELECT work_id FROM " + WORK_ITEM + " WHERE id = :id")
    String getWorkId(Statement stmt, @Value("id") int itemId);

    @Update(value = "hancomee_work", where = "id = :id{i}")
    int refreshWorkItem(Statement stmt, Map<String, Object> map, @Value("id") Object id);

    @Save("DELETE FROM hancomee_work WHERE id = :id{i}")
    int deleteWork(Statement stmt, @Value("id") Object id);

    @Update(value = WORK_ITEM, where = "id = :id{i}")
    int updateItem(Statement stmt, Map<String, Object> map, @Value("work_id") Object workId);

    @Insert(value = WORK_ITEM, lastId = true)
    int insertItem(Statement stmt, Map<String, Object> map, @Value("work_id") Object workId);
}
