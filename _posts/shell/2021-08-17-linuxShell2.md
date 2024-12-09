---
layout: post
title:  "Linux command archived ii"
crawlertitle: "Linux command archived ii"
subtitle: "Linux Shell"
ext: "指令集 复杂 精简 iptables watch dd awk sed tr iperf3 gzip tar 跳板 隧道 split 带宽 网卡"
date:  2021-08-17
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

分享日常运维需要的 LINUX 命令, 归纳整理容易记忆理解

### 查看是否支持虚拟化

```shell
$ egrep -c '(vmx|svm)' /proc/cpuinfo

$ cat /proc/cpuinfo | grep -cE 'vmx|svm'
```

### 磁盘分析

```shell
$ ncdu
```

### nethogs  nload  网络监测

nethogs 为进程级

nload 为网卡级

```shell
# s: sort by SENT traffic
# r: sort by RECEIVE traffic
# m: switch between total (KB, B, MB) and KB/s mode
$ nethogs -v 0
````

### 压力测试

```shell

$ yum install -y epel-release && yum install stress -y

# 两个进程  每个 300M 持续占用
$ stress --vm 2 --vm-bytes 300M --vm-keep

```

### 带宽测试

```shell

$ yum install net-tools
# 裸金属
$ mii-tool -v enp129s0f0
# 虚拟机
$ ethtool ens192 | grep Speed

$ yum install -y iperf3
# 服务端(需要开启5021端口)
$ iperf3 -s
# 客户端
$ iperf3 -c 192.168.xxx.xxx
```

### tr 的使用

```shell
# 小写字母转大写
$ tr 'a-z' 'A-Z'
# 删除所有回车
$ echo "Hello World" | tr -d '\r'
# 字符替换
echo "apple" | tr 'a' 'b'
# 小写转大写, 大写转小写  两两相对
echo "Hello World" | tr 'a-zA-Z' 'A-Za-z'
# 只要在 a-z 里的重复字符, 都将替换成一个:  abc
echo "aaabbbccc" | tr -s 'a-z'
```

### gzip

```shell
# 保留源文件的压缩
$ gzip –c filename > filename.gz

# 保留原文件的解压
$ gunzip –c filename.gz > filename
```

### IO 和网络监控

```shell

$ iptraf-ng
$ iotop

```

### 跳板机配置

```shell
$ ssh -J user1@serve1 user2@serve2
```

```text
Host X1
    HostName 192.168.x.x1
    User root

Host X2
    HostName 192.168.x.x2
    User root
    ProxyJump X1
    ForwardAgent yes
```

### 隧道建立

```shell
# 通过隧道主机建立本地端口到远程端口的隧道
$ ssh -f -N -L localPort:remoteIp:remotePort user@channel_server
```

### 文件切割和解压缩

```shell
# 第一个 xx.tar 是源文件  第二个是 prefix
$ split -b 1024000000 -d -a 2 xx.tar xx.tar

$ cat xxx.tar.gz* | tar -xvz
```

### 算数运算
```shell
$ a=1
$ b=2
$ c=$((a + b))
$ echo $c
```

### 命令执行并获取输出
```shell
# $() 可以嵌套使用  ``不可以,  可读性比``好
$ result=$(ls -a)
$ echo $result
```

### 字符串截取
```shell
$ string="Hello, World!"
$ echo ${string:7}  # 输出 World!
$ echo ${string:0:5}  # 输出 Hello
$ echo ${string::-1} #输出 Hello, World
```

### 获取 IP

```shell
$ ip addr | awk '/^[0-9]+: / {}; /inet.*global/ {print gensub(/(.*)\/(.*)/, "\\1", "g", $2)}' | awk 'NR==1{print}'
```

### watch
```shell
$ watch -n 1 -d netstat -ant
```

### dd 命令
dd 是转换文件并输出到标准输出的命令

```shell
# 把 boot.img 转换成文件 fd0 每次输入输出的块大小为 1440k
$ dd if=boot.img of=/dev/fd0 bs=1440k
# 转换 testfile_2 的文件, 把里面的字符全部转换成大写(ucase)  lcase(小写) 详细参照  https://www.runoob.com/linux/linux-comm-dd.html
$ dd if=testfile_2 of=testfile_1 conv=ucase
```

### awk 命令

```shell
$ awk [-F  field-separator] '{pattern + action}' {filenames}
$ awk '$1 == "value" {print $2}' filename.txt
```


### 设置时间服务器

```shell
#从 ntp 服务器更新时间
$ chronyc makestep

