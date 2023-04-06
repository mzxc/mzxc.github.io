---
layout: post
title:  "docker 相关标准"
crawlertitle: "docker 相关标准"
subtitle: "docker k8s"
ext:
date:  2023-03-03
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['docker', 'server', '云原生']
musicUri: 532776436
musicTitle: 猎户星座
musicFrom: 朴树
author: gomyck
---

Dockerfile 标准：Dockerfile 是用于定义 Docker 容器构建过程的文本文件。它包括一系列指令，用于指定从哪个基础镜像开始、如何安装依赖、如何配置环境等步骤。

Docker Image 标准：Docker 镜像是容器的模板，它包括操作系统、应用程序和依赖项等。Docker 官方维护了一个 Docker Registry，提供了大量的官方和社区贡献的 Docker 镜像。

Docker Container 标准：Docker 容器是 Docker 镜像的运行实例，它包括一个独立的文件系统、网络和进程空间。Docker 容器可以被启动、停止、删除和暂停等操作。

Docker Compose 标准：Docker Compose 是一个用于定义和运行多个 Docker 容器的工具，它使用 YAML 文件来配置应用程序的服务、网络和卷等。

Docker API 标准：Docker 提供了一组 RESTful API，用于管理 Docker 容器、镜像和网络等资源。通过这些 API，可以对 Docker 进行远程管理和监控。

OCI 标准：OCI（Open Container Initiative）是一个开放标准组织，它致力于定义容器的标准化规范。Docker 是 OCI 标准的一部分，因此 Docker 和其他 OCI 实现可以互相兼容。

CNI 标准：CNI（Container Network Interface）是一个开放标准组织，它定义了容器网络的标准化规范。Docker 支持 CNI 插件，因此可以使用各种第三方网络插件来扩展 Docker 网络功能。

CRI 是 Kubernetes 提出的容器运行时接口规范，它定义了 Kubernetes 和容器运行时之间的接口。通过 CRI，Kubernetes 可以与各种容器运行时（如 Docker、containerd 等）交互，并统一容器的生命周期管理。

CSI 是 Kubernetes 提出的容器存储接口规范，它定义了 Kubernetes 和存储插件之间的接口。通过 CSI，Kubernetes 可以与各种存储插件交互，并统一容器的存储管理。

CRI 和 CSI 的提出，让 Kubernetes 的容器管理功能变得更加灵活和可扩展。同时，它们也促进了容器技术的标准化和生态发展。
