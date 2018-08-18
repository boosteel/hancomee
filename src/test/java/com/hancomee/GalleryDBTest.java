package com.hancomee;

import com.hancomee.util.DB;
import com.hancomee.util.SQL;
import org.junit.Test;

import java.util.List;
import java.util.Map;

public class GalleryDBTest {

    DB db = new DB("jdbc:mariadb://localhost:3306/hancomee", "root", "ko9984");

    @Test
    public void run() throws Exception {

    }




    private void out(Object obj) {
        System.out.println(obj);
    }
}
