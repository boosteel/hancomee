package com.hancomee.spy.torrent;

public class TorrentData {

    private String host;

    private String referer;
    private String title;
    private String url;
    private String thumb;

    private String keyword;


    public String getHost() {
        return host;
    }

    public TorrentData setHost(String host) {
        this.host = host;
        return this;
    }

    public String getReferer() {
        return referer;
    }

    public TorrentData setReferer(String referer) {
        this.referer = referer;
        return this;
    }

    public String getTitle() {
        return title;
    }

    public TorrentData setTitle(String title) {
        this.title = title
                .replaceAll("<.*?>", "")
                .replaceAll("\\s{2,}", " ")
                .replaceAll("^\\s+|\\s+$", "");
        return this;
    }

    public String getUrl() {
        return url;
    }

    public TorrentData setUrl(String url) {
        this.url = url;
        return this;
    }

    public String getThumb() {
        return thumb;
    }

    public TorrentData setThumb(String thumb) {
        this.thumb = thumb;
        return this;
    }

    public String getKeyword() {
        return keyword;
    }

    public TorrentData setKeyword(String keyword) {
        this.keyword = keyword;
        return this;
    }

    @Override
    public String toString() {

        return "[" + keyword + "] \n" +
                "title : " + title + "\n" +
                "url : " + url + "\n" +
                "thumb : " + thumb;

    }
}
