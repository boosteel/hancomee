package com.hancomee.spy.p2p.core;

import com.hancomee.util.DB;
import com.hancomee.util.Patterns;
import org.junit.Before;
import org.junit.Test;

import java.awt.image.DataBuffer;
import java.io.DataInputStream;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

import static com.hancomee.spy.p2p.core._UTIL.quotes;

public class _db extends _base {

    DB db = new DB("jdbc:mariadb://localhost:3306/hancomee", "root", "ko9984");
    Set<String> existsNames = new HashSet<>();

    // (절대 변하면 안되는) 4가지 값을 문자열로 합쳐서 중복을 검사한다.
    @Before
    public void exists() throws Exception {
        db.execute("SELECT filename, filetype, filesize, duration FROM vvideo", (rs) -> {
            while (rs.next())
                existsNames.add(
                        UUID(rs.getString("filename"), rs.getString("filetype"),
                                rs.getString("duration"), rs.getLong("filesize"))
                );
        });
    }

    @Test
    public void test() throws Exception {

        save("D:\\files\\Download\\180925");

    }

    Pattern r_read = Pattern.compile("<---------------------------\t(.*?)\t--------------------------->");

    // 최초 저장은 6가지 값만 있으면 된다.
    // filename, filetype, filesize, duration, path, title
    public void save(String path) throws Exception {
        String sql = "INSERT INTO vvideo (path, title, filename, filetype, duration, filesize) VALUES ";
        List<String> list = read(path);
        if (!list.isEmpty())
            db.save(sql + String.join(", ", list));
        out("저장된 파일 갯수 " + list.size());
    }

    /*
     *  ① 중복확인
     *  ② VALUES 이하 SQL구문 작성
     */
    public List<String> read(String _path) throws Exception {

        List<String> list = new ArrayList<>();

        Path root = Paths.get(_path),
                info = root.resolve("info.txt");

        if (Files.exists(info)) {
            String text = String.join("\t", Files.readAllLines(info));
            Patterns.forEach(r_read, text, (i, g, data) -> {

                String[] values = data.split("\t");

                if (existsNames.add(data)) {
                    String
                            path = quotes(_path.replaceAll("\\\\", "/")),
                            filename = quotes(values[0]),
                            title = filename,
                            filtype = quotes(values[1]),
                            duration = quotes(values[2]),
                            filesize = values[3];

                    String[] query = {
                            path, title, filename, filtype, duration, filesize
                    };

                    list.add("(" + String.join(", ", query) + ")");

                } else {
                    out("\n이미저장된 파일!!\n" + data + "\n");
                }
            });
        }

        return list;
    }

    public static final String UUID(String filename, String filetype, String duration, long size) {
        return filename + "\t" + filetype + "\t" + duration + "\t" + size;
    }


}
