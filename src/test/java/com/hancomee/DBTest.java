package com.hancomee;

import com.hancomee.util.db.DB;
import com.hancomee.web.controller.work._WorkManager;
import org.junit.Test;

public class DBTest {

    DB db = new DB("jdbc:mariadb://115.23.187.44:3306/hancomee", "root", "ko9984");


    @Test
    public void test() throws Exception {

        _WorkManager data = new _WorkManager();

        db.doStmt(stmt -> {

            data.addWork(1, "마니마니");
            //data.removeWork(workId);

           /* data.saveWork(createStringMap("text", "돈 팍팍 주쇼", "id", "15783"));

            data.addRef(workId, workUUID, createDataMap("filetype", "", "original_name", "",
                    "save_name", "", "size", 1));
            data.saveMemo(workId, createDataMap("work_id", workId, "datetime", new Date(),
                    "value", "운따 메모 그만 뛰어라 씨발"));*/


        }, false);

    }


    private <T> T out(T obj) {
        System.out.println(obj);
        return obj;
    }
}
