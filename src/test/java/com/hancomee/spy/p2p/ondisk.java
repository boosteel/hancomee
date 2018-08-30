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
import java.util.function.Function;
import java.util.regex.Pattern;

// yesfile.com
public class ondisk extends P2PManager {

    Map<String, String> header;
    int count = 0;

    Pattern
            r_uuid = Pattern.compile("idx=\"(\\d+)"),
            r_data = Pattern.compile("\"title\":\"(.*?)\".*?\"contents\":(.*?)\"fl"),
            r_img = Pattern.compile("(?i)<img[^<>]+(http[^\"\\\\'\\s]+)");

    String keyword = "중국 대륙 게이 이반";
    final String[] keywords = keyword.split("\\s+");
    Function<String, Boolean> IS_BLIND = (s) -> {
        for(String key : keywords)
            if(s.contains(key)) return true;
        return false;
    };

    public ondisk() throws Exception {
        super("ondisk.com");
    }

    @Test
    public void run() throws Exception {
        header = HTTP.readHeader(getClass().getClassLoader().getResource("ondisk-request.txt"));
        search("주무르기");
    }

    public void search(String key) throws Exception {
        search(key, 1);
        out("총 받은 갯수 : " + count);
    }

    public void search(String key, int page) throws Exception {

        out("------------------------------- [ " + page + " / " + key + " ] -------------------------------");

        int[] check = {0};
        List<P2P> list = new ArrayList<>();

        String
                url = "http://fast.ondisk.co.kr/" +
                "?list_row=20" +
                "&sub_category=" +
                "&hid_adult=N" +
                "&fixed_view=N" +
                "&sort_type=default" +
                "&category=ADT" +
                "&search_column=title" +
                "&search=" + URLEncoder.encode(key, "utf-8") +
                "&page=" + page,
                data = HTTP.post(url, "utf-8");


        Patterns.forEach(r_uuid, data, (i, g, uuid) -> {

            check[0]++;

            String pageURL = "http://fast.ondisk.co.kr/module/content_detail_prc?idx=" + uuid;


            if (has(uuid)) {

                String pageHTML = Strings.unicodeDecoder(HTTP.get(pageURL, header, "utf-8"))
                        .replaceAll("\\\\/", "/");

                Patterns.forEach(r_data, pageHTML, (ii,gg,title,contents) -> {


                    String[] values = Patterns.exec(r_img, contents);

                    String thumb = values != null ? values[1] : "";

                    out("\n" + count++ + ") " + title + "\n" + pageURL + "\n" + thumb);

                    list.add(new P2P()
                            .setSite(site)
                            .setThumb(thumb)
                            .setTitle(title)
                            .setUrl("http://ondisk.co.kr/pop.php?sm=bbs_info&idx=" + uuid)
                            .setUuid(uuid)
                            .setKeyword(key)
                            // 특정키워드 제외
                            .setBlind(IS_BLIND.apply(title))
                    );


                });


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

    private ondisk out(Object obj) {
        System.out.println(obj);
        return this;
    }

    private void error() {
        if (1 > 0) throw new RuntimeException();
    }
}
