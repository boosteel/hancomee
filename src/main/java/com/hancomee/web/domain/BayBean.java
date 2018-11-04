package com.hancomee.web.domain;


import com.boosteel.util.support.Strings;

public class BayBean {


    private boolean soldout;
    private String title;
    private String user;
    private int count;
    private String url;


    public boolean isSoldout() {
        return soldout;
    }

    public BayBean setSoldout(boolean soldout) {
        this.soldout = soldout;
        return this;
    }

    public String getTitle() {
        return title;
    }

    public BayBean setTitle(String title) {
        this.title = Strings.unEscapeHTML(title.trim());
        return this;
    }

    public String getUser() {
        return user;
    }

    public BayBean setUser(String user) {
        this.user = user.trim();
        return this;
    }

    public int getCount() {
        return count;
    }

    public BayBean setCount(String count) {
        return setCount(Integer.parseInt(count.replaceAll("[^\\d]", "")));
    }
    public BayBean setCount(int count) {
        this.count = count;
        return this;
    }

    public String getUrl() {
        return url;
    }

    public BayBean setUrl(String url) {
        this.url = url;
        return this;
    }

    @Override
    public String toString() {
        return (soldout ? "[판매완료] " : "") +
                title + " (" + user + ") / " + count + "\n" + url;
    }
}
