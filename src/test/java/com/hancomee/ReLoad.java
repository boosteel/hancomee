package com.hancomee;

import org.junit.Test;

import java.io.IOException;
import java.nio.file.*;

public class ReLoad {


    @Test
    public void copy() throws Exception {

        Path root = Paths.get(ReLoad.class.getClassLoader().getResource(".").toURI()),
                classes = root.resolve("../classes"),
                src = root.resolve("../../src/main/resources");

        String[] target = {"static", "templates"};

        for(String dir : target) {
            $copy(src.resolve(dir), classes.resolve(dir));
        }

    }


    private void $copy(Path source, Path target) throws IOException {

        out(source);

        try(DirectoryStream<Path> stream = Files.newDirectoryStream(source)) {
            for(Path t : stream) {

                Path tt = target.resolve(t.getFileName());

                if(Files.isDirectory(t)) {
                    if(!Files.exists(tt))
                        Files.createDirectories(tt);
                    $copy(t, tt);
                }
                else if(Files.isRegularFile(t))
                    Files.copy(t, tt, StandardCopyOption.REPLACE_EXISTING);
            }
        }
    }

    private void out(Object obj) {
        System.out.println(obj);
    }


}
