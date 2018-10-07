package com.hancomee.web.controller;

import com.hancomee.util.DB;
import com.hancomee.util.SQL;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Controller
@RequestMapping("upload")
public class FileUploadCtrl {

    Map<String, Long> progressMap = new HashMap<>();

    // 고유 아이디값 받기
    @RequestMapping(value = "progress", method = RequestMethod.GET)
    @ResponseBody
    public String get() {
        String uuid = UUID.randomUUID().toString();
        uuid = uuid.substring(uuid.lastIndexOf("-") + 1, uuid.length());
        progressMap.put(uuid, 0l);
        return uuid;
    }

    // 서버측 다운로드 진행상황 알림
    @RequestMapping(value = "progress/{id}", method = RequestMethod.GET)
    @ResponseBody
    public Long progress(@PathVariable("id") String id) {
        Long val = progressMap.get(id);
        return val == null ? -1l : val;
    }

    @RequestMapping(value = "file/{id}", method = RequestMethod.POST)
    @ResponseBody
    public void progress(@PathVariable("id") String id, @RequestPart("file") MultipartFile file,
                         @RequestPart("path") String _path) throws Exception {
        Path path = Paths.get(_path);
        Files.createDirectories(path);

        String filename = file.getOriginalFilename(), filetype = "";

        int pos = filename.lastIndexOf(".");
        if (pos != -1)
            filetype = filename.substring(pos + 1, filename.length());

        savefile(id, path.resolve(id + "." + filetype), file.getInputStream());
    }

    private void out(Object obj) {
        System.out.println(obj);
    }


    private void savefile(String progressId, Path path, InputStream _is) throws Exception {

        try (InputStream is = _is;
             OutputStream os = Files.newOutputStream(path, StandardOpenOption.CREATE_NEW)) {

            int end;
            long size = 0l;
            byte[] buf = new byte[1024 * 10];

            // 진행도를 측정할 Progress Map
            progressMap.put(progressId, 0l);
            while ((end = is.read(buf)) != -1) {
                os.write(buf, 0, end);
                progressMap.put(progressId, size = size + end);
            }

        } finally {
            progressMap.remove(progressId);
        }
    }

}
