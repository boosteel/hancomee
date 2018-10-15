package com.hancomee;

import com.hancomee.util.HTTP;
import com.hancomee.util.Patterns;
import com.hancomee.util.Strings;
import org.junit.Test;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.List;

public class 나경택 {

    Path path = Paths.get("D:\\나경택");

    @Test
    public void test() throws Exception {
        선데이뉴스(6);
    }

    public void 굿뉴스피플(int page) throws Exception {
        String html = HTTP.get("http://goodnewspeople.com/relate_writer.php3?writer=%B3%AA%B0%E6%C5%C3&total_record=253&page=" + page);

    }

    public void 선데이뉴스(int page) throws Exception {

        int[] size = {10};

        Path root = path.resolve("선데이뉴스");

        String html = HTTP.get("http://www.newssunday.co.kr/bbs/search.php?sfl=wr_subject%7C%7Cwr_content&stx=%EB%82%98%EA%B2%BD%ED%83%9D&sop=and&gr_id=&srows=10&onetable=&page=" + page);

        Patterns.forEach("tab_article.*?wr_id=(\\d+)", html, (i, g, id) -> {
            String url = "http://www.newssunday.co.kr/bbs/board.php?bo_table=news&wr_id=" + id,
                    pageHTML = HTTP.get(url);
            Patterns.forEach("news_title01.*?([^<>\\[\\]]+)<\\/h2>.*?기사입력 (\\d{4}.\\d{2}.\\d{2}).*?<!-- 본문 내용 시작 \\{ -->(.*?)<!-- \\} 본문 내용 끝 -->",
                    pageHTML, (ii, gg, subject, date, content) -> {

                        date = date.replaceAll("\\.", "-");
                        subject = text(subject);

                        content = text(
                                content
                                        .replaceAll("^.*?\\]\\]?", "")   // 머리말 지우기
                                        .replaceAll("<\\/span>", "\n")   // 줄바꿈 설정
                        );  // 머리말 지우기

                        Text text = new Text("선데이뉴스", date, subject, content);

                        Path file = root.resolve("[" + date + "] " + Strings.eraseWindowStr(subject) +  ".txt");
                        if(!Files.exists(file)) Files.createFile(file);
                        Files.write(file, text.lines(), StandardOpenOption.TRUNCATE_EXISTING);

                        out(size[0] + ") " +  subject);
                        size[0]--;
                    });
        });

        if(size[0] == 0) 선데이뉴스(page + 1);
    }

    public String text(String content) {
        return Strings.unEscapeHTML(content).
                replaceAll("<(.*?)>", "")
                .replaceAll("&nbsp;", "")
                .replaceAll("“|”", "\"")
                .replaceAll("·", "·")
                .replaceAll("‘|’", "'")
                .replaceAll("[ \n]{2,}", "\n")
                .replaceAll("\n", "\r\n")
                .replaceAll(" {2,}", " ")
                .trim();
    }

    class Text {

        String name;
        String date;
        String subject;
        String text;

        Text(String n, String d, String s, String t) {
            name = n;
            date = d;
            subject = s;
            text = t;
        }

        List<String> lines() {
            List<String> lines = new ArrayList<>();
            lines.add(name);
            lines.add("");
            lines.add(date);
            lines.add("");
            lines.add(subject);
            lines.add("");
            lines.add(text);
            return lines;
        }

        @Override
        public String toString() {
            return String.join("\n", lines());
        }

    }

    public void out(Object obj) {
        System.out.println(obj);
    }
}
