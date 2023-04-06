---
layout: post
title:  "Mysql 存储过程"
crawlertitle: "Mysql 存储过程"
subtitle: "MYSQL SQL PROCEDURE"
ext: ""
date:  2020-07-31
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['DATABASE', '原创']
musicUri: 27591735
musicTitle: 滚滚长江东逝水
musicFrom: 杨洪基
author: gomyck
openPay: true
---

mysql 存储过程范本, 以及一些 syntax 说明

### 两个小方法

1.随机数方法: RAND(), 获得一个随机小数, 在使用 MD5() 方法可获得一个 32 位 MD5 的字符串

2.获得当前时间戳: UNIX_TIMESTAMP(NOW()), NOW()函数返回语句开始执行的时间；而SYSDATE()返回函数执行到的时间

### 存储过程范本

```sql
## 定义一个存储过程, 声明者为当前用户, 存储过程名为 gomyckDemoProcedure, 入参为ckin, 出参为ckout
CREATE DEFINER=CURRENT_USER PROCEDURE `gomyckDemoProcedure`(in ckin varchar(100), out ckout varchar(100))
BEGIN
    DECLARE endFlag int DEFAULT 0;
    DECLARE v_ssfb 					varchar(200);
    DECLARE v_ssbm 					varchar(200);
    DECLARE v_deptDirector  		varchar(200);
    DECLARE v_deptChief 		    varchar(200);
    DECLARE v_viceGeneralManager    varchar(200);
    DECLARE v_president 			varchar(200);
    DECLARE v_chairmanBoard 		varchar(200);
    DECLARE v_cfo 					varchar(200);
    DECLARE v_teller 				varchar(200);
    DECLARE v_financeAudit 			varchar(200);
    DECLARE v_id                    varchar(2000);
    DECLARE v_name                  varchar(2000);
    DECLARE v_deptId                varchar(2000);
    DECLARE v_deptName              varchar(2000);
    DECLARE v_orgId                 varchar(2000);
    DECLARE v_orgName               varchar(2000);
    DECLARE v_type                  varchar(2000);

    DECLARE v_attr_content varchar(2000) default '[';

    ## 定义一个游标, 来遍历下面的查询结果

    DECLARE tempCursor CURSOR for
    SELECT
    t.ssfb,t.ssbm,t.deptDirector,t.deptChief,t.viceGeneralManager,t.president,t.chairmanBoard,t.cfo,t.teller,t.financeAudit
    FROM temp t;

    ## 声明一个处理器, 当游标 fetch 不到结果时, 该处理器会触发对应 sql

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET endFlag=-1;
    open tempCursor;

    ## 开始一个事务

    start TRANSACTION;
    delete from plugin_audit_matrix;

    ## 声明一个循环, 名字叫 ckLoop

    ckLoop: LOOP

        ## 每次开始循环, 要重置下该变量

        set v_attr_content = '[';

        ## 从游标中取值, 一定要和结果集列对应, 不可乱序
        FETCH tempCursor INTO
            v_ssfb,
            v_ssbm,
            v_deptDirector,
            v_deptChief,
            v_viceGeneralManager,
            v_president,
            v_chairmanBoard,
            v_cfo,
            v_teller,
            v_financeAudit;

        ## 判断是否结束了取值, 这里一定要写在 fetch 之下, 否则会多循环一次, 因为 handler 是在游标结束时才触发

        if endFlag = -1
        then
            LEAVE ckLoop; ## 结束循环
        else
            set endFlag = endFlag + 1; ## 记录下游标位置
        end if;

        select
        emp_id,emp_name,dept_id,'',belong_org_id,'','' into v_id,v_name,v_deptId,v_deptName,v_orgId,v_orgName,v_type
        from sys_employee where emp_name = v_deptDirector limit 1;

        set v_attr_content = CONCAT(v_attr_content, '{"attrKey":"deptDirector", "approverInfo": {'
                                                    , '"id":"' , v_id , '","name":"' , v_name , '","deptId":"' , v_deptId
                                                    , '","deptName":"' , v_deptName , '","orgId":"' , v_orgId , '","orgName":"'
                                                    , v_orgName , '","type":"' , v_type , '"}},');

        select
        emp_id,emp_name,dept_id,'',belong_org_id,'','' into v_id,v_name,v_deptId,v_deptName,v_orgId,v_orgName,v_type
        from sys_employee where emp_name = v_deptChief limit 1;

        set v_attr_content = CONCAT(v_attr_content, ']');

        insert into plugin_audit_matrix (pk_id, org_id, org_name, dept_id, dept_name, attr_content)
        VALUES (endFlag, (select orgid from sys_org org where org.shortname = v_ssfb and org.fullname is not null LIMIT 1), v_ssfb, (select orgid from sys_org org where org.shortname = v_ssbm and org.fullname is not null and forgid = (select orgid from sys_org org where org.shortname = v_ssfb and org.fullname is not null LIMIT 1) LIMIT 1), v_ssbm, v_attr_content);

    END LOOP ckLoop;

    close tempCursor;
    COMMIT;
END

```
