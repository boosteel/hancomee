package com.hancomee;

import com.hancomee.util.MapAccess;
import com.hancomee.util.db.DataConverter;
import com.hancomee.util.IAccess;
import com.hancomee.util.db.RepositoryFactory;
import com.hancomee.util.db.SQL;
import com.hancomee.util.db.support.Pager;
import com.hancomee.util.reflect.ReflectObject;
import com.hancomee.web.controller.work.ListController;
import org.junit.Test;

import java.lang.reflect.Method;
import java.util.*;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.hancomee.util.MapAccess.createDataMap;

public class AnyTest {

    @Test
    public void test() throws Exception {

       String sql = "SELECT * FROM hancomee_work this " +
               "INNER JOIN hancomee_customer customer ON this.customer_id = customer.id " +
               "LEFT OUTER JOIN hancomee_workitem _item ON this.id = _item.work_id " +
               "LEFT OUTER JOIN hancomee_workfile_draft _draft ON _draft.item_id = _item.id " +
               "LEFT OUTER JOIN hancomee_workfile draft ON _draft.id = draft.id " +
               "WHERE this.state = :state{i} [AND this.title LIKE :%title%] [AND customer.name LIKE :%name%] " +
               "GROUP BY this.id";
       SQL.DQuery d = SQL.dynamicSQL(sql);


       Map<String, Object> obj = createDataMap("title", "1", "s", new Date(), "d", new Date(),
               "list", Arrays.asList(new String[]{"1", "2", "4"}));

       out(d.apply(new MapAccess(obj)));
    }


    public void n(int i) {
        out(i);
    }

    public List<Map<String, Object>> list() {
        return null;
    }

    public static class Magic {
        Korean korean = new Korean();
        String getName() {
            return "네임";
        }
    }

    public static class Korean {
        String name = "asdf";
    }

    public static class Test1 {
        int a;
        public String name = "운따";
    }



    private <T> T out(T obj) {
        System.out.println(obj);
        return obj;
    }
}
