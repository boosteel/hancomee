package com.hancomee.web;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.servlet.http.HttpServletRequest;

@ComponentScan({"com.hancomee"})
@SpringBootApplication
@RequestMapping
public class WebApplication extends SpringBootServletInitializer implements WebMvcConfigurer {


    // WEB-INF 배포를 위해서 반드시 필요함
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(WebApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(WebApplication.class, args);
    }


    @RequestMapping
    @ResponseBody
    public String intro() {
        return "hello";
    }

    @RequestMapping(value="templates/**/*")
    public String $template(HttpServletRequest req) {
        return req.getServletPath().substring(10) + ".html";
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/secret/gallery/**").addResourceLocations("file:D:/files/gallery/");
        registry.addResourceHandler("/local/**").addResourceLocations("file:D:/");
        registry.addResourceHandler("/disc/**").addResourceLocations("file:/");
    }

}
