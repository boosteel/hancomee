package com.hancomee.util.reflect;

import com.hancomee.util.IAccess;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

public class ReflectObject {


    /*
     *  모든 BeanData는 캐시에 저장된다.
     *  Class.getName()은 유일한 값이므로 getName()으로 캐시에 저장한다.
     */
    private static final Map<String, ReflectObject> $cache = new HashMap<>();

    public static final ReflectObject getReflectObject(Class<?> clazz) {
        return getReflectObject(clazz.getName());
    }

    public static final ReflectObject getReflectObject(String className) {
        ReflectObject db = $cache.get(className);
        if (db == null) {
            try {
                $cache.put(className, db = new ReflectObject(Class.forName(className)));
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        return db;
    }

    // reflect로 값 읽어오기 :: dot 지원
    public static final <T> T getValue(Object target, String key) {
        String[] keys = key.split("\\.");
        ReflectObject ro;

        int len = keys.length, i = 0;

        for (; i < len; i++) {
            if(target == null) return null;
            ro = ReflectObject.getReflectObject(target.getClass());
            target = ro.get(target, keys[i]);
        }
        return (T)target;
    }

    public static final<T> T setValue(T target, String key, Object value) {
        String[] keys = key.split("\\.");
        ReflectObject ro;

        int len = keys.length, i = 0;

        while(len-- > 0) {

        }
        for (; i < len; i++) {
            ro = ReflectObject.getReflectObject(target.getClass());
            target = ro.get(target, keys[i]);
        }

        return target;
    }


    public static final<T> IAccess<T> createAccess(T t) {
        ReflectObject db = getReflectObject(t.getClass());
        return new IAccess<T>() {
            @Override
            public T target() {
                return t;
            }

            @Override
            public Object get(String key) {
                return getValue(t, key);
            }

            @Override
            public IAccess<T> set(String key, Object value) {
                setValue(t, key, value);
                return this;
            }
        };
    }

    private static final String keyName(String n) {
        n = n.substring(3);
        return n.substring(0, 1).toLowerCase() + n.substring(1);
    }

    protected Class<?> clazz;
    protected Map<String, Setter> setterMap = new HashMap<>();
    protected Map<String, Getter> getterMap = new HashMap<>();
    protected Map<String, String> setterTypes = new HashMap<>();       // setter가 가진 클래스

    public ReflectObject(Class<?> clazz) {
        this.clazz = clazz;
        try {

            Method[] methods = clazz.getDeclaredMethods();
            Field[] fields = clazz.getDeclaredFields();

            String name;
            int paramCount;

            /*
             *  set, get 메서드가 있을 경우 그게 우선이고,
             *  없으면 field를 직접 사용한다.
             */
            for (Method method : methods) {

                name = method.getName();
                paramCount = method.getParameterCount();

                // setter
                if (name.startsWith("set")) {

                    // void setName(Object obj);
                    if (paramCount == 1) {
                        method.setAccessible(true);
                        Method invoke = method;

                        Class<?> c = method.getParameterTypes()[0];
                        name = keyName(name);
                        setterTypes.put(name, c.getName());
                        setterMap.put(name, (t, v) -> invoke.invoke(t, v));
                    }

                }

                // getter
                else if (name.startsWith("get")) {
                    if (!method.getReturnType().equals(Void.TYPE) && paramCount == 0) {
                        method.setAccessible(true);
                        Method invoke = method;
                        name = keyName(name);
                        getterMap.put(name, (t) -> invoke.invoke(t));
                    }
                }
            }


            for (Field field : fields) {
                name = field.getName();
                field.setAccessible(true);

                if (!getterMap.containsKey(name))
                    getterMap.put(name, (t) -> field.get(t));

                if (!setterMap.containsKey(name)) {
                    setterTypes.put(name, field.getType().getName());
                    setterMap.put(name, (t, v) -> field.set(t, v));
                }
            }

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    // 값 가지고 오기
    public <T> T get(Object obj, String name) {
        Getter g = getterMap.get(name);
        if (g != null) {
            try {
                return (T) g.get(obj);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        return null;
    }

    public void set(Object obj, String name, Object val) {
        Setter setter = setterMap.get(name);
        if (setter != null)
            try {
                setter.set(obj, val);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
    }

    public Map<String, Object> map(Object target) throws Exception {
        Map<String, Object> map = new HashMap<>();
        for (Map.Entry<String, Getter> entry : getterMap.entrySet()) {
            System.out.println(entry.getKey());
            map.put(entry.getKey(), entry.getValue().get(target));
        }
        return map;
    }

    public interface Setter {
        void set(Object target, Object value) throws Exception;
    }

    public interface Getter {
        Object get(Object target) throws Exception;
    }
}
