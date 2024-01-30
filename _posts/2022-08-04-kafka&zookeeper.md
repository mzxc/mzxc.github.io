---
layout: post
title:  "Docker 环境开启 kafka&zookeeper SASL认证机制"
crawlertitle: "Docker 环境开启 kafka&zookeeper SASL认证机制"
subtitle: "DOCKER LINUX KAFKA ZK ZOOKEEPER"
ext: "centos"
date:  2022-08-04
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['SERVER', 'DOCKER']
musicUri: 25888656
musicTitle: Leadfoot Getaway
musicFrom: Vicetone
author: gomyck
openPay: true
---

线上 kafka&zk 集群为了增强数据安全性, 需要开启鉴权机制, 从网上找了资料, 绝大多数都是错误的配置或者掺杂了很多多余的配置步骤, 故整理梳理了一套简单可靠的配置方式



### 环境
```text
MacBook Pro-12.5

Docker destop 4.10.1 (82475)
       Engine: 20.10.17
       Compose: 1.29.2

zookeeperImage: debezium/zookeeper:1.7.2.Final

kafkaImage: debezium/kafka:1.7.2.Final
```

### 开始配置

#### docker volume 的映射

因为需要更改 kafka 和 zk 的 配置文件以及启动脚本, 故需要把容器内的文件先 copy 出来 (docker cp containerId:/path /localPath)

**主要是把 bin conf 两个文件夹复制出来, 然后映射到 docker**

#### 修改配置文件

##### 1.修改 kafka 配置文件: server.properties

```properties
# 修改配置

# debezium/kafka 这个镜像每次都会重置 listeners和advertised.listeners为 PLAINTEXT://xxxxx, 代码里写死了, 所以监听器的名字必须叫 PLAINTEXT
listeners=PLAINTEXT://ip:9092
advertised.listeners=PLAINTEXT://ip:9092
# 新增配置

# 这个配置是监听器使用的鉴权安全协议, 如果需要开启鉴权, 必须要配置
listener.security.protocol.map=PLAINTEXT:SASL_PLAINTEXT
#inter broker 配置是 broker 内部通讯监听器的名称, 这个是必须要配置的(我这里配置的监听器的名字是PLAINTEXT, 因为debezium/kafka这个镜像的原因)
inter.broker.listener.name=PLAINTEXT
super.users=User:kafka
# 开启 zookeeper 鉴权时这个为 true
zookeeper.set_acl=true
sasl.enabled.mechanisms = PLAIN
allow.everyone.if.no.acl.found=true
sasl.mechanism.inter.broker.protocol = PLAIN
# 1.x版本用这个
# authorizer.class.name=kafka.security.auth.SimpleAclAuthorizer
authorizer.class.name=kafka.security.authorizer.AclAuthorizer
```

##### 2.新增 kafka 鉴权文件: kafka_server_jaas.conf

```text
KafkaServer {
   org.apache.kafka.common.security.plain.PlainLoginModule required
   username="admin"
   password="gomyck_admin"
   user_admin="gomyck_admin"
   user_kafka="gomyck_kafka";
};

# 不开启 zookeeper 这个就删掉 后面的配置也可以忽略了
Client {
   org.apache.kafka.common.security.plain.PlainLoginModule required
   username="kafka"
   password="gomyck_kafka";
};
```
**KafkaServer 配置中, username 是 kafka broker 互相通信的凭证, 且必须要配置 user_admin 这一项, 否则启动之后报错**

user_kafka 是声明了一个用户: kafka (这个用户可以提供给客户端连接使用), 密码是 gomyck_kafka

**Client 配置中, 配置的是连接 zookeeper 的凭证信息(密码需要与 zookeeper 的配置一致, 下面有配置), 且 username 必须是 kafka, 否则报错(应该是 getAcl /config 只有 kafka 用户有读取权限导致)**

##### 3.修改 kafka 启动脚本: kafka-server-start.sh

找到 KAFKA_HEAP_OPTS 这个配置项, 加入下述 -D 配置
```shell
$ export KAFKA_HEAP_OPTS="-Xmx1G -Xms1G -Djava.security.auth.login.config=/kafka/config/kafka_server_jaas.conf"
```

##### 4.修改 zookeeper 配置文件: zoo.cfg
```properties
authProvider.1=org.apache.zookeeper.server.auth.SASLAuthenticationProvider
requireClientAuthScheme=sasl
jaasLoginRenew=3600000
4lw.commands.whitelist=
```

##### 5. 新增 zookeeper 鉴权文件: zk_server_jaas.conf

```text
Server {
  org.apache.zookeeper.server.auth.DigestLoginModule required
  username="admin"
  password="admin123"
  user_admin="admin123"
  user_kafka="gomyck_kafka";
};
```
**Server 中, username 是 zookeeper 集群之间通信用的账户, user_kafka 是 zk 中的一个账户, 它与 kafka_server_jaas.conf 中的 kafka 相对应**

##### 6. 修改 zkEnv.sh

找到 SERVER_JVMFLAGS 配置项, 加入下述 -D 配置

```shell
export SERVER_JVMFLAGS="-Xmx${ZK_SERVER_HEAP}m $SERVER_JVMFLAGS -Djava.security.auth.login.config=/zookeeper/conf/zk_server_jaas.conf  -Dzookeeper.allowSaslFailedClients=false"
```

##### 7. 从 kafka 工程中的 libs 文件夹复制两个文件到 zookeeper 的 libs 下:
```text
kafka-clients-2.8.1.jar
lz4-java-1.7.1.jar
```

##### 8. 启动 zk&kafka 服务即可

### 工程中的 kafka 配置

```text
sasl.mechanism=PLAIN
security.protocol=SASL_PLAINTEXT
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="admin" password="admin";
```

### zk 的 addauth & getAcl & setAcl

**添加用户**

addauth digest admin:123456

**设置权限**

setAcl / auth:kafka:cdrwa

setAcl /test ip:127.0.0.1:cdrwa,ip:192.168.10.3:cdrwa

**查看权限**

getAcl /

### 忘记密码修复方式

进入配置文件zoo.cfg, 修改配置, 设置跳过Acl验证, 配置如下:

skipACL=yes

重启zookeeper


