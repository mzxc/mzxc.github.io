---
layout: post
title:  "Exception 合集"
crawlertitle: "工作中遇到的各种诡异异常合集"
subtitle: "Exception Java C JAVASCRIPT"
ext:
date:  2019-08-16
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['Exception', '原创']
musicUri: 343054
musicTitle: 天涯
musicFrom: 爱乐团
author: gomyck
openPay: true
---

持续更新在工作中遇到的各种异常合集

<style>
  table  th:nth-of-type(1) {width: 20%;text-align: center}
  table  th:nth-of-type(2) {width: 50%;text-align: center}
  table  th:nth-of-type(3) {width: 30%;text-align: center}
  table  td:nth-of-type(1) {width: 20%;text-align: left;font-size:12px}
  table  td:nth-of-type(2) {width: 50%;text-align: left;font-size:12px}
  table  td:nth-of-type(3) {width: 30%;text-align: left;font-size:12px}
</style>

异常简略信息|原因|解决办法
---|---
Host is down|该异常会根据eviction-interval-timer-in-ms这个属性设置的值周期性的打印,eviction-interval-timer-in-ms这个属性用来控制eureka清理无效服务的周期,单位是毫秒,该异常会伴随connect time out异常|检查Eureka工程配置文件, 是否有eureka.instance.hostname这个配置, 如果有, 检查是否可以ping通
Base-64字符串中的无效字符|这个异常是在C#解码BASE64字符串的时候遇到的, 究其原因, 是因为C#在decode的时候, 首先会校验一下当前字符串的长度模4是否等于0, 如果不等于0, 则会抛出该异常, 至于为什么要模4, 请看我的另外一篇文章 <a style="color: blue;" target="_blank" href="">BASE64编码原理</a>|最终我重写了BASE64转码的工具类, 长度不足的情况下补0
BindingException: Parameter 'arg0'|在使用mybatis时, 使用注解声明查询方法, @Select(), 其中的sql占位符使用的是: #{userName}而非${arg0}, 并且方法的入参并没有使用@param注解描述, 入参名称与sql占位符中名称一致, 但是并未达到参数名称自动绑定的效果, 跟踪第一次查询的方法栈, 可以看到这么一行代码: this.providerMethodArgumentNames = new ParamNameResolver(configuration, m).getNames();感兴趣的同学可以去看一下|1.检查yml文件里关于mybatis的配置use-actual-param-name是否是true, 如果不是, 请改成true <br/> 2.检查当前工程的JDK环境, 编译器版本以及当前语法版本是否是1.8+
status 400 reading className methodName(String,String,String,String)|feign调用时报错, 如果传值为null的时候, feign会报这个错误, 因为在请求的时候decode报错|针对方法调用判断非空
no space left on device|docker虚机向宿主机cp文件的时候, 报这个错误, 目标文件夹是C/USERS 使用df -h 查看, 空间是够用的, 但是使用df -hi则会发现, 磁盘使用率已经爆表, 因为inode信息太多|设置个新的共享盘, 比如D盘, 重启之后再cp
java.lang.reflect.Executable获取的参数名为arg0... 并不能获取真实的参数名|jdk环境是1.8, 但是在使用该类获取参数名的时候, 并不好使, 搜索资料说是编译器的问题, 因为少加了个参数|在IDEA中, setting-搜索compile-java compile-添加一个编译参数(additional commandline ....里面):-parameters
feign POST请求报文接收不到|不能使用@PostMapping注解, 必须使用RequestMapping注解|替换注解
java.net.NoRouteToHostException: No route to host|防火墙问题|firewall-cmd --zone=public --permanent --add-port=7777/tcp
java.lang.IndexOutOfBoundsException: Index: 256, Size: 256|使用 List 接收键值对长度超过 256 (springmvc)|使用@InitBinder 定义方法, 在参数表中加入自动注入参数: WebDataBinder binder, 使用 binder,setAutoGrowCollectionLimit(257); 即可解决
MYSQL #HY000|MYSQL 插入报错|空值, 或者有不同类型的插入, 比如 int 插入了 string
