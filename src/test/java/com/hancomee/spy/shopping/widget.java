package com.hancomee.spy.shopping;

import com.boosteel.http.HTTP;
import com.boosteel.util.support.Patterns;
import com.boosteel.util.support.Range;
import com.boosteel.util.support.Strings;
import com.hancomee.spy.AbstractSpy;
import com.hancomee.spy.SpyData;
import org.junit.Test;
import org.mockito.Spy;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class widget extends AbstractSpy {

    Pattern r_widgets4 = Pattern.compile("reviews_index_gallery_review.*?data-url=\"[^\"]+reviews\\/(\\d+).*?review_title\">([^<>]+).*?author_name\">([^<>]+).*?created_at\">([^<>]+)"),
            r_widgets4_image = Pattern.compile("<img[^<>]+src=\"([^\"]+reviews[^\"]+)");

    public widget() {
        super("gallery/shopping");
    }


    @Test
    public void run() throws Exception {
        test("choper.kr");
    }

    @Test
    public void pinkcider() throws Exception {
        String host = "pinkcider.co.kr";
        resolve("수영복/" + host);

        for(int page : Range.range(1, 10))
            widget(5, 22, host, page);
        //$push();
    }
    @Test
    public void sonyunara() throws Exception {
        String host = "sonyunara.com";
        resolve("소녀복/" + host);

        for(int page : Range.range(1, 10))
            widget(2, 4, host, page);
        $push();
    }
    @Test
    public void romistory() throws Exception {
        String host = "romistory.co.kr";
        resolve("숙녀복/" + host);

        for(int page : Range.range(1, 10))
            widget(2, 22, host, page);
        $push();
    }

    @Test
    public void gaenso() throws Exception {
        String host = "gaenso.com";
        //test(host);
        resolve("숙녀복/" + host);

        for(int page : Range.range(1, 10))
            widget(1, 7, host, page);
        $push();
    }
    @Test
    public void _66girls() throws Exception {
        String host = "66girls.co.kr";
        resolve("소녀복/" + host);

        for(int page : Range.range(1, 40))
            widget(1, 42, host, page);
        $push();
    }
    @Test
    public void bullang() throws Exception {
        String host = "bullang.com";
        resolve("소녀복/" + host);

        for(int page : Range.range(1, 100))
            widget(4, 5, host, page);
        $push();
    }

    @Test
    public void sezwick() throws Exception {
        String host = "sezwick.com";
        resolve("숙녀복/" + host);

        for(int page : Range.range(1, 400))
            widget(3, 5, host, page);
        $push();
    }

    @Test
    public void benito() throws Exception {
        String host = "benito.co.kr";
        resolve("숙녀복/" + host);

        for(int page : Range.range(1, 400))
            widget(5, 4, host, page);
        $push();
    }

    @Test
    public void awab() throws Exception {
        String host = "awab.co.kr";
        resolve("숙녀복/" + host);

        for(int page : Range.range(1, 10))
            widget(1, 11, host, page);
        $push();
    }

    @Test
    public void attrangs() throws Exception {
        String host = "attrangs.co.kr";
        resolve("숙녀복/" + host);

        for(int page : Range.range(1, 10))
            widget(1, 8, host, page);
        $push();
    }


    @Test
    public void thezam() throws Exception {
        String host = "thezam.co.kr";
        resolve("속옷/" + host);

        for(int page : Range.range(1, 1))
            widget(4, 12, host, page);
        $push();
    }

    @Test
    public void minuit() throws Exception {
        String host = "minuit.co.kr";
        resolve("숙녀복/" + host);

        for(int page : Range.range(1, 5))
            widget(5, 21, host, page);
        $push();
    }


    @Test
    public void liphop() throws Exception {
        String host = "liphop.co.kr";
        resolve("숙녀복/" + host);

        for(int page : Range.range(1, 100))
            widget(3, 2, host, page);
        $push();
    }

    public final void test(String host) throws Exception {
        int num = 0, id = 0;
        while(num++ < 6) {
            id = 0;
            while(id++ < 51) {
                try {
                    String url = widgetURL(num, id, host, 1),
                            html = HTTP.get(url),
                            content = Patterns.exec("\"#content\":\"(.*?)}", html)[1];

                    content = Strings.unicodeDecoder(content)
                            .replaceAll("\\\\n", "")
                            .replaceAll("\\\\\"", "\"");


                    Matcher matcher = r_widgets4.matcher(content);
                    if(matcher.find()) {
                        out("[success] widget : " + num + " / id : " + id);
                        return;
                    }
                } catch (Exception e) {
                }
                out("[error] widget : " + num + " / id : " + id);
            }
        }
    }

    public String widgetURL(int widgetNum, int widgetId, String host, int page) {
    return "https://widgets" + widgetNum + ".cre.ma/" + host + "/reviews.js?page=" + page + "&widget_id=" + widgetId;
    }

    public final void widget(int widgetNum, int widgetId, String host, int page) throws Exception {

        out("------------------------- [" + host + "  / " + page + "] -------------------------");
        List<SpyData> result = new ArrayList<>();


        String
                jsURL = widgetURL(widgetNum, widgetId, host, page),
                html = HTTP.get(jsURL),
                content = Patterns.exec("\"#content\":\"(.*?)}", html)[1];

        content = Strings.unicodeDecoder(content)
                .replaceAll("\\\\n", "")
                .replaceAll("\\\\\"", "\"");

        Patterns.forEach(r_widgets4, content, (i, g, _uuid, title, user, _date) -> {

            String uuid = host + "-" + _uuid,
                    pageURL = "http://widgets4" + ".cre.ma/" + host + "/reviews/" + _uuid + "/photo_review_popup",
                    pageHTML = HTTP.get(pageURL);

            Patterns.forEach(r_widgets4_image, pageHTML, (ii, gg, imgURL) -> {

                String $uuid = uuid + "-" + ii;

                if (addUUID($uuid)) {

                    if(ii == 0) out("[" + pageURL + "]");

                    imgURL = "http:" + imgURL;

                    out((ii + 1) + ") " + imgURL);

                    SpyData d = new SpyData()
                            .setPath(targetPath)
                            .setUuid($uuid)
                            .setTitle(title)
                            .setUser(user)
                            .setFilename($uuid)
                            .setFiletype("jpg")
                            .setDatetime(_date.trim().replaceAll(". ", "-") + " 00:00:00");

                    $down(new URL(imgURL).openStream(), d, true);
                    result.add(d);
                }

            });

            out("");
        });

        if (!result.isEmpty())
            $save(result);
    }


}
