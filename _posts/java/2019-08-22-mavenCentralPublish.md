---
layout: post
title:  "如何把JAR发布到maven中央仓库"
crawlertitle: "如何把JAR发布到maven中央仓库"
subtitle: "Zuul Java Springboot 微服务"
ext:
date:  2019-08-22
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['PROJECT MANAGE', '原创']
musicUri: 41500546
musicTitle: China-X
musicFrom: 徐梦圆
author: gomyck
openPay: true
---

详细描述maven中央仓库发布jar包的中间过程, 以及遇到的一些问题汇总, 尽量用文字描述清楚, 耐心看下去, 就一定会发布成功

### ----Sonatype篇----

> 名词解释:
> Sonatype Nexus: Sonatype Nexus helps software development teams use open source so they can innovate faster and automatically control risk

maven社区唯一指定的仓库地址为: https://search.maven.org/ 所以, 我们现在用的远程仓库地址, 无论是哪个, 都是需要去这个仓库同步index的, 然后在把依赖同步到自己的仓库下面

整个maven仓库网络是一个拓扑型架构, 仓库与仓库之间可以互相依赖, 且互相索引

如果想上传jar到公服仓库, 那么首先要打通的就是sonatype, 我们首先去sonatype官网注册个账号, 访问https://issues.sonatype.org/secure/Dashboard.jspa 这个地址是sonatype
控制台, 如果未登录, 则会先跳转到登录界面, 点击注册, 填写相关信息, 注册个账号然后登录

**1. 进入控制台之后, 点击新建按钮, 新建一个问题(issue)**
```text
project      选择community support -open source....
issue        选择new project
summary      填写一些项目简短描述
description  填写项目的描述
group id     这个最重要了, 要与你的工程pom文件里的顶级group id 一致, 而且这个是不能乱填的, 一般来说, 是你自己的域名反写
Project URL  进入到你项目的url, 假如你的项目在github上, 先进到你的项目中, 然后复制地址栏上的地址填进去就可以
SCM url      同上, 但是这个url要填写你的git资源下载地址, 就是项目右侧的clone&download那个按钮弹出来的地址
Username(s)  用户名
Already Synced to Central  默认选NO就可以, 因为暂时我们还不需要同步到中央仓库

```

**2. 等待ISSUE审批, 一般来说, 2分钟左右, 你就会收到审批结果(同时会给你的邮箱发邮件), 告诉你, 要验证你的域名, 也就是你的group id对应的域名, 会通过以下几种方式验证这个域名是不是你的**
```text
Central OSSRH updated OSSRH-xxxxx:
----------------------------------
   Status: Waiting for Response  (was: Open)

Do you own the domain gomyck.com? If so, please verify ownership via one of the following methods:
* Add a TXT record to your DNS referencing this issue (Fastest)
* Setup a redirect to your Github page (if it does not already exist)
* Send an email to central@sonatype.com referencing this issue from a gomyck.com email address

If you do not own this domain, please read:
http://central.sonatype.org/pages/choosing-your-coordinates.html
You may also choose a groupId that reflects your project hosting, in this case, something like
```

这个里面告诉你, 最快的办法就是在你的域名解析中, 添加一条text记录, 我当时就是用的这种方式, 具体操作如下:

```text
进入到域名商网站, 登录之后选择域名解析
点击添加记录, 记录类型选择text
主机记录不要写(默认是@)
记录值写你的问题编号
其他都不需要改, 点击确定

```
如果填的没问题的话, 大概10分钟左右, 你就会收到审核通过的消息, 告诉你可以上传资源了
```text
com.gomyck has been prepared, now user(s) gomyck,mzxc can:

Deploy snapshot artifacts into repository https://oss.sonatype.org/content/repositories/snapshots
Deploy release artifacts into the staging repository https://oss.sonatype.org/service/local/staging/deploy/maven2
Promote staged artifacts into repository 'Releases'
Download snapshot and release artifacts from group https://oss.sonatype.org/content/groups/public
Download snapshot, release and staged artifacts from staging group https://oss.sonatype.org/content/groups/staging
please comment on this ticket when you promoted your first release, thanks
```
他告诉你, 如果你提交了版本, 最好告诉他一下, 不用管, 以后我们也不会理他的

### ----GPG篇----

**使用 GPG 生成密钥对**

Windows下载 Gpg4win 软件来生成密钥对, 地址：https://www.gpg4win.org/download.html

我用的mac, 使用brew安装的gpg  brew install gnupg

使用以下命令来生成秘钥对:
```bash
$ gpg --gen-key
#按照提示输入信息, 在输入密码的时候, 如果嫌麻烦就直接摁回车就可以, 这样秘钥就没有密码保护了, 密码保护只有在你的私钥泄露的时候才有用, 其他时候没用

$ gpg --list-keys
#这个指令会显示你的秘钥环, 类似于下面这样
#---------------------------------
#  pub   rsa4096 2018-09-25 [SC]
#    EABB59A7BFXXXXXX46604F95ED1503AA8CDxxxx  (这个才是秘钥ID)
#  uid           [ 绝对 ] xxx (zhushi) <xxx@163.com>
#  sub   rsa4096 2018-09-25 [E]

$ gpg --keyserver hkp://pool.sks-keyservers.net --send-keys 秘钥ID
#发送你的公钥到秘钥仓库, 以后你的jar会使用私钥签名, maven中央仓库会去几个指定的秘钥仓库去找公钥来验证这个签名, 如果不上传是不能通过审核的

$ gpg --keyserver hkp://pool.sks-keyservers.net --recv-keys 秘钥ID
#验证你的公钥是否上传成功, 如果返回结果是 **未改变, 那就是成功了
```

