---
layout: post
title:  "一招让你 MAC idea springboot 项目启动快 10 倍"
crawlertitle: "一招让你 MAC idea springboot 项目启动快 10 倍"
subtitle: "IDEA SPRINGBOOT"
ext: "IDEA SPRINGBOOT JAVA MAC"
date:  2021-01-23
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['工具', '原创']
musicUri: 31477363
musicTitle: Look Back
musicFrom: Tone Damli Aaberge
author: gomyck
openPay: true
---

看了这篇文章, 治好了我多年的 IDEA 老寒腿

### 问题

MAC IDEA 启动 springboot 项目龟速

### 原因

hosts 中没有本地环路配置, 所以 spring 要检查好久, 导致启动慢

### 解决

1. 在 terminal 中输入:

```shell
$ hostname
# mzxc-mac.local
```

2. 编辑 hosts 文件, 输入下述字符串

```shell
$ vim /etc/hosts

127.0.0.1           localhost
::1                 localhost
fe80::1%lo0			localhost

127.0.0.1           mzxc-mac.local
::1                 mzxc-mac.local
fe80::1%lo0			mzxc-mac.local

```

**保存即可生效, 速度飞起**
