---
layout: post
title:  "Linux 包管理器"
crawlertitle: "Linux 包管理器"
subtitle: "LINUX YUM APT-GET RPM DPKG TAR"
ext: ""
date:  2019-12-12
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['LINUX', '原创']
musicUri: 29710981
musicTitle: 喜剧之王
musicFrom: 李荣浩
author: gomyck
openPay: true
---

总结分析各种包管理器相互之间的关联, 区别

### rpm & yum

> rpm 是红帽系列的操作系统默认的包管理器, 可以方便的查询,安装,卸载,升级软件包, 但是 rpm 只能单一安装某个软件包, 需要用户自行解决软件包依赖问题
> .rpm 是一种软件包类型, 可以使用 rpm 或 yum 包管理器安装维护

> yum 是基于 rpm 的包管理软件, 可以拟补 rpm 的不足(不能自动解决依赖), 以及可以联网进行软件的安装维护

### dpkg & apt-get

> dpkg 是 Debian 的默认包管理器, 与 rpm 功能相似
> .deb 是一种软件包类型, 可以使用 apt-get 或 dpkg 包管理器安装维护

> apt-get 与 yum 类似, 可以自动解决包依赖问题, 以及可以联网进行软件的安装维护

### tar

> tar 是一种文件格式, 一般来说, tar 类型的软件包, 安装步骤都是: 解压, ./configure, make, make install