---
layout: post
title:  "Shell 中$0 等占位符的使用"
crawlertitle: "Shell 中$0 等占位符的使用"
subtitle: "Linux Shell"
ext: ""
date:  2022-10-27
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['LINUX', '转载']
musicUri: 20752422
musicTitle: Rhythm Of Love
musicFrom: Yoomiii
author: gomyck
openPay: true
---

总是忘, 单独记一下

### Shell脚本中$0、$?、$!、$$、$*、$#、$@等的意义说明

$$
> Shell本身的PID（ProcessID，即脚本运行的当前 进程ID号）

$!
> Shell最后运行的后台Process的PID(后台运行的最后一个进程的 进程ID号)

$?
> 最后运行的命令的结束代码（返回值）即执行上一个指令的返回值 (显示最后命令的退出状态。0表示没有错误，其他任何值表明有错误)

$-
> 显示shell使用的当前选项，与set命令功能相同

$*
> 所有参数列表。如"$*"用「"」括起来的情况、以"$1 $2 … $n"的形式输出所有参数，此选项参数可超过9个。

$@
> 所有参数列表。如"$@"用「"」括起来的情况、以"$1" "$2" … "$n" 的形式输出所有参数。与$*的区别就是, for 循环时, @会拆分字符串的整体为一个一个的参数

$@
> 跟$*类似，但是可以当作数组用

$#
> 添加到Shell的参数个数

$0
> Shell本身的文件名

$1～$n
> 添加到Shell的各参数值。$1是第1参数、$2是第2参数…。

### 获取参数的方式方法

```shell
while [ -n "$1" ]
do
    case "$1" in
        -rb | -rollBack)
            IF_ROLL_BACK=true;;
    	  -help | -h)
            echo "-a  | -active     激活配置"
            echo "-jh | -home       JAVA_HOME"
            echo "-jk | -jasyptKey  JASYPT KEY"
            echo "-l  | -log        日志位置(生产环境默认 > 黑洞)"
            echo "-o  | -option     启动参数配置"
            echo "-rb | -rollBack   回滚上一版本"
            echo "-s  | -shutdown   关闭应用(signal)"
            exit;
            shift ;;
        -javaHome | -jh)
            JAVA_HOME="$2"
            $CK_ECHO "JAVA_HOME: $2" | tee -a $LUNCH_LOG
            shift ;;
        -option | -o)
            PARAM_VALUE="$2"
            $CK_ECHO "启动参数配置: $2" | tee -a $LUNCH_LOG
            shift ;;
    esac
    shift
done
```

```shell
# :a:b:cd:  第一个冒号是忽略错误  a b d 必须传参, c 不需要传参  getopts 不支持长参数, getopt 支持
while getopts "a:c:e:h:i:kn:s:d" opt
do
  case "$opt" in
    i)
      IMAGE_URI="$OPTARG"
      $CK_ECHO "IMAGE_URI: $OPTARG" | tee -a $LUNCH_LOG
      ;;
  	n)
      NODE_ID="$OPTARG"
      $CK_ECHO "NODE_ID: $OPTARG" | tee -a $LUNCH_LOG
      ;;
    c)
      NODE_COUNT="$OPTARG"
      $CK_ECHO "NODE_COUNT: $OPTARG" | tee -a $LUNCH_LOG
      ;;
  esac
done
```
