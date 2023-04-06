---
layout: post
title:  "maven构建openfire插件"
crawlertitle: "maven构建openfire插件"
subtitle: "Maven Java Plugins Ant"
ext:
date:  2019-10-30
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['PROJECT MANAGE', '原创']
musicUri: 167946
musicTitle: 阿飞的小蝴蝶
musicFrom: 萧敬腾
author: gomyck
openPay: true
---

记录一次使用maven插件构建openfire插件的全部过程

因为项目需要, 故把openfire源码下载下来修改发布, 期间要使用自己编写的openfire插件, 最新版的openfire使用maven构建, 故插件的项目构建方式也使用了maven, openfire的插件目录结构非常特殊,
<a href="http://download.igniterealtime.org/openfire/docs/latest/documentation/plugin-dev-guide.html" style="color: blue;" target="_blank">点我了解更多<a>, 需要个性化
的maven配置才能生成可用的插件jar

### 项目结构
```text
project/
  |- pom.xml
  |- plugin.xml
  |- readme.html
  |- changelog.html
  |- logo_small.gif
  |- logo_large.gif
  |- src
    |- main
      |- java(source dir)
      |- web
```

### 构建过程

首先把src-main下的java设置成source root文件夹, 使下面的类可以引用jdk环境, 编写好代码之后, 直接编写pom文件, 用maven插件去定义生成好的jar包内部结构

```text
爬坑1: 与src平级的几个文件不能打进jar包, 因为顶级文件夹并不是resources文件夹

解决1: 使用maven-resources插件, 指定resource位置, 与在jar里的位置,
也可以直接在build标签下使用resources标签声明, 这是maven的约定写法, 不过我还是声明了插件

爬坑2: 仔细看openfire插件结构, 可以看到, 插件jar里面有个lib文件夹, lib下存放的jar才是真正java代码打包好的文件,
我一开始想着使用resources插件, 把打包好的jar重复放进jar里(相当于向自己里放了个自己), 后来证明是矛盾的, 而且是不好使的

解决2: 使用ant插件, 定义最终的jar结构, 并且配置maven-jar, 只编译java类, 其余组织的工作交给ant插件做

```

