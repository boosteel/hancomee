package com.hancomee.web;

import com.hancomee.util.Range;
import org.junit.Test;

public class WebApplicationTests {

    @Test
    public void contextLoads() throws Exception {

        for(int i : Range.range(12,3,4,9)) {
            out(i);
        }
    }

    private void out(Object obj) {
        System.out.println(obj);
    }
}
