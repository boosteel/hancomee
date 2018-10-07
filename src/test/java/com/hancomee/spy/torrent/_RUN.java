package com.hancomee.spy.torrent;

import org.junit.Test;

public class _RUN {

    @Test
    public void test() throws Exception {

        /*try(DirectoryStream<Path> stream = Files.newDirectoryStream(Paths.get("D:\\files\\p2p\\ondisk\\180824 - 복사본"))) {
            for(Path p : stream) {
                String type = Files.probeContentType(p);
                if(type != null && type.contains("video"))
                    out(VideoInfo.newInstance(p));
            }
        }*/
        //out(FFMPEG.stringToInt("02:29:41"));
        out(3/2);

    }

    private static void out(Object obj) {
        System.out.println(obj);
    }
}
