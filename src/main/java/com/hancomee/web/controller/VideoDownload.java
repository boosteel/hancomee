package com.hancomee.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("video")
public class VideoDownload {

    @RequestMapping()
    public String intro() {
        return "secret/gallery.html";
    }

}
