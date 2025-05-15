---
layout: post
title:  "docker buildx 的的内置变量"
crawlertitle: "docker buildx 的的内置变量"
subtitle: "docker build buildx"
ext: ""
date:  2025-05-15
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

在构建多平台镜像时, 如果从本地复制到容器的文件, 区分指令集, 那么可以使用以下方法来根据不同平台的指令集进行区分

```dockerfile
FROM ubuntu:22.04

LABEL maintainer="gomyck"

ARG TARGETARCH
COPY mongo_tools/mongodump_${TARGETARCH} /usr/local/bin/mongodump

```

这些变量是 Docker BuildKit 和 buildx 自动注入的，无需定义 ARG，直接可以 ARG 使用。

| 内置变量             | 说明                         | 示例值                     |
| ---------------- | -------------------------- | ----------------------- |
| `TARGETARCH`     | 构建目标的 CPU 架构               | `amd64`, `arm64`, `arm` |
| `TARGETOS`       | 构建目标的操作系统                  | `linux`, `windows`      |
| `TARGETVARIANT`  | 架构变种（如 `v7`、`v8`，主要用于 ARM） | `v7`, `v8`              |
| `BUILDPLATFORM`  | 当前构建机的平台（build host）       | `linux/amd64`           |
| `TARGETPLATFORM` | 构建目标平台（buildx 设置的平台）       | `linux/arm64`           |
