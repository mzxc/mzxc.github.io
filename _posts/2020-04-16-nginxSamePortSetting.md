---
layout: post
title:  "Nginx 相同端口, 自动转发 http 请求到 https"
crawlertitle: "Nginx ssl https http"
subtitle: "Nginx 相同端口, 自动转发 http 请求到 https"
ext: "转发 nginx"
date:  2020-04-16
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['SERVER', '原创']
musicUri: 29737634
musicTitle: Highscore
musicFrom: Panda Eyes
author: gomyck
openPay: true
---

可同时对同端口, 同域名, 代理 http&https 请求

### 起因

因为公司服务器映射公网时, 不允许暴露 80 和 443 端口, 所以上线项目另选了端口作为监听端口, 域名解析配置为: study.gomyck.com - 47.100.100.222 (示例解析, 实际并不是)

并为该二级域名申请了 ssl 证书, 为了使用户可以用一个 url 访问服务(study.gomyck.com:3333), 就要做到当前端口 http&https 同时代理

> 关于域名层级  www.gomyck.com.
> 最后一个点(.)为根域名;
> .com 为顶级域名;
> gomyck.com 中, gomyck 为一级域名;
> www 为二级域名;

#### 常规配置如下:

```xml

upstream study.gomyck.com {
    server 127.0.0.1:8443;
    server 127.0.0.1:8444;
}

server {
    listen  80;
    server_name  study.gomyck.com;
    location / {
        #设置主机头和客户端真实地址，以便服务器获取客户端真实IP
        proxy_set_header Host $http_host;
        proxy_set_header X-Forwarded-Scheme $scheme;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        #禁用缓存
        proxy_buffering off;
        #反向代理的 协议 + upstream名称
        proxy_pass http://study.gomyck.com/;
    }
    #loaction代表匹配的请求uri
    location ^~ /images/ {
        root /var/www/html/;
        autoindex on;
        autoindex_exact_size off;
        autoindex_localtime on;
    }
}

server {
    listen 443;
    server_name study.gomyck.com;
    ssl on;
    ssl_certificate   cert/xxx.pem;
    ssl_certificate_key  cert/xxx.key;
    ssl_session_timeout 5m;
    ssl_ciphers xxx;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Forwarded-Scheme $scheme;
        proxy_set_header X-Forwarded-Proto https; #这里可以配置与代理服务的通讯协议
        proxy_redirect off;
        proxy_connect_timeout      240;
        proxy_send_timeout         240;
        proxy_read_timeout         240;
        proxy_pass http://study.gomyck.com/;
    }

    #loaction代表匹配的请求uri
    location ^~ /images/ {
        root /var/www/html/;
        autoindex on;
        autoindex_exact_size off;
        autoindex_localtime on;
    }
}
```

**上面的配置需要走默认的域名解析标准, 即域名后不加端口, 那么 http 默认请求 80 端口, https 默认请求 443 端口, 但是现在有自定义端口, 所以要配置如下:**

```text

upstream study.gomyck.com {
    server 127.0.0.1:8443;
    server 127.0.0.1:8444;
}

server {
    #最新的 nginx, 不需要单独使用 ssl on 来表示开启 ssl 模块
    listen ssl 3333;
    server_name study.gomyck.com;
    #ssl on;
    ssl_certificate   cert/xxx.pem;
    ssl_certificate_key  cert/xxx.key;
    ssl_session_timeout 5m;
    ssl_ciphers xxx;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;

    #重点, nginx 官方错误码, 当 http 请求到 3333 端口时, 会触发该错误码, 那么把当前请求转化为 https 请求重定向即可
    error_page 497 https://$host:$server_port$request_uri;

    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Forwarded-Scheme $scheme;
        proxy_set_header X-Forwarded-Proto https; #这里可以配置与代理服务的通讯协议
        proxy_redirect off;
        proxy_connect_timeout      240;
        proxy_send_timeout         240;
        proxy_read_timeout         240;
        proxy_pass https://study.gomyck.com/;
    }

    #loaction代表匹配的请求uri
    location ^~ /images/ {
        root /var/www/html/;
        autoindex on;
        autoindex_exact_size off;
        autoindex_localtime on;
    }
}

```

**一开始我想用两个 server 标签分别监听 http 和 https, 但是 nginx 会报错, 提示当前端口已经存在一个相同域名了**

直到在 overflow 上找到答案(面向 of 编程~):

```text

You should check out "Error Processing" section of this document:

http://nginx.org/en/docs/http/ngx_http_ssl_module.html

Non-standard error code 497 may be used to process plain HTTP request which has been sent to HTTPS port.

Something like this should work (untested):

error_page 497 https://$host$request_uri;

Named locations may also be used in error_page, see http://nginx.org/r/error_page for details.

```

最后附上地址: https://stackoverflow.com/questions/14144514/can-i-redirect-non-ssl-traffic-that-comes-in-on-an-ssl-port-with-nginx
