package com.hancomee;

import com.boosteel.http.HTTP;
import com.boosteel.nativedb.core.SQL;
import com.boosteel.util.support.MapAccess;
import com.boosteel.util.support.Patterns;
import com.hancomee.web.controller.work.ListController;
import org.junit.Test;

import java.lang.reflect.Method;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.boosteel.util.support.MapAccess.createDataMap;


public class AnyTest {

    @Test
    public void test() throws Exception {

    }


    public void naver(String query, int page) throws Exception {

        Map<String, String> header = new HashMap<>();
        header.put("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36");
        header.put("cookie", "npic=JOnB4nrZM/tE/wex2mHKCeO8dRlUn8+DT+XM+snlvK2ZowGZh3T5Pf37N6kP6z6lCA==; NNB=2YOXOKUS3QRFU; ASID=d2674676000001603f23f47900000051; _ga=GA1.2.273050149.1518249030; nx_open_so=1; nx_ssl=2; NID_AUT=urpiSqQIwB9TtR02YAYOTIb8ugiC1Gao5NG5yrQCqvnWy3AB2mHtj/3k/qEtYecY; NID_SES=AAABfzkWBbdMiF5TrPc9Gha+3iTrH9qzsmVeqwsWdGHD8MqZBksl9+t1UtUFfK3dTmSST80B+krqBoqGk+JXcdQ+4AityV640JmQ/n5Cj9cPKZIsGvOykTFRUm09hbnxtZvo2Y+KodtheeXKlJGqPt6buYB0GeqU/J3ZGqCo0vNjcj0UhJhoAJHaESJoLeeZ/NZnjp8HDgztcHR6mSJGEe/vA8pFcZ6nZnTuFXBCiZ7KSQPsNSB603pmwUv9yyveQLHujdPACJsJ4NgrtStva1UxRwHeVAB+au8PzRShdsF3bRkbtntxM4386Yz4rUFkwtsrwD61i+l6p/B3dnBmYy7dQxaKZoYBT6wtMDpoEQhSYkEMAj98Di7PChbYYwY95hgeuZNIKdCGFiT7QFzCsDo2OuZX5kj+oijFkp6bRlXhnC4WTX3TN0VOqJuA5url0nlovxmy80VepFuOe54Ru7cujb9fyec4lON08xzXyr5GNWb3wuJQLXeGk/WFpeJVEAnvrw==; _naver_usersession_=muDbLkU6OByej+ylwRbJFg==; page_uid=T/YRglpVuEwssvlSr4KssssstfG-081893");

        String url = "https://search.naver.com/search.naver?date_from=&date_option=0&" +
                "date_to=&dup_remove=1&nso=&post_blogurl=&post_blogurl_without=&" +
                "query=" + URLEncoder.encode(query, "euc-kr") +
                "&sm=tab_pge&srchby=all&st=sim&where=post&" +
                "start=" + (page < 2 ? "" : page - 1) + "1",
                html = HTTP.get(url, header);

        Patterns.forEach("class=\"sh_blog_top\".*?sh_blog_title[^<>]+title=\"([^\"]+).*?txt_inline\">([^<>]+).*?class=\"txt84\".*?>([^<>]+).*?<a .*?([^<>]+)<\\/a",
                html, (i, g, title, date, name, postId) -> {
                    out("[" + date.trim() + "]  " + title + "  /  " + name + "\n" + postId + "\n");
                });

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
