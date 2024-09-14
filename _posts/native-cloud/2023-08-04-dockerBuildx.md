---
layout: post
title:  "使用 docker buildx 构建跨平台镜像"
crawlertitle: "使用 docker buildx 构建跨平台镜像"
subtitle: "docker build buildx"
ext: ""
date:  2023-08-04
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['SERVER', '原创']
musicUri: 523042017
musicTitle: Into You
musicFrom: Matisse & Sadko
author: gomyck
openPay: true
---

默认 docker build 只会根据当前系统的架构构建镜像，如果需要构建跨平台镜像，需要使用 docker buildx。

## 如何使用

安装了 docker desktop 之后, buildx 已经默认被安装了，可以通过 `docker buildx` 查看是否安装成功。

使用下面的指令创建一个新的 builder, 默认的 default builder 只会构建当前系统的镜像
```shell
#创建一个名为 ck 的 builder
$ docker buildx create --name ck --use --driver-opt env.http_proxy=proxy.mac.gomyck.com:7890 --driver-opt env.https_proxy=proxy.mac.gomyck.com:7890
#查看是否创建成功
$ docker buildx ls
```

使用下述指令构建镜像，可以看到会构建多个平台的镜像
```shell
$ docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t gomyck/ck:latest .
```

## 参考

**linux/amd64 和 linux/arm/v7 的区别是什么？**

> v7 是 arm32v7 的简写，是 arm32 架构的 32 位系统，而 arm64 是 arm64 架构的 64 位系统。是从 v8 开始支持的 64 位指令集, 也就是说  arm64 = arm64/v8
