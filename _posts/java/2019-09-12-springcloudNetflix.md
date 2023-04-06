---
layout: post
title:  "SpringCloudNetflix 与 netflix oss的关系"
crawlertitle: "springCloudNetflix 与 netflix的关系"
subtitle: "SpringCloud netflix"
ext:
date:  2019-09-12
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['JAVA', '转载']
musicUri: 468490460
musicTitle: Let Me Love You
musicFrom: Alex Goot
author: gomyck
openPay: false
---

观点不一定准确，但是是最好理解的。

1、首先，Netflix是一家做视频的网站，可以这么说该网站上的美剧应该是最火的。

2、Netflix是一家没有CTO的公司，正是这样的组织架构能使产品与技术无缝的沟通，从而能快速迭代出更优秀的产品。在当时软件敏捷开发中，Netflix的更新速度不亚于当年的微信后台变更，虽然微信比Netflix迟发展，但是当年微信的灰度发布和敏捷开发应该算是业界最猛的。

3、Netflix由于做视频的原因，访问量非常的大，从而促使其技术快速的发展在背后支撑着，也正是如此，Netflix开始把整体的系统往微服务上迁移。

4、Netflix的微服务做的不是最早的，但是确是最大规模的在生产级别微服务的尝试。也正是这种大规模的生产级别尝试，在服务器运维上依托AWS云。当然AWS云同样受益于Netflix的大规模业务不断的壮大。

5、Netflix的微服务大规模的应用，在技术上毫无保留的把一整套微服务架构核心技术栈开源了出来，叫做Netflix OSS，也正是如此，在技术上依靠开源社区的力量不断的壮大。

6、Spring Cloud是构建微服务的核心，而Spring Cloud是基于Spring Boot来开发的。

7、Pivotal在Netflix开源的一整套核心技术产品线的同时，做了一系列的封装，就变成了Spring Cloud；虽然Spring Cloud到现在为止不只有Netflix提供的方案可以集成，还有很多方案，但Netflix是最成熟的。

In 2007, Netflix started on a long road towards fully operating in the cloud. Much of Netflix’s backend and mid-tier applications are built using Java, and as part of this effort Netflix engineering built several cloud infrastructure libraries and systems — Ribbon for load balancing, Eureka for service discovery, and Hystrix for fault tolerance. To stitch all of these components together, additional libraries were created — Governator for dependency injection with lifecycle management and Archaius for configuration. All of these Netflix libraries and systems were open-sourced around 2012 and are still used by the community to this day.

In 2015, Spring Cloud Netflix reached 1.0. This was a community effort to stitch together the Netflix OSS components using Spring Boot instead of Netflix internal solutions. Over time this has become the preferred way for the community to adopt Netflix’s Open Source software. We are happy to announce that starting in 2018, Netflix is also making the transition to Spring Boot as our core Java framework, leveraging the community’s contributions via Spring Cloud Netflix.

Why is Netflix adopting Spring Boot after having invested so much in internal solutions? In the early 2010s, key requirements for Netflix cloud infrastructure were reliability, scalability, efficiency, and security. Lacking suitable alternatives, we created solutions in-house. Fast forward to 2018, the Spring product has evolved and expanded to meet all of these requirements, some through the usage and adaptation of Netflix’s very own software! In addition, community solutions have evolved beyond Netflix’s original needs. Spring provides great experiences for data access (spring-data), complex security management (spring-security), integration with cloud providers (spring-cloud-aws), and many many more.

The evolution of Spring and its features align very well with where we want to go as a company. Spring has shown that they are able to provide well-thought-out, documented, and long lasting abstractions and APIs. Together with the community they have also provided quality implementations from these abstractions and APIs. This abstract-and-implement methodology match well with a core Netflix principle of being “highly aligned, loosely coupled”. Leveraging Spring Boot will allow us to build for the enterprise while remaining agile for our business.

The Spring Boot transition is not something we are undertaking alone. We have been in collaboration with Pivotal throughout the process. Whether it be Github issues and feature requests, in-person conversations at conferences or real-time chats over Gitter/Slack, the responses from Pivotal have been excellent. This level of communication and support gives us great confidence in Pivotal’s ability to maintain and evolve the Spring ecosystem.

Moving forward, we plan to leverage the strong abstractions within Spring to further modularize and evolve the Netflix infrastructure. Where there is existing strong community direction — such as the upcoming Spring Cloud Load Balancer — we intend to leverage these to replace aging Netflix software. Where there is new innovation to bring — such as the new Netflix Adaptive Concurrency Limiters — we want to help contribute these back to the community.

The union of Netflix OSS and Spring Boot began outside of Netflix. We now embrace it inside of Netflix. This is just the beginning of a long journey, and we will be sure to provide updates and interesting findings as we go. We want to give special thanks to the many people who have contributed to this effort over the years, and hope to be part of future innovations to come.

原文链接: <a href="https://medium.com/netflix-techblog/netflix-oss-and-spring-boot-coming-full-circle-4855947713a0">https://medium.com/netflix-techblog/netflix-oss-and-spring-boot-coming-full-circle-4855947713a0</a>
