---
layout: post
title:  "Linux GUI 安装"
crawlertitle: "Linux GUI 安装"
subtitle: "remote desktop linux xfce"
ext:
date:  2024-10-15
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

为 linux 安装GUI, 并使用 rdp 协议连接

# 安装

## redhat 系列系统

```shell
# 安装 epel
$ yum install -y epel-release

# 安装 xfce, XFCE 是一个轻量级的桌面环境，适合资源较少的系统。
$ sudo yum -y groupinstall "Xfce"

# 安装显示管理器
$ sudo yum install -y gdm
$ sudo systemctl start gdm

# 如果默认启动就激活GUI, 那么运行下面的命令
$ sudo systemctl enable gdm
$ sudo systemctl set-default graphical.target

# 永久切换命令行
$ sudo systemctl set-default multi-user.target

# 手动启动 GUI
$ sudo systemctl start graphical.target
# 手动切换命令行
$ sudo systemctl isolate multi-user.target

# 安装 xrdp
$ sudo yum -y install xrdp
# 启动 xrdp
$ sudo systemctl start xrdp
# 开机启动
$ sudo systemctl enable xrdp
# 添加防火墙
$ sudo firewall-cmd --permanent --add-port=3389/tcp
$ sudo firewall-cmd --reload
```

## debian 系列系统

```shell
#!/bin/bash
# Ubuntu Desktop 一键安装 xrdp + Xfce（稳定远程桌面）

set -e

echo "==== 更新系统并安装必要软件 ===="
sudo apt update
sudo apt install -y xrdp xfce4 xfce4-goodies xorgxrdp dbus-x11

echo "==== 禁用 Wayland ===="
sudo sed -i 's/^#WaylandEnable=.*/WaylandEnable=false/' /etc/gdm3/custom.conf

echo "==== 配置当前用户使用 Xfce 会话 ===="
echo "startxfce4" > ~/.xsession
chmod +x ~/.xsession

echo "==== 修复权限问题 ===="
sudo chown $USER:$USER ~/.Xauthority
chmod 600 ~/.Xauthority

echo "==== 重启 xrdp 服务 ===="
sudo systemctl enable xrdp --now
sudo systemctl restart xrdp

echo "==== 清理残留锁文件 ===="
sudo rm -rf /tmp/.X*-lock
sudo rm -rf /tmp/.xrdp*

echo "==== 配置完成 ===="
echo "请使用 Windows RDP 或其他 RDP 客户端，用户名：$USER，密码：你的系统密码"
echo "请在登录时选择 Xorg 会话。"
```

## 问题

1. 如果 RDP 连接闪退, 一般是因为用户在其他客户端登陆了, 把其他客户端注销之后就可以登陆了
