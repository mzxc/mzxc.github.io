---
layout: post
title:  "Maven 配置篇"
crawlertitle: "Maven 配置篇"
subtitle: "Maven Java setting.xml pom.xml fatjar"
ext: "华为 微内核"
date:  2019-08-09
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['PROJECT MANAGE', '原创']
musicUri: 188459
musicTitle: 千千阙歌
musicFrom: 张国荣
author: gomyck
openPay: true
---

Maven构建工具的配置说明, 包括全局配置以及pom配置, 了解maven各个配置标签的作用, 以及配置作用域

### ----环境变量篇----

#### 环境变量(mac)
**windows环境变量与下面一致, 只不过形式上有些出入**
```text
MAVEN_HOME=/Users/medness/work/apache-maven-x.x.x
export MAVEN_HOME
export PATH=${MAVEN_HOME}/bin:$PATH
```

### maven环境中, 配置的优先级
> pom.xml > user settings > setting.xml  如果同时存在, 取并集, 并按优先级覆盖ID相同的配置(就近原则)

> maven工程之间可以形成依赖关系, 且依赖关系自上向下传递, 类似java的继承, 父节点有的特性, 如果在子节点中pom中没被重写, 则子节点继承父节点的特性


### setting.xml中的标签说明

**localRepository:**

maven本地仓库盘符, maven在构建的时候, 会优先到当前电脑的指定仓库位置去寻找声明的依赖信息
```xml
<localRepository>/Users/medness/work/MavenRepository/repos</localRepository>
```

**pluginGroups:**

当我们使用插件的时候, 如果插件的groupId没有被显式的声明, 那么maven会默认使用当前标签内的配置信息, 当做当前使用插件的groupId
```xml
<pluginGroups>
  <!--plugin的组织Id（groupId） -->
  <pluginGroup>com.gomyck</pluginGroup>
</pluginGroups>
```

**proxies**

maven网络代理, 不多说

**servers**

这个标签是一个辅助标签, 有时候远程仓库需要用户名密码来download||deploy, 使用这个标签来记录远程仓库的账号密码, id是记录仓库的唯一标识, 是不允许重复的.
```xml
<server>
    <id>gomyck-repo-releases</id>
    <username>xxxx</username>
    <password>xxxxxxx</password>
</server>
```

**mirrors**

镜像标签, 用来指定声明的仓库资源位置在哪里, 比如maven的central仓库, 原本的地址为: http://repo.maven.apache.org/maven2/, 我们可以通过镜像标签来改变这个中央仓库的资源位置到国内淘宝, 加快依赖下载速度
```xml
<mirror>
  <id>central-repo</id>
  <name>maven central repo</name>
  <url>https://maven.aliyun.com/repository/central</url>
  <mirrorOf>central</mirrorOf>
</mirror>
```

**profiles**

这个标签跟pom中的意思一样, 但是它是片段化的, 没有pom文件中的profile子标签类型多, 因为其在setting中代表的是全局的profile, 所以只保留了通用的标签,
我通常使用这个标签来设置仓库的使用,  下面简单说下其他子标签的作用

