package com.hancomee.web;

import com.boosteel.http.HTTP;
import com.boosteel.util.support.Patterns;
import com.hancomee.web.controller.AudioBay;
import com.hancomee.web.controller.NaverCafe;
import com.hancomee.web.domain.BayBean;
import org.junit.Test;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.FileTime;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;


public class AnyTest {

    @Test
    public void test() throws Exception {

    }

    private void getter(String bo_table, int page) throws Exception {
        Pattern r = Pattern.compile(bo_table + "[^<>\"\\/]+wr_id=(\\d+).*?([^<>]+)<\\/a");
        String url = "https://www.nobra2.net/bbs/board.php?bo_table=" + bo_table + "&page=" + page,
                html = HTTP.get(url);
        Patterns.forEach(r, html, (i, d, id, title) -> {
            String pageURL = "https://www.nobra2.net/video.php",
                    pageHTML = HTTP.post(pageURL, new String[]{"code=" + id + "&board=" + bo_table}),
                    video = Patterns.exec("src=\"([^\"]+)", pageHTML)[1];

            out(video);
            if (1 > 0) throw new RuntimeException();
        });
    }


    private String wassadaURL(int page) {
        return "http://www.wassada.com/bbs_list.php?" +
                "start=" + ((page - 1) * 25) + "&" +
                "tb=board_uusell&" +
                "category=&" +
                "id=&" +
                "search_mode=&" +
                "happy_board_keyword=&" +
                "search_bbs_date=&" +
                "this_date=&" +
                "b_category=";
    }

    class D implements Comparable<D> {
        FileTime ft;
        Path path;

        public D(Path path) throws Exception {
            this.ft = Files.getLastModifiedTime(path);
            this.path = path;
        }

        @Override
        public int compareTo(D o) {
            return o.ft.compareTo(this.ft);
        }
    }


    private List<MediaFile> list(Path path) throws IOException {
        List<MediaFile> result = new ArrayList<>();
        String filepath = subpath(path);

        try (DirectoryStream<Path> stream = Files.newDirectoryStream(path)) {
            for (Path file : stream) {
                if (Files.isRegularFile(file)) {
                    String prove = Files.probeContentType(file);
                    if (prove.contains("image") || prove.contains("mp4")) {
                        result.add(new MediaFile(filepath).setFile(file));
                    }
                }
            }
        }
        return result;
    }

    private String subpath(Path path) {
        return path.subpath(0, path.getNameCount()).toString().replaceAll("\\\\", "/");
    }

    private void out(Object obj) {
        System.out.println(obj);
    }
}
