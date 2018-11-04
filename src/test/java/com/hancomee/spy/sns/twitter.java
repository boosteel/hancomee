package com.hancomee.spy.sns;

import com.boosteel.http.HTTP;
import com.boosteel.util.support.Patterns;
import com.boosteel.util.support.Strings;
import com.hancomee.spy.AbstractSpy;
import com.hancomee.spy.SpyData;
import org.junit.Test;

import java.net.HttpURLConnection;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class twitter extends AbstractSpy {

    public twitter() {
        super("gallery/sns/twitter");
    }

    private static Map<String, String> $header;

    private static final String BAN_UNICODE_STRING = "[^\\u0000-\\uD7FF\\uE000-\\uFFFF]";

    private static final Pattern
            r_data_split = Pattern.compile("[\\[,](\\{\"created_at\".*?)(?=]$|,\\{\"created)"),
            r_date_uuid_text = Pattern.compile("^\\{\"created_at\":\"([^\"]+).*?\"id\":(\\d+).*?\"text\":\"([^,]+)?"),
            BAN_UNICODE = Pattern.compile(BAN_UNICODE_STRING);

    // create_at ==> Thu Jun 01 15:41:20 +0000 2017
    private static final SimpleDateFormat
            f = new SimpleDateFormat("EEE MMM dd HH:mm:ss Z yyyy", Locale.US),
            d = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    int count = 1;

    Path twitterROOT = Paths.get("D:/files/gallery/sns/twitter");

    @Test
    public void run() throws Exception {

        //  3ZBzD5cPmRZtaVu
        //tour();
        run("Smsex26 ");

    }


    // 이미 받았던 것들 순회
    public void tour() throws Exception {
        int total = 0;
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(twitterROOT)) {

            try {
                for (Path dir : stream) {
                    if (Files.isDirectory(dir)) {
                        try {
                            total += run(dir.getFileName().toString());
                        } catch (Exception e) {
                            out(e.getMessage());
                        }
                    }

                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        out("총 받은 갯 수 : " + total);

    }


    public int run(String _names) throws Exception {
        int saveCount = 0;
        for (String screen_name : _names.split("\\s+")) {
            count = 1;
            if (!screen_name.trim().isEmpty())
                saveCount += api(screen_name);
        }
        return saveCount;
    }

    private int api(String screenName) throws Exception {
        out("\n\n--------------------------------- [" + screenName + "] ---------------------------------");

        resolve(screenName);
        api(screenName, null);
        return $push(targetPath);
    }

    private void api(String screenName, String maxId) throws Exception {
        String
                url = "https://api.twitter.com/1.1/statuses/user_timeline.json?contributor_details=false&" +
                "trim_user=false&screen_name=" + screenName + "&count=" + 10 +
                (maxId != null ? "&max_id=" + maxId : ""),
                data = Strings.unicodeDecoder(HTTP.get(url, header, "utf-8"));


        List<SpyData> result = new ArrayList<>();
        Mention last = null;
        LinkedList<Mention> list = new LinkedList<>();
        Patterns.forEach(r_data_split, data, (i, g, m) -> {
            m = m.replaceAll("\\\\n", " ").replaceAll("\\\\", "");

            // 리트윗은 제외
            if (m.contains("\"text\":\"RT @")) {
                out("리트윗 패스");
            } else list.add(new Mention(m));
        });

        if (list.size() > 1) last = list.pollLast();

        for (Mention m : list) {
            if (!addUUID(m.id)) {
                out("이미 받음 ============> " + m);
                if (!result.isEmpty()) $save(result);
                return;
            } else {
                m.readMedia((i, con, type) -> {
                    String t = con.getContentType();
                    if (t == null || !t.matches("(?i)^(video|image).*")) return;
                    out(screenName + " / " + count++ + ") " + m.text);
                    SpyData down = new SpyData()
                            .setPath(targetPath)
                            .setDatetime(m.datetime)
                            .setTitle(m.text)
                            .setUuid(m.id)
                            .setUser(screenName)
                            .setFilename(m.id + "-" + i)
                            .setFiletype(type);
                    result.add(down);
                    $down(con.getInputStream(), down, true);
                });
            }
        }

        if (!result.isEmpty()) $save(result);

        if (last != null) api(screenName, last.id);

    }


    static class Mention {

        private static final Pattern
                r_entries = Pattern.compile("(extended_entities\".*?\"source\")"),
                r_media_type = Pattern.compile("\"type\":\"([^\"]+)"),
                r_bitrate_videoURL = Pattern.compile("\"bitrate\":(\\d+).*?(http[^\"]+?mp4)"),
                r_photo = Pattern.compile("\"media_url_https\":\"([^\"]+)");

        String id;
        String datetime;
        String text;

        private String json;

        public Mention(String json) throws ParseException {

            Matcher m = r_date_uuid_text.matcher(json);
            m.find();

            String _text = m.group(3) == null ? "<내용없음>" : m.group(3);

            this.datetime = d.format(f.parse(m.group(1)));
            this.id = m.group(2);

            // 병신같은 트위터문자 없애고, 줄바꿈 없애고
            this.text = _text.replaceAll("\n", " ");

            // 2) 병신같은 트위터문자(유니코드 문자)가 있을 경우 지운다.
            if (BAN_UNICODE.matcher(text).find()) {
                text = text
                        .replaceAll(BAN_UNICODE_STRING, "");
            }

            this.json = json;
        }


        public void readMedia(ReadMedia rm) throws Exception {
            int i = 0;
            Matcher m = r_entries.matcher(json);
            if (m.find()) {
                String media = m.group(1),
                        type = Patterns.exec(r_media_type, media)[1];


                if (type.equals("video")) {
                    int bit = 0, temp;
                    String url = null;
                    m = r_bitrate_videoURL.matcher(media);

                    while (m.find()) {
                        temp = Integer.parseInt(m.group(1));
                        if (temp > bit) {
                            bit = temp;
                            url = m.group(2);
                        }
                    }
                    rm.accept(i, HTTP.$get(url.replaceAll("^https", "http"), $header), "mp4");
                } else {
                    m = r_photo.matcher(media);
                    while (m.find()) {
                        type = m.group(1);
                        rm.accept(i++, HTTP.$get(type + ":large", $header), type.replaceAll(".*\\.", ""));
                    }
                }
            }
        }

        @Override
        public String toString() {
            return "[" + datetime + "] " + id + " == " + text + "\n";
        }
    }

    private void magic(Pattern a, String e) {
        Matcher m = a.matcher(e);

    }

    private static interface ReadMedia {
        void accept(int index, HttpURLConnection con, String filetype) throws Exception;
    }

}
