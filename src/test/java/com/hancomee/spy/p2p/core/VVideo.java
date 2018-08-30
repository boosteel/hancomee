package com.hancomee.spy.p2p.core;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

public class VVideo {

    private int id;

    private boolean blind = false;
    private int favorite = 0;

    private String path;
    private String filetype;
    private String filename;
    private long filesize;
    private String duration;

    private String title;
    private String memo = "";
    private String tag = "";


    public int getId() {
        return id;
    }

    public VVideo setId(int id) {
        this.id = id;
        return this;
    }

    public boolean isBlind() {
        return blind;
    }

    public VVideo setBlind(boolean blind) {
        this.blind = blind;
        return this;
    }

    public int getFavorite() {
        return favorite;
    }

    public VVideo setFavorite(int favorite) {
        this.favorite = favorite;
        return this;
    }

    public String getPath() {
        return path;
    }

    public VVideo setPath(String path) {
        this.path = path.replaceAll("\\\\", "/");
        return this;
    }

    public String getFiletype() {
        return filetype;
    }

    public VVideo setFiletype(String filetype) {
        this.filetype = filetype;
        return this;
    }

    public String getFilename() {
        return filename;
    }

    public VVideo setFilename(String filename) {
        this.filename = filename;
        return this;
    }

    public String getTitle() {
        return title;
    }

    public VVideo setTitle(String title) {
        this.title = title;
        return this;
    }

    public long getFilesize() {
        return filesize;
    }

    public VVideo setFilesize(long filesize) {
        this.filesize = filesize;
        return this;
    }

    public String getDuration() {
        return duration;
    }

    public VVideo setDuration(String duration) {
        this.duration = duration;
        return this;
    }

    public String getMemo() {
        return memo;
    }

    public VVideo setMemo(String memo) {
        this.memo = memo;
        return this;
    }

    public String getTag() {
        return tag;
    }

    public VVideo setTag(String tag) {
        this.tag = tag;
        return this;
    }


    public List<String> INFO() {
        String[] value = {
                "<---------------------------------------",
                "path : " + path,
                "filename : " + filename,
                "filetype : " + filetype,
                "filesize : " + filesize,
                "title : " + title,
                "duration : " + duration,
                "--------------------------------------->"};

        return Arrays.asList(value);

    }


    public String SQL() {
        return "(" +

                (blind ? 1 : 0) + ", " +
                favorite + ", " +

                quit(path) + ", " +
                quit(filetype) + ", " +
                quit(filename) + ", " +
                quit(duration) + ", " +
                filesize + ", " +
                quit(title) + ", " +
                quit(memo) + ", " +
                quit(tag) +

                ")";
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        VVideo video = (VVideo) o;
        return filesize == video.filesize &&
                Objects.equals(filetype, video.filetype) &&
                Objects.equals(filename, video.filename) &&
                Objects.equals(duration, video.duration);
    }

    @Override
    public int hashCode() {
        return Objects.hash(filetype, filename, filesize, duration);
    }

    @Override
    public String toString() {
        return path + "/" + filename + "." + filetype;
    }

    public static String uuid() {
        return UUID.randomUUID().toString().substring(19);
    }

    public static String SQL(List<VVideo> list) {
        return "INSERT INTO vvideo " +
                "(blind, favorite, path, filetype, filename, duration, filesize, title, memo, tag)" +
                " VALUES " +
                String.join(", ",
                        list.stream().map(v -> v.SQL()).collect(Collectors.toList()));
    }

    private static final String quit(String a) {
        return "'" +
                (a == null ? "" : a.replaceAll("'", "\\\\'")) +
                "'";
    }
}
