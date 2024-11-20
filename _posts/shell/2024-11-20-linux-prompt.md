---
layout: post
title:  "LINUX PROMPT"
crawlertitle: "LINUX PROMPT"
subtitle: "Linux Shell Prompt"
ext: "PS1 PS2 PS3 PS4"
date:  2024-11-20
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['LINUX', '原创']
musicUri: 1816907590
musicTitle: You and I
musicFrom: Will Armex
author: gomyck
openPay: true
---

在 Linux 和 Unix 系统中，PS1、PS2、PS3 和 PS4 是 Prompt String 变量，用于控制终端中的提示符的样式和行为。它们是 Bash 中非常重要的环境变量，允许你定制命令行的显示方式。

## 各个 PS 变量的作用：

- PS1：这是最常见的提示符变量，控制命令行的主提示符。
- PS2：这是一个次级提示符，通常用于多行命令的情况（如命令被换行了）。
- PS3：控制 select 命令的提示符，通常用于显示菜单时的提示符。
- PS4：用于 set -x 调试模式下的提示符，通常用于显示脚本的执行步骤。
- PS5：这是一个新的调试提示符，通常在启用 xtrace 时用于显示更加详细的脚本执行信息。

## PS1 - 主提示符

PS1 是最常用的提示符，控制用户输入命令时的提示符。你可以将它设置为任何字符串，常见的配置包括显示用户名、主机名、当前路径等信息。

```shell
PS1="\u@\h:\w\$ "

# 这个设置会将提示符显示为：
username@hostname:/current/directory$
```

### 常用的转义字符：

```text
\u：当前用户名
\h：主机名
\w：当前工作目录
\$：如果是超级用户，显示 #，否则显示 $
```

## PS2 - 次级提示符

PS2 用于 PS1 提示符被换行时的提示符。例如，当你在命令行输入多行命令时，PS2 会作为接续行的提示符。

```shell
PS2="> "
```

## PS3 - 菜单提示符

PS3 用于控制 select 命令的提示符，通常在交互式菜单中使用，用户通过输入数字选择菜单项。

```shell
sel_val=""
PS3="Please select an option: "
options=('hub' 'local' 'exit')
select type in ${options[@]}
do
  case $type in
    'hub')
      sel_val="hub"
      break
      ;;
    'local')
      sel_val="local"
      break
      ;;
    'exit')
      echo "exit"
      exit 0
      break
      ;;
    *)
      echo "error"
      ;;
  esac
done
```

## PS4 - 调试提示符

PS4 用于控制 set -x 调试模式下的提示符，通常在调试脚本时使用，显示脚本的执行步骤。

```shell
set -x
PS4='+(${BASH_SOURCE}:${LINENO}): ${FUNCNAME[0]:+${FUNCNAME[0]}(): }'
```

## PS5 - 新的调试提示符

PS5 是一个新的调试提示符，通常在启用 xtrace 时用于显示更加详细的脚本执行信息。

```shell
set -x
PS5='+(${BASH_SOURCE}:${LINENO}): ${FUNCNAME[0]:+${FUNCNAME[0]}(): }'
```







