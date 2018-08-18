package com.hancomee.servlet.filter;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;

/*
 * ?attachment=파일명
 * 이런 쿼리가 붙어있을 경우, Response에 Content-Disposition을 기입해준다.
 * 파일확장자는 path에서 제공해야 한다.
 * file.jpg?attachment=rename  ==> rename.jpg
 *
 * ** 파일 확장자가 없으면, resource가 아닌 것으로 간주하고 response 셋팅을 하지 않는다.
 */
public class ResourceDisposition implements Filter {



    @Override
    public void init(FilterConfig arg0) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res,
                         FilterChain chain) throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        String value = (String) request.getParameter("attachment");

        if (value != null) {
            HttpServletResponse response = (HttpServletResponse) res;
            value = URLEncoder.encode(value, "utf-8").replaceAll("\\+", "%20");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + value + "\";");
        }

        chain.doFilter(req, res);
    }


    @Override
    public void destroy() {
    }


}