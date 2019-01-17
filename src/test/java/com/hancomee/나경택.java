package com.hancomee;

import com.boosteel.http.HTTP;
import com.boosteel.util.support.Strings;
import com.hancomee.web.controller.NaBookController;
import org.junit.Before;
import org.junit.Test;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.*;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.boosteel.util.support.Patterns.forEach;

public class 나경택 {

    Path path = Paths.get("D:\\나경택");
    static NaBookController CTRL;

    @Before
    public void before() {
        CTRL = new NaBookController();
        CTRL.ready();
    }

    @Test
    public void test() throws Exception {
        //CTRL.list();
        //일간투데이(1);

        List<String> list = new ArrayList<>(),
                ids = new ArrayList<>();
        Set<String> set = new HashSet<>();

        modify("1", (naBook) -> {
            //naBook.section = "건강";

            String subject = naBook.subject,
                    value = naBook.value,
                    id = naBook.id;
            if(value.contains("#"))
                list.add(subject);
        }, true);
        out("---------------------------------------------------------------");
        out(String.join("\n", list));
        out("---------------------------------------------------------------");
    }

    interface Modify {
        void run(NaBook data) throws Exception;
    }

    class NaBook {

        String id;
        String datetime;
        String news;
        String subject;
        String value;
        boolean chk;
        String section;
        String url;

        NaBook(String id, String datetime, String news, String subject, String value, String section) {
            this.id = id;
            this.datetime = datetime;
            this.news = news;
            this.subject = subject;
            this.value = value;
            this.section = section;
        }

        /*String get() {
            return v.replaceAll("('|\\\\)", "\\\\$1");
        }*/
    }

    public String trim(String text) {
        return text
                .replaceAll("　", " ")
                .replaceAll("^\\s+|\\s+$", "")
                .replaceAll("\n\\s+|\\s+\n", "\n")
                .replaceAll("\n{2,}", "\n")
                .replaceAll(" {2,}", " ");
    }

    public void view() throws Exception {
        CTRL.db.doStmt(stmt -> {
            try (ResultSet rs = stmt.executeQuery("SELECT * FROM na_book2")) {
                List<String> lines = new ArrayList<>();

                while (rs.next()) {
                    lines.add(
                            rs.getString("id") + "\t" +
                                    rs.getString("news") + "\t" +
                                    rs.getString("datetime").split(" ")[0] + "\t" +
                                    rs.getString("subject") + "\t" +
                                    rs.getString("url")
                    );
                }

                Path p = Files.createFile(Paths.get("D:\\나경택.txt"));
                Files.write(p, lines);
            }
        });
    }

    public void modify(String where, Modify modify, boolean save) throws Exception {
        CTRL.db.doWork(con -> {

            try (Statement stmt = con.createStatement();
                 Statement stmt2 = con.createStatement()) {
                try (ResultSet r = stmt.executeQuery("SELECT * FROM na_book2 WHERE " + where)) {

                    while (r.next()) {
                        NaBook naBook = new NaBook(
                                r.getString("id"),
                                r.getString("datetime").split(" ")[0],
                                r.getString("news"),
                                r.getString("subject"),
                                r.getString("value"),
                                r.getString("section"));

                        modify.run(naBook);

                        if (save)
                            stmt2.executeUpdate("UPDATE na_book2 SET " +
                                    "subject = '" + naBook.subject.replaceAll("('|\\\\)", "\\\\$1") + "', " +
                                    "value = '" + naBook.value.replaceAll("('|\\\\)", "\\\\$1") + "', " +
                                    "section = '" + naBook.section + "', " +
                                    "datetime = '" + naBook.datetime +
                                    "' WHERE id = " + r.getObject("id"));
                    }
                }
            }
        });
    }

    public void 블로그(int category, int page) throws Exception {

        out("------------------------------------------ [" + page + "] ------------------------------------------");
        int[] size = {1};

        String html = HTTP.get("https://blog.naver.com/PostList.nhn?from=postList&blogId=cc_kyungtek&categoryNo=" + category + "&currentPage=" + page);

        forEach("itemSubjectBoldfont\">([^<>]+).*?cc_kyungtek\\/(\\d+)\".*?id=\"postViewArea\">(.*?)<div class=\"post_footer_contents\">", html,
                (i, g, subject, blogNum, value) -> {
                    String url = "https://blog.naver.com/cc_kyungtek/" + blogNum;

                    if (!CTRL.exists(url)) {
                        subject = $trim(subject);
                        new Text("건강칼럼", "1990-01-01", subject, value, url).save();
                    }
                    size[0]++;
                });

        if (size[0] > 1) 블로그(category, page + 1);
    }

