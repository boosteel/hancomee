package com.hancomee.spy.sns;

import com.boosteel.http.HTTP;
import com.boosteel.util.support.Patterns;
import com.hancomee.spy.AbstractSpy;
import com.hancomee.spy.Run;
import com.hancomee.spy.VideoDown;
import com.hancomee.spy.videos.Video;
import org.junit.Test;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class Tumblr {

    Map<String, String> header;
    int delay = 10000;

    /*
        godingbra jiin09
     */
    @Test
    public void run() throws Exception {

        List<PostContent> r = new ArrayList<>();

        byHTML("kawaiihologramartisan", r);

        out("var values = " + Video.toList(r.stream().map(c -> c.video()).collect(Collectors.toList())));
        out(r.size());
    }

    private static final Pattern r_mp4 = Pattern.compile("post_url\":\"([^\"]+).*?\"summary\":\"([^\"]+).*?video_url\":\"([^\"]+)");

    private List<Video> byAPI(String id, String contentType, int offset, List<Video> result) throws Exception {

        out("-------------------------- [ " + offset + " ]---------------------------");
        int[] next = {offset};

        String
                URL = "https://api.tumblr.com/v2/blog/" + id +
                "/posts/" + contentType + "?" +
                (offset == 0 ? "" : "offset=" + offset + "&") +
                "api_key=fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4",
                data = HTTP.get(URL, header);

        data = data.replaceAll("\\\\\"", "\"")
                .replaceAll("\\\\n", "");

        Patterns.forEach(r_mp4, data, (i, g, url, title, mp4) -> {

            next[0]++;
            result.add(new Video()
                    .setMp4(mp4)
                    .setUrl(url)
                    .setSubject(title));
        });

        Thread.sleep(delay = delay + offset);

        return next[0] != offset ? byAPI(id, contentType, next[0], result) : result;

    }


    Pattern r_list = Pattern.compile("(<div class=\"post.*?hover_tags)"),
            r_url = Pattern.compile("href=\"([^\"]+)"),
            r_title = Pattern.compile("[^\\/]+$"),
            r_next = Pattern.compile("href=\"[^\"]+before_time=(\\d+)");


    // 첫진입입
    public void byHTML(String id, List<PostContent> result) throws Exception {
        byHTML(id, null, result);
    }

    public void byHTML(String id, String next, List<PostContent> result) throws Exception {

        String firstURL = "https://" + id + ".tumblr.com/archive" +
                (next == null ? "" : "?before_time=" + next),
                html = HTTP.get(firstURL);

        // 아카이브의 목록리스트를 모두 읽어간다.
        Patterns.forEach(r_list, html, (i, g, content) -> {

            String url = Patterns.exec(r_url, content)[1],
                    title = Patterns.exec(r_title, url)[0],
                    postURL = url.replaceAll("[^\\/]+$", "") +
                            URLEncoder.encode(title, "utf-8").replaceAll("\\+", "%20");

            title = title.replaceAll("-", " ");

            PostContent r = null;

            // ① 비디오
            if (content.contains("is_video"))
                r = video(title, postURL);
            /*if (content.contains("is_photo"))
                r = video(title, postURL);*/

            if(r != null)
                result.add(r);

            out("");
        });

        String[] link = Patterns.exec(r_next, html);
        if (link != null) byHTML(id, link[1], result);
    }


    /*
     *  존나 이상한 방법으로 video 주소를 알아낸다.
     */
    Pattern r_video = Pattern.compile("content=\"[^\"<>]+media[^\"<>]+(tumblr_.*?)_[^_]+\\.[^\"<>_]+?\""),
            r_image = Pattern.compile("og:image[^<>]+content=\"(http[^\"]+)");

    public PostContent video(String title, String postURL) throws Exception {

        out(title + "\n" + postURL);

        String
                postHTML = HTTP.get(postURL),
                mp4 = "https://ve.media.tumblr.com/";

        String[] values = Patterns.exec(r_video, postHTML);
        if(values == null)
            out("---------------------------- 동영상을 찾지 못했습니다.ㅠㅠ");
        else {
            return new PostContent()
                    .addContent(mp4 += values[1] + ".mp4")
                    .setTitle(title)
                    .setUrl(postURL);
        }

        return null;
    }


    public PostContent image(String title, String postURL) throws Exception {

        out(title + "\n" + postURL);

        String postHTML = HTTP.get(postURL);
        Patterns.forEach(r_image, postHTML, (i,g,url) -> {
            out(url);
        });
        return null;
    }

    /*
     *  텀블러 데이터는 아래의 객체로 정리된다.
     */
    class PostContent {
        String url;
        String title;
        List<String> content = new ArrayList<>();

        public PostContent setUrl(String url) {
            this.url = url;
            return this;
        }

        public PostContent setTitle(String title) {
            this.title = title;
            return this;
        }

        public PostContent addContent(String content) {
            this.content.add(content);
            return this;
        }

        public Video video() {
            return new Video()
                    .setMp4(content.get(0))
                    .setUrl(url)
                    .setSubject(title);
        }
    }


    private void out(Object obj) {
        System.out.println(obj);
    }
}
