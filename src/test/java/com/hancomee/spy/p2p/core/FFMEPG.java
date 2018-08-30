package com.hancomee.spy.p2p.core;


import com.hancomee.util.Patterns;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

public class FFMEPG {

    private static final String FFMPEG_URL =
            "D:\\ffmpeg\\ffmpeg-20180824-d0b48a9-win64-static\\bin\\ffmpeg";

    private static final Pattern
            r_info = Pattern.compile("(?i)Duration:.*?([\\d:]+).*?bitrate:.*?(\\d+).*?(\\d{2,}x\\d{2,})");


    public static final List<String> info(String source) throws Exception {

        return $createReader(new String[]{
                FFMPEG_URL, "-i", source
        });
    }


    /*
     *  해당 시간에 해당하는 썸네일 이미지 만들기
     *  영상파일명과 같은 제목의 jpg 파일
     */
    public static final Path createThumbnail(String _source, String time) throws Exception {
        return createThumbnail(Paths.get(_source), time);
    }

    public static final Path createThumbnail(Path _source, String time) throws Exception {
        return createThumbnail(_source, _source, time);
    }

    public static final Path createThumbnail(Path _source, Path _targetDir, String time) throws Exception {

        String filename = _source.getFileName().toString().replaceAll("\\.[^\\.]+$", "");
        Path _target = _targetDir.resolve(filename + ".jpg");

        if (Files.exists(_target))
            return _target;

        String source = _source.toString(),
                target = _target.toString();

        String[] str = {
                FFMPEG_URL,
                "-ss", "\"" + time + "\"",
                "-i", "\"" + source + "\"",
                "-y", "-vframes", "1",
                "-an", "\"" + target + "\""
        };

        out(String.join(" ", str));
        List<String> lines = $createReader(str, true);
        out(String.join("\n", lines));

        return _target;
    }

    private static List<String> $createReader(String[] exp) throws IOException {
        return $createReader(exp, false);
    }

    private static List<String> $createReader(String[] exp, boolean isError) throws IOException {
        ProcessBuilder builder = new ProcessBuilder(exp);
        //builder.redirectOutput(ProcessBuilder.Redirect.INHERIT);
        //builder.redirectError(ProcessBuilder.Redirect.INHERIT);
        Process p = builder.start();
        List<String> result = new ArrayList<>();
        String line = null;

        /*try (BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream(), "utf-8"))) {
            while ((line = br.readLine()) != null)
                result.add(line);
        }*/

        try (BufferedReader br = new BufferedReader(new InputStreamReader(p.getErrorStream(), "utf-8"))) {
            while ((line = br.readLine()) != null)
                result.add(line);
        }

        return result;

    }

    // 02:29:41 ==>  8981
    public static final int stringToInt(String duration) {
        String[] values = duration.split(":");
        int i = Integer.parseInt(values[2]);
        i += 60 * Integer.parseInt(values[1]);
        i += 3600 * Integer.parseInt(values[0]);
        return i;
    }

    // 8981 ==> 02:29:41
    public static final String intToString(int num) {
        int hour = num / (3600),
                minute = (num - (hour * 3600)) / 60,
                second = num - (hour * 3600) - (minute * 60);

        return (hour < 10 ? "0" : "") + hour + ":" +
                (minute < 10 ? "0" : "") + minute + ":" +
                (second < 10 ? "0" : "") + second;
    }

    private static final void out(Object obj) {
        System.out.println(obj);
    }

}
