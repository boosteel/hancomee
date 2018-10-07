package com.hancomee;

import com.hancomee.util.db.NamedPrepareStatement;

public class TestCommon {

    public static final void timeCheck(TimeRun t, int loop, String name) {

        try {
            long start = System.currentTimeMillis(); //시작하는 시점 계산
            while (loop-- > 0)
                t.run();
            long end = System.currentTimeMillis(); //프로그램이 끝나는 시점 계산
            out("[" + name + "] " + (end - start) / 1000.0 + "초");

        } catch (Exception e) {
            throw new RuntimeException(e);
        }


    }

    public static final <T> T out(T t) {
        System.out.println(t);
        return t;
    }

    public interface TimeRun {
        void run() throws Exception;
    }
}
