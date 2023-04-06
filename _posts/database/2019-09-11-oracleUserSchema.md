---
layout: post
title:  "ORACLE User与Schema的联系"
crawlertitle: "ORACLE User与Schema的联系"
subtitle: "ORACLE USER SCHEMA"
ext:
date:  2019-09-11
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['DATABASE', '转载']
musicUri: 29463546
musicTitle: 如果寂寞了
musicFrom: 郑晓填
author: gomyck
openPay: false
---

**1.什么是用户（user）**
    A user is a name defined in the database that can connect to and access objects.
    Oracle用户是用连接数据库和访问数据库对象的。（用户是用来连接数据库访问数据库）

**2.什么是模式(schema)**
    A schema is a collection of database objects (used by a user.). Schema objects are the logical structures that directly refer to the database’s data.
    模式是数据库对象的集合。模式对象是数据库数据的逻辑结构。（把数据库对象用模式分开成不同的逻辑结构）

**3.用户（user）与模式 (schema) 的区别**
    Schemas and users help database administrators manage database security
    用户是用来连接数据库对象。而模式用是用创建管理对象的。(模式跟用户在oracle 是一对一的关系)

**详解**

从官方的定义中，我们可以看出schema为数据库对象的集合。为了区分各个集合，我们需要给这个集合起个名字，这些名字就是我们在企业管理器的方案下看到 的许多类似用户名的节点，这些类似用户名的节点其实就是一个schema。

schema里面包含了各种对象如tables, views, sequences, stored procedures, synonyms, indexes, clusters, and database links。

一个用户一般对应一个schema,该用户的schema名等于用户名，并作为该用户缺省schema。这也就是我们在企业管理器的方案下看 到schema名都为数据库用户名的原因。而Oracle数据库中不能新创建一个schema，要想创建一个schema，只能通过创建一个用户的方法解决 (Oracle中虽然有create schema语句，但是它并不是用来创建一个schema的)，在创建一个用户的同时为这个用户创建一个与用户名同名的schem并作为该用户的缺省 shcema。

即schema的个数同user的个数相同，而且schema名字同user名字一一 对应并且相同，所有我们可以称schema为user的别名，虽然这样说并不准确，但是更容易理解一些。

一个用户有一个缺省的schema，其schema名就等于用户名，当然一个用户还可以使用其他的schema。如果我们访问一个表时，没有指明该 表属于哪一个schema中的，系统就会自动给我们在表上加上缺省的sheman名。比如我们在访问数据库时，访问scott用户下的emp表，通过 select * from emp; 其实，这sql语句的完整写法为select * from scott.emp。

在数据库中一个对象的完整名称为schema.object，而不属user.object。类似如果我们在创建对象时不指定该对象 的schema，在该对象的schema为用户的缺省schema。这就像一个用户有一个缺省的表空间，但是该用户还可以使用其他的表空间，如果我们在创 建对象时不指定表空间，则对象存储在缺省表空间中，要想让对象存储在其他表空间中，我们需要在创建对象时指定该对象的表空间

### 相关资料:

In Oracle, users and schemas are essentially the same thing. You can consider that a user is the account you use to connect to a database, and a schema is the set of objects (tables, views, etc.) that belong to that account.

See this post on Stack Overflow: difference between a User and a Schema in Oracle? for more details and extra links.

You create users with the create user statement. This also "creates" the schema (initially empty) - you cannot create a schema as such, it is tied to the user. Once the user is created, an administrator can grant privileges to the user, which will enable it to create tables, execute select queries, insert, and everything else.

The database is the thing that contains all the users you've created, and their data (and a bunch of predefined system users, tables, views, etc. that make the whole thing work). You should look at the Oracle Database Architecture documentation in the Concepts Guide (actually, that whole page is worth a read - there's a section about users and schemas higher up in that page) to get an introduction to what a database is, and what a database instance is - two important concepts.

You can create a database with the create database statement, once you've installed the Oracle software stack. But using dbca (database creation assistant) is easier to get started.

原文链接: <a href="https://blog.csdn.net/h254931252/article/details/52774276">https://blog.csdn.net/h254931252/article/details/52774276</a>