    public void 일간투데이(int page) throws Exception {

        out("------------------------------------------ [" + page + "] ------------------------------------------");
        int[] size = {1};

        String html = HTTP.get("http://www.dtoday.co.kr/engine_yonhap/search.php?page=" + page + "&total=30&picktab=article&searchcont=article&others_cont_type=&div_code=&cust_div_code=&sfield=&article_type=&period=all&from_date=&to_date=&sort=date&searchword=%B3%AA%B0%E6%C5%C3&orgsearchword=", "euc-kr");

        forEach("<strong class=\"title\">.*?idxno=(\\d+)[^<>]+_blank\">(.*?)<\\/strong>.*?(\\d{4}-\\d{2}-\\d{2})", html,
                (i, g, id, _subject, date) -> {
                    String url = "http://www.dtoday.co.kr/news/articleView.html?idxno=" + id;

                    if (!CTRL.exists(url))
                        forEach("<div class=\"cont-body\".*?>(.*?)<p class=\"auto-martop-20\">", HTTP.get(url, "euc-kr"),
                                (ii, gg, content) -> {

                                    String subject = $trim(_subject);
                                    content = $trim(content);

                                    out(page + "] " + size[0]++ + ") " + date + " / " + subject);
                                    //out(content);

                                    new Text("일간투데이", date, subject, content, url).save();

                                });
                    else size[0]++;
                });
        if (size[0] > 1) 일간투데이(page + 1);
    }

    public void 전광일보(int page) throws Exception {

        out("------------------------------------------ [" + page + "] ------------------------------------------");
        int[] size = {1};

        String html = HTTP.get("http://www.jkilbo.co.kr/news.php?CurrentPage=" + page + "&fn=1&bc=news&type=list&sh=1&shc=%B3%AA%B0%E6%C5%C3&pcode=&year1=&month1=&day1=&year2=&month2=&day2=&writer=&cate=", "euc-kr");

        forEach("\\/news.php\\?[^<>]+&num=(\\d+).*?pcode=(\\d+).*?headline2b>(.+?)<\\/font.*?(\\d{4}년\\d{2}월\\d{2})일", html,
                (i, g, id, pcode, _subject, _date) -> {
                    String url = "http://www.jkilbo.co.kr/news.php?fn=1&bc=news&type=view&pcode=" + pcode + "&num=" + id;

                    if (!CTRL.exists(url))
                        forEach("td6.*?>(.*?)<p style", HTTP.get(url, "euc-kr"),
                                (ii, gg, content) -> {

                                    String subject = $trim(_subject),
                                            date = _date.replaceAll("[^\\d]+", "-");
                                    content = $trim(content);

                                    out(page + "] " + size[0]++ + ") " + date + " / " + subject);
                                    //out(content);

                                    new Text("전광일보", date, subject, content, url).save();

                                });
                    else size[0]++;
                });
        if (size[0] > 1) 전광일보(page + 1);
    }

    // 8까지 받음
    public void 굿뉴스피플(int page) throws Exception {

        out("------------------------------------------ [" + page + "] ------------------------------------------");
        int[] size = {1};

        String html = HTTP.get("http://www.goodnewspeople.com/relate_writer.php3?writer=%B3%AA%B0%E6%C5%C3&page=" + page, "euc-kr");

        forEach("height=24>.*?<a[^<>]+aid=(\\d+).*?([^<>]+)<\\/a>.*?(\\d{4}-\\d{2}-\\d{2})", html,
                (i, g, id, _subject, date) -> {
                    String url = "http://www.goodnewspeople.com/read.php3?aid=" + id;

                    if (!CTRL.exists(url))
                        forEach("<font class=jul>(.*?)<\\/font", HTTP.get(url, "euc-kr"),
                                (ii, gg, content) -> {

                                    String subject = $trim(_subject);
                                    content = $trim(content);

                                    out(page + "] " + size[0]++ + ") " + date + " / " + subject);

                                    new Text("굿뉴스피플", date, subject, content, url).save();

                                });
                    else size[0]++;
                });
        if (size[0] > 1) 굿뉴스피플(page + 1);
    }

