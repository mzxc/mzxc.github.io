---
layout: post
title:  "JVM 运行时度量监测"
crawlertitle: "JVM 运行时度量监测"
subtitle: "java jvm"
ext: ""
date:  2022-11-15
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['JAVA', '原创']
musicUri: 1959667345
musicTitle: 给你一瓶魔法药水
musicFrom: 告五人
author: gomyck
openPay: true
---

使用 jdk 自带工具对 jvm 运行时进行状态分析

### 命令介绍

#### jps(Java Virtual Machine Process Status Tool)

jps -mlv 查看比较完整的进程信息  查看所有的jvm进程，包括进程ID，进程启动的路径等等。


#### jstack(Java Stack Trace)

① 观察jvm中当前所有线程的运行情况和线程当前状态。

② 系统崩溃了？如果java程序崩溃生成core文件，jstack工具可以用来获得core文件的java stack和native stack的信息，从而可以轻松地知道java程序是如何崩溃和在程序何处发生问题。

③ 系统hung住了？jstack工具还可以附属到正在运行的java程序中，看到当时运行的java程序的java stack和native stack的信息, 如果现在运行的java程序呈现hung的状态，jstack是非常有用的。

#### jstat(Java Virtual Machine Statistics Monitoring Tool)

① jstat利用JVM内建的指令对Java应用程序的资源和性能进行实时的命令行的监控，包括了对进程的classloader，compiler，gc情况；

②监视VM内存内的各种堆和非堆的大小及其内存使用量，以及加载类的数量。

#### jmap(Java Memory Map)

监视进程运行中的jvm物理内存的占用情况，该进程内存内，所有对象的情况，例如产生了哪些对象，对象数量；

#### jinfo(Java Configuration Info)

观察进程运行环境参数，包括Java System属性和JVM命令行参数

### 具体命令使用：

#### jmap

**参数**
```text
-dump:[live,]format=b,file=<filename> 使用hprof二进制形式,输出jvm的heap内容到文件=. live子选项是可选的，假如指定live选项,那么只输出活的对象到文件.

-finalizerinfo 打印正等候回收的对象的信息.

-heap 打印heap的概要信息，GC使用的算法，heap的配置及wise heap的使用情况.

-histo[:live] 打印每个class的实例数目,内存占用,类全名信息. VM的内部类名字开头会加上前缀”*”. 如果live子参数加上后,只统计活的对象数量.

-permstat 打印classload和jvm heap长久层的信息. 包含每个classloader的名字,活泼性,地址,父classloader和加载的class数量. 另外,内部String的数量和占用内存数也会打印出来.

-F 强迫.在pid没有相应的时候使用-dump或者-histo参数. 在这个模式下,live子参数无效.

-h | -help 打印辅助信息

-J 传递参数给jmap启动的jvm.

pid 需要被打印配相信息的java进程id

```

**-histo:**

```shell
$ jmap -histo  [pid]

#6577:             1             16  sun.util.calendar.Gregorian
#6578:             1             16  sun.util.calendar.JulianCalendar
#6579:             1             16  sun.util.locale.InternalLocaleBuilder$CaseInsensitiveChar
#6580:             1             16  sun.util.locale.provider.AuxLocaleProviderAdapter$NullProvider
#6581:             1             16  sun.util.locale.provider.CalendarDataUtility$CalendarWeekParameterGetter
#6582:             1             16  sun.util.locale.provider.SPILocaleProviderAdapter
#6583:             1             16  sun.util.locale.provider.TimeZoneNameUtility$TimeZoneNameGetter
#6584:             1             16  sun.util.resources.LocaleData
#6585:             1             16  sun.util.resources.LocaleData$LocaleDataResourceBundleControl
#Total       1560993       87695656
```

**-dump:**

#生成的文件可以使用jhat工具进行分析，在OOM（内存溢出）时，分析大对象，非常有用

```shell
$ jmap -dump:format=b,file=heapdump.hprof 1
```

**通过使用如下参数启动JVM，也可以获取到dump文件**

```text
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=./java_pid<pid>.hprof
```

