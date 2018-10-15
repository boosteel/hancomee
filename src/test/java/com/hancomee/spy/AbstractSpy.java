package com.hancomee.spy;

import com.hancomee.util.db.DB;
import com.hancomee.util.HTTP;
import com.hancomee.util.Patterns;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public abstract class AbstractSpy {

    protected Map<String, String> header;


    protected Set<String> uuid = new HashSet<>();
    protected DB $db;

    private static final Path ROOT = Paths.get("D:/files");

    protected Path root;
    protected String rootPath;
    protected String targetPath;

    protected AbstractSpy(String uri) {

        try {


            // 클래스명으로 헤더 읽어오기 :: classname}-request.txt
            URL url = getClass().getClassLoader().getResource(this.getClass().getSimpleName() + "-request.txt");
            if (url != null) {
                Path path = Paths.get(url.toURI());
                if (Files.exists(path))
                    header = HTTP.readHeader(path);
            }

            this.rootPath = this.targetPath = uri;

            // 폴더 생성
            Files.createDirectories(this.root = this.ROOT.resolve(this.targetPath));

            // DB 커넥션
            $db = new DB("jdbc:mariadb://localhost:3306/hancomee", "root", "ko9984");

            // DB에서 uuid 가지고 오기
            $db.execute("SELECT uuid FROM spy_data WHERE path LIKE '" + uri + "%'", (rs) -> {
                while (rs.next())
                    uuid.add(rs.getString("uuid"));
            });
            $db.execute("SELECT uuid FROM secret_gallery WHERE path LIKE '" + uri + "%'", (rs) -> {
                while (rs.next())
                    uuid.add(rs.getString("uuid"));
            });


        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    protected void error() {
        throw new RuntimeException();
    }

    protected void resolve(String sub) throws IOException {
        targetPath = rootPath + "/" + sub;
        Files.createDirectories(root = ROOT.resolve(targetPath));
    }

    protected boolean addUUID(String s) {
        return uuid.add(s);
    }

    protected long $down(String url, SpyData data, boolean force) throws IOException {
        HttpURLConnection con = HTTP.$get(url);
        long d = $down(con.getInputStream(), data, force);
        con.disconnect();
        return d;
    }

    protected long $down(InputStream is, SpyData data, boolean force) throws IOException {

        Path savePath = root.resolve(data.getFilename() + "." + data.getFiletype());
        long siz = force ?
                Files.copy(is, savePath, StandardCopyOption.REPLACE_EXISTING) :
                Files.copy(is, savePath);
        data.setFilesize(siz);
        return siz;
    }

    protected void $save(List<SpyData> list) throws Exception {
        $db.save("spy_data", list.stream().map(i -> i.map)
                .collect(Collectors.toList()));
    }

    private static final String[]
            SPY_DATA_PROPS =
            "filename filetype filesize path user title uuid datetime".split(" "),
            SECRET_GALLERY_PROPS =
                    ("filename filetype filesize path user title uuid datetime " +
                            "rotate blind favorite shot").split(" ");

    protected void $push() throws Exception {
        $push(targetPath);
    }

    protected int $push(String path) throws Exception {

        int ignore = 0;
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        // 이미 저장된 uuid를 가지고 온다.
        List<String> uuids =
                $db.execute("SELECT uuid FROM secret_gallery WHERE path LIKE '" + path + "%'",
                        new ArrayList<>(),
                        (rs, i) -> {
                            return rs.getString("uuid");
                        });

        // 해당 path의 모든 데이터를 가지고 온다.
        List<Map<String, Object>> data =
                $db.execute("SELECT * FROM spy_data WHERE path LIKE '" + path + "%'",
                        new ArrayList<>(),
                        (rs, i) -> {
                            Map<String, Object> map = new HashMap<>();

                            for (String prop : SPY_DATA_PROPS)
                                map.put(prop, rs.getString(prop));

                            return map;
                        }),
                result = new ArrayList<>();

        // 솎아낸다.
        for (Map<String, Object> map : data) {
            if (uuids.contains(map.get("uuid")))
                ignore++;
            else {
                // uploadtime 갱신
                map.put("uploadtime", simpleDateFormat.format(new Date()));
                result.add(map);
            }
        }

        if (!result.isEmpty())
            $db.save("secret_gallery", result);

        out("무시된 갯 수 : " + ignore);
        out("저장된 갯 수 : " + result.size());
        return result.size();

    }

    // ************************** ▼ static method ▼ ************************** //
    private static Pattern r_type = Pattern.compile("\\/([^\\s\\/]+)");

    public static final String imgType(String contentType) {
        if (!contentType.contains("image"))
            throw new RuntimeException(contentType + "은 이미지타입이 아닙니다.");
        String type = Patterns.exec(r_type, contentType)[1];
        return type.equals("jpeg") ? "jpg" : type;
    }

    // ************************** ▲ static method ▲ ************************** //

    protected <T> T out(T obj) {
        System.out.println(obj);
        return obj;
    }

}
