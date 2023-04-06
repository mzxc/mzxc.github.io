---
layout: post
title:  "微服务内网穿透实践"
crawlertitle: "微服务内网穿透实践"
subtitle: "NGINX FRP SPRINGBOOT EUREKA"
ext: ""
date:  2020-03-17
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['JAVA', '原创']
musicUri: 221895
musicTitle: 再度重逢
musicFrom: 陈柯
author: gomyck
openPay: true
---

完美穿透内网阻塞, 映射多个服务到注册中心

### 1.起因

因为在家里办公时, 多个微服务需要注册到服务器上的 eureka

但是家里的路由器设置端口映射不好使(路由器上层还有光猫, 但是光猫设置不了)

所以只能使用内网穿透软件来做端口映射

### 2.解决

在使用内外网穿透软件的时候, 反向代理软件只需要监听一个端口: 比如说 80 (nginx)

网关从 eureka 上获取服务 uri 时, 只需要请求同一个 IP:PORT(使用域名来区分服务, 域名解析之后指向一个 IP) 就可以了

否则需要启动多个穿透软件(一个穿透软件只监听一个端口), 不科学, 然后根据不同的 server name 来转发不同的请求

所以服务在 eureka 上注册的端口号与穿透过来的端口号需要设置两套

**比如在 eureka 上暴漏的是 80 (网关实际请求端口), 本地实际监听的是 8080**


### 3.具体配置:

公有云配置(我的阿里云, 避免 IP 变动带来的DNS配置更改):
```text
nginx: {
  监听: 80
  域名监听: app1.gomyck.com, app2.gomyck.com, app3.gomyck.com
  proxy_pass: 内网穿透(服务器端)
}

本地机器:
内网穿透(客户端): {
  app1.gomyck.com: 127.0.0.1:8881
  app2.gomyck.com: 127.0.0.1:8882
  app3.gomyck.com: 127.0.0.1:8883
}

server:
  port: 8860  #服务本地监听的端口
eureka:
  instance:
    prefer-ip-address: false
    hostname: app2.gomyck.com  #设置访问的域名
    non-secure-port: 80  #设置网关请求的实际端口, 而不是服务本身监听的端口, 但是这么设置, 在 eureka 的监控页面上点击链接, 还是服务本身监听的端口(server.port)

```



