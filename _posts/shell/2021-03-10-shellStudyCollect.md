---
layout: post
title:  "Shell 脚本的一些常用语法分析"
crawlertitle: "Shell 脚本的一些常用语法分析"
subtitle: "SHELL LINUX"
ext: "JAR 启动 while case in 变量引用"
date:  2021-03-10
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['SHELL', '原创']
musicUri: 1399664349
musicTitle: 世间美好与你环环相扣
musicFrom: 吕口口
author: gomyck
openPay: true
---

整理学习 shell 脚本编写过程中遇到的各种疑难杂症, 以及分享一个 jar 包启动脚本, 万能呦~~~

<style>
  table  th:nth-of-type(1) {width: 20%;text-align: center}
  table  th:nth-of-type(2) {width: 10%;text-align: center}
  table  td:nth-of-type(3) {width: 70%;text-align: left;font-size:7px}
</style>

#### grep 的一个小技巧

grep *.jar  这个命令, 依赖当前文件夹下的 jar 的名称, 然后在去匹配

也就是说 当前文件夹下匹配的 jar 包名称, 会自动替换 *.jar

可以使用 echo *.jar 实验

多个匹配的结果会用空格隔开

### shell 脚本编写过程中需要注意的事项

```text
1. = 号是赋值符号, 前后不允许有空格, 不然会报错
2. 字符串是赋予变量的值, 必须使用单引号 ''  或者双引号 ""  包围, 否则会有语义错误
3. 变量的引用, 需要使用 ${param} 这类方式引用
4. if[] 是标准的判断表达式, [] 与 test 命令一样, 可以判断表达式是否为真,  if[[]] 支持正则等, 表达式左右必须要有空格!!!!!!!!!!
5. -a 叫选项 option  abc 叫参数 parameter
```

### 例子代码

```shell

#!/bin/sh

echo "
 *************************************
 *          Author by gomyck         *
 * --------------------------------  *
 *|  qq:    474798383              | *
 *|  email: hao474798383@163.com   | *
 *|  blog:  https://blog.gomyck.com| *
 * --------------------------------  *
 *************************************
 "

JAVA_HOME=
RESOURCE_NAME=*.jar
LOG_PATH="/dev/null"
BACK_PATH=
XX_INFO=
ACTIVE=none
CK_RANDOM="gomyck.$RANDOM.$RANDOM"
GREP_RANDOM="gomyck.none"
OLD_RANDOM=`cat rdm`
if [ $? == 0 ]; then
    GREP_RANDOM=${OLD_RANDOM}
fi
PARAM_VALUE='-Dfile.encoding=UTF-8 -Deureka.instance.ip-address= -Djasypt.encryptor.password='
while [ -n "$1" ]
do
    case "$1" in
         -param | -p)
            PARAM_VALUE="$2"
            echo "系统属性配置: $2"
            shift ;;
         -xx | -x)
            XX_INFO="$2"
            echo "虚拟机非标准选项配置: $2"
            shift ;;
        -back | -b)
            BACK_PATH="$2"
            echo "文件备份位置: $2"
            shift ;;
        -log | -l)
			LOG_PATH="$2"
            echo "日志输出位置: $2"
            shift ;;
        -active | -a)
			ACTIVE="$2"
            echo "激活配置: $2"
            shift ;;
        --) shift
            break ;;
        *) ACTIVE="$1";;
    esac
    shift
done

if [[ ${ACTIVE} != "pro" && ${ACTIVE} != "dev" && ${ACTIVE} != "test" ]]; then
    echo "Please input a profile you want active -> [dev pro test]"
    exit
fi
if [[ ${ACTIVE} ==  "test" || ${ACTIVE} ==  "dev" ]]; then
	echo "开发测试环境, 日志默认输出位置: ./gomyck.log"
	LOG_PATH="gomyck.log"
fi

tpid=`ps -ef|grep $GREP_RANDOM|grep -v grep|grep -v kill|awk '{print $2}'`
if [ ${tpid} ]; then
    echo Elegant Close Application... ${tpid}
    kill -15 $tpid
fi

sleep 5

tpid=`ps -ef|grep $GREP_RANDOM|grep -v grep|grep -v kill|awk '{print $2}'`
if [ ${tpid} ]; then
    echo  Hard Close Application... ${tpid}
    kill -9 $tpid
else
    echo Close Success!
    echo Bootstrap Application...
fi

rm -f rdm
rm -f tpid

if [ ${BACK_PATH} ]; then
    if [ ! -d ${BACK_PATH}  ];then
      mkdir $BACK_PATH
    fi
    cp -f ./*.jar $BACK_PATH
fi

if [ ${JAVA_HOME} ]; then
    nohup $JAVA_HOME/bin/java -jar $PARAM_VALUE $XX_INFO -Dspring.profiles.active=${ACTIVE} -DckFlag=${CK_RANDOM} ./$RESOURCE_NAME > ${LOG_PATH} 2>&1 &
else
    nohup java -jar $PARAM_VALUE $XX_INFO -Dspring.profiles.active=${ACTIVE} -DckFlag=${CK_RANDOM} ./$RESOURCE_NAME > ${LOG_PATH} 2>&1 &
fi

echo ${CK_RANDOM} > rdm
echo $! > tpid
echo Application is Running!!!

if [[ ${ACTIVE} ==  "test" || ${ACTIVE} ==  "dev" ]]; then
	tail -f gomyck.log
fi


```