profile配置好之后, 如果使用eclipse, 则在当前工程根目录右键, 点击maven> select maven profile> 选择配置好的profile,
如果使用IDEA, 那么在右侧, 点击maven侧边栏, 在弹出的面板最上面, 会有profiles的下拉列表, 勾选要使用的profile即可
```xml
<profiles>
  <profile>
      <id>gomyck-repo-ali-all</id>
      <!-- 可以被自动触发, 这个字标签是个辅助标签, 需要配合Activation标签使用 -->
      <activation>
          <!-- 具体配置看下一个配置说明 -->
      </activation>
      <!-- 扩展属性, 也是个辅助标签, 与<properties> 标签组合使用 -->
      <properties />
      <repositories>
          <repository>
              <id>gomyck-repo-releases</id>
              <url>https://repo.rdc.aliyun.com/repository/17470-release-K5GxQ2/</url>
          </repository>
          <repository>
              <id>gomyck-repo-snapshots</id>
              <url>https://repo.rdc.aliyun.com/repository/17470-snapshot-JPWNMN/</url>
              <snapshots>
                  <!-- 激活仓库快照版本下载 -->
                  <enabled>true</enabled>
                  <!-- 更新策略为每次构建都检查更新 -->
                  <updatePolicy>always</updatePolicy>
            </snapshots>
          </repository>
      </repositories>
  </profile>
</profiles>
```
**profile中激活条件标签(activation)说明:**
```xml
<!-- profile标签内的字标签, 以下条件, 只要满足其一, 即可激活其父profile标签 -->
<activation>
    <!-- 默认不激活 -->
    <activeByDefault>false</activeByDefault>
    <!-- 所有不是1.5版本的环境都激活 -->
    <jdk>!1.5</jdk>
    <os>
        <!--激活profile的操作系统的名字 -->
        <name>Windows XP</name>
        <!--激活profile的操作系统所属家族(如 'windows') -->
        <family>Windows</family>
        <!--激活profile的操作系统体系结构 -->
        <arch>x86</arch>
        <!--激活profile的操作系统版本 -->
        <version>5.1.2600</version>
    </os>
    <!--如果Maven检测到某一个属性（其值可以在POM中通过${name}引用），其拥有对应的name = 值，Profile就会被激活。如果值字段是空的，那么存在属性名称字段就会激活profile，否则按区分大小写方式匹配属性值字段 -->
    <property>
        <!--激活profile的属性的名称 -->
        <name>mavenVersion</name>
        <!--激活profile的属性的值 -->
        <value>2.0.3</value>
    </property>
    <!--提供一个文件名，通过检测该文件的存在或不存在来激活profile。missing检查文件是否存在，如果不存在则激活profile。另一方面，exists则会检查文件是否存在，如果存在则激活profile。 -->
    <file>
        <!--如果指定的文件存在，则激活profile。 -->
        <exists>${basedir}/file2.properties</exists>
        <!--如果指定的文件不存在，则激活profile。 -->
        <missing>${basedir}/file1.properties</missing>
    </file>
</activation>
```
#### profile可以设置默认激活, 且不写ID的时候, 就会全局激活该配置, 而且IDEA的profiles列表是看不到这个配置的


**ActiveProfiles**

激活的profile列表
```xml
<activeProfiles>
  <!-- 激活的profile id -->
  <activeProfile>gomyck-repo-ali-all</activeProfile>
</activeProfiles>
```

**Offline**

构建时是否为离线模式, 当网络不好时, 构建非常缓慢, 可设置该属性为true, 使用本地仓库加快构建速度

> setting.xml一次设置, 终身使用, 所以在配置改文件时, 要保证通用性, 易用性, 并且涉及到账号密码的setting文件, 最好不要提供给他人复用, 以免敏感信息泄露


### pom.xml的使用

pom文件是标识当前工程为maven工程的声明文件, maven通过该文件来对以其为相对根目录的工程文件进行相应的构建操作, 如用CPU 硬盘 内存等信息描述一台计算机的构成一样, pom文件
中的标签也在用类似的方式描述当前工程的构成, 以及构建细节, 通过其内的标签, 来描述当前工程的基本信息, 属性, 依赖信息, 构建信息, 部署信息....

#### 如何描述当前的maven工程
使用groupId, artifactId, version三个基本标签来描述当前maven工程, 通常是这样的:
```xml
<groupId>com.gomyck</groupId>
<artifactId>demo</artifactId>
<version>0.0.1-SNAPSHOT</version>
```
以上三个顶级标签, 声明了当前工程的基本信息, groupId一般情况下, 都使用你的域名倒叙, artifactId用来描述当前工程的应用信息
通过上述三个标签, 确定了当前工程全球唯一性, 当然, 还有一些辅助标签, 用来对其补充额外的基本信息, 比如作者信息等

#### pom.xml中的标签说明

