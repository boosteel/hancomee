package com.hancomee.web.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class MediaFile {

    private String path;
    private String filename;
    private String filetype;
    private long filesize;
    private int rotate = 0;

    public MediaFile(String path) {
        this.path = path;
    }

    public String getPath() {
        return path;
    }

    public MediaFile setPath(String path) {
        this.path = path;
        return this;
    }

    public MediaFile setFile(Path path) throws IOException {
        String[] str = path.getFileName().toString().split("\\.(?=[^\\.]+$)");
        setFilename(str[0]);
        setFiletype(str[1]);
        setFilesize(Files.size(path));
        return this;
    }

    public String getFilename() {
        return filename;
    }

    public MediaFile setFilename(String filename) {
        this.filename = filename;
        return this;
    }

    public String getFiletype() {
        return filetype;
    }

    public MediaFile setFiletype(String filetype) {
        this.filetype = filetype;
        return this;
    }

    public long getFilesize() {
        return filesize;
    }

    public MediaFile setFilesize(long filesize) {
        this.filesize = filesize;
        return this;
    }

    public int getRotate() {
        return rotate;
    }

    public MediaFile setRotate(int rotate) {
        this.rotate = rotate;
        return this;
    }

    @Override
    public String toString() {
        return path + "/" + filename + "." + filetype + " (" + filesize + ")";
    }
}