### 其他知识点

**kill 命令接收的信号量**

SignalName  |Number|	Description
---|---
SIGHUP	    |1	   | Hangup (POSIX)
SIGINT	    |2	   | Terminal interrupt (ANSI)
SIGQUIT	    |3	   | Terminal quit (POSIX)
SIGILL	    |4	   | Illegal instruction (ANSI)
SIGTRAP	    |5	   | Trace trap (POSIX)
SIGIOT	    |6	   | IOT Trap (4.2 BSD)
SIGBUS	    |7	   | BUS error (4.2 BSD)
SIGFPE	    |8	   | Floating point exception (ANSI)
SIGKILL	    |9	   | Kill(can't be caught or ignored) (POSIX)
SIGUSR1	    |10	   | User defined signal 1 (POSIX)
SIGSEGV	    |11	   | Invalid memory segment access (ANSI)
SIGUSR2	    |12	   | User defined signal 2 (POSIX)
SIGPIPE	    |13	   | Write on a pipe with no reader, Broken pipe (POSIX)
SIGALRM	    |14	   | Alarm clock (POSIX)
SIGTERM	    |15	   | Termination (ANSI)
SIGSTKFLT	|16	   | Stack fault
SIGCHLD	    |17	   | Child process has stopped or exited, changed (POSIX)
SIGCONT	    |18	   | Continue executing, if stopped (POSIX)
SIGSTOP	    |19	   | Stop executing(can't be caught or ignored) (POSIX)
SIGTSTP	    |20	   | Terminal stop signal (POSIX)
SIGTTIN	    |21	   | Background process trying to read, from TTY (POSIX)
SIGTTOU	    |22	   | Background process trying to write, to TTY (POSIX)
SIGURG	    |23	   | Urgent condition on socket (4.2 BSD)
SIGXCPU	    |24	   | CPU limit exceeded (4.2 BSD)
SIGXFSZ	    |25	   | File size limit exceeded (4.2 BSD)
SIGVTALRM	|26	   | Virtual alarm clock (4.2 BSD)
SIGPROF	    |27	   | Profiling alarm clock (4.2 BSD)
SIGWINCH	|28	   | Window size change (4.3 BSD, Sun)
SIGIO	    |29	   | I/O now possible (4.2 BSD)
SIGPWR	    |30	   | Power failure restart (System V)

常用的信号量有  2  9  15


**cat >> fileName <<(-) EOF**

创建文件, 然后根据操作提示符, 输入字符, 当系统单独捕捉到 EOF 时, 结束输入监听

<< 后面加 - 之后, EOF 不需要顶行写, 兼容脚本产生的制表符



