package com.hancomee.spy;

import com.hancomee.spy.videos.Video;
import com.hancomee.util.HTTP;
import com.hancomee.util.IO;
import com.hancomee.util.Patterns;
import com.hancomee.util.Range;
import org.junit.Test;
import org.springframework.mail.MailParseException;

import java.net.HttpURLConnection;
import java.net.URLEncoder;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class VideoDown {

    int count = 1;

    @Test
    public void test() throws Exception {

        List<Video> result = new ArrayList<>();

        for(int page : Range.range(1, 5)) {
            getter("kr_woori3", page, result);
        }

        out("var values = " + Video.toList(result));
        out(result.size());
    }

    public void foreign(List<Video> result) throws Exception {
        // office hidden
        String keyword = "blowjob mouth\n";
        try {
            for (int i : Range.range(1)) {
                //result.addAll(youporn(keyword, i));
                result.addAll(xvideos(keyword, i));
                result.addAll(xhamster(keyword, i));
                //result.addAll(youramateurporn(keyword, i));
                result.addAll(voglioporno(keyword, i));

                //result.addAll(handjobhub(keyword, i));

                //result.addAll(foxporns(keyword, i));
                //result.addAll(pornhub(keyword, i));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void getter(String bo_table, int page, List<Video> result) throws Exception {


        Pattern r = Pattern.compile(bo_table + "[^<>\"\\/]+wr_id=(\\d+).*?([^<>]+)<\\/a");
        String url = "https://www.nobra2.net/bbs/board.php?bo_table=" + bo_table + "&page=" + page,
                html = HTTP.get(url);
        Patterns.forEach(r, html, (i, d, id, title) -> {
            String pageURL = "https://www.nobra2.net/video.php",
                    pageHTML = HTTP.post(pageURL, new String[]{"code=" + id + "&board=" + bo_table}),
                    video = Patterns.exec("src=\"([^\"]+)", pageHTML)[1],
                    contentType;

            String ecodeURL = URLEncoder.encode(Patterns.exec("[^\\/]+$", video)[0], "utf-8");
            video = video.replaceAll("[^\\/]+$", "") + ecodeURL.replaceAll("\\+", "%20");
            contentType = HTTP.$get(video).getContentType();

            if(contentType != null && contentType.contains("video")) {
                out(title);
                result.add(new Video()
                .setSubject(title).setMp4(video));
            }


        });
    }

    public void rr() throws Exception {

    }



    // ****************************** ▼  xvideos  ▼  ****************************** //

    Pattern xvideos_list = Pattern.compile("<div id=\"video_.*?<a href=\"([^\"]+).*?title=\"([^\"]+)"),
            xvideos_img = Pattern.compile("og:image.*?content=\"([^\"]+).*?High\\('(http.*?mp4.*?)'");

    public List<Video> xvideos(String keyword, int page) throws Exception {

        List<Video> list = new ArrayList<>();

        String url = "https://www.xvideos.com/?k=" +
                keyword.replaceAll("\\s", "+") + "&p=" + (page - 1),
                html = HTTP.get(out(url));

        Patterns.forEach(xvideos_list, html, (i, g, href, title) -> {
            out(count++ + ") " + "https://www.xvideos.com" + href);
            String pageURL = "https://www.xvideos.com" + href,
                    pageHTML = HTTP.get(pageURL);

            Patterns.forEach(xvideos_img, pageHTML, (ii, gg, thumb, src) -> {

                list.add(new Video()
                        .setMp4(src)
                        .setSubject(title)
                        .setThumb(thumb)
                        .setUrl(pageURL)
                );

            });
        });
        return list;
    }

    // ****************************** ▲  xvideos  ▲  ****************************** //


    // ****************************** ▼  youporn  ▼  ****************************** //

    Pattern r_youporn_list = Pattern.compile("<a[^>]+href=\"([^\"]+)[^>]+video-box-image.*?data-original=\"([^\"]+).*?video-box-title\">([^<]+)"),
            r_youporn_mp4 = Pattern.compile("page_params.video.mediaDefinition.*?\"videoUrl\":\"([^\"]+)");

    public List<Video> youporn(String keyword, int page) throws Exception {


        List<Video> list = new ArrayList<>();

        String url = "https://www.youporn.com/search/?query=" +
                keyword.replaceAll("\\s", "+") + "&page=" + page,
                html = HTTP.get(out(url));

        Patterns.forEach(r_youporn_list, html, (i, g, _href, thumb, title) -> {
            String href = "https://www.youporn.com" + _href;
            out(count++ + ") " + href);
            String pageHTML = HTTP.get(href),
                    mp4 = Patterns.exec(r_youporn_mp4, pageHTML)[1];

            list.add(new Video()
                    .setMp4(mp4)
                    .setSubject(title)
                    .setThumb(thumb)
                    .setUrl(href)
            );
        });
        return list;
    }

    // ****************************** ▲  youporn  ▲  ****************************** //


    // ****************************** ▼  xhamster  ▼  ****************************** //

    Pattern r_xhamster_list = Pattern.compile("\"thumb-list__item video-thumb\".*?<a[^>]+href=\"([^\"]+).*?<img[^>]+src=\"([^\"]+).*?<a[^>]+__name\".*?>([^<]+)"),
            r_xhamster_mp4 = Pattern.compile("<a[^>]+href=\"([^\"]+\\.mp4.*?)\"");

    public List<Video> xhamster(String keyword, int page) throws Exception {


        List<Video> list = new ArrayList<>();

        String url = "https://xhamster.com/search?q=" +
                keyword.replaceAll("\\s", "+") + "&p=" + page,
                html = HTTP.get(out(url));

        Patterns.forEach(r_xhamster_list, html, (i, g, href, thumb, title) -> {
            out(count++ + ") " + href);
            String pageHTML = HTTP.get(href),
                    mp4 = Patterns.exec(r_xhamster_mp4, pageHTML)[1];

            list.add(new Video()
                    .setMp4(mp4)
                    .setSubject(title)
                    .setThumb(thumb)
                    .setUrl(href)
            );
        });
        return list;
    }

    // ****************************** ▲  xhamster  ▲  ****************************** //


    // ****************************** ▼  youramateurporn  ▼  ****************************** //

    Pattern r_youramateurporn_list = Pattern.compile("\"thumb\".*?href=\"([^\"]+).*?<img.*?src=\"([^\"]+).*?\"item-title\".*?([^<>]+)<\\/a"),
            r_youramateurporn_mp4 = Pattern.compile("<title>([^<>]+).*?<source.*?src=\"([^\"]+)");

    public List<Video> youramateurporn(String keyword, int page) throws Exception {


        List<Video> list = new ArrayList<>();

        String url = "https://www.youramateurporn.com/search/" +
                keyword.replaceAll("\\s", "-") + "/page" + page + ".html",
                html = HTTP.get(out(url));

        Patterns.forEach(r_youramateurporn_list, html, (i, g, href, thumb, _title) -> {
            out(count++ + ") " + href);
            String pageHTML = null;
            try {
                pageHTML = HTTP.get(href);
            } catch (Exception e) {
                return;
            }
            String[] data = Patterns.exec(r_youramateurporn_mp4, pageHTML);

            if (data == null) return;

            list.add(new Video()
                    .setMp4(data[2])
                    .setSubject(data[1])
                    .setThumb(thumb)
                    .setUrl(href)
            );
        });
        return list;
    }

    // ****************************** ▲  youramateurporn  ▲  ****************************** //


    // ****************************** ▼  foxporns  ▼  ****************************** //

    Pattern r_foxporns_list = Pattern.compile("\"thumb-block.*?href=\"([^\"]+).*?src=\"([^\"]+).*?alt=\"([^\"]+)"),
            r_foxporns_mp4 = Pattern.compile("<title>([^<>]+).*?<source.*?src=\"([^\"]+)");

    public List<Video> foxporns(String keyword, int page) throws Exception {


        List<Video> list = new ArrayList<>();

        String url = "http://www.foxporns.com/search-" +
                keyword.replaceAll("\\s", "%20") + "/" + page + ".html",
                html = HTTP.get(out(url));

        Patterns.forEach(r_foxporns_list, html, (i, g, href, thumb, _title) -> {
            href = "http://www.foxporns.com" + href;
            list.add(new Video()
                    .setMp4(href)
                    .setSubject(_title)
                    .setThumb(thumb)
                    .setUrl(href)
            );
        });
        return list;
    }

    // ****************************** ▲  foxporns  ▲  ****************************** //


    // ****************************** ▼  voglioporno  ▼  ****************************** //

    Pattern r_voglioporno_list = Pattern.compile("\"box-escena\".*?href=\"([^\"]+).*?src=\"([^\"]+).*?alt=\"([^\"]+)"),
            r_voglioporno_mp4 = Pattern.compile("<source.*?src=\"([^\"]+)");

    public List<Video> voglioporno(String keyword, int page) throws Exception {


        List<Video> list = new ArrayList<>();

        String url = "https://www.voglioporno.com/cerca/page" + page + ".html?q=" +
                keyword.replaceAll("\\s", "+"),
                html = HTTP.get(out(url));

        Patterns.forEach(r_voglioporno_list, html, (i, g, href, thumb, _title) -> {
            href = "https://www.voglioporno.com" + href;
            out(count++ + ") " + href);
            String pageHTML = HTTP.get(href),
                    mp4 = Patterns.exec(r_voglioporno_mp4, pageHTML)[1];

            list.add(new Video()
                    .setMp4(mp4)
                    .setSubject(_title)
                    .setThumb(thumb)
                    .setUrl(href)
            );
        });
        return list;
    }

    // ****************************** ▲  voglioporno  ▲  ****************************** //

    // ****************************** ▼  pornhub  ▼  ****************************** //

    Pattern r_pornhub_list = Pattern.compile("\"phimage\".*?mediumthumb=\"([^\"]+).*?<a[^<>]+href=\"([^\"]+)[^<>]+?title=\"([^\"]+)");

    public List<Video> pornhub(String keyword, int page) throws Exception {


        Map<String, String> map = new HashMap<>();
        //map.put("Cookie", "RNKEY=2564547027");

        List<Video> list = new ArrayList<>();

        String url = "https://www.pornhub.com/video/search?search=" +
                keyword.replaceAll("\\s", "+") + "&page=" + page,
                html = HTTP.get(url);

        Patterns.forEach(r_pornhub_list, html, (i, g, thumb, href, title) -> {
            String pageURL = out("https://www.pornhub.com" + href),
                    pageHTML = HTTP.get(pageURL),
                    mp4 = Patterns.exec("\"videoUrl\":\"([^\"]+)", pageHTML)[1].replaceAll("\\\\", "");

            list.add(new Video()
                    .setMp4(mp4)
                    .setSubject(title)
                    .setThumb(thumb
                            .replaceAll("\\(", "\\\\\\\\(")
                            .replaceAll("\\)", "\\\\\\\\)"))
                    .setUrl(pageURL)
            );
        });

        return list;
    }

    // ****************************** ▲  pornhub  ▲  ****************************** //


    // ****************************** ▼  handjobhub  ▼  ****************************** //

    Pattern r_handjobhub_list = Pattern.compile("=\"item-inner-col.*?href=\"([^\"]+\\/video\\/[^\"]+)[^<>]+title=\"([^\"]+).*?src=\"([^\"]+)"),
            r_handjobhub_mp4 = Pattern.compile("<source[^<>]+src=\"([^\"]+)");

    public List<Video> handjobhub(String keyword, int page) throws Exception {


        List<Video> list = new ArrayList<>();

        String url =
                keyword.isEmpty() ?
                        "https://handjobhub.com/page" + page + ".html" :
                        "https://handjobhub.com/search/" +
                                keyword.replaceAll("\\s", "-") + "/page" + page + ".html",


                html = HTTP.get(out(url));

        Patterns.forEach(r_handjobhub_list, html, (i, g, href, title, thumb) -> {
            out(count++ + ") " + href);
            String pageHTML = HTTP.get(href);

            String[] values = Patterns.exec(r_handjobhub_mp4, pageHTML);
            if(values != null) {
                list.add(new Video()
                        .setMp4(values[1])
                        .setSubject(title)
                        .setThumb(thumb)
                        .setUrl(href)
                );
            }

        });
        return list;
    }

    // ****************************** ▲  handjobhub  ▲  ****************************** //

    private <T> T out(T obj) {
        System.out.println(obj);
        return obj;
    }



    private void error() {
        if (1 > 0) throw new RuntimeException();
    }
}
