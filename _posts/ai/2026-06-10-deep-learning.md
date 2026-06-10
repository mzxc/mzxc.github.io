---
layout: post
title:  "深度学习的一些概念"
crawlertitle: "深度学习的一些概念"
subtitle: "LLM AI 大模型"
ext: ""
date:  2026-06-10
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['AI', '原创']
musicUri: 1969039800
musicTitle: 如果的事
musicFrom: gomyck
author: gomyck
openPay: true
---

# 深度学习的一些概念

## 数值概念

![image](https://github.com/mzxc/picx-images-hosting/raw/master/20260302/image.5c1itiop9l.webp)

![image](https://github.com/mzxc/picx-images-hosting/raw/master/20260302/image.6f184en3yb.webp)

## 单个神经元展开的表达式

> i 就是当前的神经元序号(一共有 m 个), j 就是当前输入序号(一共有 n 个)

![image](https://github.com/mzxc/picx-images-hosting/raw/master/20260302/image.6f184esnhk.webp)

每个神经元都有 n 个权重, 对应输入维度数, 所以当前层所有的权重就是 m × n 的矩阵, 下面是展开后的解释

![image](https://github.com/mzxc/picx-images-hosting/raw/master/20260302/image.4g51e2tbuq.webp)

## 上面的神经元算完之后, 怎么激活

原来的感知器可能只是输出两个信号: 0 或者 1, 但是现在的网络激活函数有很多:

ReLU

![image](https://github.com/mzxc/picx-images-hosting/raw/master/20260302/image.7lkjd0rmx2.png)

Sigmoid

![image](https://github.com/mzxc/picx-images-hosting/raw/master/20260302/image.2oc2j6eljg.webp)

Softmax（多分类输出层）

![image](https://github.com/mzxc/picx-images-hosting/raw/master/20260302/image.8dxeura0xz.webp)

> 神经元“激活”发生在线性计算之后、每一层都会激活；
> 网络内部几乎从不输出 0/1，
> 0/1 是你在推理阶段对概率结果做的决策，而不是网络本身的输出。
>
> ## 训练的一些概念
>
> mAP ap IoU
>
> ![image](https://github.com/mzxc/picx-images-hosting/raw/master/20260302/image.2ksglhm027.webp)
>
> ![image](https://github.com/mzxc/picx-images-hosting/raw/master/20260302/image.4xv32p2ucw.webp)
