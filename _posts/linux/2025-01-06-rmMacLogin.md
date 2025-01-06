---
layout: post
title:  "删除 MAC 允许在后台下的 APP 项"
crawlertitle: "删除 MAC 允许在后台下的 APP 项"
subtitle: "MAC 允许在后台 登录"
ext:
date:  2025-01-06
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['SERVER', '原创']
musicUri: 1392990601
musicTitle: 我和我的祖国
musicFrom: 王菲
author: gomyck
openPay: true
---

运行下面的命令, 会在桌面生成所有登录享和允许在后台项的列表, 查看列表, 根据每项的描述, 删除对应的文件即可

```shell
$ sudo -- bash -c 'echo " - $(date) -"; while IFS= read -r eachPlist; do echo "-$eachPlist";  /usr/bin/defaults read "$eachPlist"; done <<< "$(/usr/bin/find /Library/LaunchDaemons /Library/LaunchAgents ~/Library/LaunchAgents /private/var/root/Library/LaunchAgents /private/var/root/Library/LaunchDaemons -name "*.plist")"; /usr/bin/defaults read com.apple.loginWindow LogoutHook; /usr/bin/defaults read com.apple.loginWindow LoginHook' > ~/Desktop/launch.txt
```

看 第一行 与 Program 对应的文件, 删除即可

```text
-/Library/LaunchDaemons/com.microsoft.OneDriveStandaloneUpdaterDaemon.plist
{
    Label = "com.microsoft.OneDriveStandaloneUpdaterDaemon";
    MachServices =     {
        "com.microsoft.OneDriveStandaloneUpdaterDaemon" = 1;
    };
    Program = "/Applications/OneDrive.app/Contents/StandaloneUpdaterDaemon.xpc/Contents/MacOS/StandaloneUpdaterDaemon";
    ProgramArguments =     (
    );
    StandardErrorPath = "/Library/Logs/Microsoft/OneDrive/OneDriveStandaloneUpdaterDaemon.log";
    StandardOutPath = "/Library/Logs/Microsoft/OneDrive/OneDriveStandaloneUpdaterDaemon.log";
}
```
