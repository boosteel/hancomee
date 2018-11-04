package com.hancomee.spy.shopping;

import com.boosteel.http.HTTP;
import com.boosteel.util.support.Patterns;
import com.boosteel.util.support.Range;
import com.hancomee.spy.AbstractSpy;
import com.hancomee.spy.SpyData;
import org.junit.Test;
import org.mockito.Spy;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class kijakeunyeoja extends AbstractSpy {

    public kijakeunyeoja() {
        super("gallery/shopping");
    }


    int count = 0;
    String host = null;

    @Test
    public void run() throws Exception {
        pickpick();
    }

    public void pickpick() throws Exception {
        host = "pickpick.co.kr";
        resolve("숙녀복/" + host);
        for (int page : Range.range(1, 500))
            read(page);
        $push();
    }

    public void kijakeunyeoja() throws Exception {
        host = "kijakeunyeoja.com";
        resolve("숙녀복/" + host);
        for (int page : Range.range(380, 386))
            read(page);
        $push();
    }

    Pattern r_uuid = Pattern.compile("alt=\"파일첨부[^<>]+?afile_(\\d+)"),
            r_data = Pattern.compile("\"row\">제목.*?([^<>]+)<\\/td.*?작성자.*?<td>([^<>]+).*?\"detail\"(.*?)<\\/td"),
            r_imgURL = Pattern.compile("src=\"([^\"]+)");

    private void read(int page) throws Exception {

        String url = "http://" + host + "/board/product/list.html?board_no=4&page=" + page,
                html = HTTP.get(url);

        List<SpyData> result = new ArrayList<>();

        out("\n---------- " + url + " ----------");

        Patterns.forEach(r_uuid, html, (i, g, _uuid) -> {
            String pageURL = "http://" + host + "/board/product/get.html?no=" + _uuid + "&board_no=4&page=" + page,
                    pageHTML = HTTP.get(pageURL);

            Patterns.forEach(r_data, pageHTML, (i2, g2, title, user, content) -> {

                Patterns.forEach(r_imgURL, content, (i3, g3, imgURL) -> {
                    String date = "2014-10-10 00:00:00";
                    String[] values = Patterns.exec("\\d{4}\\/\\d{2}\\/\\d{2}", imgURL);

                    if (values != null)
                        date = values[0].replaceAll("\\/", "-") + " 00:00:00";

                    imgURL = "http:" + imgURL;
                    String uuid = host + "-" + _uuid;

                    if (addUUID(uuid)) {
                        SpyData d = new SpyData()
                                .setUuid(host + "-" + _uuid)
                                .setFilename(host + "-" + _uuid)
                                .setPath(targetPath)
                                .setTitle(title)
                                .setUser(user)
                                .setDatetime(date)
                                .setFiletype("jpg");


                        out(++count + ") " + imgURL);
                        $down(imgURL, d, true);
                        result.add(d);
                    }
                });


            });
        });

        if (!result.isEmpty())
            $save(result);
    }
}
