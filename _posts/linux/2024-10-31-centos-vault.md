---
layout: post
title:  "Centos 安装过时的仓库"
crawlertitle: "Centos 安装过时的仓库"
subtitle: "vault linux centos"
ext:
date:  2024-10-31
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['SERVER', '原创']
musicUri: 1392990601
musicTitle: 我和我的祖国
musicFrom: 王菲
author: gomyck
openPay: true
---

centos 8 以前的版本 yum 仓库都已经停止维护了, 官方的镜像源也已经下线, 需要配置 vault 仓库来支持 yum 的使用

```ini
# CentOS-Base.repo
#
# The mirror system uses the connecting IP address of the client and the
# update status of each mirror to pick mirrors that are updated to and
# geographically close to the client.  You should use this for CentOS updates
# unless you are manually picking other mirrors.
#
# If the mirrorlist= does not work for you, as a fall back you can try the
# remarked out baseurl= line instead.
#
#

[base]
name=CentOS-7.9.2009 - Base - mirrors.aliyun.com
failovermethod=priority
baseurl=https://vault.centos.org/7.9.2009/os/$basearch/
gpgcheck=1
gpgkey=https://vault.centos.org/RPM-GPG-KEY-CentOS-7

#released updates
[updates]
name=CentOS-7.9.2009 - Updates - mirrors.aliyun.com
failovermethod=priority
baseurl=https://vault.centos.org/7.9.2009/updates/$basearch/
gpgcheck=1
gpgkey=https://vault.centos.org/RPM-GPG-KEY-CentOS-7

#additional packages that may be useful
[extras]
name=CentOS-7.9.2009 - Extras - mirrors.aliyun.com
failovermethod=priority
baseurl=https://vault.centos.org/7.9.2009/extras/$basearch/
gpgcheck=1
gpgkey=https://vault.centos.org/RPM-GPG-KEY-CentOS-7

#additional packages that extend functionality of existing packages
[centosplus]
name=CentOS-7.9.2009 - Plus - mirrors.aliyun.com
failovermethod=priority
baseurl=https://vault.centos.org/7.9.2009/centosplus/$basearch/
gpgcheck=1
enabled=0
gpgkey=https://vault.centos.org/RPM-GPG-KEY-CentOS-7
```

## 具体操作

1.去阿里云镜像仓库下载 yum 配置文件
2.运行命令
```shell
$ sed -i.bak -e "s|http://mirrors.aliyun.com/centos/|https://vault.centos.org/|g" CentOS-Base.repo
$ sed -i.bak -e "s|\$releasever|7.9.2009|g" CentOS-Base.repo
```

