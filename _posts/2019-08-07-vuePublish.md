---
layout: post
title:  "VUE项目发布到Nginx相关知识总结"
crawlertitle: "VUE项目发布到Nginx相关知识总结"
subtitle: "vue publish nginx"
ext: "外汇 根服务 13 汇率 人民币 美元"
date:  2019-08-07
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['JAVASCRIPT', '原创']
musicUri: 521416693
musicTitle: So Far Away
musicFrom: Martin Garrix
author: gomyck
openPay: true
---

发布vue项目时遇到的问题以及解决方法

### ----发布篇----

#### vue 配置API

<a target="_blank" href="https://cli.vuejs.org/zh/config/#%E5%85%A8%E5%B1%80-cli-%E9%85%8D%E7%BD%AE">vue.config.js API</a>

#### 前端工程相关命令

##### 1.安装cnpm
(cnpm跟npm是一样的东西, 区别在于用到的依赖在下载地址上不同, cnpm下载的依赖都是从淘宝镜像中下的)
```bash
$ sudo npm install -g cnpm --registry=https://registry.npm.taobao.org
```
##### 2.新建vue工程
```bash
#安装vue脚手架
$ npm install -g vue-cli
#使用脚手架新建工程
# [vue-element-admin是项目名]  如果想创建 vue-1.0 版本的  在项目名后面加 #1.0
$ vue init webpack vue-element-admin
```
**当然, 也可以使用IDEA -> FILE -> NEW PROJECT -> STATIC WEB -> VUE**

##### 3.使用node容器运行工程
```bash
$ cd [project root dir]
$ npm run [dev] #dev是可选项, 具体看package.json下的scripts中配置
```

##### 4.打包
```bash
$ cd [project root dir]
$ npm run build
```
**运行命令之后, 会在当前根目录下生成dist文件, 其为工程发布包**

#### Nginx部署vue

#### 1.安装nginx
....不在本篇文章之内

#### 2.修改nginx.conf
````bash
$ vim nginx.conf
````
找到对应端口, 监听的server属性, 在其内加入以下配置
```text
location /api/ {
    proxy_pass http://192.168.1.108:8080/;  #设置接口地址代理, vue的代理在nginx环境下, 会失效, 因为nginx代理了 / 所以要单独配置接口代理
}

location / {
    root   html/dist; #dist文件夹放到了与nginx.conf所在文件夹平级的html文件夹下
    try_files $uri $uri/ /index.html;   #把所有的请求都转发到/index.html下, vue可以根据location.href来判断到底路由到哪.
}

```


### ----爬坑篇----

#### 客户端
1.vue的publicPath要设置成 / 而不要用 ./  (vue默认配置是 / , 但是nginx代理有上下文时, 要设置成 /{contextPath} )

2.vue的devServer配置在 nginx location配置为 / 的时候, 会失效, 这个问题当时找了好久, 因为前端把 /api 替换成接口地址了,
在发布到nginx后, 接口地址一直是服务端地址, 当时以为是缓存, 后来仔细想想应该是nginx的问题

3.**2018-08-20补充**, 这是一个非常大的坑, 因为一开始前端工程只有一个, 所以按照上面的配置无问题发生, 后来因为项目需要, 前端工程要新建多个, 但是token想要共享必须要同源,
所以我第一想法是使用nginx做反向代理, 在一个nginx服务中发布多个前端工程,之前查看VUE官网, 给出的路由配置建议是使用history模式, 然后配置nginx:
```text
location / {
    root   html/dist; #dist文件夹放到了与nginx.conf所在文件夹平级的html文件夹下

    #把所有的请求都转发到/index.html下, vue可以根据location.href来判断到底路由到哪.
    #2019-12-03 修正: 官网解释: 按下述配置依次去资源文件夹寻找文件, 也就是说, 先用$uri 再用$uri/ 最后有个 catch 的策略: 使用 index.html
    try_files $uri $uri/ /index.html;
}
```
但是因为加入了多个工程, 所以location不能用 / 了, 于是我分为了两个location配置:
```text
location /projectManager {
    root html/projectManager/dist;
    try_files $uri $uri/ /index.html;
}

location /systemManager {
    root html/systemManager/dist;
    try_files $uri $uri/ /index.html;
}
```
按照以前的配置说明( **爬坑篇 -> 客户端 -> 1** ), 如果代理有上下文存在, 那么前端工程也必须同步配置上下文, 也就是publicPath也要配置与location对应的值 (/projectManager  /systemManager), 这里有个细节,
就是要查看一下路由的base属性是否用全局变量替代(base: process.env.BASE_URL), 如果不是, 也要配置成与location对应的值

配完之后心里美滋滋, 发布工程, 打开网页, 进入systemManager工程的时候, 报了404, 泪目, 反复排查之后, 定位到应该是root标签的问题, 改动如下
```text
location /projectManager {
    alias html/projectManager/dist;
    try_files $uri $uri/ /index.html;
}

location /systemManager {
    alias html/systemManager/dist;
    try_files $uri $uri/ /index.html;
}
```
root与alias标签的区别:
> root:  请求/systemManager  实际上是去服务器上的html/systemManager/dist/systemManager中去找资源

> alias: 请求/systemManager  实际上是去服务器上的html/systemManager/dist/中去找资源

解决完改BUG之后, 在去请求systemManager工程页面, 成功显示, 心里又美滋滋, 结果F5之后, 出现404   T_T


