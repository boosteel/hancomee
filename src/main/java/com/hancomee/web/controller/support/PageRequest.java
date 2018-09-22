package com.hancomee.web.controller.support;

import java.util.List;
import java.util.Map;

public class PageRequest {

    public List<Map<String, Object>> values;
    public long count;
    public long totalPages;
    public int page;

    public PageRequest(List<Map<String, Object>> values, long count, int page, int size) {
        this.values = values;
        this.count = count;
        totalPages = count / size;
        if(count % size != 0) totalPages++;
        this.page = page;
    }

}
