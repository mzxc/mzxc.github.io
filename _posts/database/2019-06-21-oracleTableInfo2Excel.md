---
layout: post
title:  "数据库表信息转换请求报文列表"
crawlertitle: "数据库表信息转换请求报文列表"
subtitle: "数据库 表信息转换"
ext:
date:  2019-06-21
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['DATABASE', '原创']
musicUri: 425136423
musicTitle: Incomplete
musicFrom: Agata
author: gomyck
openPay: true
---


在实际开发中, 在与三方厂商对接接口时, 需要我方提供请求报文明细给对方,
如果报文格式与数据库字段一一对应的话, 不妨试试以下的sql, 来生成报文字段列表

### Oracle

使用方法: 替换where条件内的表名(你需要生成报文字段列表的数据库表名)

```sql
SELECT
    utcs.Table_Name AS tabName ,
    utcs.comments AS tabComments ,
    LOWER(ucc.column_name) AS colName ,
    (
      utc.data_type || '(' || utc.data_length || ')'
    ) AS colType ,
    ucc.comments AS colComments
FROM
    user_tab_columns utc
INNER JOIN user_col_comments ucc ON utc.column_name = ucc.column_name
AND utc.Table_Name = ucc.Table_Name
INNER JOIN user_tab_comments utcs ON utcs.Table_Name = ucc.table_name
WHERE
    utcs.Table_Name LIKE '%TABLENAME1%'
    OR utcs.Table_Name LIKE '%TABLENAME2%'
    OR utcs.Table_Name LIKE '%TABLENAME3%'
    OR utcs.Table_Name LIKE '%TABLENAMEN..%'
ORDER BY
    utcs.Table_Name
```

#### Mysql

使用方式与oracle相同

```sql
SELECT
  TABLE_SCHEMA ,
  COLUMN_NAME ,
  CHARACTER_SET_NAME ,
  COLUMN_TYPE ,
  COLUMN_COMMENT
FROM
  information_schema. COLUMNS
WHERE
  table_name = 'table_name';
```
