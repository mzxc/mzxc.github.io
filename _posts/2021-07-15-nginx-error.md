---
layout: post
title:  "Nginx 自定义全局错误页面"
crawlertitle: "Nginx 自定义全局错误页面"
subtitle: "NGINX ERROR PAGE"
ext: ""
date:  2021-07-15
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['SERVER', '原创']
musicUri: 1400259247
musicTitle: 星辰
musicFrom: gomyck
author: gomyck
openPay: true
---

拒绝丑陋的 nginx 原有错误页面, 配置通用的漂亮错误页

### 应用场景

我个人的服务器上有大量的服务, 供我个人日常开发和其他用途使用, 但是在遇到服务错误的时候, 通常会出现各种问题

### 错误案例

> http 转换成 https: 当我访问一个 url 时, http://xxx.gomyck.com, 如果当前 url 指向的服务不可用时, 地址的的请求协议有 http 转换为 https

造成该种现象的原因一般来自浏览器缓存, 而且当服务可用时, 通常要清空缓存才可以正确访问

> 并未配置 url 对应的 https 配置, 访问 https://url 时, 页面显示的是我另外的一个 url 页面, exp: https://a.gomyck.com 显示的是 https://b.gomyck.com 的页面
> 其中, a 并未配置 https 配置, b 配置了 https 的配置

nginx 官方给出的解释是: 在未指定SSL默认站点时,未开启SSL的站点使用HTTPS会直接访问到已开启SSL的站点

因为 nginx 的查找规则是按照配置的从上到下依次查找, 如果没有找到, 则匹配 default_server, 如果还是找不到, 则默认匹配第一个, 所以我们可以通过配置 default_server 类解决此问题

```text
server {
     listen 443 ssl default_server;
     server_name _ ;
     ssl_certificate        xxx.crt;  #必须是实际存在的文件
     ssl_certificate_key    xxx.key;  #必须是实际存在的文件
     return 404;
}
```
这样在未配置 https 时, 默认返回 404

### 全局错误配置

查看 nginx 官方文档, error_page 的上下文可以是 http server location, 所以我们依据上下级关系, 在 http 配置中加入错误配置

**error_page 404             http://static.gomyck.com/error/error.html;**

**error_page 500 502 503 504 http://static.gomyck.com/error/error.html;**

这里直接使用 url 来定义错误页, 省去其他配置

**reload 之后发现并不好使, 查阅相关资料, 需要 nginx 开启一项配置:**

**proxy_intercept_errors on;** #开启代理错误拦截(nginx 和 被代理的服务返回的错误码)

**fastcgi_intercept_errors on;**  #开启fastcgi模块错误拦截(这个模块大多用于 PHP)







