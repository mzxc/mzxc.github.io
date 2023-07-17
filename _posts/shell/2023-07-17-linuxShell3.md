---
layout: post
title:  "Linux command archived iii"
crawlertitle: "Linux command archived iii"
subtitle: "Linux Shell"
ext: "指令集 复杂 精简 iptables watch dd awk"
date:  2023-07-17
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

linux shell 可用代码片段

### shell 引入文件

```shell
# 脚本库目录 /path/to/library/
# common_functions.sh
# useful_tools.sh

# 主脚本 main.sh
source /path/to/library/common_functions.sh
source /path/to/library/useful_tools.sh
```

### 提示框确认

```shell
echo "是否确认上述操作已完成? y/n"
read reply
case $reply in
  y* | Y*)
    echo "start init!";;
  n* | N*)
    exit 0;;
esac
```

### 帮助文档

```shell
### ======常用参数======
### -d  启动单机版 kafka
### -n  当前节点 ID
### -c  节点总数量
### -s  当前服务器 IP
### -a  激活的配置 test (公司内网), prod (生产内网)
###
### ======不常用参数======
### -k 仅启动 kafka (比如已经初始化 3 台 zk 和 kafka, 第四台服务器不需要 zk, 那么该参数可以仅启动 kafka)
### -i hub 地址, 配置该参数, hub 地址将不会受到激活的配置影响
### -e docker-compose 启动参数
###
### 单机版本: ./init.sh -d -s 服务器IP -a test
### 集群版本: ./init.sh -n 1 -c 3 -s 服务器IP -a test
###
### zookeeper 端口为: 2181   kfaka 端口为: 9092

help() {
    awk -F'### ' '/^###/ { print $2 }' "$0"
}

#set -euo pipefail # x:打印脚本  e:非零退出  u:除了$*和$@, 未定义变量引用既是错误 pipefail:命令失败的返回码作为管道返回码(默认是最后一条 shell)

set -x

if [[ $# == 0 ]] || [[ "$1" == "-h" ]]; then
      help
      exit 1
fi
```

### ip和域名校验

```shell
#!/bin/bash

# 输入字符串
string="www.xxx.comx1.xa"

# IP地址的正则表达式
ip_regex="^([0-9]{1,3}\.){3}[0-9]{1,3}$"

# 域名的正则表达式
domain_regex="^([a-zA-Z0-9]+\.){1,}[a-zA-Z]{2,}$"

# 判断是否为IP地址
if echo "$string" | grep -E -q "$ip_regex"; then
  echo "输入字符串是一个IP地址"
elif echo "$string" | grep -E -q "$domain_regex"; then
  echo "输入字符串是一个域名"
else
  echo "输入字符串既不是IP地址也不是域名"
fi
```

### 日志打印

```shell
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE="\033[34m"
PURPLE="\033[35m"
BOLD="\033[1m"
NC='\033[0m'

info(){
  if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "$GREEN$(date '+%Y/%m/%d %H:%M:%S') - [INFO] - $* $NC"
  else
    echo -e "$GREEN$(date '+%Y/%m/%d %H:%M:%S') - [INFO] - $* $NC"
  fi
}
error(){
  if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "$RED$(date '+%Y/%m/%d %H:%M:%S') - [ERROR] - $* $NC"
  else
    echo -e "$RED$(date '+%Y/%m/%d %H:%M:%S') - [ERROR] - $* $NC"
  fi
}
warn(){
  if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "$YELLOW$(date '+%Y/%m/%d %H:%M:%S') - [WARN] - $* $NC"
  else
    echo -e "$YELLOW$(date '+%Y/%m/%d %H:%M:%S') - [WARN] - $* $NC"
  fi
}

```