#显示 UTC 当前时间
$ date -u

#显示时间
$ timedatectl

#设置 ntp 服务器
$ ntpdate ip
```

### 查询进程执行所在目录

```shell
$ pwdx pid
```

### 删除时间段文件

```shell
# 删除一天前的.gz 后缀的文件
$ find ./ -type f -name "*.gz" -mtime +1 -exec rm -rf {} \;
```

### ssh-copy-id 快速实现免密登录服务器

```shell
$ ssh-copy-id -p 2233 root@xx.xx.xx.xx
```

### sed 快速指南

```shell
# "ws.*9001\/ws" 是被替换的文字 "222" 是替换成的文字
$ sed -i "s/ws.*9001\/ws/222/g" demo.txt
# 在第十行插入 hello
$ sed '10i\\ hello' file.txt
# 删除第一到十行内容
$ sed '1,10d' file.txt
# 追加文本 如果有特殊字符, 要使用 \\
$ sed '10a world' file.txt
# 多重指令
$ sed -e '/^foo/d' -e 's/bar/baz/g' file.txt
$ sed -e '/^foo/d; s/bar/baz/g' file.txt
# 替换 clusterDNS
# n; 是处理下一行
# s/value1/value2/ 是替换
$ sed -i '/^clusterDNS:/ {n; s/.*/- 10.233.0.4/;}' kubelet-config.yaml
# 删除匹配行
sed '/pattern/{d;}' filename
# 在匹配行后追加
sed '/pattern/{a\
new line
;}' filename
# 在匹配行前追加
sed '/pattern/{i\
new line
;}' filename
```

### sshpass 可以为后面的 shell 提供密码服务

```shell
$ sshpass -p xxxx ssh root@xx.xx.xx.xx "mv -f /usr/share/gomyck/xx/xx.jar /usr/share/gomyck/xx/backup/xx.jar.`date "+%Y-%m-%d-%l-%M-%s"`"
$ sshpass -p xxxx scp /usr/share/gomyck/xx/xx.jar  root@xx.xx.xx.xx:/usr/share/gomyck/xx/
```

### 用户操作

```shell
#添加用户
$ useradd gomyck -g gomyck -s  /bin/bash -d /home/gomyck
#修改用户信息
$ usermod -s  .. gomyck
#修改密码
$ passwd gomyck
```

### 查看系统内核信息
```shell
$ lsb_release -a
$ cat /etc/redhat-release
```

###  查看IP经过的路由节点
```shell
# traceroute www.baidu.com
$ traceroute [IP][HOST]
```

### 切换当前命令行权限为ROOT
```shell
$ sudo -i
```

### 查看当前文件inode信息
```shell
stat [file]
```

### 硬盘信息查看
```shell
$ find / -type f -size +1G -exec du -h {} \;  #快速查找大于 1G 的文件信息
$ df -hl  #查看当前可用硬盘空间
$ du -Sh  #查看所有文件的大小
$ du -sh  #查看当前文件大小
$ du -sh /usr #查看usr文件夹的大小
$ du -h --max-depth=1 ./ #查看当前文件夹下所有文件的大小, 遍历深度为 1 就是看当前文件夹下的文件
```

### 修改密码
```shell
passwd [用户id]
```

### 查看ip地址
```shell
$ ip addr
$ ifconfig
```

### 不挂起命令: nohup  no hang up
```shell
$ nohup [command]
```

### 后台执行命令: 防止当前shell占用控制台桌面
```shell
$ [command]  &
```

### nohup & 组合使用:
**nohup [command] > gomyck.log 2>&1 &      把当前进程不挂起后台执行, 且把控制台打印的日志输出到gomyck.log中**

**2>&1 是将标准出错重定向到标准输出，这里的标准输出已经重定向到了out.file文件，即将标准出错也输出到out.file文件中。最后一个& ， 是让该命令在后台执行。**

### 命令帮助
```shell
$ whatis  [command]    # 显示命令简要信息
$ info    [command]    # 显示命令的详细信息
$ man     [command]    # 显示命令的说明文档
$ which   [command]    # 查看命令所在目录
$ whereis [command]    # 查看命令引用的目录(这个命令适用于安装了多个版本, 确定当前使用的是哪个目录下的命令)
```

### 设置环境变量
```shell
$ vim /etc/profile
$ ~/.profile
$ ~/.bashrc
$ /.bash_profile  #用户环境变量
$ ~/.zshrc        #zsh
# 在上述文件中,
# XXX_HOME=/User/xxx/vvv
# export PATH={XXX_HOME}/bin:$PATH
```
### 清理内存
```shell
$ echo 1 > /proc/sys/vm/drop_caches
```

### 查看进程对应的端口号
```shell
$ netstat -nap | grep pid
```

### 占用端口的进程信息
```shell
$ lsof -i:port
```

### 查看该进程下的线程
```shell
$ ps -T -p pid
```

### alias
```shell
$ cd /etc
$ vim profile
$ alias tom1='cd /usr/share/my-tomcat-one'
$ source profile
$ alias tom1
```

### telnet
```shell
$ telnet ip port
$ ctrl+]  #进入telnet
$ quit enter #回车 退出telnet
```

### systemctl
```shell
# systemctl命令是系统服务管理器指令，它实际上将 service 和 chkconfig 这两个命令组合到一起。
$ systemctl start xxx 可以启动服务
```

### curl
```shell
$ curl -R -0 "www.baidu.com"            # 访问baidu
$ curl -O xxx.rar www.xxx.com/aa.tar    # 下载
```

### linux欢迎界面显示信息
```shell
$ vim /etc/motd文件
```

### 创建快捷方式
```shell
$ ln -s 源文件 现有文件
# exp:ln -s /user/bin/qq.exe ./qq
```

### 测试远程端口开放
```shell
$ nc -vv 47.93.89.154 1099

