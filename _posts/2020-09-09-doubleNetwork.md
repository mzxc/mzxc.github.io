---
layout: post
title:  "CentOS 双网卡实战"
crawlertitle: "CentOS 双网卡实战"
subtitle: "BROADCAST NETWORK"
ext: "双网卡"
date:  2020-09-09
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['LINUX', '原创']
musicUri: 1408220694
musicTitle: 最甜情歌
musicFrom: 红人馆
author: gomyck
openPay: true
---

项目需要, 配置服务器双网卡互联互通

### 1.服务器环境
虚拟机: vSphere Client 6.0.0
服务器系统: CentOS

### 2.网卡配置

**公网访问网卡配置**
```text
TYPE=Ethernet
BOOTPROTO=static
PROXY_METHOD=none
BROWSER_ONLY=no
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=eth1
UUID=88b429d8-1d58-461c-bb8f-37d8245b8925
DEVICE=ifcfg-eth1
ONBOOT=yes
#可以上网的网段 IP
IPADDR=
#网关
GATEWAY=xxx.xxx.xxx.1
#广播地址
BORADCAST=xxx.xxx.xxx.255
#掩码
NETMASK=255.255.255.0
#网卡对应的网络地址
NETWORK=188.188.181.0
PRRDND=yes
DNS1=8.8.8.8
#必须要配置, 这个 MAC 地址是在虚拟机配置上找到
HWADDR=00:0C:29:03:72:1F
# 防火墙域
ZONE=public
```

**内网访问网卡配置**
```text
TYPE=Ethernet
BOOTPROTO=static
DEFROUTE=yes
PEERROUTES=yes
IPV4_FAILURE_FATAL=yes
IPV6INIT=no
NAME=eth2
UUID=83fbf9d2-5cfa-4508-a287-3312eb82e1ed
DEVICE=ifcfg-eth2
PREFIX=24
PEERDNS=yes
ONBOOT=yes
# 内网网段地址
IPADDR=
# 内网广播地址
BROADCAST=xxx.xxx.xxx.255
DNS1=8.8.8.8
# 掩码
NETMASK=255.255.255.0
# 网关一定要注释掉
#GATEWAY=188.188.2.1
# 网卡 MAC  在虚拟机配置上找到
HWADDR=00:0C:29:03:72:15
ZONE=public
```

### 3.一点问题

这种配置, 在使用 shell 重启网卡时 ( service network restart ), 会报错, 需要重启服务器才会生效
