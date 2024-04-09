---
layout: post
title:  "K8S pod 拓扑分布策略"
crawlertitle: "K8S pod 拓扑分布策略"
subtitle: "docker  k8s  topology"
ext: ""
date:  2024-04-09
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

由于K8S 集群内配置未拉齐, 且 node 数量小于 50, 导致 schedule 在 pod 分配时, 一次性拉取所有 node 信息, 进行打分, 这导致 pod 分布的倾斜

## 相关知识

在 k8s 中 通过 kube-scheduler 组件来实现 pod 的调度,所谓调度, 即把需要创建的 pod 放到 合适的 node 上, 大概流程为,通过对应的 调度算法 和 调度策略,
为待调度的 pod 列表中的 pod 选择一个最合适的 Node, 然后目标节点上的 kubelet 通过 watch 接口监听到 kube-schedule 产生的 Pod 绑定事件,
通过 APIService 获取对应的 Pod 清单,下载 image 并且启动容器.

这里具体的 调度算法 大体上分两步,筛选出候选节点,确定最优节点,确定最优节点涉及节点打分等.

常见的 Pod 的 调度策略 有 选择器、指定节点、主机亲和性方式,同时需要考虑节点的 cordon 与 drain 标记

[Kubernetes 调度器](https://kubernetes.io/zh-cn/docs/concepts/scheduling-eviction/kube-scheduler/)

[Kubernetes 调度器配置](https://kubernetes.io/zh-cn/docs/reference/scheduling/config/)

[调度器性能调优](https://kubernetes.io/zh-cn/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)

[Pod 拓扑分布约束](https://kubernetes.io/zh-cn/docs/concepts/scheduling-eviction/topology-spread-constraints/)

[调度框架](https://kubernetes.io/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/)

[kube-scheduler-config配置](https://kubernetes.io/zh-cn/docs/reference/config-api/kube-scheduler-config.v1/)

## 为什么需要跨集群节点 均匀调度分布 Pod ？

我们知道在 k8s 中, 如果只是希望每个节点均匀调度分布一个 pod, 那么可以利用 DaemonSet 来实现. 如果多个, 就需要 pod 的拓扑分布约束均匀调度 Pod,
实现在集群中均匀分布 Pod, 可以尽可能的利用 节点的超售, Pod 的超用, 以实现高可用性和高效的集群资源利用.

k8s 中通过 Pod 拓扑分布约束 (PodTopologySpread) 来实现均匀调度 pod. 这一特性从 v1.19 以后达到稳定状态. 在 v1.25,v1.1.26 的版本中添加的部分属性.

需要说明的是, 这里的 均匀调度 pod 不是说 只有对当前需要调度的 pod 在 工作节点发生均匀调度,不考虑当前节点上之前存在的 pod , 而是基于 工作节点的 均匀调度.即所谓均匀调度分布是基于工作节点的.虽然 pod 的拓扑分布约束是定义在 pod 上的.

## 解决办法

通过查看 k8s 官方文档, 发现通过简单修改调度器配置并不能解决问题, 因为在 node 数量小于 50 的情况下, 可操作空间非常小

如果使用 k8s 调度器插件, 则会提升集群调度的复杂性, 且不能保证稳定性

最终使用 pod 拓扑规则来实现调度的均衡策略, 具体使用方式如下

- 为每个可分配 POD 的节点新增标签: node = worker1, node = worker2, node = worker3 .......
  - 如果不使用这个 key 的话, 控制节点如果不能分配 pod 的情况下, 会造成差值(maxSkew), 导致不能继续分配
  - 相同的 node 的值, 将会被视为同一个域, 即同一个节点(拓扑逻辑上)
- 对需要进行拓扑约束的 pod, 编辑 yaml, 如下:

```yaml
---
#######省略了无用的配置项#######
apiVersion: apps/v1
kind: Deployment
spec:
  selector:
    matchLabels:
      k8s.kuboard.cn/layer: svc
      k8s.kuboard.cn/name: ad1
  template:
    spec:
      containers:
        - image: 'hao474798383/msg-router:v2.2.1-jre11'
          imagePullPolicy: IfNotPresent
          name: message-router
      #######新增下述配置#######
      topologySpreadConstraints:
        - labelSelector:
            # 用于查找匹配的 Pod。匹配此标签的 Pod 将被统计，以确定相应拓扑域中 Pod 的数量
            matchLabels:
              app: test
            # 用于查找匹配的 Pod。匹配此标签的 Pod 将被统计，以确定相应拓扑域中 Pod 的数量
            matchExpressions:
              - key: k8s.kuboard.cn/layer
                operator: In
                values:
                  - svc
                  - web
          # 以绝对均匀的方式分配 pod, 即 pod 在节点分布的差值不能超过的值(1)
          maxSkew: 1
          topologyKey: node
          # ScheduleAnyway 始终调度 pod,即使它不能满足 pod 的均匀分布, 但会尽量满足均衡
          whenUnsatisfiable: DoNotSchedule
```











