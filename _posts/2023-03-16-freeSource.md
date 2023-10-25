---
layout: post
title:  "免费的云资源"
crawlertitle: "免费的云资源"
subtitle: "云 free"
ext:
date:  2023-03-16
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['云', '免费']
musicUri: 532776436
musicTitle: 猎户星座
musicFrom: 朴树
author: gomyck
---

# 云

IaaS指提供系统（可以自己选）或者储存空间之类的硬件，软件要自己手动装；PaaS提供语言环境和框架（可以自己选）；SaaS只能使用开发好的软件（卖软件本身）；BaaS一般类似于非关系数据库，但各家不通用，有时还有一些其它东西。

## 其他人的集合

* https://education.github.com/pack GitHub学生包，需用教育邮箱验证。各种福利，可从DigitalOcean上手
* https://github.com/ripienaar/free-for-dev 本文尽量不与此项目重复
* https://free.zhelper.net/
* https://github.com/AchoArnold/discount-for-student-dev
* https://github.com/ivmm/Student-resources
* https://www.freeforstudents.org/
* https://github.com/255kb/stack-on-a-budget
* https://github.com/Ibexoft/awesome-startup-tools-list
* https://www.cokemine.com/
* https://freestuff.dev/

## Paas

* https://www.heroku.com/ java go py docker。国内访问不佳。现在没有免费的了
* https://fly.io/docs/pricing/ py node go 静态，感觉很完美
* https://deta.space/ 支持任意语言，监听PORT环境变量即可；Py只需在mian.py里声明app变量即可，但只支持3.9。定时任务、类dict数据库、10GB存储。只有自己能访问
* https://www.pythonanywhere.com/ 限制非常多，免费账户不允许访问白名单之外的网站。但好歹能提供一个自动https的web app
* https://www.divio.com/ docker
* https://render.com/ 曾经免费plan只有静态网页，现在提供service和database了。有node py go pg
* https://www.clever-cloud.com/en/pricing 看介绍送20€，但应该只会送一次，可以用4个月；数据库好像有完全免费的
* https://cloud.google.com/appengine/docs/ 标准环境有一点储存空间和流量，要求启用API即要求绑卡，柔性环境(.NET)必须启用结算。国内无法访问
* https://clustered.com/pricing 现在只免费14天，永久免费的plan还没出，但至少从2020年11月就是这样了
* https://www.koyeb.com docker node py go，首页被RST
* https://railway.app/ node py go java，用了类似于heroku的buildpacks，RST
* https://qoddi.com/
* https://appwrite.io/cloud 至少从2021年10月就说有了，但一直没出
* https://adaptable.io/ node py go
* https://appliku.com/ django
* https://repl.it/ 本意是多人协作IDE，非VSC，只用了monaco。但支持免费hosting，监听0.0.0.0上任意端口即可，0.5G内存1G储存。自带kv数据库和pg。配置文件为隐藏的.replit和nix，内容参考configuring-repl

### .net

* https://freeasphosting.net/ 网站说了一大堆学习的东西，不过说支持.NET5
* https://www.gearhost.com/ 看起来比较好，支持3.1。还支持PHP7和node。现在开了CF屏蔽大陆IP
* https://order.aspify.com/en/freehosting/ 100MB硬盘100MB数据库，支持5。但之前不让注册说服务在中国不可用
* https://somee.com/ 被墙了，且IP被封了
* https://www.myasp.net/hosting_plans 免费两个月但好像能免费续期

## 云端空间/IDE

* https://cloudstudio.net VSC，服务器在上海，每月免费1000分钟=16.7小时，4G内存，8G硬盘（但/tmp很大）
* https://mydev.csdn.net/product/ide/dashboard 与coding的非常类似，目前每月免费5000分钟。没有cpptools
* https://www.gitpod.io/ VSC，免费版每月50小时，支持在本地打开；专业版在学生包里免费6个月但要求Primary Email是学校的账户
* GitHub Codespaces：每月免费60小时
* https://workspaces.openshift.com/ 魔改VSC，不支持扩展，国内访问慢；之前是codenvy和che.openshift.io
* https://paiza.cloud/en/ 日产，好像还支持SSH连上去
* https://codetasty.com/
* https://next.tech/ 学生包中有
* https://ide.goorm.io/pricing 可以建立五个工作区，可以用SSH连上去。好像是自制的，界面完成度蛮高的，有终端，但没有intellisense，只能玩玩。好像可以运行docker容器？
* https://www.tutorialspoint.com/codingground.htm http://codepad.org/ https://ideone.com/ https://coliru.stacked-crooked.com/ https://wandbox.org/ https://tio.run https://code.xueersi.com/ide/code/1 https://jsrun.net/ https://www.jdoodle.com/ https://rextester.com/  https://ide.progman.in https://glot.io/ 无需登录，能执行许多语言，但只能说能运行代码，称不上IDE。https://www.codiva.io 有一点intellisense
* https://www.keil.arm.com/
* https://www.jetbrains.com/zh-cn/space/
* https://lightly.teamcode.com/ 国产，新出的

