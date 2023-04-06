---
layout: post
title:  "LINUX SHELL 打印的一些小技巧"
crawlertitle: "LINUX SHELL 打印的一些小技巧"
subtitle: "SHELL BASH LINUX"
ext: ""
date:  2023-03-01
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['SHELL', '原创']
musicUri: 439121048
musicTitle: Girls
musicFrom: Marcus & Martinus
author: gomyck
openPay: true
---

**不合理的需求:  ll 输出的文件名 按照空格分隔, 打印出来**

### awk 打印

```shell
$ ll | awk '{printf "%s ", $9}'
```

### while 循环打印
```shell
$ ll | awk '{print $9}' | while read line;do echo -n $line" ";done;echo
```

### tr 的使用
```shell
$ ll | awk '{print $9}' | tr '\n' ' '
```

### echo -n
```shell
$ ll | awk '{print $9}' | xargs echo -n
```

### 移动文件夹下的所有文件到指定文件夹
```shell
# grep 这种排除, 会把带有 xxx 的文件都排除, 它不是精确匹配
$ ls -1 | grep -v xxx | xargs -I {} mv {} ./minio/
# find 会查找所有文件, 但会排除 minio 这个文件, 它是精确匹配
$ find .  -name '*' -not -name 'minio' | xargs -I {} mv {} ./minio/
```
