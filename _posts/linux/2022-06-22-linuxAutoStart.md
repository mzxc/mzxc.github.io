---
layout: post
title:  "Linux开机自启设置"
crawlertitle: "Linux开机自启设置"
subtitle: "linux init.d"
ext: " rc.local chkconfig"
date:  2022-06-22
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['SERVER', '原创']
musicUri: 1893400815
musicTitle: Sail Away
musicFrom: Teminite
author: gomyck
openPay: true
---

有道笔记迁移

### /etc/init.d 为linux的软连接目录, 可以理解为可执行文件的快捷方式存放目录

**chkconfig 参数用法:**

```text
--add 　增加所指定的系统服务, 让chkconfig指令得以管理它, 并同时在系统启动的叙述文件内增加相关数据.
--del 　删除所指定的系统服务, 不再由chkconfig指令管理, 并同时在系统启动的叙述文件内删除相关数据.
--level <等级代号> 指定读系统服务要在哪一个执行等级中开启或关毕.

等级 0 表示: 表示关机
等级 1 表示: 单用户模式
等级 2 表示: 无网络连接的多用户命令行模式
等级 3 表示: 有网络连接的多用户命令行模式
等级 4 表示: 不可用
等级 5 表示: 带图形界面的多用户模式
等级 6 表示: 重新启动
```

**第一种方式:  把启动程序的 命令 添加到 /etc/rc.d/rc.local 文件中**

```shell
#!/bin/sh
#
# This script will be executed *after* all the other init scripts.
# You can put your own initialization stuff in here if you don't
# want to do the full Sys V style init stuff.
touch /var/lock/subsys/local

# 添加自动执行的脚本命令
sh /usr/share/gomyck/xxx/ck.sh pro
```

**第二种方式:  把写好的启动脚本添加到目录/etc/rc.d/init.d/, 然后使用命令chkconfig设置开机启动.**

**在脚本的头加入**

```text
# chkconfig: 2345 10 90
# description: gomyck service ....

2345 是启动级别, 参考上面的级别说明

10是启动优先级, 90是停止优先级, 优先级范围是0－100, 数字越大, 优先级越低
```

### 注意 如果想依赖环境变量, 必须加 source /etc/profile 在脚本的开始, 不然引用有问题!

```shell
#将mysql启动脚本放入所有脚本运行目录/etc/rc.d/init.d中
$ cp /usr/share/gomyck/xxx/ck.sh /etc/rc.d/init.d/ck.sh
$ chown root.root /etc/rc.d/init.d/ck.sh
$ chmod +x /etc/rc.d/init.d/ck.sh
$ chkconfig --add ck.sh
```

#查看全部服务在各运行级状态
chkconfig --list ck.sh

#只要运行级别3启动, 其他都关闭
chkconfig --levels 245 ck.sh off