### 前端在线IDE

* https://jsbin.com 简洁，无需注册，开源。国内搭建的：https://code.h5jun.com http://http://js.jirengu.com
* https://codepen.io/ 可不注册
* https://stackblitz.com/ 基于VSC Web版，无服务器，但基于wasm允许运行终端、node包括npm等、一点点linux命令
* https://codesandbox.io/
* https://bit.dev/ RST
* https://runkit.com 类似于jupyter notebook，也能创建api，以及把js的codeblock变得可运行
* https://www.codeply.com/
* https://plnkr.co/ 比较简陋
* https://jsfiddle.net/ 我这里打不开，且感觉是他们封的我们
* https://backlight.dev/ https://webcomponents.dev/
* https://coderpad.io

### Jupyter Notebook/Lab 大数据机器学习平台

* https://colab.research.google.com/ 有免费gpu额度，国内无法直接打开。免费版无终端
* https://tianchi.aliyun.com/notebook-ai/home 免费gpu 60小时/年。登录要用阿里云账号，不想记住密码，每次都要用手机扫很麻烦，有时还要短信二次验证
* https://aistudio.baidu.com/aistudio/projectoverview/private 内存8G，磁盘100G，work目录永久保存，实名认证有一些GPU资源；长时间不用无法自动重连
* https://www.kaggle.com 验证电话后有免费gpu和外网，能连续运行9小时，有机器学习的教程
* https://www.heywhale.com/home/project 国产
* https://datalore.jetbrains.com/
* https://cocalc.com/doc/jupyter-notebook.html
* https://jupyter.org/try 官方，资源非常少，有C++；mybinder可以从GitHub仓库建立临时NB
* https://deepnote.com 免费额度750小时，5G空间
* https://www.intel.cn/content/www/cn/zh/developer/tools/devcloud/services.html
* https://lab.datafountain.cn/ 国产，CCF
* https://www.datacastle.cn 国产

## 数据库DBaaS

* https://db4free.net/ mysql 200M
* https://dbhub.io/ SQLite，以HTTPAPI使用，基本上是用git存文件，不过允许用API查询，修改则要下下来
* https://memfiredb.com/ 兼容PG11，国产，5GB，目前在公测，管理员说后续收费计划还没决定
* ~~https://remotemysql.com/ mysql 8.0 100M，需要花不少时间回答调查问卷，允许常见的DQL和DML和创建索引，不能创建Proc 视图 触发器~~ 挂了
* https://www.freemysqlhosting.net/ mysql 5.5，5MB，每周会收到要手动操作来延期的邮件
* https://www.datastax.com/products/datastax-astra/pricing ApacheCassandra(NoSQL)
* ~~https://www.freesqldatabase.com/ mysql 5MB~~ 会过期且就不能再用了
* http://sqlpub.com/ MySQL，国产
* https://freedb.tech/ MySQL8 50MB
* https://tidbcloud.com/ 兼容MySQL，国产
* https://neon.tech/ PG，EA

## BaaS

* ~~https://bmob.cn/~~ https://www.bmobapp.com/
* https://leancloud.cn/pricing/
* https://firebase.google.cn/pricing 用处：https://zhuanlan.zhihu.com/p/95334890
* https://www.zhihu.com/question/34124789/answer/72495188
* https://maxleap.cn/s/web/zh_cn/devcenter-pricing.html
* https://www.8base.com GraphQL
* https://www.easycsv.io/pricing
* JSON
  * ~~https://jsonstores.com/~~ 100个JSON对象，每个最大2MB
  * https://jsonbin.io/
  * https://extendsclass.com/json-storage.html
  * https://json.psty.io/
  * https://www.jsonstorage.net/ 有无需注册的
  * https://db.neelr.dev/ 无需注册，打开网页时自动生成一个TOKEN。但国内打不开
* https://hygraph.com Headless CMS

## Managed K8S

* https://www.redhat.com/zh/technologies/cloud-computing/openshift 每60天清除
* https://okteto.com/pricing 免费版2CPU，4G内存，10G储存。刚注册送一个月pro，不付款自动降到免费版。免费版24小时不活动就sleep。原意是为开发者日常开发使用的
* https://labs.play-with-k8s.com/ 好像每天只有四小时；https://labs.play-with-docker.com/
* zarvis.ai staroid.com 网页都用的是Google的服务器，无法直接访问
* https://kubesail.com/ 停止免费版了，不过还是能作为管理平台
* https://loft.sh/ 好像只是客户端或者管理平台
* ~~https://kubernauts.sh/~~ 宣传免费版有1CPU，1G内存；申请注册后没收到任何邮件，无法登录。现在会跳转到https://kubernautic.com/ 打不开
* 挂了的：k8spin.cloud tryk8s.com usekrucible.com

