---
layout: post
title:  "记一次正则的实践(先行断言, 后行断言, 贪婪/懒惰匹配)"
crawlertitle: "记一次正则的实践(先行断言, 后行断言, 贪婪/懒惰匹配)"
subtitle: "REGULAR PATTERN MATCH"
ext: "url uri 匹配"
date:  2020-01-08
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['REGULAR', '原创']
musicUri: 536578128
musicTitle: 探戈就是趟着走
musicFrom: gomyck
author: gomyck
openPay: true
---

对 url 进行截取的正则表达式编写过程

### 需求分析

给定一个 url , 需要截取出来主机地址, 但不包括上下文以及之后的请求路径

exp: **http://www.gomyck.com/ck/query/userInfo?name=gomyck**

使用给定的正则匹配之后, 要得到 **www.gomyck.com**

### 推导过程

**根据 url 的组成(schema + :// + uri + context + requestURI + queryParam)得到简略的正则: //.*/**

```javascript
const url = "http://www.gomyck.com/ck/query/userInfo?name=gomyck";
const express = "//.*/";
console.log(url.match(express));
//[
//  '//www.gomyck.com/ck/query/',
//  index: 5,
//  input: 'http://www.gomyck.com/ck/query/userInfo?name=gomyck',
//  groups: undefined
//]
```
**当正则中没有全局匹配标志 /g 时, match 方法返回的数据类型为 array, 只有一个索引: 0, 另包括几个额外的属性:**

```text
index: 匹配的文本在字符串中的起始位置
input: 源字符串
group: 组
```

从结果可知, 返回的结果多了匹配项, 额且把上下文之后的请求 uri 也返回了, 分析原因可知, 当前匹配为贪婪模式, 也就是说 匹配的 /, 不会在第一次匹配时停止向后寻找

**第一次修改表达式如下: //.*?/**

```javascript
const url = "http://www.gomyck.com/ck/query/userInfo?name=gomyck";
const express = "//.*?/";
console.log(url.match(express));
//[
//  '//www.gomyck.com/',
//  index: 5,
//  input: 'http://www.gomyck.com/ck/query/userInfo?name=gomyck',
//  groups: undefined
//]
```

**?为懒惰匹配元字符, 用来修饰其本身前的量词匹配规则, 比如 * {n} {n, m} 这种, 其含义为在使整个匹配成功的前提下, 尽量少匹配字符**

返回结果去掉了包括上下文之后的内容, 但是多了匹配项的字符串

```javascript

const str = "cckck";
const express1 = "c.*k";
// cckck  贪婪模式, 全部都匹配了
console.log(str.match(express1));
// 使用字符串不能定义全局正则:  "/c.*?k/g" 这种不好使, 必须把双引号去掉, 猜测是因为使用字符串初始化 RegExp 对象时有问题
const express2 = /c.*?k/g;
// cck ck 懒惰模式, 但是因为有 /g 全局匹配模式, 所以把符合条件的字符都返回了
console.log(str.match(express2));

```

**第二次修改表达式如下: (?<=//).*?(?=/)**

```javascript
const url = "http://www.gomyck.com/ck/query/userInfo?name=gomyck";
const express = "(?<=//).*?(?=/)";
console.log(url.match(express));
//[
//  'www.gomyck.com',
//  index: 5,
//  input: 'http://www.gomyck.com/ck/query/userInfo?name=gomyck',
//  groups: undefined
//]
```

> ?<= 为零宽先行断言(翻译: 从给定的字符串往后匹配)
> ?=  为零宽后行断言(翻译: 从给定的字符串往前匹配)

整个表达式的含义为: 从 // 向后匹配, 中间可以有任意个字符, 遇到 / 后停止(因为是从 / 往前匹配), 使用零宽断言表达式匹配的字符串不包括断言本身的字符, 至此整个需求得到解决



