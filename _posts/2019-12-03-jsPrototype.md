---
layout: post
title:  "Js prototype 与 _proto_ 的关系"
crawlertitle: "Js prototype 与 _proto_ 的关系"
subtitle: "Js prototype 与 _proto_ 的关系"
ext: ""
date:  2019-12-03
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['JAVASCRIPT', '原创']
musicUri: 522041157
musicTitle: Autumn
musicFrom: LJY
author: gomyck
openPay: true
---

简单解释二者之间的关系

![image](/img/in-post/res2019-09-11/prototype.png)

**在 js 中, 万物**(String, Number, Function, Array...)(上述对象为基本类型的包装类型)**皆为对象(Object)**, 每个对象都有一个隐藏的属性: \[\[prototype]](也就是_proto_) , 这个属性称之为原型对象(因为万物皆对象, \[\[prototype]] 也不例外, 也是个对象)

> 1.相同类型的对象, 在构造时, 将会继承原型对象的扩展特性(方法\|属性)
>
> 2.对于特殊的对象 Function 函数, 有个特殊的属性: prototype, 这个属性指向该对象的原型对象, 也就是 prototype 指向 [[prototype]], [[prototype]]对象中有个指针, 又指回了构造函数
>
> 3.每次在定义一个函数的时候, 这个函数的prototype就被隐式的定义了, 如果不对其赋值, 那么它就是 Object
>
> 4.讨论原型的时候, 都是基于函数的, 只有函数才有原型属性(构造函数也是函数), 讨论原型不能脱离函数
>
> 5.在调用对象的方法或属性时的过程如下:
> Self ref = new Self();
>
> ref.xx
>
> => ref.constructor.prototype.xx   (构造函数的 prototype 属性)
> == ref.\_proto_.xx   (浏览器提供的指向原型对象的属性)
> == Self.\[\[prototype]].xx    (原型对象)
>
> => Self.\[\[prototype]].constructor.prototype.xx
> == Self.\[\[prototype]].\_proto_.xx
> == Self.\[\[prototype]].\[\[prototype]].xx
>
> .....loop find......

**因为 [[prototype]] 也是对象, 也有构造函数, [[prototype]] 的构造函数的 prototype 属性指向为 [[prototype]] 的原型, [[prototype]].[[prototype]] = Object, Object 的[[prototype]]为 null, 如此往复, 就形成了闭环, 也就是继承**