### pom文件(附说明)

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <!-- 父工程为openfire插件工程 -->
    <parent>
        <artifactId>plugins</artifactId>
        <groupId>org.igniterealtime.openfire</groupId>
        <version>4.4.2</version>
    </parent>
    <groupId>com.gomyck</groupId>
    <artifactId>openfire-plugin-gomyck-sendmessage</artifactId>
    <name>Openfire Plugin Gomyck Sendmessage</name>
    <description>
        消息插件
    </description>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <build>
        <!-- 初次打包的jar名称 -->
        <finalName>gomyck-sendMessage</finalName>
        <plugins>
            <!-- maven编译插件, 声明周期为compiler, 主要负责编译java类 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.5.1</version>
                <configuration>
                    <!-- 源代码开发版本 -->
                    <source>1.8</source>
                    <!-- 目标编译版本 -->
                    <target>1.8</target>
                    <!-- 编码方式 -->
                    <encoding>${project.build.sourceEncoding}</encoding>
                </configuration>
            </plugin>
            <!-- maven 打jar包插件, 这个插件遇到的坑最多, 其遵循就近原则, 如果在configuration中写了配置,
            那么其默认的配置都会不好使, 比如include, 如果用了, 那么只会编译include的类 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.1.0</version>
                <configuration>
                    <!-- 只在jar里放class文件, 如果不写这个, 那么resources插件生成的资源文件也会打进jar里, 如果写了这个,
                     resources插件只会在target-class文件夹下生成文件 -->
                    <includes>
                        <include>**/com/gomyck/**</include>
                    </includes>
                    <outputDirectory>${project.build.directory}</outputDirectory>
                </configuration>
            </plugin>

            <!-- maven 资源插件, 这个插件主要把一些外部文件变成打包时的资源文件 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-resources-plugin</artifactId>
                <version>3.1.0</version>
                <executions>
                    <execution>
                        <phase>install</phase>
                        <!-- resources 和 copy-resources, 如果是resources,
                        则直接会在jar包里体现, 如果是copy-resources, 那还必须指定要copy的目标文件夹位置 -->
                        <goals>
                            <goal>resources</goal>
                        </goals>
                    </execution>
                </executions>
                <configuration>
                    <resources>
                        <resource>
                            <!-- 资源文件所在文件夹 -->
                            <directory>${project.basedir}</directory>
                            <!-- 是否使用文件过滤器 -->
                            <filtering>true</filtering>
                            <!-- 如果使用过滤器, 那么包含哪些文件 -->
                            <includes>
                                <include>changelog.html</include>
                                <include>logo_large.gif</include>
                                <include>logo_small.gif</include>
                                <include>plugin.xml</include>
                                <include>readme.html</include>
                            </includes>
                        </resource>

                        <resource>
                            <directory>${project.basedir}/src/main/web</directory>
                            <!-- jar包目标位置, 下面的意思是会在jar的根目录下建立web文件夹,
                            并且把src/main/web下的所有文件都copy进去 -->
                            <targetPath>web</targetPath>
                        </resource>

                    </resources>
                </configuration>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-dependency-plugin</artifactId>
                <version>3.1.0</version>
                <executions>
                    <execution>
                        <id>copy-dependencies</id>
                        <phase>package</phase>
                        <goals>
                            <goal>copy-dependencies</goal>
                        </goals>
                        <configuration>
                            <outputDirectory>${project.build.directory}/lib</outputDirectory>
                            <overWriteReleases>true</overWriteReleases>
                            <overWriteSnapshots>true</overWriteSnapshots>
                            <overWriteIfNewer>true</overWriteIfNewer>
                            <includeGroupIds>
                                com.gomyck,
                                com.alibaba,
                                org.bouncycastle,
                                org.jasypt,
                                org.apache.httpcomponents,
                                com.google.code.gson,
                                org.apache.poi
                            </includeGroupIds>
                        </configuration>
                    </execution>
                </executions>
            </plugin>

            <plugin>
                <!-- ant插件, 这个最重要了, 以上三个插件只是能够零散的把文件编译并放在target文件夹下,
                我使用ant插件, 把文件整理起来, 并压缩到指定的jar里面 -->
                <artifactId>maven-antrun-plugin</artifactId>
                <version>1.3</version>
                <executions>
                    <execution>
                        <!-- 调用阶段 -->
                        <phase>install</phase>
                        <goals>
                            <!-- 目标(命令) -->
                            <goal>run</goal>
                        </goals>
                        <configuration>
                            <tasks>
                                <echo message="开始构建插件包..."></echo>
                                <copy todir="${project.build.directory}/${project.build.finalName}-final/lib" overwrite="true" file="${project.build.directory}/${project.build.finalName}.jar"></copy>
                                <copydir dest="${project.build.directory}/${project.build.finalName}-final/" src="${project.build.directory}/classes/" excludes="org/**"></copydir>
                                <jar basedir="${project.build.directory}/${project.build.finalName}-final/" destfile="${project.build.directory}/${project.build.finalName}-final.jar"></jar>
                                <delete dir="${project.build.directory}/${project.build.finalName}-final/"></delete>
                            </tasks>
                        </configuration>
                    </execution>
                </executions>
            </plugin>

        </plugins>
    </build>
</project>
```

### ant文档地址(所有的ant构建命令可在此查看)

<a href="https://maven.apache.org/plugins/maven-antrun-plugin/usage.html" style="color: blue;" target="_blank">点击前往<a>

<a href="https://ant.apache.org/manual/tasksoverview.html" style="color: blue;" target="_blank">点击前往<a>