    // 10페이지까지 받음
    public void 경기헤럴드(int page) throws Exception {

        out("------------------------------------------ [" + page + "] ------------------------------------------");
        int[] size = {1};

        String html = HTTP.get("http://search.ggherald.com/?stype=GGHERALD.COM&ssort=0&cddtc=MPK_dkbsoft_4957&sword=%EB%82%98%EA%B2%BD%ED%83%9D&page=" + page);

        forEach("class=\"title\"><a.*?idx=(\\d+)\".*?([^<>]+)<\\/a", html,
                (i, g, id, _subject) -> {
                    String url = "http://www.ggherald.com/default/index_view_page.php?idx=" + id;

                    if (!CTRL.exists(url))
                        forEach("입력 : (\\d{4}년.*?)일.*?<\\/table>(.*?)<div[^<>]+\"f11_2\"", HTTP.get(url, "euc-kr"),
                                (ii, gg, date, content) -> {
                                    String subject = $trim(_subject);
                                    date = date.replaceAll("[^\\d]+", "-");
                                    content = $trim(content);

                                    out(size[0]++ + ") " + date + " / " + subject);

                                    new Text("경기헤럴드", date, subject, content, url).save();
                                });
                    else size[0]++;
                });
        if (size[0] > 1) 경기헤럴드(page + 1);
    }

    // 25까지 받음
    public void 선데이뉴스(int page) throws Exception {

        out("------------------------------------------ [" + page + "] ------------------------------------------");
        int[] size = {1};

        String html = HTTP.get("http://www.newssunday.co.kr/bbs/search.php?sfl=wr_subject%7C%7Cwr_content&stx=%EB%82%98%EA%B2%BD%ED%83%9D&sop=and&gr_id=&srows=10&onetable=&page=" + page);

        forEach("tab_article.*?wr_id=(\\d+)", html, (i, g, id) -> {
            String url = "http://www.newssunday.co.kr/bbs/board.php?bo_table=news&wr_id=" + id;

            if (!CTRL.exists(url))
                forEach("news_title01.*?([^<>\\[\\]]+)<\\/h2>.*?기사입력 (\\d{4}.\\d{2}.\\d{2}).*?<!-- 본문 내용 시작 \\{ -->(.*?)<!-- \\} 본문 내용 끝 -->",
                        HTTP.get(url), (ii, gg, subject, date, content) -> {

                            date = date.replaceAll("\\.", "-");
                            subject = $trim(subject);

                            content = $trim(content);  // 머리말 지우기
                            new Text("선데이뉴스", date, subject, content, url).save();

                            out(size[0]++ + ") " + subject);
                            out(url);
                            out("--------------------------------------------------------------------------");

                        });
            else size[0]++;
        });

        if (size[0] > 1) 선데이뉴스(page + 1);
    }


    public String $trim(String content) {
        return Strings.unEscapeHTML(content)
                .replaceAll("(?i)<br[\\/><br\\s]*?>", "\n")
                .replaceAll("&nbsp;", "")
                .replaceAll("<(.*?)>", "")
                .replaceAll("“|”", "\"")
                .replaceAll("·", "·")
                .replaceAll("‘|’", "'")
                .replaceAll(" {2,}", " ")
                .replaceAll("\n{2,}", "\n")
                .replaceAll("^\\s+|\\s+$", "")
                .trim();
    }

    class Text {

        String news;
        String date;
        String subject;
        String value;
        String url;

        Text(String n, String d, String s, String t, String u) {
            news = n;
            date = d;
            subject = s;
            value = t;
            this.url = u;
        }

        public void save() {
            if (CTRL.exists(url)) out("이미 있음!!");
            else CTRL.save(map());
        }

        Map<String, Object> map() {
            Map<String, Object> map = new HashMap<>();
            map.put("url", url);
            map.put("datetime", date);
            map.put("subject", subject);
            map.put("value", value);
            map.put("news", news);
            return map;
        }

        List<String> lines() {
            List<String> lines = new ArrayList<>();
            lines.add(url);
            lines.add(date);
            lines.add(subject);
            lines.add("");
            lines.add(value);
            return lines;
        }

        @Override
        public String toString() {
            return value;
        }

    }

    public void out(Object obj) {
        System.out.println(obj);
    }
}
