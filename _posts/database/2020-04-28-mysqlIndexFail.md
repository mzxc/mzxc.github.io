---
layout: post
title:  "MySql LEFT JOIN 索引失效"
crawlertitle: "MySql LEFT JOIN 索引失效"
subtitle: "DATABASE MYSQL INDEX LEFT JOIN"
ext: ""
date:  2020-04-28
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['DATABASE', '原创']
musicUri: 1396973729
musicTitle: 大田後生仔
musicFrom: 丫蛋蛋
author: gomyck
openPay: true
---

记一次 mysql 左连接导致索引失效的原因

### 起因

生产环境一条查询 3 张表的 sql(简化版) :
```sql
SELECT * FROM TABLE1 T1  -- 大概 1500 条数据
LEFT JOIN TABLE2 T2 ON T1.T2_ID = T2.OBJ_ID  -- 大概 1000 条数据
LEFT JOIN TABLE2 T3 ON T1.T3_ID = T3.OBJ_ID  -- 大概 5000 条数据
```

查询时长: 4S 左右
>T2 T3 表是我们常用的业务表(平时使用 inner join 连接, 极少数使用 left join, 但是使用 left join 时也并不慢), OBJ_ID 为主键
>T1 是新建的表

### 分析

像这种数据量小, 并且诡异的慢查询, 一般来说, 只能上 explain 分析了, 分析得知:
> T1 与 T2 之间的查询type: eq_ref(性能较优, 使用了索引)
> T1 与 T3 之间的查询type: all (性能最烂, 未使用索引)

此刻陷入疑惑, 明明都是使用索引作为关联条件, 为什么 T2 可以, T3 不可以, 慢查询也是该原因导致的全表扫描形成笛卡尔积

翻看三张表的表结构, 除了排序规则(collate)不一致, 其他的都一致

### 解决

查询相关资料, 得知, 当两张表排序规则不一致时, 可能会使索引失效(我使用 inner join T3 是走索引的)

因为 T3 表为主要业务表, 也是整体数据结构的通用排序规则(utf8_general_ci), 所以修改 T1 与 T2 的排序规则, 使用表设计, 修改表的排序规则为: utf8_bin - utf8_general_ci

**发现索引还是未生效**

使用:
```sql
show full columns from TABLE1;

```
查看得知: 字段的排序规则并未跟随表的排序规则变化, 查询资料得知, 修改后的表排序规则只对新增字段生效

使用下述sql 解决问题:
```sql

ALTER TABLE TABLE1 CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;

```

### 原因

因为 T1 表是同事在自己机器数据库建的表, 他本地数据库的排序规则为: utf8_bin, 导致创建的表排序规则与测试库, 生产库不一致