**2021-05-26 补充**

新版的 gpg 生成的秘钥对必须输入密码, 这样在 maven 中 deploy 报错:
gpg: 签名时失败： Inappropriate ioctl for device
gpg: signing failed: Inappropriate ioctl for device

**解决办法:**

```shell
$ cd ~/.gnupg

$ cat >> gpg.conf << EOF
use-agent
pinentry-mode loopback
EOF

$ cat >> gpg-agent.conf << EOF
allow-loopback-pinentry
EOF
```

**在 maven pom.xml 中配置 pgp 插件, 增加一项:**
<passphrase>秘钥密码</passphrase>


### ----maven篇----

**在你的maven顶级工程中加入以下配置**

```xml
<groupId>com.gomyck</groupId>
<artifactId>gomyck-quickdev</artifactId>
<packaging>pom</packaging>
<version>1.1.0-SNAPSHOT</version>
<name>gomyck-quickdev</name>
<url>http://www.gomyck.com</url>
<description>gomyck 快速开发平台</description>
<developers>
    <developer>
        <id>gomyck</id>
        <name>haoy</name>
        <url>www.gomyck.com</url>
        <email>hao474798383@163.com</email>
    </developer>
</developers>

<licenses>
    <license>
        <name>The Apache Software License, Version 2.0</name>
        <url>http://www.apache.org/licenses/LICENSE-2.0.txt</url>
    </license>
</licenses>

<scm>
    <connection>scm:git:git@github.com:mzxc/gomyck-fastdfs-spring-boot-starter.git</connection>
    <developerConnection>scm:git:git@github.com:mzxc/gomyck-fastdfs-spring-boot-starter.git</developerConnection>
    <url>git@github.com:mzxc/gomyck-fastdfs-spring-boot-starter.git</url>
</scm>

<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-source-plugin</artifactId>
            <version>3.8.0</version>
            <configuration>
                <attach>true</attach>
            </configuration>
            <executions>
                <execution>
                    <phase>compile</phase>
                    <goals>
                        <goal>jar</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-gpg-plugin</artifactId>
            <version>1.6</version>
            <executions>
                <execution>
                    <phase>verify</phase>
                    <goals>
                        <goal>sign</goal>
                    </goals>
                </execution>
            </executions>
            <configuration>
                <!-- 你的秘钥ID -->
                <keyname>${gpg.keyname}</keyname>
                <passphraseServerId>${gpg.keyname}</passphraseServerId>
                <passphrase>${gpg.passphrase}</passphrase>
            </configuration>
        </plugin>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-javadoc-plugin</artifactId>
            <version>3.1.1</version>
            <executions>
                <execution>
                    <phase>package</phase>
                    <goals>
                        <goal>jar</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>

<distributionManagement>
    <repository>
        <id>sonatype-nexus-staging</id>
        <url>https://oss.sonatype.org/service/local/staging/deploy/maven2/</url>
    </repository>
    <snapshotRepository>
        <id>sonatype-nexus-snapshots</id>
        <url>https://oss.sonatype.org/content/repositories/snapshots/</url>
    </snapshotRepository>
</distributionManagement>

```

**在你的settings.xml中加入以下配置**

```xml
<server>
    <id>sonatype-nexus-snapshots</id>
    <username>sonatype账号</username>
    <password>sonatype密码</password>
</server>
<server>
    <id>sonatype-nexus-staging</id>
    <username>sonatype账号</username>
    <password>sonatype密码</password>
</server>
<profiles>
  <profile>
      <activation>
        <activeByDefault>true</activeByDefault>
      </activation>
      <properties>
        <gpg.keyname>你的秘钥 ID</gpg.keyname>
      </properties>
  </profile>
</profiles>
```

运行deploy, 如果按照我的步骤一步一步走, 应该没有错误(如果报错也是你的doc问题, 按照提示一步一步改好, 否则maven审核会失败)

### ----nexus篇----

如果上一步没有错误的话, 访问网址: https://oss.sonatype.org/#stagingRepositories

点击右上角登录, 账号密码就是sonatype的账号密码, 登录进去之后, 点击Staging repositories

在右侧搜索框输入你的group id, 然后点击refresh, 就会看到你的提交信息

选中, 点击close, 这时当前的纪录就会变成一个小齿轮, 表示nexus在校验你的jar

按照剧本, 你的提交应该会全部通过(图标显示数字就是失败, 反之则是成功)

再次选中当前记录, 点击release, 就会上传成功了, 这时sonatype会给你发邮件

以后你只需要按照maven篇deploy, 然后在使用nexus篇提交release就可以了

**注意: 如果是snapshot版本, 则不需要审核, 直接deploy就可以直接引用, 但是在maven仓库(https://search.maven.org/)是搜索不到的**

### ----爬坑篇----

1.一开始总是提示文件验证签名失败, 提示我说没有在秘钥仓库找到对应的公钥, 但是我本地可以确定的是提交了且ID一致, 后来过了大概1小时, 验证忽然就过了,
这期间, 我把nexus提示的秘钥仓库地址都复制出来, 挨个上传我的公钥, 最后不知道是哪个仓库生效了, 但是我觉得是仓库延迟问题

2.以后写代码一定要把doc写好, 不然遇见这种场景, 简直就是折磨, 尤其doc多的时候

3.如果你有多个gpg秘钥, 一定要指定秘钥ID, 不然gpg插件是秘钥环的顺序来对你的工程签名的, 这会导致你上传的公钥不一定对应的上签名的私钥, 秘钥的ID请在settings.xml中配置profile, gpg插件的配置请到apache-gpg官网看

4.sonatype在国内环境下, 访问非常困难, 建议找个科学上网的方式, 来实践本教程
