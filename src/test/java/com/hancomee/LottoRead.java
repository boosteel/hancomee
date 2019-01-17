package com.hancomee;

import com.boosteel.http.HTTP;
import com.boosteel.util.support.Patterns;
import org.junit.Test;

import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class LottoRead {

    @Test
    public void test() throws Exception {

        List<String> lines = Files.readAllLines(Paths.get("d:/excel.html"), Charset.forName("euc-kr")),
                result = new ArrayList<>();

        String s = String.join("", lines),
                json;

        Patterns.forEach("<tr>.*?right\">(\\d+).*?\"center\">([^<>]+).*?<td>(\\d+)<\\/td>.*?<td>(\\d+)<\\/td>.*?<td>(\\d+)<\\/td>.*?<td>(\\d+)<\\/td>.*?<td>(\\d+)<\\/td>.*?<td>(\\d+)<\\/td>.*?<td>(\\d+)<\\/td>",
                s,
                (i, g, id, date, n1, n2, n3, n4, n5, n6, bonus) -> {
                    date = date.replaceAll("\\.", "-");

                    result.add(" {" +
                            "id:" + id + "," +
                            "date: '" + date + "'," +
                            "nums: [" + n1 + "," + n2 + "," + n3 + "," +
                            n4 + "," + n5 + "," + n6 + "," + bonus + "]" +
                            "}");
                });

        json = "[" + String.join(",", result) + "]";
        out(json);

    }


    private <T> T out(T obj) {
        System.out.println(obj);
        return obj;
    }
}