# --broker 为管道服务  -k 为保持开启且允许多客户端连接
$  nc -lp 8080 -k --broker
```

### 查找符合条件字符串的上下3行
```shell
grep -C 3 '140.205.201.41' catalina.out
```

### 查找文件 find
```shell
$ find / -name xxx
```

### 文件夹
```shell
-   #上次访问的文件夹
#exp: cd - 访问上次cd的文件夹

~   #代表当前用户文件夾
#exp: cd ~/.ssh  就是进入当前用户下的.ssh文件夹
#其目录在/home/{user}
```


### zip unzip
```shell
# 压缩并指定目录
$ zip -r /home/kms/kms.zip /home/kms/server/kms
# 解压并指定目录
$ unzip /home/kms/kms.zip -d /home/kms/server/kms
```

### 查看cpu信息
```shell
$ lscpu
```


### free
命令：-m  查看[以MB为单位]内存信息

### 关机
```shell
$ shutdown
# exp：
# shutdowx -h now   立即关机
# shutdowx +5    5分钟之后关机
# shutdowx 10:30    10:30关机****
```

### cat 合并文件&查看文件
```shell
$ cat xxx.txt >> vvv.txt          #(把xxx这个文件合并到vvv文件之后)
$ cat xxx.txt  vvv.txt >zzz.txt   #(把xxx与vvv合并成新的文件zzz)
```

### mv 移动&修改名字命令
```shell
$ mv xxx.txt ../      #把xxx.txt  移动到上一级
$ mv xxx.txt zzz.txt  #把xxx.txt  重命名为  zzz.txt
```

### 其他常用命令
```shell
$ pwd       #显示当前目录
$ find      #搜索
$ who       #当前登陆者：所有人  查看登录日志 who /var/log/wtmp
$ whoami    #当前登陆者信息
$ hostname  #主机名
$ uname -a  #系统信息
$ ifconfig  #网络情况
$ unaliax   #解除别名
```

### 打包压缩
```text
tar
参数：
-c 归档文件  -x 解档文件
-z gzip压缩  -j  bzip2压缩
-v 显示过程  -f 使用归档名
```
```shell
$ tar -cvf /home/xxx.tar /usr/aaa.txt  #把usr目录下的aaa.txt压缩成xxx.tar并放到home文件夹下
```

### 远程拷贝命令
```shell
$ scp ../xxx.jar root@11.11.11.11:/usr/share/xxxxx
# (注意：最后的文件夹结尾不要加／ 否则会把当前文件当作文件夹拷贝过去)
$ scp [-1246BCpqrv] [-c cipher] [-F ssh_config] [-i identity_file] [-l limit] [-o ssh_option] [-P port] [-S program] [[user@]host1:]file1 [...] [[user@]host2:]file2
```
```text
scp命令的参数说明:
-1 强制scp命令使用协议ssh1
-2 强制scp命令使用协议ssh2
-4 强制scp命令只使用IPv4寻址
-6 强制scp命令只使用IPv6寻址
-B 使用批处理模式（传输过程中不询问传输口令或短语）
-C 允许压缩。（将-C标志传递给ssh，从而打开压缩功能）
-p 保留原文件的修改时间，访问时间和访问权限。
-q 不显示传输进度条。
-r 递归复制整个目录。
-v 详细方式显示输出。scp和ssh(1)会显示出整个过程的调试信息。这些信息用于调试连接，验证和配置问题。
-c cipher 以cipher将数据传输进行加密，这个选项将直接传递给ssh。
-F ssh_config 指定一个替代的ssh配置文件，此参数直接传递给ssh。
-i identity_file 从指定文件中读取传输时使用的密钥文件，此参数直接传递给ssh。
-l limit 限定用户所能使用的带宽，以Kbit/s为单位。
-o ssh_option 如果习惯于使用ssh_config(5)中的参数传递方式，
-P port 注意是大写的P, port是指定数据传输用到的端口号
-S program 指定加密传输时所使用的程序。此程序必须能够理解ssh(1)的选项。
```

### 用户及用户组管理
```shell
$ /etc/passwd    #存储用户账号
$ /etc/group     #存储组账号
$ /etc/shadow    #存储用户账号的密码
$ /etc/gshadow   #存储用户组账号的密码
$ useradd        #用户名
$ userdel 	     #用户名
$ adduser	     #用户名
$ groupadd 	     #组名
$ groupdel 	     #组名
$ passwd root    #给root设置密码
$ su root        #切换用户到 root
$ su - root      #shell 环境和用户都切换到 root
$ /etc/profile   #系统环境变量
$ bash_profile   #用户环境变量
$ .bashrc        #用户环境变量
$ su user        #切换用户，加载配置文件.bashrc
$ su - user      #切换用户，加载配置文件/etc/profile ，加载bash_profile

