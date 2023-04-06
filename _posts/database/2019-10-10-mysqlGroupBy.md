---
layout: post
title:  "MySql Group by 函数的正确打开方式"
crawlertitle: "MySql Group by 函数的正确打开方式"
subtitle: "MySql Group by Having"
ext:
date:  2019-10-10
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['DATABASE', '原创']
musicUri: 411214279
musicTitle: 雅俗共赏
musicFrom: 许嵩
author: gomyck
openPay: true
---

在使用分组函数时, 进行结果集筛选, 遇到的一些问题以及解决办法

#### 1. 应用场景
有两张表

文章表(一对多留言表) **t_posts**:
oid, posts_name
留言表(多对一文章表) **t_comment**:
oid, posts_id, msg_content, create_time



#### 2.需求分析
查询每个文章的最新回复内容

#### 3.SQL编写

```sql

select
  tp.oid,
  tp.posts_name,
  tc.msg_content,
  tc.create_time
from t_posts tp
left join t_comment tc on tp.oid = tc.posts_id
group by tp.oid having create_time = max(create_time)

```

**假设现在有两个文章A, B (回复的记录在数据库的顺序与下述一致)**
```text
A有一个回复记录时间为: 2019-09-10
A有一个回复记录时间为: 2019-09-11
B有一个回复记录时间为: 2019-09-01
B有一个回复记录时间为: 2019-09-09
```

运行上面的sql, 会发现结果集丢失大量记录, 并且结果是错误的, 经过查询资料得知

mysql的 having 是在 group by 之后再执行, 也就是说, 先分组, 在过滤, 但是因为存在两条以上的留言记录,
所以分组之后的结果集只会取每条留言的第一条作为分组之后的记录信息, 这时如果使用having create_time = max(create_time)
那么, max(create_time) 为当前分组的最大时间

为: 2019-09-10 和 2019-09-09

**所以上述sql会丢失结果集**

#### 4.改造SQL

因为知道分组之后合并的重复结果集为rownum最小的那条, 那么可不可以改造sql如下??

```sql

select
  tp.oid,
  tp.posts_name,
  tc.msg_content,
  tc.create_time
from t_posts tp
left join t_comment tc on tp.oid = tc.posts_id
group by tp.oid having create_time = max(create_time)
-- 下面的是新增的sql
order by tc.create_time desc

```
运行之后发现依旧不好使, 证明order by 在group by & having 之后

**后来想想可不可以 不用having, 直接用order by来优化分组后的结果呢?**

~~having create_time = max(create_time)~~

```sql
select
  tp.oid,
  tp.posts_name,
  tc.msg_content,
  tc.create_time
from t_posts tp
left join t_comment tc on tp.oid = tc.posts_id
group by tp.oid
order by tc.create_time desc

```
结果集错误, 并不能影响分组结果, 依旧是按照rownum最小分组合并重复结果集, 然后在排序

#### 5.终极改造版本

因为order by 只能后影响group by, 那么是不是可以在group by 之前先把结果集排序一下, 然后再分组呢?

```sql

select * from (
  select
    tp.oid,
    tp.posts_name,
    tc.msg_content,
    tc.create_time
  from t_posts tp
  left join t_comment tc on tp.oid = tc.posts_id
  order by tc.create_time desc
) t
group by t.oid

```

发现还是不好使, 但是子查询确实先排序了

经查询(explain), 发现子查询的order by被优化没了, 解决办法:

1. 在子查询里使用limit 99999

2. 在子查询里使用where条件, create_time = (select max(create_time) from t_comment group by oid)


```sql

select * from (
  select
    tp.oid,
    tp.posts_name,
    tc.msg_content,
    tc.create_time
  from t_posts tp
  left join t_comment tc on tp.oid = tc.posts_id
  order by tc.create_time desc limit 9999
) t
group by t.oid

```

#### 大功告成

附建表语句:

<a href="/img/in-post/resources/res2019-10-10/demo.sql" style="color: blue;">点击下载</a>


附加知识点:

mysql5.5 与 mysql 5.7 版本差异: 5.7+ 版本, 如果不使用 limit, group by 会把 order by 优化掉
