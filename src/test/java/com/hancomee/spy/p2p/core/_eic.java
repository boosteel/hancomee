package com.hancomee.spy.p2p.core;

import com.boosteel.http.HTTP;
import com.boosteel.util.support.Patterns;
import com.boosteel.util.support.Strings;
import org.junit.Test;

import java.awt.image.ImagingOpException;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URLEncoder;
import java.nio.file.*;
import java.util.List;
import java.util.regex.Pattern;

public class _eic extends _base {


    Pattern
            r_list_data = Pattern.compile("<div class=\"list\".*?href=\"([^\"]+).*?src=\"([^\"]+).*?<h2>.*?([^<>]+)<\\/a"),
            r_rename = Pattern.compile("(.*\\/)(.*)n(\\..*)"),
            r_translate = Pattern.compile("\"resultData\":\"(.*?)\",\"");


    @Test
    public void run() throws Exception {
        String path = "D:\\files\\p2p\\jav\\190106";

        rename(path);
        imgDown(path);
    }

    public void rename(String path) throws Exception {

        _file.tour(path, (file, name, type, root, index) -> {
            String filename = file.getFileName().toString();
            String[] value = Patterns.exec("([a-zA-Z]{2,}?-\\d+)", name),
                    n = Patterns.exec("\\((\\d+)\\)", name);

            if (value != null) {
                String v = value[1].toUpperCase() +
                        (n == null ? "" : "(" + n[1] + ")") +
                        "." + type;

                if (!filename.equals(v)) {

                    out(filename);
                    out(v);
                    out("");

                    Files.move(file, root.resolve(v));
                }

            }
        });
    }


    // 해당폴더의 파일명 조사해서 이미지 다운받기
    public void imgDown(String path) throws Exception {

        Path target = Paths.get(path);
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(target)) {
            for (Path file : stream) {
                String filename = file.getFileName().toString();
                String[] values = Patterns.exec("^([A-Z]+-\\d+)", filename);
                if (values != null) {
                    filename = filename.replaceAll("\\.([^\\.]+)$", "");
                    down(values[1], 1, target, filename);
                }
            }
        }

    }

    public int down(String num, int page, Path target) throws Exception {
        return down(num, page, target, num);
    }

    public int down(String num, int page, Path target, String filename) throws Exception {

        out("--------------------------- [ " + page + " / " + num + " ] ---------------------------");

        int[] check = {0};

        String url = "https://www.eic-av.com/search?q=" + num + "&current_page=" + page,
                html = HTTP.get(url);

        Patterns.forEach(r_list_data, html, (i, g, href, thumb, title) -> {

            check[0]++;

            String uuid = Patterns.exec("\\d+", href)[0];

            href = "https://www.eic-av.com" + href;
            title = title.replaceAll("\\s{2,}", " ")
                    .replaceAll("&hellip;", "")
                    .replaceAll("^\\s+|\\s+$", "");

            String[] values = Patterns.exec(r_rename, thumb);

            if (values != null) {

                out("\n" + href + "\n" + title);

                String translateStr = Strings.unEscapeHTML(translate(title));
                translateStr = Strings.eraseWindowStr(translateStr);

                if (target != null) {

                    HttpURLConnection imgCon = getImage(uuid);

                    if (imgCon != null) {
                        out(translateStr);
                        Files.copy(imgCon.getInputStream(),

                                target.resolve(filename + ".jpg"),
                                StandardCopyOption.REPLACE_EXISTING);
                    }
                }
            }

        });

        return check[0];
    }

    private HttpURLConnection getImage(String uuid) throws Exception {
        String img1 = "https://img.idol-mile.com/av/product/h4/pp_" + uuid + ".jpg",
                img2 = "https://img.idol-mile.com/av/product/pp_" + uuid + "l.jpg";

        HttpURLConnection con = HTTP.$get(img1);
        if (imageCheck(con)) return con;

        con = HTTP.$get(img2);
        if (imageCheck(con)) return con;

        return null;
    }

    private boolean imageCheck(HttpURLConnection con) throws ImagingOpException {
        String contentType = con.getContentType();
        if (contentType != null && contentType.contains("image")) return true;
        return false;
    }


    private String translate(String str) throws Exception {
        String url = "https://s.search.naver.com/n/translate/translateForNx.dic" +
                "?_callback=window.__jindo2_callback._565" +
                "&query=" + URLEncoder.encode(str, "utf-8") +
                "&srcLang=ja" +
                "&tarLang=ko" +
                "&cht=0",
                result = HTTP.get(url);
        return Patterns.exec(r_translate, result)[1];
    }

}
