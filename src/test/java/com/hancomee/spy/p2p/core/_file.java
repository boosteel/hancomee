package com.hancomee.spy.p2p.core;

import com.hancomee.util.Patterns;
import org.apache.tomcat.jni.File;
import org.junit.Test;

import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class _file extends _base {

    @Test
    public void run() throws Exception {

        String path = "D:\\files\\Download\\181014";

        forceThumb(path);
        videoInfo(path);
    }

    // 여기서 만든 info.txt를 _db 클래스에서 읽어 DB에 저장하게 된다.
    public void videoInfo(String path) throws Exception {

        List<String> result = new ArrayList<>();
        List<String> list = new ArrayList<>();

        int[] count = {0};
        tour(path, (file, name, type, root, index) -> {
            count[0]++;

            out("(" + count[0] + ") " + name + "." + type);

            FFMEPG_INFO info = FFMEPG_INFO.create(file);
            list.add("(" + count[0] + ")");
            list.add("<---------------------------");
            list.add(name);     // 파일명
            list.add(type);     // 파일타입
            list.add(info.getDuration());   // 영상 길이
            list.add(Files.size(file) + "");    // 파일용량
            list.add("--------------------------->");
            list.add("");
            list.add("");
        });

        result.add("");
        result.add("");
        result.add("총 " + count[0] + "개 파일");
        result.add("");
        result.add("");

        result.addAll(list);

        Files.write(Paths.get(path).resolve("info.txt"), result,
                StandardOpenOption.TRUNCATE_EXISTING, StandardOpenOption.CREATE);
    }

    public void forceThumb(String path) throws Exception {
        List<Path> list = checkThumb(path);
        Path root = Paths.get(path),
                thumbDir = root; //Files.createDirectories(root.resolve("thumb"));
        for (Path f : list) {
            out("\n" + f);
            FFMEPG_INFO info = FFMEPG_INFO.create(f);
            FFMEPG.createThumbnail(f, thumbDir, FFMEPG.intToString(info.getSecond() / 2));
        }
    }

    // 썸네일 없는 파일 확인
    public List<Path> checkThumb(String path) throws Exception {

        List<Path> list = new ArrayList<>();
        tour(path, (file, name, type, root, index) -> {
            Path thumb = file.getParent().resolve(
                    file.getFileName().toString()
                            .replaceAll("\\.[^\\.]+$", "") + ".jpg"
            );
            if (!Files.exists(thumb))
                list.add(file);
        });
        return list;
    }





    public void createThumb(String dir) throws Exception {
        Path target = Paths.get(dir);
        List<String> list = Files.readAllLines(target.resolve("thumb.txt"));

        for (String line : list) {
            line = line.trim();
            if (Pattern.compile("\\d{2}:\\d{2}:\\d{2}").matcher(line).find()) {
                String[] values = line.split("\t");
                FFMEPG.createThumbnail(target.resolve(values[0]), values[1]);
            }
        }
    }

    public static void tour(String path, TOUR t) throws Exception {
        int count = 0;
        Path root = Paths.get(path);
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(root)) {
            for (Path file : stream) {
                String f = Files.probeContentType(file);

                if (f != null && f.contains("video")) {
                    String[] names = Patterns.exec("^(.*)\\.([^\\.]+)$", file.getFileName().toString());
                    t.accept(file, names[1], names[2], root, count++);
                }
            }
        }
    }


    public interface TOUR {
        void accept(Path file, String filename, String filetype, Path root, int index) throws Exception;
    }
}
