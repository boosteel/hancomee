package com.hancomee.util;

public interface IAccess<T> {
    T target();
    Object get(String key);
    IAccess<T> set(String key, Object value);
}
