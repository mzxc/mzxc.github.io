---
layout: post
title:  "MySql的一些优化策略, 以及 B+ 树的一些知识"
crawlertitle: "MySql的一些优化策略, 以及 B+ 树的一些知识"
subtitle: "MySql B+ Tree TPS QPS"
ext: ""
date:  2022-04-23
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['DATABASE', '原创']
musicUri: 1430429719
musicTitle: Control
musicFrom: Zoe Wees
author: gomyck
openPay: true
---

了解并掌握 MySQL 以及 B+ 树的一些必要知识

### B+树

**磁盘管理数据最小单位为扇区(512字节), 而操作系统中, 文件系统的数据管理单元最小为块(为4KB)**

对于海量数据的关系型数据库, 维护数据需要依赖高明的数据结构, 以及组织算法, 为了更高效的管理数据集, mysql 中定义了块的概念, innoDB默认的块大小为 16KB (innodb_page_size), 此为逻辑单位

innodb引擎每次操作数据都是在操作这 16KB 的块(也可以称之为页), 无论是索引数据或者是业务数据, 都存储在块里(page)

而每个块相互关联(**双向链表**), 则组成了 mysql 存储数据的集合: B+树

**B+数的概念可以参考下图:**

![image](/img/in-post/res2022-04-23/2022-04-23-001.png)

B+数也是经典的数据结构, 其特性如下:
```text
1. 所有叶子节点的索引值, 都是从左到右依次增大
2. 非叶子结点的值, 都为此节点的子节点数据中的最小值, 子节点是冗余父节点的值的
3. 相同层的节点之间通过链表互相关联, 形成双向链表
4. 所有业务数据存储在叶子节点中, 非叶子节点只存储索引值
5. 每个节点对应一个块(page)
```

通过块大小我们可以分析得出: 最顶层节点如果每个索引占用空间大小如果为 160byte (LONG类型(64byte) 加其他描述字段), 那么每个块可存储 1000 个索引值

那么第二层节点可存储 1000 * 1000 个索引值

假设每条业务数据占用空间为 1KB 那么每个叶子节点可存储 16 条业务数据

可推到出 三层的 B+树, 可存储  1000 * 1000 * 16 = 16000000 一千六百万条数据

如果叶子节点每条数据占用空间为100字节, 每个页大概可存储 200 条记录, 1000 * 1000 * 200 = 200000000 两亿条数据

**所以告诉无限扩增表字段的小伙伴, 长点心吧, 不要啥数据都可一张表灌了**

**innoDB 为每个页生成一个 32 位的编号, 可计算得出 innoDB引擎最大支持的存储空间为: 2^32*16KB = 64TB (尽情的存吧, 朋友)**

**在 mysql 中, 主键一般称为聚簇索引, 而其他索引则称为二级索引, 这是因为主键的索引是 B+树主树的数据, 而其他索引则是单独的 B+树, 其叶子节点存的其实是主键的索引数据**

### 回表以及优化办法

先说一下什么是回表: 除了查询主键索引之外, 我们在查询时, 如果使用的是自定义索引, 那么会先使用自定义索引 B+ 树后, 返回主键的索引, 在使用数据集返回到 **主键索引 B+ 树** 去重复过滤

**知识点: 我们手动创建的索引, 也会生成一个单独的 B+ 树, 只不过叶子节点存储的是对应结果集的主键索引值**

那么如何去优化呢: 可以使用联合索引, 且查询条件使用联合索引的非最左索引项, 比如 联合索引(a,b,c)

那么该索引 B+ 树, 实际上是下图所示:

![image](/img/in-post/res2022-04-23/2022-04-23-002.png)

数据库根据联合索引最左边的索引来构建 B+树, 这也就是为什么在使用联合索引的时候, 一定要遵循最左原则

当我们使用查询条件时, 如果使用 a=xx and b=xx 时, 此时是不需要回表的, 因为索引中不仅包含了主键索引, 也包含了 b, 可以使用 b 来进行过滤后, 直接定位到业务数据(此为覆盖索引扫描)

### mysql 查询时的一些优化策略

1. 联合索引时, 中间的索引不要使用范围查询  如(a,b,c)  where a=1 and b>2 and c=3  这时, b 和 c 的索引扫描都会失效, 具体请参考上图, 因为只有当前面的索引匹配之后, 后续的索引才是有序的, 当前置索引是范围结果时, 后面的索引是无序的, 就会失效

2. 不要在查询条件上操作索引: where SUBSTR(outTradeNo,0,3) = '123' 这种情况会使索引失效

3. 不推荐使用 不等于 != 会跳过索引

4. 使用覆盖索引: 查询结果包含索引

5. 不要使用 select * 来作为查询条件, 尽量使用覆盖索引

6. 如果使用 like 时, '%name%' 或 '%name' 这种情况, 要使用覆盖索引: select name, xxx from tableName where name like '%123%', 否则会失去索引扫描效果

7. 字符串字段查询加单引号, 否则失去索引效果

8.


### mysql 连接报错, 使用 useSSL=false

mysql 驱动高版本需要使用显示声明 useSSL=false 来禁止建立安全连接通道, 否则会报连接握手错误

### mysql in 的多列应用

如果遇到 A B 两个列, 参与查询: where (A = 1 AND B = 2) OR (A = 4 AND B = 4) OR (A = 6 AND (B = 8 OR B = 10))

可以转换成  where (A, B) IN ((1, 2), (4, 4), (6,8), (6,10))

### mysql 查看死锁

**如果查询慢, 看一下 where 条件和 order by 后面的字段是否有索引**

```sql
SHOW VARIABLES like '%profi%';
SHOW PROFILES;
SHOW PROFILE all for query 265;
SHOW OPEN TABLES where In_use > 0;
select * from information_schema.INNODB_TRX;
SHOW PROCESSLIST;
KILL PID;
```

### 查询数据库 TPS QPS
```sql
SHOW GLOBAL STATUS LIKE 'Questions';  //336642530
SHOW GLOBAL STATUS LIKE 'Uptime'; //7242892
select 336642530 / 7242892 from dual;

SHOW GLOBAL STATUS LIKE 'Com_commit'; //4023739
SHOW GLOBAL STATUS LIKE 'Com_rollback';//256
SHOW GLOBAL STATUS LIKE 'Uptime';//7242971
select (4023739 + 256) / 7242892 from dual;
```
