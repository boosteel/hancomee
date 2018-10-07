package com.hancomee;

import com.hancomee.util.Access;
import com.hancomee.util.DataConverter;
import com.hancomee.util.IAccess;
import com.hancomee.util.reflect.DataBean;
import com.hancomee.util.reflect.ReflectObject;
import org.junit.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class AnyTest {

    @Test
    public void test() throws Exception {


        IAccess<Map<String, Object>> a = Access.createMap(new HashMap<>());
        a.set("name", "asdf");

        out(a.target());

        IAccess<Magic> m = DataBean.createAccess(new Magic());
        out(m.get("korean.nam"));

    }


    class Magic {
        Korean korean = new Korean();
    }

    class Korean {
        String name = "asdf";
    }

    public void r() throws Exception {
        String sql = "WHERE state = :state{d} [AND name LIKE :%ame] [OR a = :a{i}]";
        Function<Map<String, Object>, String> d = where(sql);

        ReflectObject o = ReflectObject.getReflectObject(Test1.class);
        out(o.map(new Test1()));
        out(d.apply(o.map(new Test1())));
    }

    public static class Test1 {
        int a;
        public String name = "운따";
    }

    Pattern
            point = Pattern.compile("\\[([^\\]]+)\\]|:([^:\\s,()]+)");  // [prop = :value] 또는 :value

    public Function<Map<String, Object>, String> where(String parse) {

        List<Function<Map<String, Object>, String>> list = new ArrayList<>();
        int pos = 0, i;
        Matcher m = point.matcher(parse);

        while (m.find()) {

            String key = m.group(2),
                    text = parse.substring(pos, pos = m.start());

            list.add(obj -> text);      // *before text

            // ① [AND prop = :value{d}]
            if (key == null) {
                String exp = m.group(1).trim(),    // AND prop = :value{d}
                        $before = exp.substring(0, i = exp.indexOf(":"));

                Function<Map<String, Object>, String> keyA = keyApply(exp.substring(i + 1, exp.length()));

                // null이면 빈문자열, 아니면 완성문자열
                list.add((map) -> {
                    out($before);
                    String data = keyA.apply(map);
                    if (data.equals("null")) return "";
                    else return $before + data;
                });
            } else {
                list.add(keyApply(key));
            }

            pos = m.end();
        }

        return (map) -> {
            StringBuilder builder = new StringBuilder();
            for (Function<Map<String, Object>, String> g : list)
                builder.append(g.apply(map));
            return builder.toString();
        };
    }


    // name{?}
    public Function<Map<String, Object>, String> keyApply(String exp) {
        int i = exp.indexOf("{");
        String key = exp, type = "varchar";

        // 데이터 타입이 정의되어 있을때
       if (i != -1) {
            key = exp.substring(0, i);
            type = exp.substring(i + 1, exp.indexOf("}"));
        }
        // LIKE
        else if (key.contains("%")) {
            if (key.startsWith("%")) {
                type = key.endsWith("%") ? "%like%" : "%like";
            } else {
                type = "like%";
            }
            key = key.replaceAll("%", "");
        }

        String $key = key, $type = type;
        return (obj) -> DataConverter.exp_to_sql($type, obj.get($key));
    }


    private <T> T out(T obj) {
        System.out.println(obj);
        return obj;
    }
}
