package com.hancomee.spy.p2p;

import com.hancomee.spy.p2p.core.P2P;
import com.hancomee.util.HTTP;
import com.hancomee.util.Patterns;
import com.hancomee.util.Strings;
import org.junit.Test;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

// yesfile.com
public class yesfile extends P2PManager {

    Map<String, String> header;

    Pattern
            r_uuid_title = Pattern.compile("idx\":\"([^\"]+).*?title\":\"(.*?)\","),
            r_img = Pattern.compile("<!-- 컨텐츠 상세 내용.*?<img.*?src=\"([^\"]+)");

    public yesfile() throws Exception {
        super("yesfile.com");
    }

    @Test
    public void run() throws Exception {
        header = HTTP.readHeader(getClass().getClassLoader().getResource("yesfile-request.txt"));
        search("국산");
    }

    public void search(String key) throws Exception {
        search(key, 1);
    }

    public void search(String key, int page) throws Exception {

        out("------------------------------- [ " + page + " / " + key + " ] -------------------------------");

        int[] check = {0};

        List<P2P> list = new ArrayList<>();

        String url = "https://www.yesfile.com/ajax/ajax_search.php?page=" + page + "&" +
                "t_search_code=BD_AD&" +
                "keyword_save=Y&" +
                "t_search_value=" + URLEncoder.encode(key, "euc-kr"),
                data = Strings.unicodeDecoder(HTTP.get(url));

        Patterns.forEach(r_uuid_title, data, (i, g, uuid, title) -> {

            String pageURL = "http://www.yesfile.com/board/board_view.php?pg_mode=view_popup&idx=" + uuid + "&code=BD_AD_08";

            check[0]++;

            if (has(uuid)) {


                title = title.replaceAll("<[^<>]+?>", "");
                String pageHTML = HTTP.get(pageURL, header, "euc-kr"),
                        thumb = Patterns.exec(r_img, pageHTML)[1];

                if (thumb.startsWith("//"))
                    thumb = "http:" + thumb;


                out("\n" + title + "\n" + pageURL + "\n" + thumb);

                list.add(new P2P()
                        .setSite(site)
                        .setThumb(thumb)
                        .setTitle(title)
                        .setUrl(pageURL)
                        .setUuid(uuid)
                );

            } else {
                out("\n" + pageURL + "이미 받음");
            }

        });

        if (!list.isEmpty())
            save(list);

        // 게시물은 20개이므로, 20개가 다 있다면 다음페이지가 있다고 간주
        if (check[0] == 20)
            search(key, page + 1);

    }

    private yesfile out(Object obj) {
        System.out.println(obj);
        return this;
    }

    private void error() {
        if (1 > 0) throw new RuntimeException();
    }
}
