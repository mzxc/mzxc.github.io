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
$ docker buildx create --name ck --use --config ~/Documents/my_setting/docker/docker-buildx/buildkitd.toml --driver-opt env.http_proxy=proxy.mac.gomyck.com:7890 --driver-opt env.https_proxy=proxy.mac.gomyck.com:7890

#查看是否创建成功
$ docker buildx ls

```

buildkitd.toml 用于配置 buildx 可以推送镜像到私服

```toml
debug = true
# insecure-entitlements allows insecure entitlements, disabled by default.
insecure-entitlements = [ "network.host", "security.insecure" ]

# optionally mirror configuration can be done by defining it as a registry.
[registry."image.xxxxxx.com"]
  http = true
  insecure = true

```


使用下述指令构建镜像，可以看到会构建多个平台的镜像
```shell
# 打包成 tar (只能指定一种架构, 否则不支持 type=docker)
$ docker buildx build --platform linux/amd64 -t gomyck/ck:v1.1.0-3.9.20 -t gomyck/ck:latest . --output type=docker,dest=img-amd64.tar

# 打包成 tar (只能指定一种架构, 否则不支持 type=docker)
$ docker buildx build --platform linux/arm64 -t gomyck/ck:v1.1.0-3.9.20 -t gomyck/ck:latest . --output type=docker,dest=img-arm64.tar

# 打包并上传到 hub
$ docker buildx build --platform linux/amd64,linux/arm64 -t gomyck/ck:v1.1.0-3.9.20 -t  gomyck/ck:latest . --push
```

## 参考

**linux/amd64 和 linux/arm/v7 的区别是什么？**

> v7 是 arm32v7 的简写，是 arm32 架构的 32 位系统，而 arm64 是 arm64 架构的 64 位系统。是从 v8 开始支持的 64 位指令集, 也就是说  arm64 = arm64/v8

## buildx 遇到的问题

org.sonatype.nexus.repository.docker.internal.V2Handlers - Error: PUT /v2/hylink/dolphinscheduler-api/manifests/3.2.2
java.lang.NullPointerException: Cannot get property 'digest' on null object

由于新版本的 buildx 使用了新的标准

https://docs.docker.net.cn/reference/cli/docker/buildx/build/#provenance

构建之后, 在老版本的 registry 服务器上会报错, 可以使用 --provenance=false 参数来关闭 provenance 功能
