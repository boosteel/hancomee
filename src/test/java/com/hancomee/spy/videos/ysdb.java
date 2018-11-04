package com.hancomee.spy.videos;

import com.boosteel.http.HTTP;
import com.boosteel.util.support.Patterns;
import com.boosteel.util.support.Range;
import com.hancomee.spy.Run;
import org.junit.Test;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class ysdb {

    @Test
    public void test() throws Exception {

        List<Video> result = new ArrayList<>();

        int last = 30;
        for (int p : Range.range(last - 9, last)) {
            read(p, result);
        }

        System.out.println(Video.toJs(result));
    }

    Pattern r_list = Pattern.compile("<li>.*?wr_id=(\\d+).*?>([^<>]+)<"),
            r_video = Pattern.compile("<video.*?src=\"([^\"]+mp4)");


    public void read(int page, List<Video> result) throws Exception {

        out("--------------------------- [ " + page + " ] ---------------------------");

        String url = "https://haeso.net/list/board.php?bo_table=obong&page=" + page,
                html = HTTP.get(url);

        Patterns.forEach(r_list,
                html,
                (i, g, id, title) -> {
                    String pageURL = "https://haeso.net/bbs/ajax_view.php?bo_table=obong&wr_id=" + id,
                            pageHTML = HTTP.get(pageURL);

                    String[] values = Patterns.exec("<source.*?src=\"([^\"]+)", pageHTML);

                    if(values != null) {
                        String mp4 = values[1].replaceAll("\\/{3,}", "//"),
                                contentType = new URL(mp4).openConnection().getContentType();
                        if (contentType != null && contentType.contains("video")) {
                            out("https://haeso.net/bbs/board.php?bo_table=obong&wr_id=" + id);
                            out(mp4);
                            out("");

                            result.add(new Video()
                                    .setMp4(mp4)
                                    .setSubject(title));
                        }

                    }

                });
    }

    private void out(Object obj) {
        System.out.println(obj);
    }
}
