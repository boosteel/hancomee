package com.hancomee.web.controller;

import com.hancomee.util.HTTP;
import com.hancomee.util.Patterns;
import com.hancomee.web.domain.BayBean;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Controller
@RequestMapping("audiobay")
public class AudioBay {


    private static Pattern
            r_naver_cafe2 = Pattern.compile("\"inner_number\">(\\d+).*?([^<>]+)<\\/a>.*?td_view\">(\\d+)"),
            r_naver_cafe = Pattern.compile("list-count\">(\\d+).*?'m-tcol-c'>([^<>]+).*?id=\"article.*?([^<>]+)<.*?view-count.*?([^<>]+)<.*?view-count.*?([^<>]+)<"),
            r_naver_cafe_search = Pattern.compile("list-count\">(\\d+).*?'m-tcol-c'>(.+?)<\\/a.*?id=\"article.*?([^<>]+)<.*?view-count.*?([^<>]+)<.*?view-count.*?([^<>]+)<"),
            r_wassada = Pattern.compile("'center'>[,\\d]{3,}.*?href='([^']+board_uusell[^']+).*?([^<>]+)<.*?'15'>([^<>]+).*?'center'>.*?(\\d+)"),
            r_hificlub = Pattern.compile("href=\"([^\"]+web2017[^\"]+pid[^\"]+).*?13pt;'>([^<>]+).*?\"center\">([^<>]+).*?<br \\/>[^<>]+?(\\d+)"),
            r_enjoyaudio = Pattern.compile("class=\"no\">[^<>]+\\d+.*?href=\"([^\"]+document_srl[^\"]+).*?([^<>]+)<.*?\"m_no\">([^<>]+).*?([^<>]+)<\\/span");

    @RequestMapping()
    public String intro() {
        return "audiobay.html";
    }

    @RequestMapping("wassada")
    @ResponseBody
    public List<BayBean> wassada(@RequestParam("page") int page) throws Exception {
        String _url = "http://www.wassada.com/bbs_list.php?" +
                "start=" + ((page - 1) * 25) + "&" +
                "tb=board_uusell&" +
                "category=&" +
                "id=&" +
                "search_mode=&" +
                "happy_board_keyword=&" +
                "search_bbs_date=&" +
                "this_date=&" +
                "b_category=",
                html = HTTP.get(_url);

        List<BayBean> list = new ArrayList<>();
        Patterns.forEach(r_wassada, html, (i, g, url, title, user, count) -> {
            BayBean bb = new BayBean()
                    .setSoldout(g.contains("판매완료"))
                    .setTitle(title)
                    .setUser(user)
                    .setUrl("http://www.wassada.com/" + url)
                    .setCount(count);
            list.add(bb);
        });
        return list;
    }

    @RequestMapping("hificlub")
    @ResponseBody
    public List<BayBean> hificlub(@RequestParam("page") int page) throws Exception {

        String
                _url = "https://www.hificlub.co.kr/web10/jmkt/jmkt_list_n16.asp",
                html = HTTP.post(_url,
                        new String[]{"jmkt_gb=1&sf=&shop_code=&next=" + page + "&kw1=1&kw2=1&kw3=1&s_prod=&cat=&kind=&jmkt_prod_ty=&dpty="},
                        "euc-kr");

        List<BayBean> list = new ArrayList<>();
        Patterns.forEach(r_hificlub, html, (i, g, url, title, user, count) -> {
            BayBean bb = new BayBean()
                    .setCount(count)
                    .setTitle(title)
                    .setUser(user)
                    .setSoldout(g.contains("판매완료"))
                    .setUrl("https://www.hificlub.co.kr" + url);
            list.add(bb);
        });

        return list;
    }


    @RequestMapping("enjoyaudio")
    @ResponseBody
    public List<BayBean> enjoyaudio(@RequestParam("page") int page) throws Exception {

        String _url = "https://www.enjoyaudio.com/zbxe/index.php?mid=audiosell&page=" + page,
                html = HTTP.get(_url);

        List<BayBean> list = new ArrayList<>();

        Patterns.forEach(r_enjoyaudio, html, (i, g, url, title, count, user) -> {
            BayBean bb = new BayBean()
                    .setUrl(url.replaceAll("amp;", ""))
                    .setTitle(title)
                    .setUser(user)
                    .setSoldout(g.contains("판매완료"))
                    .setCount(count);
            list.add(bb);

        });

        return list;
    }

    @RequestMapping("naver")
    @ResponseBody
    public List<BayBean> navercafe(
            @RequestParam("clubId") int clubId,
            @RequestParam("menuId") int menuId,
            @RequestParam("name") String name,
            @RequestParam("page") int page

    ) throws Exception {

        // https://cafe.naver.com/joonggonara?iframe_url=/ArticleList.nhn?search.clubid=10050146&search.menuid=411&userDisplay=50&search.page=1
        String _url = "https://cafe.naver.com/ArticleList.nhn?" +
                "search.clubid=" + clubId + "&" +
                "search.menuid=" + menuId + "&" +
                "search.questionTab=A&" +
                "search.totalCount=501&" +
                "userDisplay=50" + "&" +
                "search.page=" + page,
                html = HTTP.get(_url, "euc-kr");

        List<BayBean> list = new ArrayList<>();

        Patterns.forEach(r_naver_cafe, html, (i, g, num, title, user, date, count) -> {
            BayBean bb = new BayBean()
                    .setCount(count)
                    .setTitle(title)
                    .setUrl("https://cafe.naver.com/" + name + "/" + num)
                    .setUser(user)
                    .setSoldout(g.contains("완료"));
            list.add(bb);
        });

        if (list.isEmpty()) {
            Patterns.forEach(r_naver_cafe2, html, (i, g, num, title, count) -> {
                BayBean bb = new BayBean()
                        .setCount(count)
                        .setTitle(title)
                        .setUrl("https://cafe.naver.com/" + name + "/" + num)
                        .setSoldout(g.contains("완료"));
                list.add(bb);
            });
        }

        return list;
    }


}
