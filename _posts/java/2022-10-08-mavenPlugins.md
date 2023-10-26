---
layout: post
title:  "Maven 打包, 一文通透"
crawlertitle: "Maven 打包, 一文通透"
subtitle: "maven fatjar"
ext: "install package plugins"
date:  2022-10-08
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['JAVA', '原创']
musicUri: 1839119892
musicTitle: My Way
musicFrom: Cassette
author: gomyck
openPay: true
---

maven 各种打包姿势, 再也不用担心各种花样打包了

在工作当中, 由于各种框架需要, 环境需要, 平台需要, 要求我们使用 maven 打包出各种类型的 jar 文件, 通过下述案例, 可针对当前应用场景使用不同方式的打包技术

### 需要给 jar 包加 git 版本号

在 pom 文件里可以使用下面的任意属性, 比如给 version 标签增加 git 版本号

```text
<version>1.2.1-${git.commit.id.abbrev}</version>
```

```json
{
  "git.branch" : "master",
  "git.build.host" : "localhost",
  "git.build.time" : "2019-08-28 17:05:33",
  "git.build.user.email" : "xxx@163.com",
  "git.build.user.name" : "xxx",
  "git.build.version" : "1.0-SNAPSHOT",
  "git.closest.tag.commit.count" : "",
  "git.closest.tag.name" : "",
  "git.commit.id" : "437e26172c51cab8fc88ea585145797df222fbb2",
  "git.commit.id.abbrev" : "437e261",
  "git.commit.id.describe" : "437e261-dirty",
  "git.commit.id.describe-short" : "437e261-dirty",
  "git.commit.message.full" : "获取版本信息",
  "git.commit.message.short" : "获取版本信息",
  "git.commit.time" : "2019-08-27 19:07:03",
  "git.commit.user.email" : "xxx@163.com",
  "git.commit.user.name" : "xxx",
  "git.dirty" : "true",
  "git.remote.origin.url" : "http://git.xxx.cn/gitlab/git/xxx.git",
  "git.tags" : "",
  "git.total.commit.count" : "3324"
}
```

```xml
<plugin>
  <groupId>pl.project13.maven</groupId>
  <artifactId>git-commit-id-plugin</artifactId>
  <version>2.2.5</version>
  <executions>
    <execution>
      <id>get-the-git-infos</id>
      <phase>
        prepare-package
      </phase>
      <goals>
        <goal>revision</goal>
      </goals>
    </execution>
  </executions>
  <configuration>
    <dotGitDirectory>${project.basedir}/.git</dotGitDirectory>
    <prefix>git</prefix>
    <verbose>false</verbose>
    <dateFormat>yyyy-MM-dd HH:mm:ss</dateFormat>
    <generateGitPropertiesFile>true</generateGitPropertiesFile>
    <generateGitPropertiesFilename>${project.build.outputDirectory}/git.properties</generateGitPropertiesFilename>
    <format>json</format>
    <abbrevLength>7</abbrevLength>
    <gitDescribe>
      <skip>false</skip>
      <always>false</always>
      <dirty>-dirty</dirty>
    </gitDescribe>
  </configuration>
</plugin>
```

### 场景 1: docker 容器需要的 jar

首先保证 docker 在宿主机上的环境是一样的, 其次, 在宿主机上建设统一路径的文件夹, 如: /usr/share/gomyck/xxx

使用下述插件打包, 可把当前工程打成分散的小包:

```xml
<plugin>
  <groupId>org.codehaus.mojo</groupId>
  <artifactId>appassembler-maven-plugin</artifactId>
  <version>2.1.0</version>
  <executions>
    <execution>
      <goals>
        <goal>assemble</goal>
      </goals>
    </execution>
  </executions>
  <configuration>
    <repositoryLayout>flat</repositoryLayout>
    <!-- 打包的jar，以及maven依赖的jar放到这个目录里面 -->
    <repositoryName>lib</repositoryName>
    <useWildcardClassPath>true</useWildcardClassPath>
    <!-- 配置文件的目标目录 -->
    <configurationDirectory>conf</configurationDirectory>
    <!-- 拷贝配置文件到上面的目录中 -->
    <copyConfigurationDirectory>true</copyConfigurationDirectory>
    <!-- 从哪里拷贝配置文件 (默认src/main/config) -->
    <configurationSourceDirectory>src/main/resources</configurationSourceDirectory>
    <includeConfigurationDirectoryInClasspath>true</includeConfigurationDirectoryInClasspath>
    <!--生成的项目的目录位置，这里的client是项目的名称，你可以根据你的需要自己随便命名 -->
    <assembleDirectory>${project.build.directory}/dist</assembleDirectory>
    <!-- 可执行脚本的目录 -->
    <binFolder>bin</binFolder>
    <programs>
      <program>
        <id>main</id>
        <!-- 启动类地址 -->
        <mainClass>cn.net.hylink.qingzhi.MessageRouteApplication</mainClass>
        <!-- 生成的脚本文件的名称，比如start.sh,你也可以根据你的需要命名成其他名字 -->
        <name>start</name>
        <jvmSettings>
          <initialMemorySize>20m</initialMemorySize>
          <maxMemorySize>256m</maxMemorySize>
          <maxStackSize>128m</maxStackSize>
          <systemProperties>
            <systemProperty>xxx=23456</systemProperty>
            <systemProperty>vvv="xaz"</systemProperty>
          </systemProperties>
          <extraArguments>
            <!-- <extraArgument>-server</extraArgument> -->
            <!-- <extraArgument>-Xmx1G</extraArgument> -->
            <!-- <extraArgument>-Xms1G</extraArgument> -->
          </extraArguments>
        </jvmSettings>
      </program>
    </programs>
    <!-- 生成linux, windows两种平台的执行脚本 -->
    <platforms>
      <platform>windows</platform>
      <platform>unix</platform>
    </platforms>
    <binFileExtensions>
      <unix>.sh</unix>  <!-- 设置生成文件为xshell脚本格式 -->
    </binFileExtensions>
  </configuration>
</plugin>
```

