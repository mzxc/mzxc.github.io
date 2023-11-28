---
layout: post
title:  "利用 linux 内置软件 logrotate 实现等保要求的日志管理"
crawlertitle: "利用 linux 内置软件 logrotate 实现等保要求的日志管理"
subtitle: "Linux LOG LOGROTATE SHELL"
ext: ""
date:  2023-11-28
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['LINUX', '转载']
musicUri: 28258623
musicTitle: 返场精粹 1
musicFrom: 郭德纲
author: gomyck
openPay: true
---

linux 类操作系统内置了日志切片软件: logrotate,  本文介绍了如何使用 logrotate, 以及实际应用的案例配置

logrotate 的配置文件在 /etc/logrotate.conf  以及  /etc/logrotate.d/

其中 /etc/logrotate.conf 是主控配置, /etc/logrotate.d/ 文件夹下存储的是不同类型日志的切割配置

使用下面的配置可保证: 每天生成一个切片, 保留 180 天, 切片格式为: xx.log-20231127.gz, 切片自动归档到指定目录

## /etc/logrotate.conf

文件里不可以有注释!!!!!使用时把注释去掉!!!

```text  
rotate 7                   # 保留7个旧日志文件
daily                      # 每天生成一个新的日志文件
create                     # 创建新的空日志文件
compress                   # 压缩旧的日志文件
delaycompress              # 延迟压缩, 方便查看
missingok                  # 不存在则忽略
notifempty                 # 空文件不执行任何操作
include /etc/logrotate.d/  # 包含其他配置文件
```

## /etc/logrotate.d/xx

文件里不可以有注释!!!!!使用时把注释去掉!!!

```text
/home/log/xx/xx.log {
    rotate 180
    daily
    missingok
    notifempty
    compress
    create 0644 root root
    lastaction
        if [ ! -d /home/log/xx/back_up ]; then
            mkdir -p /home/log/xx/back_up
        fi
        if [ -f /home/log/xx/xx.log-*.gz ]; then
            mv /home/log/xx/xx.log-*.gz /home/log/xx/back_up/
        fi
        find /home/log/xx/back_up/ -type f -mtime +180 -delete
    endscript
}
```

## 测试脚本

```shell
# 窗口 1 执行
$ mkdir -p /home/log/xx
$ cd /home/log/xx
$ touch xx.log

# 窗口 2 执行
$ while true; do if [ -e "/home/log/xx/xx.log" ]; then echo 123 >> /home/log/xx/xx.log; else echo "File does not exist."; fi; sleep 1; done
```

## 手动执行切割(即可在/home/log/xx/ 看到日志备份)

```shell
$ logrotate -f /etc/logrotate.conf
```

### QA: 为什么我执行了logrotate -f /etc/logrotate.conf, 但是 back_up 文件夹里没有日志备份

A: logrotate 有延迟压缩的策略, 当天会压缩前一天的日志文件, 如此反复迭代, 所以手动执行后, 不会存在 gz 文件, 需要明天 logrotate 执行后才可以生成, 脚本里只备份了 .gz 结尾的文件, 所以手动执行后 back_up 文件夹里是不会有任何文件的

## nginx 配置文件

```text
/home/gomyck/log/nginx/*.log {
    rotate 180
    daily
    missingok
    notifempty
    compress
    create 0644 root root
    lastaction
        if [ ! -d /home/gomyck/log/nginx/back_up/ ]; then
            mkdir -p /home/gomyck/log/nginx/back_up/
        fi
        if [ -f /home/gomyck/log/nginx/*.log-*.gz ]; then
            mv /home/gomyck/log/nginx/access.log-*.gz /home/gomyck/log/nginx/back_up/
        fi
        find /home/gomyck/log/nginx/back_up/ -type f -mtime +180 -delete
    endscript
}
```
### 数据插入脚本
```shell
$ while true; do if [ -e "/home/gomyck/log/nginx/access.log" ]; then echo 123 >> /home/gomyck/log/nginx/access.log;echo 123 >> /home/gomyck/log/nginx/error.log; else echo "File does not exist."; fi; sleep 1; done
```





