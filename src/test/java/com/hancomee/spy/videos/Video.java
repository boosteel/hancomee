package com.hancomee.spy.videos;

import java.util.List;
import java.util.stream.Collectors;

public  class Video {
    private String mp4;
    private String subject;
    private String url;
    private String thumb;

    public String getMp4() {
        return mp4;
    }

    public Video setMp4(String mp4) {
        this.mp4 = mp4;
        return this;
    }

    public String getSubject() {
        return subject;
    }

    public Video setSubject(String subject) {
        this.subject = subject;
        return this;
    }

    public String getUrl() {
        return url;
    }

    public Video setUrl(String url) {
        this.url = url;
        return this;
    }

    public String getThumb() {
        return thumb;
    }

    public Video setThumb(String thumb) {
        this.thumb = thumb;
        return this;
    }

    public String toJSON() {
        return "{" +
                toJSON("title", subject) + ", " +
                toJSON("mp4", mp4) + ", " +
                toJSON("thumb", thumb) + ", " +
                toJSON("url", url) +
                "}";
    }


    @Override
    public String toString() {
        return "title : " + subject + "\n" +
                "url : " + url + "\n" +
                "thumb : " + thumb + "\n" +
                "mp4 : " + mp4 + "\n\n";
    }

    public static String toJSON(String key, String value) {
        return "\"" + key + "\" : " + " \"" + value + "\"";
    }

    public static String toList(List<Video> list) {
        return "[" + String.join(", ", list.stream().map((v) -> v.toJSON()).collect(Collectors.toList())) + "]";
    }

    public static String toJs(List<Video> list) {
        return "var values = [" + String.join(", ", list.stream().map((v) -> v.toJSON()).collect(Collectors.toList())) + "]";
    }
}