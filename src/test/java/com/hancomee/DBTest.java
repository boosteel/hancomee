package com.hancomee;

import com.boosteel.nativedb.NativeDB;
import com.hancomee.web.controller.JinyeosooController;
import com.hancomee.web.controller.work._WorkManager;
import org.junit.Test;

public class DBTest {

    NativeDB db = new NativeDB("jdbc:mariadb://115.23.187.44:3306/hancomee", "root", "ko9984");


    @Test
    public void test() throws Exception {

        out(db.getCon());
        db.createRepository(JinyeosooController.SQL.class);

    }


    private <T> T out(T obj) {
        System.out.println(obj);
        return obj;
    }
}
