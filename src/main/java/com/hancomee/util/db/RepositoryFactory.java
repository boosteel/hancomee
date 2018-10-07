package com.hancomee.util.db;

import com.hancomee.util.SQL;
import com.hancomee.util.db.anno.*;
import com.hancomee.util.reflect.DataBean;

import javax.sql.DataSource;
import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.hancomee.util.DataConverter.data_by_jType;

public class RepositoryFactory {

    // @Value용 객체
    private static class QVal {
        int index;
        String key;

        QVal(int i, String k) {
            index = i;
            key = k;
        }
    }

    private static class MethodData {

        Class<?> returnType;


        DataSource dataSource;
        String name;

        boolean autoCommit;

        boolean hasParameters;
        boolean hasValue;
        boolean hasMap;
        boolean hasConnection;

        boolean wantResultSet;
        boolean wantSave;
        boolean wantLastId;
        boolean wantMap;
        boolean wantList;
        boolean wantDataBean;
        boolean wantSingleValue;

        int paramCount;

        int connectionIndex = -1;
        int beanIndex = -1;
        int mapIndex = -1;

        List<QVal> values = new ArrayList<>();

        /*
         *  Method의 모든 정보를 뽑아낸다.
         */
        MethodData(Method method, DataSource db) throws Exception {

            this.dataSource = db;
            name = method.getName();
            hasParameters = (paramCount = method.getParameterCount()) != 0;
            returnType = method.getReturnType();


            String className = returnType.getName();

            if (method.getAnnotation(Save.class) != null) {
                wantSave = true;
            } else if (method.getAnnotation(LastInsertId.class) != null) {
                wantSave = wantLastId = true;
            } else if (!className.equals("void")) {

                autoCommit = true;

                if (className.contains(".")) {
                    /*
                     *  ① List 타입   ② 일반 클래스는
                     *  모두 DataBean으로 간주한다.
                     */
                    if (!returnType.getName().startsWith("java.")) {
                        wantDataBean = true;
                    } else if (List.class.isAssignableFrom(returnType)) {

                        /*
                         *  method의 리턴타입의 Generic 객체정보를 가지고 오는 방법을 모르겠다.
                         */
                        String genericName = method.getGenericReturnType().getTypeName();
                        returnType = Class.forName(genericName
                                .substring(genericName.indexOf("<") + 1, genericName.indexOf(">"))
                        );
                        wantDataBean = wantList = true;
                    } else if (className.equals("java.sql.ResultSet")) {
                        wantResultSet = true;
                    } else if (Map.class.isAssignableFrom(returnType)) {
                        wantMap = true;
                    } else
                        wantSingleValue = true;
                }

            }


            int i = 0;
            Class<?>[] parameters = method.getParameterTypes();
            Annotation[][] annotations = method.getParameterAnnotations();

            /*
             *  메소드 파라미터 순회
             *  메소드 파라미터는 결국 query를 완성하기 위한 값들이다.
             */
            for (Class<?> param : parameters) {

                // 애노테이션은 Value만 허용한다.
                if (annotations[i].length == 1 && Value.class.isAssignableFrom(annotations[i][0].getClass())) {
                    if (beanIndex != -1 || mapIndex != -1)
                        throw new RuntimeException("파라미터값은 @Value | Map<String, Object> | Custom Class");
                    values.add(new QVal(i, ((Value) annotations[i][0]).value()));
                }

                className = param.getName();
                if (className.contains(".") && !className.startsWith("java.")) {
                    if (!values.isEmpty() || mapIndex != -1)
                        throw new RuntimeException("파라미터값은 @Value | Map<String, Object> | Custom Class");
                    beanIndex = i;
                }
                // 파라미터 중에 Map이 있는지
                else if (Map.class.isAssignableFrom(param)) {
                    if (!values.isEmpty() || beanIndex != -1)
                        throw new RuntimeException("파라미터값은 @Value | Map<String, Object> | Custom Class");
                    hasMap = true;
                    mapIndex = i;
                } else if (Connection.class.isAssignableFrom(param)) {
                    connectionIndex = i;
                    hasConnection = true;
                }

                i++;
            }

            autoCommit = method.getAnnotation(AutoCommit.class) == null;
        }


        /*
         *  인자로 Connection이 들어오면 그것을 사용하고,
         *  아니면 직접 DB에서 받아온다.
         */
        Object run(Object[] args, ConRun r) throws Exception {
            if(hasConnection) return r.run((Connection) args[connectionIndex]);
            else {
                try (Connection con = dataSource.getConnection()) {

                    if (autoCommit) {
                        return r.run(con);
                    } else {
                        try {
                            con.setAutoCommit(false);
                            Object rv = r.run(con);
                            con.commit();
                            return rv;
                        } catch (Exception e) {
                            con.rollback();
                            throw e;
                        }
                    }

                } catch (Exception e) {
                    throw e;
                }
            }
        }