## Serverless/Node Paas（无状态的api）

* https://glitch.com/
* https://workers.cloudflare.com/ ；https://github.com/xiaoyang-sde/reflare
* https://vercel.com/ node go py
* https://deno.com/deploy
* https://pipedream.com/
* https://keen.io/
* https://www.cloud66.com/pricing/
* https://encore.dev/
* 谷歌的functions有一些免费额度，但一定会产生部署费用，最少$0.03/mo
* 国内的云服务厂商一般都有FaaS服务，也有一定的免费额度，但问题是公网流出流量是没有免费额度的
* https://www.slappforge.com/sigma 仅开发平台
* https://catalyst.zoho.com/
* https://wundergraph.com/
* https://www.val.town/

## 静态网页托管（必须要能自动更新）

* https://surge.sh/
* https://www.netlify.com/
* https://cloudcannon.com
* https://tiiny.host 只能存活7天？
* https://pages.cloudflare.com/
* https://cloud.digitalocean.com/apps starter版本免费3个静态网站，用了cf的cdn国内可能无法访问

## 也许可用的IaaS

* euserv，德国的，只有IPV6，亲测确实可以，但硬盘很慢。现在好像要收setup fee
* https://activity.xinruiyun.cn/free/ 新睿云，发个广告可以免费用一个月的ECS
* https://www.oracle.com/cn/cloud/free/ 体验文章：https://51.ruyo.net/14138.html 不支持prepaid card；https://www.blueskyxn.com/202109/5232.html
* https://51.ruyo.net/14583.html Azure
* https://www.atlantic.net/ ~~免费12个月~~现在好像变成免费一个月了，需要信用卡，
* https://hax.co.id/ https://woiden.id/ 注册仅需一个tg账号，不用信用卡。理论永久免费，需要每周手动续订一下
* https://evolution-host.com/
* https://microlxc.net/ https://nanokvm.net/ 需要注册 https://lowendtalk.com/ 满足一定条件才能申请
* 谷歌云、Amazon、Azure、Yandex Cloud：注册后都会送一些额度
* https://open.iot.10086.cn OneNET移动的，目前没啥免费的内容
* https://evolution-host.com/free-vps.php 需要一个有流量的网站放它们的广告
* https://www.vultr.com/free-tier-program/

### [IBM Cloud](https://www.ibm.com/cn-zh/cloud/free)

* Lite(轻量)版无需信用卡，没有到期时间，完全不会变到付费套餐上，额度到了就无法使用，30天不活动自动删除，一共44项服务
* Cloud Foundry：PaaS 256M内存，支持Java Node .NET GO PHP Py。10天不活动就休眠。apic.mybluemix.net和mybluemix.net都被墙了。要用ibmcloud命令行
* 对象储存：25GB储存，5GB出站；Cloudant JSON文档数据库：1GB；DB2数据库：200MB，每90天要邮件延期
* 机器翻译：但无ja-zh模型，只能和en互转，每月100万字符
* ~~API Gateway：转发一次到另一个endpoint上，能用于静态文件的反代，能设定密钥验证和限制速率，显示调用频率。免费调用100万次但是没写每月，之后限速~~ 他们关闭此服务了，说要迁移到API Connect Reserved，然而这东西是付费的，介绍中的Lite能用的V5版也不存在
* Cloud for Education：持续时间一小时的ECS，能用RDP连上但卡到完全无法使用，好像无外部互联网连接
* 机器学习
* Docker Registry：储存0.5GB，流量5GB
* Event Streams：Kafka
* 那些“软件”虽然有非常多免费的，但必须部署到k8s上；k8s也有免费套餐，但lite无法创建，因为流量和IP可能要收费
* 函数计算：虽然有一点免费额度，但是无lite版

### [腾讯云](https://cloud.tencent.com/act/free)

* 对象储存：免费半年
* CDN：免费半年
* Serverless：免费一年
* 文件储存：免费10G
* 机器翻译：免费500万字符/月，开通免费版必不会收任何费用
* 云托管 CloudBase Run：不知道干什么用的

### [阿里云](https://free.aliyun.com)

* ECS：https://www.aliyun.com/daily-act/ecs/free 需要实名认证且未购买过任何产品，有个t6的ECS可以免费试用一年
* MaxCompute大数据计算服务开发者版https://www.aliyun.com/product/odps
* 云效DevOps有一些免费额度，包括5GB Maven仓库
* 机器翻译通用版：每月100万字符免费额度
* FaaS一年免费额度

## 低代码平台/aPaaS

