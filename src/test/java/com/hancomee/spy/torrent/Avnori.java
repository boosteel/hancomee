package com.hancomee.spy.torrent;

import com.hancomee.util.HTTP;
import com.hancomee.util.Patterns;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class Avnori {

    private static final String[] bo_table = {
            "torrent_kcav",
            "torrent_ymav",
            "torrent_nmav",
            "torrent_amav"
    };


    private static final Pattern r_list = Pattern.compile("<a class=\"zoomer\".*?href=\"([^\"]+).*?src=\"([^\"]+).*?<strong>(.*?)<\\/strong");

    public static final List<TorrentData> search(String keyword) throws Exception {
        List<TorrentData> list = new ArrayList<>();

        for (String n : bo_table) {
            int page = 1;
            List<TorrentData> result;
            do {
                result = get(n, page++, keyword);
                list.addAll(result);
            } while (result.size() == 12);
        }


        return list;
    }

    public static final List<TorrentData> get(String bo_table, int page, String keyword) throws Exception {

        List<TorrentData> list = new ArrayList<>();
        String encode = URLEncoder.encode(keyword, "utf-8");

        String url = "https://avnori.com/bbs/board.php" +
                "?bo_table=" + bo_table +
                "&sca=" +
                "&page=" + page +
                "&sop=and" +
                "&sfl=wr_subject" +
                "&stx=" + encode,
                html = HTTP.get(url);

        Patterns.forEach(r_list, html, (i, g, href, thumb, title) -> {
            list.add(new TorrentData()
                    .setUrl(href)
                    .setReferer(url)
                    .setHost("https://avnori.com")
                    .setKeyword(keyword)
                    .setThumb(thumb)
                    .setTitle(title)
            );
        });
        return list;
    }

    private static void out(Object obj) {
        System.out.println(obj);
    }
}
