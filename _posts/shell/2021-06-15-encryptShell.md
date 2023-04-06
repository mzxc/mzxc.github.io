---
layout: post
title:  "SHELL 脚本加密"
crawlertitle: "SHELL 脚本加密"
subtitle: "SHELL ENCRYPT SH SHC"
ext: "SH SHELL"
date:  2021-06-15
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['LINUX', '原创']
musicUri: 1491156317
musicTitle: What Lovers Do
musicFrom: Maroon 5
author: gomyck
openPay: true
---

把你的 shell 脚本变得更安全

### 起因

因为要在 shell 脚本中加入一些密码等敏感信息, 所以需要把脚本加密后放在服务器中

### 方法

我查过资料, 解决方案有几种, 但是个人认为最好的解决方案是 shc (其他方案有 gzexe, 这个东西可以被解压缩, 不好用)

shc 虽然也可以被解密, 但是成本相对来说高很多

### 解决

```shell
$ yum install shc
$ cd [path to your shell]
$ shc -r -f filename
```

**-r 是生成一个发布版本的脚本文件, 如果不加 -r, 那么生成的加密后文件不能放到别的机器上执行**

-f 是文件名称

**执行之后会生成两个文件:**
>.x    加密后文件
>.x.c  生成前的 c 文件

我们保存好源文件, 以后只需要使用.x 后缀的文件就可以了, 很方便
