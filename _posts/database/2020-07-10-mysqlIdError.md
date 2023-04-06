---
layout: post
title:  "Mysql检索条件类型不一致引发的一次线上 BUG 修复"
crawlertitle: "Mysql检索条件类型不一致引发的一次线上 BUG 修复"
subtitle: "MYSQL PRIMARY KEY"
ext: "整型主键 字符串主键 datetime"
date:  2020-07-10
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['DATABASE', '原创']
musicUri: 28461933
musicTitle: Monsters
musicFrom: Timeflies
author: gomyck
openPay: true
---

线上数据无缘无故被篡改, 排查并解决

### 起因
客户反映, 线上已有数据被篡改, 原本未填写的表单项多了值

### 排查
查操作日志表, 未找到相关修改记录的操作, 查对应新增修改 service, 也无查询相关数据的操作, 前端也同样排查了一遍, 排除了页面缓存或者并发问题

查找客户反映的字段, 以这些字段为条件查询被篡改表(表 B), 发现了 3 条记录, 其中一条记录为触发器(表 A)新增, 查看触发器, 新增触发器没有修改动作, 修改触发器存在修改本表(表 B)的动作

> 表 A 是第三方厂商操作的表, 这个表有 CRUD 动作时, 要同步我们的表 B, 所以 表 A 中存在触发器, 来对表 B 做操作

仔细查看 sql, 未发现问题, 但是当时我非常肯定的认为就是触发器的问题, 于是手动修改了上面查到的三条记录中触发器新增的那条记录(表 A), 果然, 三条记录(表 B)都会被 update

查看 update 语句, 是根据主键更新, 对比之后发现, 触发器的表(表 A)主键是 int 类型, 被篡改表(表 B)主键是 UUID(字符串), 结果当作为条件比较时, 会把字符串转型, 类似下面:

```text
23MMSSD0-0EWE0ADAS00F-SDF   >>   23

0MSDA-QW3213-ASD-ERT-HFGF   >>   0

KKKAS-ASD-A-SD-A-DA-DS-A-D  >>   0
```

恰巧触发器的那条记录 ID 是 5, 而另外两条的 UUID 起始字符也都是 5, 所以就导致作为对比时, 相等

### 解决

把触发器的 update 语句检索条件, 整型主键转成字符串在做对比, 类似下面:

```sql
where concat(pk_id, '') = obj_id;
```

至此问题得到解决

### 其他问题记录

mysql5.6 之前的版本, 建表时, datetime 不支持长度: datetime(3), 如果使用数据泵导出的 5.6 之后版本的 sql, 在导入到 5.6 之前的版本库时, 要把 (3) 这种字符删掉才好使
