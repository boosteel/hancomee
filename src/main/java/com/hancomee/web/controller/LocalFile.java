package com.hancomee.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.FileTime;
import java.util.*;

@Controller
@RequestMapping("secret/local-files")
public class LocalFile {

    private Path ROOT = Paths.get("D:/");

    @RequestMapping()
    public String intro() {
        return "secret/local-files.html";
    }


    @RequestMapping(value = "dirs")
    @ResponseBody
    public List<String> dirs(@RequestParam(value = "path", defaultValue = "") String path) throws IOException {
        Path root = ROOT.resolve(path);
        if(!check(root)) return Collections.emptyList();
        return tour(root, new ArrayList<>());
    }

    @RequestMapping(value = "list")
    @ResponseBody
    public Set<MediaFile> list(@RequestParam("path") String path) throws IOException {
        Path root = ROOT.resolve(path);
        if(!check(root)) return Collections.emptySet();
        return list(root);
    }

    @RequestMapping(value = "favorite", method = RequestMethod.POST)
    @ResponseBody
    public void favorite(@RequestBody Map<String, String> val) throws IOException {
        String v = val.get("target");
        System.out.println(v);
    }

    private boolean check(Path path) throws IOException {
        return path.getNameCount() > 0 && Files.exists(path);
    }

    // 폴더 가지고 오기
    public List<String> tour(Path path, List<String> list) throws IOException {
        if (Files.isDirectory(path)) {
            list.add(subpath(path));
            try (DirectoryStream<Path> stream = Files.newDirectoryStream(path)) {
                for (Path target : stream) tour(target, list);
            }
        }
        return list;
    }

    private Set<MediaFile> list(Path path) throws IOException {
        Set<MediaFile> result = new TreeSet<>();
        String filepath = subpath(path);

        try (DirectoryStream<Path> stream = Files.newDirectoryStream(path)) {
            for (Path file : stream) {
                if (Files.isRegularFile(file)) {
                    String prove = Files.probeContentType(file);
                    if (prove != null && (prove.contains("image") || prove.contains("mp4"))) {
                        String[] str = file.getFileName().toString().split("\\.(?=[^\\.]+$)");
                        result.add(new PathSort("/local/" + filepath + "/")
                                .setFileTime(Files.getLastModifiedTime(file))   // 수정한 날짜로 정렬
                                .setFilename(str[0])
                                .setFiletype(str[1])
                                .setFilesize(Files.size(path))
                        );
                    }
                }
            }
        }
        return result;
    }

    // 수정된 날짜 순으로 정렬하기 위함함
   class PathSort extends MediaFile implements Comparable<PathSort> {

        private FileTime ft;

        public PathSort(String path) {
            super(path);
        }

        public PathSort setFileTime(FileTime ft) {
            this.ft = ft;
            return this;
        }

        @Override
        public int compareTo(PathSort o) {
            return o.ft.compareTo(this.ft);
        }
    }


    private String subpath(Path path) {
        return path.subpath(0, path.getNameCount()).toString().replaceAll("\\\\", "/");
    }
}
