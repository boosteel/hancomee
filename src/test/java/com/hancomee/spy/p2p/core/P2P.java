package com.hancomee.spy.p2p.core;


import com.boosteel.util.support.Strings;

import java.util.List;
import java.util.stream.Collectors;

public class P2P {

    private int id;

    private String site;
    private String uuid;
    private String url;
    private String thumb;
    private String title;
    private String keyword;

    private boolean visited;
    private boolean good;
    private boolean blind = false;


    public int getId() {
        return id;
    }

    public P2P setId(int id) {
        this.id = id;
        return this;
    }

    public String getSite() {
        return site;
    }

    public P2P setSite(String site) {
        this.site = site;
        return this;
    }

    public String getUuid() {
        return uuid;
    }

    public P2P setUuid(String uuid) {
        this.uuid = uuid;
        return this;
    }

    public String getTitle() {
        return title;
    }

    public P2P setTitle(String title) {
        this.title = Strings.unEscapeHTML(title)
                .replaceAll("\\\\", "")
                .replaceAll("'", "\\\\'");
        return this;
    }

    public String getUrl() {
        return url;
    }

    public P2P setUrl(String url) {
        this.url = url;
        return this;
    }

    public String getThumb() {
        return thumb;
    }

    public P2P setThumb(String thumb) {
        this.thumb = thumb;
        return this;
    }

    public boolean isVisited() {
        return visited;
    }

    public P2P setVisited(boolean visited) {
        this.visited = visited;
        return this;
    }

    public boolean isGood() {
        return good;
    }

    public P2P setGood(boolean good) {
        this.good = good;
        return this;
    }

    public boolean isBlind() {
        return blind;
    }

    public P2P setBlind(boolean blind) {
        this.blind = blind;
        return this;
    }

    public String getKeyword() {
        return keyword;
    }

    public P2P setKeyword(String keyword) {
        this.keyword = keyword;
        return this;
    }

    // site, uuid, url, thumb
    public String SQL() {
        return "(" + quie(site) + ", " +
                quie(uuid) + ", " +
                quie(url) + ", " +
                quie(thumb) + ", " +
                (blind ? 1 : 0) + ", " +
                quie(keyword) + ", " +
                quie(title) + ")";
    }


    public static final String INSERT(List<P2P> list) {
        return "INSERT INTO p2p (site, uuid, url, thumb, blind, keyword, title) VALUES " +
                String.join(", ", list.stream().map( v -> v.SQL()).collect(Collectors.toList()));


    }

    private static final String quie(String s) {
        return "'" + s.replaceAll("'", "\\'")+ "'";
    }
}
