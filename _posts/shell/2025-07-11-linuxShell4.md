---
layout: post
title:  "Linux command archived iv"
crawlertitle: "Linux command archived iv"
subtitle: "Linux Shell"
ext: "shell"
date:  2025-07-11
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

## 间接变量引用

```shell
$ varname="HOME"
$ echo "${!varname}"   # 输出 $HOME 的值
```

## 从文件中读取变量值

`````shell
$ val="$(< /path/to/file)"  # 等价于 val=$(cat /path/to/file) 但更快
`````

## 参数展开

```shell
# 默认值
$ echo "${VAR:-default}"     # 如果 VAR 为空，则用 default
# 必须有值
$ echo "${VAR:?必须设置 VAR}"  # 如果 VAR 没设置，退出并报错
# 前缀删除
$ file="/path/to/file.txt"
$ echo "${file##*/}"         # 输出 file.txt（去掉最长前缀）
$ echo "${file#*/}"          # 输出 path/to/file.txt（去掉最短前缀）
# 后缀删除
$ echo "${file%.txt}"        # 输出 /path/to/file（去掉后缀）
# 替换
$ text="abc123abc456"
$ echo "${text/abc/XXX}"     # 只替换第一个 abc
$ echo "${text//abc/XXX}"    # 替换所有 abc
# 字符串长度
$ echo "${#file}"            # 输出字符串长度
```

## 数组操作

```shell
arr=(a b c)
echo "${arr[0]}"         # a
echo "${arr[@]}"         # a b c
echo "${#arr[@]}"        # 3
```

## 多行读取

```shell
while read -r line; do
  echo "line: $line"
done < /path/to/file
```
