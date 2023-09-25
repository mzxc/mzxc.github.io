---
layout: post
title:  "limit 的小技巧"
crawlertitle: "limit 的小技巧"
subtitle: "mysql pg"
ext: ""
date:  2023-09-25
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['DATABASE', '原创']
musicUri: 1969039800
musicTitle: 如果的事
musicFrom: gomyck
author: gomyck
openPay: true
---

数据库在分页查询的过程中, 超大偏移量导致的慢查询, 如何处理?

1.使用自连表查询

```sql
-- 使用 limit 对主键做快速定位, 在通过关联查询, 查询记录
SELECT * FROM table1 AS t1 JOIN ( SELECT id FROM table1 LIMIT 0, 50) AS t2 ON t1.id = t2.id;
```

2.对于递进查询, 可以使用索引定位

```sql
-- id 是递增关系, 可使用上一次记录的最后一条记录的 ID 来快速定位
SELECT * FROM table1 WHERE id >= 111111 LIMIT 50;
```

3.组合 1 和 2

```sql
SELECT * FROM table1 AS t1 JOIN ( SELECT id FROM table1 where id >= 111111 LIMIT 50) AS t2 ON t1.id = t2.id;
```

上述两种操作, 核心原理就是规避回表, 尽可能使用索引定位。
