---
layout: post
title:  "Oracle数据导入导出(expdp  impdp)"
crawlertitle: "Oracle数据导入导出(expdp  impdp)"
subtitle: "Oracle expdp impdp"
ext:
date:  2019-06-20
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['DATABASE', '原创']
musicUri: 526904859
musicTitle: 뿜뿜 (BBoom BBoom)
musicFrom: 모모랜드 (MOMOLAND)
author: gomyck
---

oracle数据泵的使用方式, 以及数据泵命令的参数说明

#### 使用expdp和impdp时应该注重的事项：

1、exp和imp是客户端工具程序，它们既可以在客户端使用，也可以在服务端使用。

2、expdp和impdp是服务端的工具程序，他们只能在oracle服务端使用，不能在客户端使用。

3、imp只适用于exp导出的文件，不适用于expdp导出文件；impdp只适用于expdp导出的文件，而不适用于exp导出文件。

4、对于10g以上的服务器，使用exp通常不能导出0行数据的空表，而此时必须使用expdp导出。

#### 一. 创建逻辑目录，该命令不会在操作系统创建真正的目录（请先创建真正的目录），最好以system等管理员创建逻辑目录。

```bash
$ conn system/manger@orcl as sysdba
```
```sql
create directory dump_dir as 'd:\test\dump';
```

#### 二. 查看管理员目录（同时查看操作系统是否存在，因为oracle并不关心该目录是否存在，假如不存在，则出错）

```sql
select * from dba_directories;
```
#### 三. 给scott用户赋予在指定目录的操作权限，最好以system等管理员赋予。

```sql
grant read,write on directory dump_dir to scott;
```
#### 四. 用expdp导出数据

##### 1)导出用户
```bash
$ expdp scott/tiger@orcl schemas=scott dumpfile=expdp.dmp directory=dump_dir
```
##### 2)导出表
```bash
$ expdp scott/tiger@orcl tables=emp,dept dumpfile=expdp.dmp directory=dump_dir
```
##### 3)按查询条件导
```bash
$ expdp scott/tiger@orcl directory=dump_dir dumpfile=expdp.dmp tables=emp query='where deptno=20'
```
##### 4)按表空间导
```bash
$ expdp system/manager@orcl directory=dump_dir dumpfile=tablespace.dmp tablespaces=temp,example
```
##### 5)导整个数据库
```bash
$ expdp system/manager@orcl directory=dump_dir dumpfile=full.dmp full=y
```
##### 6)只导出表结构
多加一个参数 : content=metadata_only

#### 五. 用impdp导入数据

导入命令:
```bash
$ impdp 用户/密码@数据库 文件夹=.. dumpfile=... remap_schema=xxx:xxxx[这句的意思是把原有方案(用户) 变成当前方案(用户)]  remap_tablespace=xxx:xxxx[这句的意思是把原有导出表空间换成当前的表空间]    TABLE_EXISTS_ACTION表存在的方案
```

举栗说明:
```bash
$ impdp gomyck/*****@orcl directory=dump_dir dumpfile=PMS1.dmp REMAP_SCHEMA=olduser:newuser remap_schema=SCYW:gomyck remap_tablespace=TS_SBTZ:GOMYCK TABLE_EXISTS_ACTION=TRUNCATE
```

TABLE_EXISTS_ACTION 说明:

默认为：SKIP(但是如果设定了CONTENT=DATA_ONLY，那么默认的是APPEND)

作用：定义了如果要导入的表已经存在，impdp的动作

值及其含义：

SKIP:不管已经存在的表，直接跳过

APPEND:保持现有数据不变，导入源数据

TRUNCATE:删掉现有数据，导入源数据

REPLACE:删掉现有表，并重建，导入源数据

# 2023-07-28 使用 imp 导入数据

// 登录 sqlplus
```shell
$ sqlplus sys/oracle as sysdba;
```

```sql
// 创建表空间
create tablespace GOMYCK datafile '/home/gomyck/db' size 1500M autoextend on next 5M maxsize 3000M;

// 给 SYSTEM 表空间扩容
ALTER TABLESPACE SYSTEM ADD DATAFILE '/home/gomyck/file.dbf' SIZE 5G;

// 创建用户
create user gomyck identified by 'xxxxxx';

// 给用户分配表空间
alter gomyck quota unlimited on GOMYCK;

// 给用户授权角色
grant connect, resource to gomyck;
```

```shell
// 执行导入
$ imp gomyck/hy123123 fromuser=HIT_HQDF touser=gomyck file=/root/temp/20230529.dmp
```

