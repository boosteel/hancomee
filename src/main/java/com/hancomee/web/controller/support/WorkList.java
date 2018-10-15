package com.hancomee.web.controller.support;

import com.hancomee.util.db.support.Pager;
import com.hancomee.web.controller.work.ListController;

import java.util.Map;

public class WorkList extends Pager {
    public int state;

    public int[] price;
    public int[] count;

    public WorkList (Map<String, String> query) {
        super(query);
        this.state = Integer.parseInt(query.get("state"));
    }

    public WorkList setArray(int[][] values) {
        this.count = values[0];
        this.price = values[1];
        return this;
    }
}
