package com.hancomee.spy.p2p;

import com.hancomee.spy.p2p.core.P2P;
import com.hancomee.util.DB;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class P2PManager {

    private DB db = new DB("jdbc:mariadb://localhost:3306/hancomee", "root", "ko9984");
    private Set<String> CHECK = new HashSet<>();

    protected String site;

    protected P2PManager(String site) throws Exception {
        this.site = site;
        db.execute("SELECT uuid FROM p2p WHERE site = '" + site + "'",
                (rs) -> {
                    while (rs.next())
                        CHECK.add(rs.getString(1));
                });
    }

    protected void save(List<P2P> list) throws Exception {
        db.update(P2P.INSERT(list));
    }

    protected boolean has(String uuid) {
        return CHECK.add(uuid);
    }

}
