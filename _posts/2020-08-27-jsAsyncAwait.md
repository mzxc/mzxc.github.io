---
layout: post
title:  "使用 async await 调优你的代码"
crawlertitle: "使用 async await 调优你的代码"
subtitle: "JAVASCRIPT ASYNC"
ext: "PROMISE"
date:  2020-08-27
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['JAVASCRIPT', '原创']
musicUri: 417859039
musicTitle: Lost Control
musicFrom: Tyron Hapi
author: gomyck
openPay: true
---

记录一下 async 和 await 的使用方法方式

### 1. promise 的使用

在 js 中, 最出设计这一概念的当属 jquery, Deferred 为了解耦回调函数和回调逻辑之间的耦合关系

其中一些概念也在 deferred 中提出来, 后来 jquery 成为了标准中的一部分 ECMAScript (ECMA-262), deferred 逐渐退出历史舞台, 对 deferred 感兴趣的, <a style="color: blue;" href="/posts/jqDeferred/">传送门在这里</a>, promise 标准出现之后, 实现这一标准的框架也随之而来

Promise 对象为 js 标准内置对象之一, 为 promise 标准的实现类

**常用的 promise 使用方法:**

```javascript
function demo (){
    const sayHello = "hello..";
    console.log(sayHello);
    const promise = new Promise((reslove, reject) => {
        setTimeout(() => {reslove("gomyck!")}, 2000);
        //setTimeout(() => {reslove("error!")}, 2000);
    });
    promise.then(res => {console.log(res);}); // reslove 对应的回调
    promise.catch(error => {console.log(error);}); // reject 对应的回调
    promise.finally(() => {}); // 全局完成事件, 无论成功失败, 都会执行
    //结果为 : hello..  gomyck
}

demo();
```

**其实看上述代码, 与 jq 的 deferred 几乎是一模一样的模式, 只不过回调函数名称不一样而已, 致敬 jq**

### 2. 语法糖 async await

promise 的出现, 解决了回调函数和回调逻辑之间的耦合关系, 但是也带来了一些嵌套, 不可避免的嵌套, 上述代码可以写成这样:

```javascript
function demo (){
    const sayHello = "hello..";
    console.log(sayHello);
    new Promise((reslove, reject) => {
        setTimeout(() => {reslove("gomyck!")}, 2000);
        //setTimeout(() => {reslove("error!")}, 2000);
    }).then(res => {
        console.log(res);
    }).catch(error => {
        console.log(error);
    });
    //结果为 : hello..   gomyck
}

demo();
```

一旦出现 promise 嵌套 promise 的情况, 那代码的缩进程度会使可读性变的很差, 我实际操作过三层以上的嵌套, 比较恶心(插件带来的延迟执行)

为了解决这种恶心的问题, async await 语法糖出现了, 该语法糖是编译器底层带来的, 所以几乎不会带来附加问题...

### 3. 使用方式

同样是上述代码, 可以改造如下:

```javascript
function promisFunc() {
    return new Promise((reslove, reject) => {
        setTimeout(() => {reslove("gomyck!")}, 2000);
        //setTimeout(() => {reslove("error!")}, 2000);
    })
}
async function demo(){
    const sayHello = "hello..";
    console.log(sayHello);
    const result = await promisFunc();
    console.log(result);// 如果是 reslove, 则会打印 gomyck, 如果是 reject, 那么在上一步, 会抛异常
}

demo().catch(e => {console.log(e)}); //这里统一捕获 reject 带来的异常

//结果为 : hello..  gomyck
```

**多层嵌套的情况:**

```javascript
function promisFunc() {
    return new Promise((reslove, reject) => {
        setTimeout(() => {reslove("gomyck!")}, 2000);
        //setTimeout(() => {reslove("error!")}, 2000);
    })
}
async function demo(){
    const sayHello = "hello..";
    console.log(sayHello);
    const result = await promisFunc();
    console.log(result);// 如果是 reslove, 则会打印 gomyck, 如果是 reject, 那么在上一步, 会抛异常
    return "demo 返回了..";
}

async function demo1(){
    const sayHello = "嵌套外层..";
    console.log(sayHello);
    const result = await demo();
    console.log(result);
}

demo1().catch(e => {console.log(e)}); //这里统一捕获 reject 带来的异常

//结果为 : 嵌套外层..  hello..  gomyck!  demo 返回了..

```

**注意, await 关键字必须在 async 函数中使用, 否则会编译出错**

**注意, 任何 await 的方法, reject 或 throw 都会导致整体的线程终端**

比如 setTimeout(() => {reslove("gomyck!")}, 2000); 这段代码, 运行之后, 结果为:  **嵌套外层..  hello..  error!!!!!**

任意一环的 promise 的 reject 除非显示的 try catch, 否则都会导致整体主线程抛异常

**综上, 能看出语法糖带来的好处: 代码简洁, 代码缩进浅, 可读性强, 使异步代码可以像同步代码一样操作**

