---
layout: post
title:  "使用 mysqlslap 对数据库压测"
crawlertitle: "使用 mysqlslap 对数据库压测"
subtitle: "Mysql database"
ext: ""
date:  2023-05-19
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['SERVER', '原创']
musicUri: 1969039800
musicTitle: 如果的事
musicFrom: gomyck
author: gomyck
openPay: true
---

> 压测语句 混合sql, 自动生成递增列, 每轮测试执行 1000 次查询, 10 列字符类型, 10 列数字类型, 循环测试 1000 轮, 并发数为 100, 测试引擎为 innodb**

```shell
$ mysqlslap --auto-generate-sql-load-type=mixed         \
  --auto-generate-sql-add-autoincrement                 \
  --number-of-queries=1000                              \
  --number-char-cols=10                                 \
  --number-int-cols=10                                  \
  -i 1000 -c 100 -a                                     \
  -uroot -h192.168.x.xx -P3306 -pxxxxxx --engine=innodb \
  --debug-info  --only-print
```

```text
--auto-generate-sql, -a 自动生成测试表和数据，表示用mysqlslap工具自己生成的SQL脚本来测试并发压力。

--auto-generate-sql-load-type=type 测试语句的类型。代表要测试的环境是读操作还是写操作还是两者混合的。取值包括：read，key，write，update和mixed(默认)。

--auto-generate-sql-add-auto-increment 代表对生成的表自动添加auto_increment列，从5.1.18版本开始支持。

--number-char-cols=N, -x N 自动生成的测试表中包含多少个字符类型的列，默认1

--number-int-cols=N, -y N 自动生成的测试表中包含多少个数字类型的列，默认1

--number-of-queries=N 总的测试查询次数(并发客户数×每客户查询次数)

--query=name,-q 使用自定义脚本执行测试，例如可以调用自定义的一个存储过程或者sql语句来执行测试。

--create-schema 代表自定义的测试库名称，测试的schema，MySQL中schema也就是database。

--commint=N 多少条DML后提交一次。

--compress, -C 如果服务器和客户端支持都压缩，则压缩信息传递。

--concurrency=N, -c N 表示并发量，可指定多个值，以逗号或者--delimiter参数指定的值做为分隔符。例如：--concurrency=100,200,500。

--engine=engine_name, -e engine_name 代表要测试的引擎，可以有多个，用分隔符隔开。例如：--engines=myisam,innodb。

--iterations=N, -i N 测试执行的迭代次数，代表要在不同并发环境下，各自运行测试多少次。

--only-print 只打印测试语句而不实际执行。

--detach=N 执行N条语句后断开重连。

--debug-info, -T 打印内存和CPU的相关信息。
```

Q1:
mysqlslap: Error when connecting to server: Authentication plugin 'caching_sha2_password' cannot be loaded: /usr/lib64/mysql/plugin/caching_sha2_password.so: cannot open shared object file: No such file or directory

A1:
```sql
-- mysql 用户密码加密方式改一下
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'xxx';
```


