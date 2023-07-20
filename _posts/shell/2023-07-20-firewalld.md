---
layout: post
title:  "Linux 防火墙"
crawlertitle: "Linux 防火墙"
subtitle: "Linux Firewalld Iptables shell"
ext: ""
date:  2023-07-20
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['LINUX', '原创']
musicUri: 1816907590
musicTitle: You and I
musicFrom: Will Armex
author: gomyck
openPay: true
---

# Linux 防火墙使用案例

```shell
# 查看防火墙状态
$ firewall-cmd --zone=internal --query-target

$ firewall-cmd --zone=internal --list-all

$ firewall-cmd --list-all-zones

# rule <rule-options> [action <action-options>]
# <rule-options> 是规则的条件部分，用于指定匹配规则的条件，例如源 IP、目标 IP、端口、协议等。
# <action-options> 是规则的动作部分，用于指定规则匹配时所执行的动作，例如接受、拒绝、重定向等。

# <rule-options>
# family=<ipv4|ipv6>：指定规则的 IP 版本，可以是 IPv4 或 IPv6。
# source address=<address>：指定源 IP 地址。
# destination address=<address>：指定目标 IP 地址。
# source port=<port>：指定源端口。
# destination port=<port>：指定目标端口。
# protocol=<protocol>：指定协议，如 tcp、udp、icmp 等。

# <action-options>
# accept：接受匹配的流量。
# reject：拒绝匹配的流量。
# drop：丢弃匹配的流量。
# redirect to-port=<port>：将匹配的流量重定向到指定的端口。

$ firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="192.168.99.99" port port="5432" protocol="tcp" accept'
$ firewall-cmd --permanent --remove-rich-rule='rule family="ipv4" source address="192.168.99.99" port port="5432" protocol="tcp" accept'

# 添加信任区域
$ firewall-cmd --zone=trusted --permanent --add-source=172.17.0.1/16
#删除信任区域
$ firewall-cmd --zone=trusted --permanent --remove-source=172.17.0.1/16

# 添加端口
$ firewall-cmd --zone=public --permanent --add-port=80/tcp
# 删除端口
$ firewall-cmd --zone=public --permanent --remove-port=80/tcp

# 添加服务
$ firewall-cmd --zone=public --permanent --add-service=http
# 删除服务
$ firewall-cmd --zone=public --permanent --remove-service=http

# 当前运行规则永久生效
$ firewall-cmd --runtime-to-permanent
# 重启防火墙
$ firewall-cmd --reload

# 查看防火墙状态
$ firewall-cmd --state
# 查看防火墙版本
$ firewall-cmd --version
```
