---
layout: post
title:  "关于 jakarta validation api 和 javax validation api"
crawlertitle: "jakarta validation api 与 javax validation api 的区别"
subtitle: "JAVA VALIDATION SPRINGBOOT HIBERNATE"
ext: ""
date:  2023-09-05
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['JAVA', '原创']
musicUri: 22845490
musicTitle: Sunjeong
musicFrom: 高耀太
author: gomyck
openPay: true
---

[https://jcp.org/en/jsr/detail?id=380](https://jcp.org/en/jsr/detail?id=380)

Jakarta Bean Validation 和 Javax Bean Validation 是 Java Bean 验证的两个实现。

Jakarta Bean Validation 是在 Java EE 8 中引入的一个新的验证框架，它是在 Java Bean Validation 的基础上构建的。 Jakarta Bean Validation 使用 @jakarta.validation.constraints 包中的注解来验证 Java Beans。

Javax Bean Validation 则是 Java Bean Validation 的旧版本，它使用的是 @javax.validation.constraints 包中的注解。

在 Java EE 8 之前，Javax Bean Validation 是 Java Bean 验证的主要实现，但是随着 Jakarta Bean Validation 的出现，Javax Bean Validation 已经不再是 Java Bean 验证的主要选择了。
