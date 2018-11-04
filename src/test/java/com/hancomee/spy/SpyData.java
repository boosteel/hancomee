package com.hancomee.spy;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Pattern;

import static com.boosteel.util.support.Strings.unEscapeHTML;


public class SpyData {
    
    private String uuid;
    private String title;
    private String datetime;
    private String user;

    private String filename;
    private String filetype;
    private long filesize;
    private String path;

    Map<String, Object> map = new HashMap<>();

    public String getUuid() {
        return uuid;
    }

    public SpyData setUuid(String uuid) {
        map.put("uuid", this.uuid = uuid);
        return this;
    }

    private static final String BAN_UNICODE_STRING = "[^\\u0000-\\uD7FF\\uE000-\\uFFFF]";
    private static final Pattern BAN_UNICODE = Pattern.compile(BAN_UNICODE_STRING);

    public String getTitle() {
        return title;
    }

    public SpyData setTitle(String title) {
        title = unEscapeHTML(title.trim().replaceAll("\\\\x[^\\\\x]{2}", ""));
        if (BAN_UNICODE.matcher(title).find()) {
            title = title.replaceAll(BAN_UNICODE_STRING, "");
        }
        map.put("title", this.title = title);
        return this;
    }

    public String getDatetime() {
        return datetime;
    }

    public SpyData setDatetime(String datetime) {
        if(datetime.length() < 11) datetime = datetime + " 00:00:00";
        map.put("datetime", this.datetime = datetime);
        return this;
    }

    public String getUser() {
        return user;
    }

    public SpyData setUser(String user) {
        map.put("user", this.user = user.trim());
        return this;
    }

    public String getFilename() {
        return filename;
    }

    public SpyData setFilename(String filename) {
        map.put("filename", this.filename = filename);
        return this;
    }

    public String getFiletype() {
        return filetype;
    }

    public SpyData setFiletype(String filetype) {
        map.put("filetype", this.filetype = filetype);
        return this;
    }

    public String getPath() {
        return path;
    }

    public SpyData setPath(String path) {
        map.put("path", this.path = path);
        return this;
    }

    public long getFilesize() {
        return filesize;
    }

    public SpyData setFilesize(long filesize) {
        map.put("filesize", this.filesize = filesize);
        return this;
    }

    @Override
    public String toString() {
        return "[" + uuid + "] " + datetime + "_" + title + " (" + user + ")";
    }
}
