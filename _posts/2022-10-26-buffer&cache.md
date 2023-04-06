---
layout: post
title:  "Buffer/Cache 过高问题排查解决"
crawlertitle: "Buffer/Cache 过高问题排查解决"
subtitle: "Linux IO"
ext: ""
date:  2022-10-26
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['LINUX', '原创']
musicUri: 1969039800
musicTitle: 如果的事 (男声版)
musicFrom: Terry Zhong 钟天利
author: gomyck
openPay: true
---

过高的inactive mem 会导致进程在申请内存时失败, 通过对Buffer/Cache的分析, 找到最终的问题所在

### 场景还原

4C 16G 虚拟机, CentOS Linux release 7.4.1708

```text
       total        used        free      shared  buff/cache   available
Mem:     15G        5.4G         94M        4.1G         10G        6.0G
Swap:   7.9G        1.1G        6.7G
```

上面的指标不代表常态, 有时 available 会非常的低, 导致申请内存失败, free 一直保持低可用

CPU 指标时不时会打满

### Buffer Cache

```text
在Linux 2.4的内存管理中，buffer指Linux内存的：Buffer cache。cache指Linux内存中的：Page cache。一般呢，是这么解释两者的。

A buffer is someting that has yet to be ‘written’ to disk.

A cache is someting that has been ‘read’ from the disk and stored for later use.
```

```text
在Linux 2.6之后Linux将他们统一合并到了Page cache作为文件层的缓存。而buffer则被用作block层的缓存。

block层的缓存是什么意思呢，你可以认为一个buffer是一个physical disk block在内存的代表，用来将内存
中的pages映射为disk blocks，这部分被使用的内存被叫做buffer

buffer里面的pages，指的是Page cache中的pages，所以，buffer也可以被认为Page cache的一部分。

cache 只会缓存文件的读写, 磁盘的读写用 buffer (文件系统和磁盘 块设备)
```

**buffer/cache 是应对大量写或者碎片写而使用的缓冲区, buffer主要用来标记, 实际上写的区域还是 cache 里的 pages , 只不过 buffer 记录了哪些 pages 被修改了, 这样在系统回写的时候能提高效率**

**buffer/cache 是为了快速命中, 快速读取数据而使用的加速区, 热点数据会被存放于此**

### 问题排查

网上搜索内存高排查帖子, 基本上都是先阐述 Buffer/Cache 的原理, 然后使用 hcache 来查看占用内存较高的进程, 运行次命令

```text
+---------------------------------------------+----------------+
| Name     | Size (bytes)   | Pages      | Cached    | Percent |
|---------------------------------------------+----------------+
| xxxxxx1  | 35626720       | 8698       | 8698      | 100.000 |
| xxxxxx2  | 100370728      | 24505      | 5810      | 023.709 |
| xxxxxx3  | 17487040       | 4270       | 4270      | 100.000 |
| xxxxxx4  | 8134992        | 1987       | 1987      | 100.000 |
| xxxxxx5  | 21017520       | 5132       | 1057      | 020.596 |
| xxxxxx6  | 3135672        | 766        | 766       | 100.000 |
| xxxxxx7  | 2542252        | 621        | 621       | 100.000 |
| xxxxxx8  | 2512448        | 614        | 614       | 100.000 |
| xxxxxx9  | 2436488        | 595        | 590       | 099.160 |
| xxxxxx10 | 2358960        | 576        | 576       | 100.000 |
+---------------------------------------------+----------------+
```

可以看到, 占用 cached 最高的为: xxxxxx1 这个可执行文件进程, 而占用大小才 30 多 MB, 说明不是 cache 被大量占用, 而是 buffer 被大量占用, 而且没有得到释放, 说明系统存大大量的写操作

使用 top 监听系统状态, vmstat 监听虚拟内存使用状态, 这两个工具虽然能监听, 但很难去直观排查出是哪个进程导致大量写

```shell
$ top

$ vmstat 1 100
```

**通过命令清除缓冲区内存占用:**

```shell
#1. 表示清除pagecache
$ echo 1 > /proc/sys/vm/drop_caches
#2. 表示清除回收slab分配器中的对象（包括目录项缓存和inode缓存）
$ echo 2 > /proc/sys/vm/drop_caches
#3. 表示清除pagecache和slab分配器中的缓存对象
$ echo 3 > /proc/sys/vm/drop_caches
```

使用 iotop 来监听 IO 情况

```shell
$ iostat -oP >> iolog.log
```

通过指标监测工具, 实时检测系统指标, 待 buffer 再次升高时, 分析日志, 看到有个数据库备份, 写入速度最大达到 25MB/S

该命令是通过 crontab 来定时执行, 每次会生成大概 7 个 G 的备份文件, 从而导致 cpu 飙升以及内存占用飙升

而且非常奇葩的是, 该任务每分钟执行一次, 非常的无语, 至此问题得到解决

### 其他的小知识

**《全国人民代表大会和地方各级人民代表大会选举法》第二条规定：**

全国人民代表大会的代表，省、自治区、直辖市、设区的市、自治州的人民代表大会的代表，由下一级人民代表大会选举。

《全国人民代表大会和地方各级人民代表大会选举法》第二十九条规定：全国和地方各级人民代表大会的代表候选人，按选区或者选举单位提名产生。

各政党、各人民团体，可以联合或者单独推荐代表候选人。选民或者代表，十人以上联名，也可以推荐代表候选人。 推荐者应向选举委员会或者大会主席团介绍候选人的情况。
