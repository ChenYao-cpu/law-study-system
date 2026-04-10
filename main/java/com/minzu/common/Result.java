package com.minzu.common;

public class Result {
    private int code;
    private String msg;
    private Object data;

    // 成功静态方法
    public static Result success(Object data) {
        Result r = new Result();
        r.code = 200;
        r.msg = "success";
        r.data = data;
        return r;
    }

    // 失败静态方法（带自定义消息）
    public static Result error(String msg) {
        Result r = new Result();
        r.code = 500;
        r.msg = msg;
        r.data = null;
        return r;
    }

    // 失败静态方法（带自定义状态码和消息）
    public static Result error(int code, String msg) {
        Result r = new Result();
        r.code = code;
        r.msg = msg;
        r.data = null;
        return r;
    }

    // getter / setter（必须，否则 Spring 序列化可能有问题）
    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}