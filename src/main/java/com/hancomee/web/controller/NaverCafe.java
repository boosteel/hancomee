package com.hancomee.web.controller;

import com.boosteel.http.HTTP;
import com.boosteel.util.support.Patterns;
import com.hancomee.web.domain.BayBean;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Controller
@RequestMapping("navercafe")
public class NaverCafe {

    private static Pattern
            r_cafe_name = Pattern.compile("g_sClubId = \"(\\d+)"),
            r_naver_info = Pattern.compile("g_sClubId = \"(\\d+).*?cafe.naver.com\\/([^\"]+).*?mcafe_name.*?([^<>]+)<"),
            r_naver_cafe_search = Pattern.compile("list-count\">(\\d+).*?'m-tcol-c'>(.+?)<\\/a.*?id=\"article.*?([^<>]+)<.*?view-count.*?([^<>]+)<.*?view-count.*?([^<>]+)<");

    @RequestMapping(value = {"*"})
    public String intro() {
        return "navercafe.html";
    }


    /*
     *  카페 영문주소나 카페 id를 통해 카페 기본정보 확인하기기
    */
    @RequestMapping("data/info")
    @ResponseBody
    public Map<String, String> info(@RequestParam("id") String clubid) throws Exception {
        Map<String, String> map = new HashMap<>();

        // 카페 영문명이 들어올 경우
        if (!clubid.matches("\\d+")) {
            clubid = Patterns.exec(r_cafe_name, HTTP.get("https://cafe.naver.com/" + clubid, "euc-kr"))[1];
        }

        String html = HTTP.get("https://cafe.naver.com/CafeProfileView.nhn?clubid=" + clubid, "euc-kr");
        String[] values = Patterns.exec(r_naver_info, html);

        map.put("id", values[1]);
        map.put("url", values[2]);
        map.put("name", values[3].trim());

        return map;
    }

    @RequestMapping("data/list")
    @ResponseBody
    public List<BayBean> data(@RequestParam("id") String clubid,
                              @RequestParam("searchBy") int searchBy,
                              @RequestParam("word") String query,
                              @RequestParam("page") int page,
                              @RequestParam("name") String cafeName) throws Exception {

        query = URLEncoder.encode(query, "euc-kr");

        /*
            search.searchBy=0  제목+내용
            search.searchBy=1  제목만
            search.searchBy=2  글작성자
            search.searchBy=3  댓글내용
            search.searchBy=4  댓글작성자
         */
        String url = "https://cafe.naver.com/ArticleSearchList.nhn?" +
                "search.clubid=" + clubid + "&" +
                "search.media=0&" +
                "search.searchdate=all&" +
                "search.defaultValue=1&" +
                "userDisplay=50&" +
                "search.option=0&" +
                "search.sortBy=date&" +
                "search.searchBy=" + searchBy + "&" +
                "search.searchBlockYn=0&" +
                "search.query=" + query + "&" +
                "search.viewtype=title&" +
                "search.page=" + page,
                html = HTTP.get(url, "euc-kr");

        List<BayBean> list = new ArrayList<>();

        Patterns.forEach(r_naver_cafe_search, html, (i, g, num, title, user, date, count) -> {
            BayBean bb = new BayBean()
                    .setCount(count)
                    .setTitle(title)
                    .setUrl("https://cafe.naver.com/" + cafeName + "/" + num)
                    .setUser(user)
                    .setSoldout(g.contains("완료"));
            list.add(bb);
        });
        return list;


    }
}
