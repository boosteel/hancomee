package com.hancomee.web.controller.work;

import com.hancomee.util.DB;
import com.hancomee.util.db.TableInfo;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component()
public class _WorkCommon {

    public DB db = new DB("jdbc:mariadb://115.23.187.44:3306/hellofunc", "root", "ko9984");

    public TableInfo customer = TableInfo.create("hancomee_customer", db),
            work = TableInfo.create("hancomee_work", db),
            workItem = TableInfo.create("hancomee_workitem", db),
            workFile = TableInfo.create("hancomee_workfile", db);

    public _WorkCommon() {
        System.out.println(customer);
    }

    @Bean
    public DB workDB() {
        return db;
    }

}
