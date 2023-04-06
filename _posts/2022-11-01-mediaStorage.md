---
layout: post
title:  "计算机中存储介质的最小单元"
crawlertitle: "计算机中存储介质的最小单元"
subtitle: "Linux FS DISK KAFKA"
ext: "跳表  跳跃链表"
date:  2022-11-01
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['LINUX', '原创']
musicUri: 28258626
musicTitle: 返场精粹 4
musicFrom: 郭德纲
author: gomyck
openPay: true
---

列举一些常用软件以及操作系统的最小存储单元

disk:
```text
磁盘: 最小单元是扇区，大小为512字节
```

windows文件系统
```text
XFS/EXT4/FAT/NTFS/ExFAT: 最小单元是 块(block) 也是 簇(cluster)，一般是8个扇区为1簇，大小为4kb
```

Linux文件系统
```text
Linux系统文件是由多个block块组成，1个block块通常是4kb，1block=8个扇区，所以说Linux存取文件的最小单位是块。
```
Mysql InnoDB存储引擎
```text
最小单元是页，大小为16kb（默认，可以更改）, InnoDB中的指针大小：6字节
```

CPU
```text
CPU 高速缓存：最小单元是缓存行，大小一般为64byte (64 位操作系统)

CPU L1，L2，L3的缓存行大小通常保持一致，L1是L2的子集，L2是L3的子集，L1 分为指令缓存和数据缓存，核心独占，
L2也是核心独占，L3为CPU独占，内存为插槽的所有cpu共享
```

Kafka
```text
kafka本身使用稀疏索引, 这种索引本身具有有序性, 类似于跳表, 属于抽象范围索引, 单个的 kafka topic partition 中,
消息会被切成数个分段(segment), 扩展名为 log, log 的切分依据为: log.segment.bytes (默认1G) 和时间参数: log.roll.hours (7days)

log的文件名就是 offset 的值, 表示上一个文件的最后一条消息的 offset, 也是当前文件第一条消息的 offset - 1

每个 log 文件都会配备两个索引文件: index 和 timeindex, 对应偏移量和时间戳索引, 均为稀疏索引

~ kafka-run-class kafka.tools.DumpLogSegments --files /data4/kafka/data/ods_analytics_access_log-3/00000000000197971543.index
Dumping /data4/kafka/data/ods_analytics_access_log-3/00000000000197971543.index
offset: 197971551 position: 5207
offset: 197971558 position: 9927
offset: 197971565 position: 14624
offset: 197971572 position: 19338
offset: 197971578 position: 23509
offset: 197971585 position: 28392
offset: 197971592 position: 33174
offset: 197971599 position: 38036
offset: 197971606 position: 42732
......

~ kafka-run-class kafka.tools.DumpLogSegments --files /data4/kafka/data/ods_analytics_access_log-3/00000000000197971543.timeindex
Dumping /data4/kafka/data/ods_analytics_access_log-3/00000000000197971543.timeindex
timestamp: 1593230317565 offset: 197971551
timestamp: 1593230317642 offset: 197971558
timestamp: 1593230317979 offset: 197971564
timestamp: 1593230318346 offset: 197971572
timestamp: 1593230318558 offset: 197971578
timestamp: 1593230318579 offset: 197971582
timestamp: 1593230318765 offset: 197971592
timestamp: 1593230319117 offset: 197971599
timestamp: 1593230319442 offset: 197971606
......

```

![image](/img/in-post/res2022-11-01/2022-11-01-000.png)






**关于跳表: https://www.cnblogs.com/Laymen/p/14084664.html**
