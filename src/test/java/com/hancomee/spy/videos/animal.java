package com.hancomee.spy.videos;


import com.boosteel.http.HTTP;
import com.boosteel.util.support.Patterns;
import com.boosteel.util.support.Range;
import org.junit.Test;

import javax.validation.constraints.Null;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

// https://sexwithhorse.net/13/
public class animal {


    @Test
    public void test() throws Exception {

        List<Video> result = new ArrayList<>();

        for (int p : Range.range(1, 1)) {
            pornbraze(p, result);
        }

        System.out.println(Video.toJs(result));
    }

    Pattern r_list = Pattern.compile("<a href=\"\\/([^\"]+)\"><img[^\"]+src=\"([^\"]+)"),
            r_video = Pattern.compile("<video.*?src=\"([^\"]+mp4)");

    public void read(int page, List<Video> result) throws Exception {
        String url = "https://sexwithhorse.net/" + page + "/",
                html = HTTP.get(url);
        Patterns.forEach(r_list, html, (i, g, pageURL, imgURL) -> {
            result.add(new Video()
                    .setMp4(imgURL.replaceAll("([^\\/]+)$", "content/full.mp4"))
                    .setSubject("제목없음"));
        });
    }


    public void pornbraze(int page, List<Video> result) throws Exception {
        String url =
                page == 1 ? "https://vip.pornbraze.com/animal1/" :
                        "https://vip.pornbraze.com/animal1/recent/" + (page) + "/",
                html = HTTP.get(url);

        Patterns.forEach("id=\"video-(\\d+).*?class=\"video\">.*?href=\"([^\"]+).*?title=\"([^\"]+)",
                html,
                (i,g,id,href,title) -> {
                    result.add(new Video()
                    .setMp4("http://vip4.pornbraze.com/mp4/" +id +".mp4")
                    .setSubject(title));
                });
    }

    private void out(Object obj) {
        System.out.println(obj);
    }
}