        // @Value가 있을 경우 Map을 만들때 쓴다.
        // args는 method.invoke시의 인자값
        Object paramValues(Object[] args) {
            if (beanIndex != -1) return args[beanIndex];
            if (mapIndex != -1) return args[mapIndex];

            Map<String, Object> map = new HashMap<>();
            for (QVal v : values) map.put(v.key, args[v.index]);
            return map;
        }

        boolean isReturnType(Class<?> type) {
            return type.isAssignableFrom(returnType);
        }
    }

    public interface ConRun {
        Object run(Connection con) throws Exception;
    }

    public interface MethodRun {
        Object run(Object[] args) throws Exception;
    }

    public static final <T> T createRepository(Class<T> cons, DataSource db) {

        try {

            Map<Method, MethodRun> result = new HashMap<>();

            for (Method method : cons.getMethods()) {

                Query c = method.getAnnotation(Query.class);

                // ************************ @Prepared ************************ //
                if (c != null) {
                    NamedPreparedStatementFactory factory = SQL.newPrepared(c.value());
                    MethodData md = new MethodData(method, db);


                    if (md.wantDataBean) {

                        // List<{type}>
                        if (md.wantList) {
                            result.put(method, (args) -> {
                                DataBean dataBean = DataBean.getBeanData(md.returnType.getName());
                                return md.run(args, con -> {
                                    List<?> list = new ArrayList<>();
                                    try (ResultSet rs = factory.create(con)
                                            .set(md.paramValues(args))
                                            .doWorkR((p, m) -> p.executeQuery());) {
                                        while (rs.next())
                                            list.add(dataBean.newInstance(rs));
                                        return list;
                                    }
                                });
                            });
                        }
                        // 단일 객체
                        else {
                            result.put(method, (args) -> {
                                DataBean dataBean = DataBean.getBeanData(md.returnType.getName());
                                return md.run(args, con -> {
                                    try (ResultSet rs = factory.create(con)
                                            .set(md.paramValues(args))
                                            .doWorkR((p, m) -> p.executeQuery())) {
                                        return rs.next() ? dataBean.newInstance(rs) : null;
                                    }
                                });
                            });
                        }
                    }
                    // 리절트셋을 바로 원할때
                    else if (md.wantResultSet) {

                        /*
                         *   ★★★ ResultSet method(Map<String, Object> values)
                         *   ★★★ ResultSet method(@Value("") Type name, ...)
                         *   ★★★ ResultSet method(Map<String, Object> values, @Value("") Type name, ...)
                         */
                        if (md.hasValue || md.hasMap) {
                            result.put(method,
                                    (args) -> md.run(args, con -> factory.create(con)
                                            .set(md.paramValues(args))
                                            .doWorkR((p, m) -> p.executeQuery())));
                        }
                    }

                    /*
                     *   ★★★ @LastInsertId
                     */
                    else if (md.wantLastId) {
                        result.put(method, (args) -> md.run(args,
                                con -> factory.create(con)
                                        .set(md.paramValues(args))
                                        .doWorkR((p, m) -> {
                                            p.executeUpdate();
                                            try (Statement s = con.createStatement();
                                                 ResultSet rs = s.executeQuery("SELECT LAST_INSERT_ID()")) {
                                                rs.next();
                                                return rs.getLong(1);
                                            }
                                        })));
                    }
                    /*
                     *   ★★★ int method(Map<String, Object> values)
                     *   ★★★ int method(Value("") Type name, ...)
                     *   ★★★ int method(Map<String, Object> values, Value("") Type name, ...)
                     */
                    else if (md.wantSave) {
                        result.put(method,
                                (args) -> md.run(args, con -> factory.create(con)
                                        .set(md.paramValues(args))
                                        .doWorkR((p, m) -> p.executeUpdate())));
                    }

                    /*
                     *   ★★★ NamedPrepareStatement method(Connection con)
                     */
                    else if (md.isReturnType(NamedPrepareStatement.class)) {
                        result.put(method, (args) -> md.run(args, con -> factory.create(con)));
                    } else if (md.wantSingleValue) {
                        String className = md.returnType.getName();
                        result.put(method, (args) -> {
                            return md.run(args, con -> {
                                return factory.create(con)
                                        .set(md.paramValues(args))
                                        .doWorkR((p, uu) -> {
                                            try (ResultSet rs = p.executeQuery()) {
                                                ResultSetMetaData m = rs.getMetaData();
                                                if (rs.next()) {
                                                    return data_by_jType(rs, m, className, 1);
                                                } else
                                                    return null;
                                            }
                                        });
                            });
                        });
                    }
                }

            }


            return (T) Proxy.newProxyInstance(
                    cons.getClassLoader(),
                    new Class[]{cons},
                    (proxy, method, methodArgs) -> {
                        MethodRun r = result.get(method);
                        if (r == null)
                            throw new RuntimeException("메소드 시그니처가 바르게 작성되지 않았습니다.\n" + method);
                        return r.run(methodArgs);
                    });


        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
