package com.hancomee.spy.shopping;

import com.boosteel.http.HTTP;
import com.boosteel.util.support.Patterns;
import com.boosteel.util.support.Range;
import com.hancomee.spy.AbstractSpy;
import com.hancomee.spy.SpyData;
import org.junit.Test;

import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import static com.boosteel.util.support.Patterns.forEach;

public class any extends AbstractSpy {

    public any() {
        super("gallery/shopping");
    }

    String host;

    @Test
    public void themauve() throws Exception {
        host = "themauve.co.kr";
        resolve("섹시/" + host);
        for (int page : Range.range(101, 357))
            read(page);
        $push();
    }

    @Test
    public void jungmadam() throws Exception {
        host = "jungmadam.co.kr";
        resolve("섹시/" + host);
        for (int page : Range.range(1, 5))
            read(page);
        $push();
    }

    private void read(int page) throws Exception {

        out("------------------------------- [" + page + "] -------------------------------");
        List<SpyData> result = new ArrayList<>();

        String url = "http://www." + host + "/board/product/list.html?board_no=4&page=" + page,
                html = HTTP.get(url);

        forEach("\"subject\">.*?read.html\\?no=(\\d+).*?([^<>]+)<\\/a>.*?<td>([^<>]+)", html,
                (i, g, id, title, name) -> {
                    if (g.contains("\"파일첨부\"")) {
                        String pageURL = "http://www." + host + "/board/product/read.html?no=" + id + "&board_no=4",
                                pageHTML = HTTP.get(pageURL);

                        forEach("<img src=\"([^\"]+\\/file_data\\/[^\"]+)", pageHTML,
                                (ii, gg, imgURL) -> {
                                    imgURL = "http:" + imgURL;

                                    String uuid = host + "-" + id + "-" + ii;

                                    if (addUUID(uuid)) {

                                        out(imgURL);
                                        SpyData d = new SpyData()
                                                .setDatetime("2018-11-11 00:00:00")
                                                .setUser(name)
                                                .setTitle(title)
                                                .setPath(targetPath)
                                                .setFilename(uuid)
                                                .setFiletype("jpg")
                                                .setUuid(uuid);

                                        $down(imgURL, d, true);
                                        result.add(d);
                                    }
                                });
                    }
                });

        if (!result.isEmpty())
            $save(result);
    }
}
