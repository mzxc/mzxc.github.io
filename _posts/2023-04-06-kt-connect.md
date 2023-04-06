---
layout: post
title:  "本地开发环境与k8s 集群混合开发方案"
crawlertitle: "本地开发环境与k8s 集群混合开发方案"
subtitle: "K8S KT ALI "
ext: ""
date:  2023-04-06
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['CLOUD NATIVE', '原创']
musicUri: 506339107
musicTitle: Bing Bing
musicFrom: Crayon Pop
author: gomyck
openPay: true
---

使用 kt-connect , 建立本地与私有云之间的多样性网络环境

## kt-connect 的一些特性

* Connect：建立数据代理通道，实现本地服务直接访问Kubernetes集群内网（包括Pod IP和Service域名）
* Exchange：让集群服务流量重定向到本地，实现快速验证本地版本和调试排查问题
* Mesh：创建路由规则重定向特定流量，实现多人协作场景下互不影响的本地调试
* Preview：暴露本地服务到集群，实现无需发布即可在线预览集成效果


## 一. 安装 kt-connect

### MacOS:

1. 运行以下脚本
```shell
# 版本过低 就去 github 查看最新版本
$ curl -OL https://github.com/alibaba/kt-connect/releases/download/v0.3.7/ktctl_0.3.7_MacOS_x86_64.tar.gz
$ tar zxf ktctl_0.3.7_MacOS_x86_64.tar.gz
$ mv ktctl /usr/local/bin/ktctl
$ ktctl --version
```

2. 将 kubeConfig 文件放到 ~/kt 下 (kubeConfig 文件必须要有访问权限)

### Windows:

1. 访问 https://github.com/alibaba/kt-connect/releases/download/v0.3.7/ktctl_0.3.7_Windows_x86_64.zip
2. 下载并解压，将包中的 wintun.dll 和可执行文件 ktctl.exe 一起放到 D 盘的 kt 文件夹下 (可以自定义位置, 但后面配置的 PATH 路径也要做对应的更改)
3. 将 kubeconfig_yyyf.yaml 文件也放到 D 盘的 kt 文件夹下
4. 配置 windows 环境变量 PATH, 加入 D:\kt

## 二. 运行 kt-connect

MacOS:

```shell
$ sudo ktctl connect -n qingzhi --excludeIps 192.168.0.0/16 -c /Users/gomyck/Desktop/kubeConfig.yaml
```

Windows:
```shell
# 使用管理员权限打开 cmd
$ ktctl connect -n yyyf-public -c D:\kt\kubeconfig_yyyf.yaml
```

**如果命令行工具打印了**

```text
12:27PM INF ---------------------------------------------------------------
12:27PM INF  All looks good, now you can access to resources in the kubernetes cluster
12:27PM INF ---------------------------------------------------------------
```

**说明代理启动成功, 此时本地服务即可访问 k8s 内部服务了**