```xml

<!-- 当前工程的父节点 -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.1.3.RELEASE</version>
</parent>

<groupId>com.gomyck</groupId>
<artifactId>fastdfs</artifactId>
<version>0.0.1-SNAPSHOT</version>
<!-- 打包方式 -->
<packaging>jar</packaging>

<!-- 工程名字, 没啥用, 就是个声明 -->
<name>fastdfs</name>

<!-- 当前maven环境中的变量, 可以使用${xxx} 来引用标签内的值 -->
<properties>
    <spring-boot.version>2.1.3.RELEASE</spring-boot.version>
    <spring-cloud.version>Greenwich.SR2</spring-cloud.version>
</properties>

<!-- 当前工程的依赖信息, 一般来说, 配置通用的就可以了, 其余的在各个子工程中单独引入 -->
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-websocket</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-cache</artifactId>
    </dependency>
</dependencies>

<!-- 工程构建插件配置, 可以指定打包组件信息, 源代码打包组件信息, 还可以指定默认的插件信息 -->
<build>
    <!-- project为maven内置变量, 为当前工程名称 -->
    <finalName>${project.name}</finalName>
    <plugins>
        <!-- 插件信息 -->
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>

<!-- 远程仓库配置, 在原有资源仓库集合中, 增量加入该配置 -->
<repositories>
    <repository>
        <id>spring-milestones</id>
        <name>Spring Milestones</name>
        <url>https://repo.spring.io/milestone</url>
        <snapshots>
            <enabled>false</enabled>
        </snapshots>
    </repository>
</repositories>

<!-- 依赖管理组件, 知道为什么上面依赖信息都没有version吗, 因为有这个组件, 这也是spring cloud为我们指定好的,
符合当前spring版本的最优依赖版本配置, 有了这个配置, 一些被spring官方收录且管理的第三方依赖, 就不需要写版本号了 -->
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>${spring-cloud.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>

<!-- 我们写好的工程打包供别人使用的时候, 要发布到局域网私服或远程仓库地址, 就可以用以下配置,
如果当前的仓库有密码, 那么需要在setting.xml中servers标签中, 配置一个和当前仓库ID一致的配置
注意: 配置只能有一套, 也就是说, 发布的仓库只能指定一个, 如果需要发布多个, 需要顺序发布, 而不能并发发布-->
<distributionManagement>
    <!-- 远程仓库的地址信息 -->
    <repository>
        <!-- 要与server标签的id对应上 -->
        <id>holystar-dependence</id>
        <url>http://xxx.xxx.xxx.xxx:xxxx/repository/xxxxx/</url>
    </repository>
    <snapshotRepository>
        <id>holystar-dependence</id>
        <url>http://xxx.xxx.xxx.xxx:xxxx/repository/xxxxx/</url>
    </snapshotRepository>
</distributionManagement>

<!-- 当前工程的子模块信息, 使用这个标签, 会在构建当前工程时, 把构建命令传递到其内的子模块中, 该标签在逻辑上, 规范maven工程的结构信息 -->
<modules>
    <module>gomyck-config</module>
    <module>gomyck-fastdfs</module>
</modules>

```

### ----其他知识点----

华为终于官宣了其自研的鸿蒙OS, 并称其为微内核全场景分布式AI...架构, 不好意思, 我有点醉了

分不清到底是一堆营销词还是真的有那么夸张, 毕竟把时下最流行的词都揉到一起念了出来, 肺活量小的人还真做不到.

以下属于个人理解:

> 关于微内核的定义: 剔除宏内核臃肿的内核组件, 仅保留最基本的系统服务, 比如线程, 任务, 进程通信(IPC), 内存管理等, 原来宏内核中的驱动, 文件管理, IO, 网络服务等, 统统排出到内核外, 以模块形式实现

**优点:**

1. 服务模块化, 因为微内核只提供最基本的服务, 剩下的都属于应用层, 所以只要厂商做适配, 那么所有设备都可以兼容微内核, 所有设备都可以选择性的做模块化适配

2. 安全, 微内核代码只有几万行, 且是可以用数学验证其是free bug的, 所以微内核在汽车嵌入式领域, 航天, 医疗方面使用时非常广泛的, 举个例子, 为什么说黑莓手机非常安全,
因为早些年黑莓手机使用的就是微内核系统, QNX (发布会说鸿蒙OS有优秀的安全性, 没明白是在哪方面安全, 是网络安全, 还是数据安全, 还是没有后门)

3. 兼容, 能使不同的操作特性的系统在一个系统中共存, 因为基础服务都是模块, 当然想怎么玩就怎么玩

**缺点:**

1. 进程之间的消息传递, 正是因为所有服务都被独立分配内存, 模块化, 导致进程之间的通信开销变的非常大

2. 服务间接口设计, 模块化带来两个服务之间复杂接口的定义变得异常困难

3. 最重要一点, 生态, 微内核是学术界的宠儿, 但并不代表是业界的宠儿(工业界), 情怀虽然可以有, 但是投入巨大的成本去适配一个后起之秀, 任何企业都会三思后行,
任何时候, 生态最终会决定一个技术产物的兴衰, 至少工业界如此, 没有厂商为你做兼容, 驱动, 没有客户买单, 再好的东西都是死路一条, 个人或者小群体的努力, 并不能左右世界的浪潮

**总结:**

如果是为了提高销量或者利益相关来刺激国民G点, 那一年半载即可见分晓, 如果是真正干事的话, 华为确实是走在国内厂商头前的超级英雄

BUT: talk is cheap, show me the code!
