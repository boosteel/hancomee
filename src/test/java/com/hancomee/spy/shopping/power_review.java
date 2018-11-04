package com.hancomee.spy.shopping;

import com.boosteel.http.HTTP;
import com.boosteel.util.support.Patterns;
import com.boosteel.util.support.Range;
import com.hancomee.spy.AbstractSpy;
import com.hancomee.spy.SpyData;
import org.junit.Test;

import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class power_review extends AbstractSpy {


    Pattern r_id_content = Pattern.compile("<li id=\"power_review_([^\"]+).*?\"more-options\">([^<>]+).*?작성자 : ([^<>]+).*?등록일 : ([^<>]+).*?<span>도움이"),
            r_image = Pattern.compile("<img[^<>]+src=\"([^\"]+square::[^\"]+)");

    public power_review() {
        super("gallery/shopping");
    }

    @Test
    public void cr5p() throws Exception {
        String host = "www.cr5p.com";
        resolve("섹시/" + host);

        for (int page : Range.range(1, 210))
            read(host, page);

        $push();
    }

    @Test
    public void hypnotic() throws Exception {
        String host = "www.hypnotic.co.kr";
        resolve("섹시/" + host);

        for (int page : Range.range(300, 1000))
            read(host, page);

        $push();
    }

    //http://www.hypnotic.co.kr/shop/power_review.action.html?action_type=get_review_list&page_type=search&page=3&sort=&term=1&is_photo=&category=&searchword=&search_myreview=&write_time=
    public void read(String host, int page) throws Exception {

        out("----------------------------- [" + page + "] -----------------------------");

        String url = "http://" + host + "/shop/power_review.action.html?" +
                "action_type=get_review_list&page=" + page,
                html = URLDecoder.decode(HTTP.get(url), "utf-8").replaceAll("\n", "");

        List<SpyData> result = new ArrayList<>();

        Patterns.forEach(r_id_content, html, (i, g, id, _title, user, date) -> {

            String title = _title.length() > 33 ? _title.substring(0, 33) : _title;


            Patterns.forEach(r_image, g, (ii, gg, src) -> {

                src = src.replaceAll("square::", "");
                HttpURLConnection con = HTTP.$get(src);

                String $uuid = id + "-" + ii,
                        contentType = con.getContentType();

                if (addUUID($uuid)) {

                    if (ii == 0)
                        out(title);

                    out(src);
                    SpyData d = new SpyData()
                            .setPath(targetPath)
                            .setUuid($uuid)
                            .setTitle(title)
                            .setUser(user)
                            .setFilename($uuid)
                            .setFiletype(contentType.contains("image") ? imgType(contentType) : "jpg")
                            .setDatetime(date.trim().replaceAll(". ", "-") + " 00:00:00");

                    $down(new URL(src).openStream(), d, true);
                    result.add(d);
                }

            });
            out("");
        });


        if (!result.isEmpty())
            $save(result);
    }

}