**把输出的文件在浏览器中访问查看**

```shell
#执行成功后，访问http://localhost:7000即可查看内存信息。（首先把7000端口打开）
$ jhat data.hprof
```

#### jstat

**outputOptions**

```text
-class：统计类装载器的行为
-compiler：统计HotSpot Just-in-Time编译器的行为
-gc：统计堆各个分区的使用情况
-gccapacity：统计新生区，老年区，permanent区的heap容量情况
-gccause：统计最后一次gc和当前gc的原因
-gcnew：统计gc时，新生代的情况
-gcnewcapacity：统计新生代大小和空间
-gcold：统计老年代和永久代的行为
-gcoldcapacity：统计老年代大小
-gcpermcapacity：统计永久代大小
-gcutil：统计gc时，heap情况
-printcompilation：HotSpot编译方法统计
```

**-class：**
```shell
#每隔1秒监控一次，一共做10次
$ jstat -class [pid] 1000 10

#Loaded: 类加载数量  Bytes: 加载的大小（k）  Unloaded: 类卸载的数量  Bytes: 卸载的大小（k） Time: 时间花费在执行类加载和卸载操作

#Loaded         Bytes         Unloaded         Bytes         Time
#1697           3349.5         0                 0.0         1.79
#1697           3349.5         0                 0.0         1.79
#1697           3349.5         0                 0.0         1.79
#1697           3349.5         0                 0.0         1.79
```

**-compiler**

```shell
$ jstat -compiler [pid]

#Compiled     编译任务的执行次数
#Failed       编译任务的失败次数
#Invalid      编译任务无效的次数
#Time         编译任务花费的时间
#FailedType   最后一次编译错误的类型
#FailedMethod 最后一次编译错误的类名和方法
```

**-gc：**
```shell
#每隔2秒监控一次，共20次
$ jstat -gc [pid] 2000 20

#S0C S1C S0U S1U                 EC EU         OC                 OU PC         PU YGC         YGCT FGC FGCT         GCT
#8704.0 8704.0 805.5                 0.0                 69952.0         64174.5                 174784.0 2644.5                 16384.0 10426.7                 2 0.034                 0                 0.000 0.034
#8704.0 8704.0 805.5                 0.0                 69952.0         64174.5                 174784.0 2644.5                 16384.0 10426.7                 2 0.034                 0                 0.000 0.034
#8704.0 8704.0 805.5                 0.0                 69952.0         64174.5                 174784.0 2644.5                 16384.0 10426.7                 2 0.034                 0                 0.000 0.034

#S0C 生还者区0 容量(KB)    S1C 生还者区1 容量(KB)   S0U 生还者区0 使用量(KB)  S1U 生还者区1 使用量(KB)
#EC  伊甸园区容量(KB)      EU 伊甸园区使用量(KB)    OC 老年区容量(KB)         OU 老年区使用量(KB)
#PC  永久区容量(KB)        PU 永久区使用量(KB)
#YGC 新生代GC次数          YGCT 新生代GC时间
#FGC full GC 事件的次数    FGCT full GC的时间       GCT 总GC时间
```

**-gccapacity**

输出每个堆区域的最小空间限制（ms）/最大空间限制（mx），当前大小，每个区域之上执行GC的次数。（不输出当前已用空间以及GC执行时间）。

**-gccause**

输出-gcutil提供的信息以及最后一次执行GC的发生原因和当前所执行的GC的发生原因

**-gcutil**
```shell
#每隔1秒监控一次，共10次
jstat -gcutil 2058 1000 10
```

#### jinfo

```shell
#查看java进程的配置信息
$ jinfo [pid]

#Attaching to process ID 2058, please wait...
#Debugger attached successfully.
#Server compiler detected.
#JVM version is 24.0-b56
#Java System Properties:
#
#java.runtime.name = Java(TM) SE Runtime Environment
#project.name = Amoeba-MySQL
#java.vm.version = 24.0-b56
#sun.boot.library.path = /usr/local/java/jdk1.7/jre/lib/amd64
```