排查了一下午, 没发现问题所在, google了一下, 终于, 在一个帖子里看到了一点有用的信息: **如果发布多个工程的话, vue是不能使用history模式的, 必须使用默认模式(hash)**
修改前端路由模式, 重新发布, 页面成功展示, 且刷新无404问题

**最终配置如下:**
```text
location /api/ {
    client_max_body_size 100m;
    #设置主机头和客户端真实地址，以便服务器获取客户端真实IP
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_buffering off;
    proxy_pass http://192.168.1.xxx:7777/; #网关地址
}

location /projectManager {
    alias html/projectManager/dist;
    try_files $uri $uri/ /index.html;
}

location /systemManager {
    alias html/systemManager/dist;
    try_files $uri $uri/ /index.html;
}
```

#### 2019-08-29补充

1.vue工程加入环境变量:
  模式与环境变量的区别: 模式包含多个环境变量, 以key=value的形式存在, vue的模式会默认把NODE_ENV的值替换成当前的模式名称, 如果想自定义环境变量, 要以VUE_APP_开头, 否则不好使
  https://cli.vuejs.org/zh/guide/mode-and-env.html#%E6%A8%A1%E5%BC%8F

#### 2019-09-18补充

2.如果使用nginx代理两个前端node(vue)服务, 那么F12里会一直报错:  GET http://localhost/sockjs-node/info?t=1568791304370 net::ERR_CONNECTION_REFUSED

> 解决办法: 打开 node_modules - 找到sockjs-cli - dist -sockjs.js - 1605行  注释掉 (self.xhr.send(payload);)

3.可以使用nginx代理node服务, 方便开发热部署: (vue工程中 publicPath: /ck/projectManager)
```text
location /ck/projectManager {
    proxy_pass http://192.168.1.99:8080/ck/projectManager;
}

location /ck/systemManager {
    proxy_pass http://192.168.1.99:8081/ck/systemManager;
}

location / {
    rewrite ^ /ck/systemManager;
}

```

#### 2019-12-03补充, 修正 vue 多项目不能使用 history 的错误:

因为误解了 try_files 属性的作用, 所以在一开始没有找到 history 的配置方法(多工程), 最近因为线上的一个 BUG 才让我重新重视这块问题: **chrome 低版本,
在使用 window.location.reload()方法的时候,有时会丢失 hash 信息**, 导致页面有时会丢失 hash 而重定向到登录页

> exp: 进入系统后, 默认展示首页, 这时如果不停的点击[首页]导航按钮, 按钮触发的事件就是 reload() 事件, 有时首页 iframe 可以正常渲染, 有时
会重定向到登录页, 直接访问路由地址, F5 刷新没有发现该情况, 但是使用控制台, 输入 location.reload(), 会出现这种情况, 使用 oupeng
浏览器没有这个问题, 使用高版本 chrome 浏览器没有这个问题

**通过修改以下配置, 可以使代理服务支持多工程 history 模式**

**try_files 的正确使用** (注意对比以前的配置, 只不过修改了 try_files 的配置)

```text
location /projectManager {
    alias html/projectManager/dist;
    try_files $uri $uri/ /projectManager/index.html; # 依次尝试使用 $uri $uri/ 来寻找资源文件, 如果未找到, 则使用最后一个参数中指定的 uri 进行内部重定向
}

location /systemManager {
    alias html/systemManager/dist;
    try_files $uri $uri/ /systemManager/index.html; # 依次尝试使用 $uri $uri/ 来寻找资源文件, 如果未找到, 则使用最后一个参数中指定的 uri 进行内部重定向
}

```
**关于 try_files 的说明:** <a href="http://nginx.org/en/docs/http/ngx_http_core_module.html#location" target="_blank" style="color: blue;">点击查看</a>


#### 服务端
1.如果location配置的是 / , 且接口与当前服务不在同一台机器上, 那么一定要配置接口代理(**注意: api后面的 / 不能少**)
```text
location /api/ {
    proxy_pass http://192.168.1.108:8080/;
}
```
**端口号后面的 / 一定不要少, 因为有与没有意义不同, 涉及到绝对路径与相对路径的问题**



### ----其他知识点----

#### history 与 hash的区别

<a href="/posts/jsRouter/" style="color: blue" target="_blank">点击前往<a>

#### 外汇比例的调整对中国的利弊

> 从出口方面说，有利于出口。举例说明，现在人民币兑美元是1美元兑5元人民币，一双鞋子国内卖100元，国外卖20美元；如果人民币贬值，变成1美元兑10人民币，
> 在国内仍然卖100元的鞋子，拿到国际市场卖10美元就和国内卖100元获得相同的利润，事实上你在国际市场仍然卖20美元，因此在国际市场可以获得更多利润，也就对出口有利。

> 不利的方面，假如你在美国留学，学费每年是1万美元，在1美元兑换5元人民币的情况下，家里准备5万元就购交学费了，当人民币贬值，变成1美元兑10元人民币时，同样1万美元的学费，
> 却要准备10万的人民币，可以说负担增大了。

> 我认为如果在贸易战之前, 人民币贬值对中国有利(因为进口量小了), 因为中国是出口大国, 但在贸易战之际, 人民币贬值, 加上香港暴乱, 只会造成股市大批量套现跑路, 而且贬值从宏观映射到百姓身上,
> 也会增加了平时的日常开销


#### 为什么全世界只有13台根域名服务器

> 由于早期的 DNS 查询结果是一个512字节的 UDP 数据包。这个包最多可以容纳13个服务器的地址，
> 因此就规定全世界有13个根域名服务器，编号从a.root-servers.net一直到m.root-servers.net。
