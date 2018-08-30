package com.hancomee.spy.p2p;

import com.hancomee.spy.p2p.core.P2P;
import com.hancomee.util.HTTP;
import com.hancomee.util.Patterns;
import org.junit.Test;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

// yesfile.com
public class filehon extends P2PManager {

    Map<String, String> header;

    Pattern
            r_uuid_title = Pattern.compile("data-idx=\"(\\d+).*?bbsTitleAll.*?<span.*?>(.*?)<\\/td"),
            r_img = Pattern.compile("(?i)id=\"bbsContents\".*?<img.*?src=[\"']?([^\"]+)");

    public filehon() throws Exception {
        super("filehon.com");
    }

    @Test
    public void run() throws Exception {
        header = HTTP.readHeader(getClass().getClassLoader().getResource("fileham-request.txt"));
        search("정액");
    }

    public void search(String key) throws Exception {
        search(key, 1);
    }

    public void search(String key, int page) throws Exception {

        out("------------------------------- [ " + page + " / " + key + " ] -------------------------------");

        int[] check = {0};
        List<P2P> list = new ArrayList<>();

        String
                query = "doc=list_jin2" +
                "&search=" + URLEncoder.encode(key, "euc-kr") +
                "&reSearch_keyword=" +
                "&search_keyword=total_search" +
                "&search_type=ADT&section=" +
                "&sub_sec=&list_count=20" +
                "&skn=&search_sort=" +
                "&con_tot=" +
                "&searchAdult=" +
                "&order_chk=" +
                "&withplat=" +
                "&searChk=searChk" +
                "&p=" + page +
                "&code1=" +
                "&code2=",
                url = "http://fileham.com/main/doc/storage/list_div_jin.php?",
                data = HTTP.post(url, new String[]{query}, "euc-kr");

        Patterns.forEach(r_uuid_title, data, (i, g, uuid, title) -> {

            check[0]++;

            title = title.replaceAll("<[^<>]+?>", "")
                    .replaceAll("\\s{2,}", " ")
                    .trim();

            String pageURL = "http://fileham.com/main/popup.php?doc=bbsInfo&idx=" + uuid +
                    "&code1=ADT&code2=&search_sort=1";


            if (has(uuid)) {

                title = title.replaceAll("<[^<>]+?>", "").trim();
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

    private filehon out(Object obj) {
        System.out.println(obj);
        return this;
    }

    private void error() {
        if (1 > 0) throw new RuntimeException();
    }
}
