---
layout: post
title:  "通读SpringMVC文档"
crawlertitle: "通读SpringMVC文档"
subtitle: "SpringMVC "
ext:
date:  2019-10-21
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['JAVA', '原创']
musicUri: 3406918
musicTitle: Titanium
musicFrom: David Guetta
author: gomyck
openPay: true
---

This part of the documentation covers support for Servlet-stack web applications built on the Servlet API and deployed to Servlet containers. Individual chapters include Spring MVC, View Technologies, CORS Support, and WebSocket Support. For reactive-stack web applications, see Web on Reactive Stack.

### 目的

**一直以来对springMVC处于既熟悉又陌生的状态, 在开发过程中, 从简单的controller编写, 到复杂的映射器(requestMappingHandlerMapping)重写等, 多多少少经历过一些MVC的框架重写工作, 随着代码的积累, 源码的查看, 感觉是时候通读一下MVC文档, 然后在顺着文档思路在去看一看源码了. 希望这篇文章可以帮助到一些路过的朋友**

### 理解MVC

**MVC模式最早由Trygve Reenskaug在1978年提出，是施乐帕罗奥多研究中心（Xerox PARC）在20世纪80年代为程序语言Smalltalk发明的一种软件架构。MVC模式的目的是实现一种动态的程序设计，使后续对程序的修改和扩展简化，并且使程序某一部分的重复利用成为可能。除此之外，此模式透过对复杂度的简化，使程序结构更加直观。软件系统透过对自身基本部分分离的同时也赋予了各个基本部分应有的功能。专业人员可以依据自身的专长分组：**

> 控制器（Controller）- 负责转发请求，对请求进行处理。
> 视图（View）        - 界面设计人员进行图形界面设计。
> 模型（Model）       - 程序员编写程序应有的功能（实现算法等等）、数据库专家进行数据管理和数据库设计(可以实现具体的功能)。

springMVC原来是构建在spring framework上的一个使用servlet api编写的web架构平台, 一开始叫做spring-webmvc, 但是人们通常称为springMVC, 与兼容spring framework的java EE容器所兼容

在springMVC框架中, 我们可以看到其所为MVC编写的一系列bean, ModelAndView, ViewResolver, ThemeResolver, HandlerMethodArgumentResolver, HandlerMapping, FrameworkServlet....

### 核心处理(调度bean)DispatcherServlet

> DispatcherServlet 跟绝大多数的 web 前端框架一样, 是设计在围绕前端控制方面的中央控制器, 它提供一个通用的算法, 在实际工作中, 按照策略, 来调用实际使用的组件, 模块是灵活可配的并且支持多种工作流

> DispatcherServlet 可以做到请求映射, 视图解析, 异常转发等更多功能

### 上下文 Context

DispatchServlet 通过 WebApplicationContext 来配置自己, WebApplicationContext 与 容器的 **ServletContext** 类有关联, 通过绑定到容器的上下文中, 我们可以通过 **RequestContextUtils**
来获取 WebApplicationContext, 上下文 bean 是单例的, 但是多个 DispatchServlet 可能共享一个 WebApplicationContext **根实例**, 这样每个 DispatchServlet 都有自己的 WebApplicationContext **子实例**
, **根实例**为享元模式, 包含一些通用的 bean, 如: 数据仓库 bean, 业务 service

```text
DispatchServlet
  |-- Root WebApplicationContext  (shared)
    |-- Services
    |-- Repositories
  |-- Servlet WebApplicationContext  (owned)
    |-- Controllers
    |-- ViewResolver
    |-- HandlerMapping
```