* 指不用写很多代码就能设计出软件，有可视化工具
* 大部分都是BPM平台，即 表单+工作流审批，适合企业建立业务逻辑在线办公
* 往往与平台本身严重绑定，难以复用和维护，切换平台代价大，开发者自身难以提升

### 国内的

* https://github.com/taowen/awesome-lowcode 收集
* https://www.aliwork.com/ 宜搭，阿里+钉钉
* https://www.apicloud.com/ 云端开发管理类
* https://www.mingdao.com/ 明道云
* https://www.jiandaoyun.com/ 简道云
* https://www.huoban.com/ 伙伴云
* https://qingflow.com/ 轻流
* https://www.steedos.com/pricing/platform/ 华炎魔方，开源，私有部署免费
* https://baidu.gitee.io/amis/docs/index 开源，偏程序员
* https://modao.cc/ 墨刀，原型设计工具
* https://www.imgcook.com/ 淘宝，由设计稿生成界面
* https://www.huaweicloud.com/product/appcube.html 华为云应用魔方，太新
* https://www.informat.cn/ 织信
* https://seatable.cn/ 在线协同表格和信息管理工具，类似于excel，本体不开源但开源了一些组件
* https://www.baishuyun.com/ 百数云
* https://js.design/ 即时设计，原型设计工具
* https://code.fun/
* https://yesapi.cn/
* https://www.jijyun.cn/ 集简云，相当于内置了常见应用的爬虫数据源，获取后根据需要执行动作
* 网页感觉不太好的
  * https://www.iyunbiao.com/ 云表
  * https://www.grapecity.com.cn/solutions/huozige 活字格
  * https://www.learun.cn/ 力软敏捷框架
  * https://www.ivx.cn 号称零代码开发Web App和小程序，前身是ih5.cn，不是BPM
  * https://wuyuan.io/ https://enhancer.io/ 无远开发平台，个人使用免费，商业收费
  * https://www.wudaima.com/ 宜创无代码，官网的footer的链接都是废的，一点也不透明
  * https://www.bn100.com/ 柏思科技/Workfine
* 收费的
  * https://h3yun.com/ 氚云，只免费15天，集成钉钉
  * https://www.newdao.net/ 牛刀，免费两周
  * https://www.clickpaas.com/ 不支持个人
  * https://www.dadayun.cn/ 搭搭云 没有注册的地方
* 没有https的： http://www.joget.cn/ 捷得 、http://www.putdb.com/ WebBuilder 、http://www.mf999.com/ 魔方网表(纯表单类)、http://www.delit.cn/ 度量快速开发平台、http://www.jinyunweb.com 进云、http://dev.easydo.cn 易开发、http://www.jepaas.com/ 、

### 国外的

* https://anvil.works/ py全栈，前端Drag and Drop UI，后端和数据储存用的是该网站的库
* https://www.outsystems.com/pricing-and-editions/ 开发移动应用，是该行的老大；前端组件比较多，后台相对弱一点儿；注册需要姓名，邮箱
* https://www.mendix.com/ 开发移动应用，后台能力比较强（有微流系统）
* https://free.caspio.com/ Database-Powered Apps
* https://thunkable.com 开发移动应用
* https://www.appsheet.com/ 无法直接打开
* https://www.zoho.com/creator/ 网页在我这里打开巨慢。可以一直用免费版只要不使用高级特性
* https://zenkit.com/ 无法直接打开
* Google的App Maker（G Suite收费）、微软的PowerApps（收费10$/mo）
* https://www.dronahq.com/
* https://zhuanlan.zhihu.com/p/375252561
* https://www.odoo.com/zh_CN/ 开源
* https://bubble.io/ 新出的
* https://github.com/appsmithorg/appsmith
* https://www.ragic.com.cn/ 表格类
* https://www.airtable.com/
* https://www.make.com

## 定时任务

* https://www.cronjobservices.com/ 收集
* EasyCron：每月要重新激活
* https://cronitor.io/

## 未分类

* https://www.litespeedtech.com/experience-litespeed-for-free 一个月有效？需要姓名，电话，邮箱，地址。好像只有wordpress，还是只有软件？
* https://github-students.educationhost.co.uk/ 免费一年
* 有可能与Jupyter有关：
  * https://www.dataquest.io/plans-pricing/
  * https://mode.com/compare-plans/
  * https://kyso.io/pricing
* https://studio.azureml.net/ 可视化机器学习实验工具，可不登陆使用
* https://quic.cloud/ Wordpress cache cdn
* https://apis.baidu.com/
* https://platform.sh/pricing/ 好像只免费30天
* API聚合
* https://rapidapi.com/ 只是一个平台，经过它反代到各个提供者的服务器上，大部分质量很低，速度超慢。作为提供者大概简化了收费和验证途径吧。有点用的：simple-file-storage、secure-storage、postput。各种cors-proxy反代。ProxyPage代理ip
* https://apilayer.com/
* https://www.lafyun.com/
