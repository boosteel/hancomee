package com.hancomee.util;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

public class Access {


    public static final <T> T read(Map<String, Object> map, String key) {

        String[] keys = key.split("\\.");
        int len = keys.length, i = 0;

        Object val = map;

        for (; i < len; i++) {
            if (val != null && Map.class.isAssignableFrom(val.getClass())) {
                val = ((Map) val).get(keys[i]);
            } else return null;
        }
        return (T) val;
    }

    public static final IAccess<Map<String, Object>> createMap(Map<String, Object> map) {
        return new IAccess<Map<String, Object>>() {
            public Map<String, Object> target() {
                return map;
            }

            @Override
            public Object get(String key) {
                return read(map, key);
            }

            @Override
            public IAccess<Map<String, Object>> set(String key, Object value) {
                Map<String, Object> target = map;
                String[] keys = key.split("\\.");

                int i = 0, l = keys.length - 1;
                for (; i < l; i++) {
                    if (target.get(key = keys[i]) == null)
                        target.put(key, new HashMap<>());
                    target = (Map<String, Object>) target.get(key);
                }

                target.put(key, value);
                return this;
            }
        };
    }


}
