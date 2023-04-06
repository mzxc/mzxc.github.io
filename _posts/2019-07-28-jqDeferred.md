---
layout: post
title:  "Jquery Deferred 详解"
crawlertitle: "Jquery Deferred 详解"
subtitle: "Jquery Deferred JavaScript promise"
ext:
date:  2019-07-28
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['JAVASCRIPT', '原创']
musicUri: 520464296
musicTitle: 戏如人生
musicFrom: 王童语
author: gomyck
openPay: true
---

学会使用Deferred对象以及其相关函数, 可以优雅的解决开发过程中一些异步执行问题

### ----应用篇----

#### 开发场景

##### 你是否经历过这种代码场景:

```javascript
function demo1(){
    .....

    const result = demo2();
    if(result){
        ....
    }else{
        ....
    }

    .....
}

function demo2(){
    const changeStatus = true; //一个可预期的返回值
    $.ajax({
        url: "xxx",
        async: true,
        .....
        .....
        success: function (reslut) {
            if(.....){
                changeStatus = false;
            }
        }
    });
    return changeStatus;
}
```
上述代码在执行时, 你会发现changeStatus会一直返回true

##### 原因: ajax为非阻塞代码块, 在发送请求时不会阻塞当前线程的执行, 而请求是耗时动作, 必然会比代码执行速度慢, 所以在success方法执行之前, 方法已经返回changeStatus的值

##### 解决办法:
1. 把ajax设置成同步请求, async: false, 带来的问题: 如果请求耗时时间过长, 会造成页面假死的情况,

2. 把后续逻辑都放到success中(抽取受到返回值影响的代码块, 放到success中)

```javascript
function demo1(){

    .....

    demo2();

    .....

}

function demo2(){
    const changeStatus = true; //一个可预期的返回值
    $.ajax({
        url: "xxx",
        async: true,
        .....
        .....
        success: function (reslut) {
            if(.....){
                changeStatus = false;
            }
            //转移的代码, 此代码块受到changeStatus的状态影响
            if(changeStatus){
                ....
            }else{
                ....
            }
        }
    });
    return changeStatus;
}

```
此种做法, 增加了代码的维护成本, 也使代码可读性变差(丑)

那么可不可以用一种优雅的方式, 解决这个问题呢?

### ----Deferred篇----

#### 名词解释
deferred: 延期的, 推迟

#### 对象的功能说明
```text
A Deferred object starts in the pending state. Any callbacks added to the object with
 deferred.then(), deferred.always(), deferred.done(), or deferred.fail() are queued to
be executed later. Calling deferred.resolve() or deferred.resolveWith() transitions the
Deferred into the resolved state and immediately executes any doneCallbacks that are set.
Calling deferred.reject() or deferred.rejectWith() transitions the Deferred into the rejected
state and immediately executes any failCallbacks that are set. Once the object has entered the
resolved or rejected state, it stays in that state. Callbacks can still be added to the resolved
or rejected Deferred — they will execute immediately.
```
简单翻译: deferred对象在初始化的时候是延迟状态的, 任何添加到队列里的回调方法会推迟执行, 调用resolve()或者
resolveWith()方法来转换当前实例进入到resolve状态, 并且执行对应状态的回调方法, 调用reject()或rejectWith()方法
来使实例进入reject状态, 并执行对应的回调方法, 一个对象实例当进入到不同的状态时, 它会保持状态, 回调方法会添加到当前
实例中, 并被立即执行

#### 对象的方法说明

**deferred.then(doneFilter, failFilter, progressFilter):**

```text
doneFilter
Type: Function()
当实例为resolve状态时被触发

failFilter
Type: Function()
当实例为rejected状态时被触发

progressFilter
Type: Function()
当实例状态改变时会被触发
```

**deferred.always(alwaysCallbacks)**

```text
alwaysCallbacks
Type: Function()
实例状态改变时总会被触发, 参数为function或function数组
```
**deferred.done(doneCallbacks)**

```text
doneCallbacks
Type: Function()
实例状态为resolve时会被触发, 参数为function或function数组
```
**deferred.fail(failCallbacks)**

```text
failCallbacks
Type: Function()
实例状态为 rejected时会被触发, 参数为function或function数组
```

#### 应用场景
jquery提供两种方式返回deferred对象: $.ajax $.when

1. $.ajax().then().fail()...
2. $.when(...).done().fail()...

着重讲一下when, 这个方法在不传参的时候, 会返回一个resolve状态的promise(不可变状态的deferred对象)

when可接收多个deferred对象实例, 用来判断最终的状态, exp:
```javascript
const d1 = $.Deferred();
const d2 = $.Deferred();

$.when( d1, d2 ).done(function ( v1, v2 ) {
    console.log( v1 ); // "Fish"
    console.log( v2 ); // "Pizza"
});
// 只有所有deferred对象为resolve状态, 回调函数done才会执行
d1.resolve( "Fish" );
d2.resolve( "Pizza" );
```

### ----代码改进篇----
通过以上学习, 我们可以知道, 使用deferred对象和when配合, 可以达到方法延期执行的效果

so, 改变原来的代码如下:
```javascript

const ajaxDone = $.Deferred();

function demo1(){
    .....

    demo2();

    $.when(ajaxDone).done(function(result) {
         if(result){
             ....
         }else{
             ....
         }
    });

    .....
}


function demo2(){
    $.ajax({
        url: "xxx",
        async: true,
        .....
        .....
        success: function (reslut) {
            if(.....){
                ajaxDone.resolve(false);
            }
            ajaxDone.resolve(true);
        }
    });
}
```

关于Deferred的应用场景, 还有很多, 在开发过程中, 一定要灵活运用, 多思考,
花心思来打磨自己的代码, 才会使自己的技术能力得到提高