<a href="https://www.mojohaus.org/appassembler/appassembler-maven-plugin/assemble-mojo.html" style="color: blue;" target="_blank">详细文档</a>

<a href="https://www.mojohaus.org/appassembler/appassembler-maven-plugin/usage-program-jvmsettings.html" style="color: blue;" target="_blank">JVM设置</a>

生成的目录结构:

```text

--dist
  --bin   可执行脚本存放文件夹
  --conf  配置文件文件夹
  --lib   jar 包(所有的依赖和当前工程, 均打成小 jar)
```

**使用该方式打包的 jar, 通过与jre 镜像的约定规则, 自动调用 start.sh完成服务的启动, 以后每次升级, 只需要替换 lib 中的工程 jar 就可以, 不需要替换额外的依赖 jar, 每次升级只需要传几百KB的文件即可**

### 场景 2: flink 需要的 jar

通过 flink 启动的 task 需要的 jar 为完整的 fatjar, 通常情况下, 我们可以使用 flink 官方例子中的 shade 插件来完成打包

```xml
<!-- We use the maven-shade plugin to create a fat jar that contains all necessary dependencies. -->
<!-- Change the value of <mainClass>...</mainClass> if your program entry point changes. -->
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-shade-plugin</artifactId>
  <version>3.0.0</version>
  <executions>
    <!-- Run shade goal on package phase -->
    <execution>
      <phase>package</phase>
      <goals>
        <goal>shade</goal>
      </goals>
      <configuration>
        <artifactSet>
          <excludes>
            <exclude>org.apache.flink:flink-shaded-force-shading</exclude>
            <exclude>org.apache.flink:flink-streaming-java</exclude>
            <exclude>org.apache.flink:flink-clients</exclude>
            <exclude>com.google.code.findbugs:jsr305</exclude>
            <!--<exclude>org.slf4j:*</exclude>-->
            <exclude>org.apache.logging.log4j:*</exclude>
          </excludes>
        </artifactSet>
        <filters>
          <filter>
            <!-- Do not copy the signatures in the META-INF folder.
            Otherwise, this might cause SecurityExceptions when using the JAR. -->
            <artifact>*:*</artifact>
            <excludes>
              <exclude>META-INF/*.SF</exclude>
              <exclude>META-INF/*.DSA</exclude>
              <exclude>META-INF/*.RSA</exclude>
            </excludes>
          </filter>
        </filters>
        <transformers>
          <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
            <mainClass>com.gomyck.FlinkItApplication</mainClass>
          </transformer>
          <!-- 这个配置会使 META-INF/services 文件夹下的文件合并, 因为使用了 spi 的机制, 会存在好多 services的文件, 涉及到相同接口的实现会覆盖 -->
          <transformer implementation="org.apache.maven.plugins.shade.resource.ServicesResourceTransformer"/>

          <!-- 下面的配置是为了把 spring 的元数据配置合并, 否则这些文件会覆盖 -->
          <!--
          <transformer implementation="org.apache.maven.plugins.shade.resource.AppendingTransformer">
            <resource>META-INF/spring.handlers</resource>
          </transformer>
          <transformer implementation="org.apache.maven.plugins.shade.resource.AppendingTransformer">
            <resource>META-INF/spring.schemas</resource>
          </transformer>
          <transformer implementation="org.apache.maven.plugins.shade.resource.AppendingTransformer">
            <resource>META-INF/spring.tooling</resource>
          </transformer>
          <transformer implementation="org.apache.maven.plugins.shade.resource.AppendingTransformer">
            <resource>META-INF/spring.factories</resource>
          </transformer>
          -->
        </transformers>
      </configuration>
    </execution>
  </executions>
</plugin>
```

