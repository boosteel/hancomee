package com.hancomee.spy.p2p.core;

public class _UTIL {

    public static final String quotes(String s) {
        return "'" + s.replaceAll("'", "\\\\'") + "'";
    }
}
