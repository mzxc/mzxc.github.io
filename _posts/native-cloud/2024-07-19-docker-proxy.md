---
layout: post
title:  "Docker 代理配置"
crawlertitle: "Docker 代理配置"
subtitle: "docker docker-compose proxy"
ext: ""
date:  2024-07-19
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['SERVER', '原创']
musicUri: 523042017
musicTitle: Into You
musicFrom: Matisse & Sadko
author: gomyck
openPay: true
---

linux 系统下的 docker 代理配置

```shell

$ mkdir -p /etc/systemd/system/docker.service.d

$ cat << EOF > /etc/systemd/system/docker.service.d/http-proxy.conf
[Service]
Environment="HTTP_PROXY=http://127.0.0.1:7890"
Environment="HTTPS_PROXY=http://127.0.0.1:7890"
Environment="NO_PROXY=localhost,127.0.0.1,::1"
EOF

$ systemctl daemon-reload
$ systemctl restart docker

$ docker info | grep -i proxy
```

socks 配置方式

```text
[Service]
Environment="ALL_PROXY=socks5h://localhost:1080"
```