# 更改文件的用户及用户组
$ sudo chown [-R] owner[:group] {File|Directory}
# 例如：还以jdk-7u21-linux-i586.tar.gz为例。属于用户hadoop，组hadoop 要想切换此文件所属的用户及组。可以使用命令。
$ sudo chown root:root jdk-7u21-linux-i586.tar.gz
```
```text
文件权限管理
三种基本权限
R  读        数值表示为4
W  写        数值表示为2
X  可执行     数值表示为1
```

![image](/img/in-post/res2021-08-17/2021-08-17-001.png)
```text
如图所示，jdk-7u21-linux-i586.tar.gz 文件的权限为-rw-rw-r--

-rw-rw-r--一共十个字符，分成四段
第一个字符“-”表示普通文件；这个位置还可能会出现“l”链接；“d”表示目录

第二三四个字符“rw-”表示当前所属用户的权限。 所以用数值表示为4+2=6

第五六七个字符“rw-”表示当前所属组的权限。   所以用数值表示为4+2=6

第八九十个字符“r--”表示其他用户权限。      所以用数值表示为2

所以操作此文件的权限用数值表示为662
```

### 更改权限
```shell
$ sudo chmod [u所属用户  g所属组  o其他用户  a所有用户]  [+增加权限  -减少权限]  [r  w  x]   目录名
```
**例如：有一个文件filename，权限为“-rw-r----x” ,将权限值改为"-rwxrw-r-x"，用数值表示为765**
```shell
$ sudo chmod u+x g+w o+r  filename
#上面的例子可以用数值表示
$ sudo chmod 765 filename
```
