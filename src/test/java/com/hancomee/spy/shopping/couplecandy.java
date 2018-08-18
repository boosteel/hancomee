package com.hancomee.spy.shopping;

import com.hancomee.spy.AbstractSpy;
import com.hancomee.spy.SpyData;
import com.hancomee.util.HTTP;
import com.hancomee.util.Patterns;
import com.hancomee.util.Range;
import com.hancomee.util.Strings;
import org.junit.Test;

import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class couplecandy extends AbstractSpy {

    public couplecandy() {
        super("gallery/shopping");
    }

    String host = "couplecandy.kr";

    @Test
    public void run() throws Exception {
        resolve("코스튬/" + host);
        for (int page : Range.range(3, 43))
            read(page);
        $push();
    }

    Pattern r_url = Pattern.compile("review_view_show\\('([^']+)', '([^']+).*?([^<>]+)<\\/p"),
            r_data = Pattern.compile("pr-date\">.*?(\\d{4}-\\d{2}-\\d{2}).*?([^\\s]+)"),
            r_imgURL = Pattern.compile("(http:[^\"']+)");

    // http://www.couplecandy.kr/shop/power_review.action.html?action_type=get_review_view&num1=994645&num2=00000
    private void read(int page) throws Exception {

        out("------------------------------- [" + page + "] -------------------------------");
        List<SpyData> result = new ArrayList<>();

        String url = "http://www.couplecandy.kr/shop/power_review.action.html?action_type=get_review_list&page_type=photo_search&page=" +
                page + "&sort=&term=1&is_photo=&category=&searchword=&search_myreview=&write_time=",
                data = URLDecoder.decode(HTTP.get(url), "utf-8").replaceAll("\n", "");

        Patterns.forEach(r_url, data, (i, g, n1, n2, title) -> {


            String url2 = "http://www.couplecandy.kr/shop/power_review.action.html?action_type=get_review_view&num1=" + n1 + "&num2=00000",
                    data2 = HTTP.get(url2);

            String[] values = data2.split("\"attach_list\""),
                    metas = Patterns.exec(r_data, URLDecoder.decode(values[0], "utf-8").replaceAll("\n", ""));


            Patterns.forEach(r_imgURL, values[1].replaceAll("\\\\\\/", "/"), (i3, g3, imgURL) -> {

                String uuid = host + "-" + n1 + "-" + i3;

                if (addUUID(uuid)) {
                    if (i3 == 0)
                        out("-------------> " + (i + 1));

                    SpyData d = new SpyData()
                            .setDatetime(metas[1] + " 00:00:00")
                            .setUser(metas[2])
                            .setTitle(title)
                            .setPath(targetPath)
                            .setFilename(uuid)
                            .setFiletype("jpg")
                            .setUuid(uuid);

                    $down(imgURL, d, true);
                    result.add(d);
                }
            });
        });
        if (!result.isEmpty())
            $save(result);
    }
}
