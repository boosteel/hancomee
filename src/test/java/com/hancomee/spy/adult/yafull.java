package com.hancomee.spy.adult;

import com.boosteel.http.HTTP;
import com.boosteel.util.support.Patterns;
import com.boosteel.util.support.Range;
import com.hancomee.spy.AbstractSpy;
import com.hancomee.spy.SpyData;
import org.junit.Test;

import java.net.HttpURLConnection;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class yafull extends AbstractSpy {

    public yafull() {
        super("gallery/adult/yafull.com");
    }


    int count = 0;
    String host = "yafull.com";

    @Test
    public void run() throws Exception {
        for (int page : Range.range(1, 1))
            member_img(page);
    }

    public void member_img(int page) throws Exception {
        resolve("국산야사");
        read(page);
    }

    Pattern r_uuid = Pattern.compile("\"list-row\">.*?wr_id=(\\d+)"),
            r_data = Pattern.compile("name=\"title\"[^<>]+content=\"([^\"]+).*?name=\"author\"[^<>]+content=\"([^\"]+).*?fa-clock-o\".*?content=\"([^\"]+).*?\"view-img\">(.*?)<style>"),
            r_imgURL = Pattern.compile("(<img.*?>)");

    private void read(int page) throws Exception {


        String url = "https://yafull.com/bbs/board.php?bo_table=photo_kr&page=" + page,
                html = HTTP.get(url);

        List<SpyData> result = new ArrayList<>();

        out("\n---------- " + url + " ----------");

        Patterns.forEach(r_uuid, html, (i, g, _uuid) -> {
            String pageURL = "https://yafull.com/bbs/board.php?bo_table=photo_kr&wr_id=" + _uuid,
                    pageHTML = HTTP.get(pageURL);

            out("\n--> " + pageURL);
            out(pageHTML);
            error();
            /*Patterns.forEach(r_data, pageHTML, (i2, g2, title, user, date, content) -> {

                Patterns.forEach(r_imgURL, content, (i3, g3, imgHTML) -> {

                    String imgURL = null;
                    String[] values = Patterns.exec("content=\"([^\"]+)", imgHTML);

                    if (values == null) {
                        imgURL = Patterns.exec("src=\"([^\"]+)", imgHTML)[1].replaceAll("thumb-", "")
                                .replaceAll("_\\d+x\\d+\\.", ".");
                    } else imgURL = values[1];

                    String uuid = host + "-" + bonabo_tableme + "-" + _uuid + "-" + i3;

                    if (addUUID(uuid)) {
                        SpyData d = new SpyData()
                                .setUuid(uuid)
                                .setFilename(uuid)
                                .setPath(targetPath)
                                .setTitle(title)
                                .setUser(user)
                                .setDatetime(date.replaceAll("KST", " "));


                        out(++count + ") " + imgURL);

                        HttpURLConnection con = HTTP.$get(imgURL);
                        d.setFiletype(imgType(con.getContentType()));

                        $down(con.getInputStream(), d, true);
                        result.add(d);
                    }
                });


            });*/
        });

        /*if (!result.isEmpty())
            $save(result);*/
    }
}
