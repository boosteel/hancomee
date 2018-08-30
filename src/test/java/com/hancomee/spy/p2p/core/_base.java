package com.hancomee.spy.p2p.core;

import org.junit.Test;

public class _base {


    @Test
    public void test() throws Exception {

    }


    protected void out(Object obj) {
        System.out.println(obj);
    }

    protected void error() {
        if (1 > 0) throw new RuntimeException();
    }
}