这种方式打的 jar 包是 fatjar, 并且会排除 flink runtime 中存在的依赖, 并且这种依赖排除是传递的: 比如排除的是 org.apache.flink:flink-clients, 那么这个依赖 pom 文件中的所有依赖将会被排除

相反的例子就是使用  maven-dependence 插件排除依赖, org.apache.flink:flink-clients 仅仅会排除自身, 但这个依赖 pom 文件中描述的其他依赖, 将会被打进 fatjar 中

**上述例子可以打包出 fatjar, 但不支持在工程中使用 spring 容器, 读取不到配置文件, 没找到原因, 而且这种打包方式会把所有的依赖转换成 class, 与工程文件混在一起, 不好维护**

最后使用下述的方式解决 fatjar 打包问题

```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-dependency-plugin</artifactId>
  <executions>
    <execution>
      <id>copy-compile-dependencies</id>
      <phase>package</phase>
      <goals>
        <goal>copy-dependencies</goal>
      </goals>
      <configuration>
        <type>jar</type>
        <includeTypes>jar</includeTypes>
        <outputDirectory>
          ${project.build.directory}/lib
        </outputDirectory>
        <excludeScope>provided</excludeScope>
        <!-- 依赖传递, 打开这个也有问题, 不用这个注解, 仅排除依赖自身 -->
        <!--<excludeTransitive>true</excludeTransitive>-->
      </configuration>
    </execution>
  </executions>
</plugin>

<!-- 这个插件没啥用, 主要是打单体 jar 时, 用一用 -->
<!--<plugin>-->
<!--  <groupId>org.apache.maven.plugins</groupId>-->
<!--  <artifactId>maven-jar-plugin</artifactId>-->
<!--  <configuration>-->
<!--    <classesDirectory>target/classes/</classesDirectory>-->
<!--    <archive>-->
<!--      &lt;!&ndash;生成的jar中，不要包含pom.xml和pom.properties这两个文件&ndash;&gt;-->
<!--      <addMavenDescriptor>false</addMavenDescriptor>-->
<!--      <manifest>-->
<!--        <mainClass>com.gomyck.FlinkItApplication</mainClass>-->
<!--        &lt;!&ndash; 打包时 MANIFEST.MF文件不记录的时间戳版本 &ndash;&gt;-->
<!--        <useUniqueVersions>false</useUniqueVersions>-->
<!--        <addClasspath>true</addClasspath>-->
<!--        <classpathPrefix>lib/</classpathPrefix>-->
<!--      </manifest>-->
<!--      <manifestEntries>-->
<!--        &lt;!&ndash;jar中的MANIFEST.MF文件ClassPath需要添加config目录才能读取到配置文件&ndash;&gt;-->
<!--        <Class-Path>config/ .</Class-Path>-->
<!--      </manifestEntries>-->
<!--    </archive>-->
<!--  </configuration>-->
<!--</plugin>-->

<plugin>
  <artifactId>maven-antrun-plugin</artifactId>
  <version>1.3</version>
  <executions>
    <execution>
      <id>copy-lib-src-webapps</id>
      <phase>install</phase>
      <goals>
        <goal>run</goal>
      </goals>
      <configuration>
        <tasks>
          <echo message="开始构建JAR包..."/>
          <copydir dest="${project.build.directory}/${project.build.finalName}-final/lib" src="${project.build.directory}/lib/"/>
          <copydir dest="${project.build.directory}/${project.build.finalName}-final/" src="${project.build.directory}/classes/"/>
          <jar basedir="${project.build.directory}/${project.build.finalName}-final/" destfile="${project.build.directory}/${project.build.finalName}-final.jar">
            <manifest>
              <attribute name="Main-Class" value="com.gomyck.FlinkItApplication"/>
            </manifest>
          </jar>
        </tasks>
      </configuration>
    </execution>
  </executions>
</plugin>
```

<a href="https://maven.apache.org/plugins/maven-antrun-plugin/usage.html" style="color: blue;" target="_blank">ANT 使用<a>

<a href="https://ant.apache.org/manual/tasksoverview.html" style="color: blue;" target="_blank">ANT 使用<a>

### 其他 fatjar 打包方式:

```xml
<plugin>
  <artifactId>maven-assembly-plugin</artifactId>
  <configuration>
    <archive>
      <manifest>
        <!--这里要替换成jar包main方法所在类 -->
        <mainClass>com.gomyck.mail.MailSend</mainClass>
      </manifest>
    </archive>
    <descriptorRefs>
      <descriptorRef>jar-with-dependencies</descriptorRef>
    </descriptorRefs>
  </configuration>
  <executions>
    <execution>
      <id>make-assembly</id>
      <phase>package</phase>
      <goals>
        <goal>single</goal>
      </goals>
    </execution>
  </executions>
</plugin>
```
