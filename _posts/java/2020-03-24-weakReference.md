---
layout: post
title:  "Reference 学习笔记"
crawlertitle: "Reference 学习笔记"
subtitle: "Reference 引用"
ext: "强引用 软引用 弱引用 虚引用"
date:  2020-03-24
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['JAVA', '原创']
musicUri: 412911872
musicTitle: Time Leaper
musicFrom: Henrik Hansson
author: gomyck
openPay: true
---

学习了解 java 引用类型, 并应用到实际需求


## java 数据类型介绍

java 中数据类型分为: 基本类型, 引用类型

### 基本类型:
> 四类八种, 分为整型(byte short int long), 浮点型(double, float), 布尔型(boolean), 字符型(char), 对于基本类型来说, 其值与引用地址都存在栈中, 栈对应的值, 就是该变量的实际值

> 基本类型的存储形式有利于编译器优化, exp: a=1;b=1; a 先初始化, b 则会指向 a, 当 b=2; 时, jvm 会寻找当前栈有没有等于 2 的引用, 有则重复上述步骤, 无则新建字面量 2 并赋予 b; 因为基本类型声明周期跟随当前线程, 所以提高了 jvm 的运行效率(省去内存回收, 以及对象逃逸分析)

> void 也是基本类型, 但是不可以直接操作, 其也有对应的包装类: Void

### 引用类型(对象):
> 引用类型相对于基本类型来说, 其引用对应的值为当前对象在堆内存的 hash 地址, 变量一旦声明之后, 就不可以在更改类型(可以强转, 哈哈)

> 数组 也是引用类型

### 二者的区别:
```text
基本数据类型在栈中进行分配, 而对象类型在堆中进行分配
所有方法的参数都是在传递引用而非本身的值    基本类型例外
对象之间的赋值只是传递引用，基本类型之间的赋值则先搜索, 有则更改引用, 无在赋值
```

### 引用类型的分类

在 java 中, 规定了四种引用类型, 其自身的特性决定了当前引用被 GC 的时机以及代码应用领域

#### 强引用 Strong Reference

在编码过程中, 默认使用的就是该类型的引用, 其特性为如果一个对象引用到 GC Roots 对象可达时, 该对象无法被 GC(即便是 OOM)

#### 软引用 Soft Reference

阻止 GC 能力稍弱, 当软引用到 GC Roots 对象可达时, 将暂时不会被回收, 直到内存不足或不可达时, 才会被回收, 一般来说, 可用作缓存, 即有用但非必须的数据存储

#### 弱引用 Weak Reference

与软引用应用场景类似, 但无法阻止 GC, 当垃圾回收线程扫描到该引用时且GC Roots不可达时, 将会回收它的内存, 弱引用可以配合引用队列联合使用, 当弱引用被回收时, 其引用会添加到引用队列中(ReferenceQueue)

#### 虚引用 Phantom Reference

无法知晓声明周期, 也无法通过引用获得该对象, 其随时可能会被回收, 必须与引用队列配合使用, 以便知晓其是否被回收

### exp:

看一看 WeakHashMap 的实际应用(摘自 openfire 源码, 对我有很大的启发)

> 首先在该类中定义一个 Collections.synchronizedMap(new WeakHashMap<>()); 此代码为同步模式的WeakHashMap, 具体实现可以看看源码, 很简单

> 然后在该类中定义一个内部类, 实现了 AutoCloseable 接口, 可以在 try 代码块自动关闭, 在构造外部类时, 实例化该内部类, 在调用 lock 方法时, 传入外部类实例

> 查看该类的构造函数可以看出, 它是需要传入一个 source 标识以及 class 类型的, 这表示, 你可以在任何的类中使用此类来给指定的资源上锁, 很巧妙, 避免了重复在代码中自己去实现锁

> 同时, 使用唯一资源标识当做 key, 把锁存储在了 WeakHashMap 中, 其中涉及到俩个知识点
```text
1. key 生成使用 String.intern(); 可以保证 key 永远指向常量池地址, intern 方法 1.6 之前与 1.7 之后又一些区别, 具体可看本博客另外介绍文章
2. 使用外部类持有该 key, 可以保证 key 在不为 null 时 (unlock 时会把 key 设置为 null), 无法被 GC, 具体原理看最下边的实验小节
```
[点我跳转到实验小节](#关于弱引用的一个小实验)

> 当使用 close 时, 把 key 设置为 null, 以便于 GC, 如果在下次 GC 之前, 使用同样的资源标识获取 lock, 那么会返回同样的 lock 对象, 如果没有, 则走computeIfAbsent方法, 此方法为如果 key 不存在时,
> 调用传入的 function 函数, 并把该函数返回值当做值, 传入的 key 当做键, 存储到当前 MAP 中(就相当于, 有则返回, 没有则put, 再返回)



```java
package org.jivesoftware.util;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.WeakHashMap;
import java.util.concurrent.locks.ReentrantLock;

/**
 * A {@link ReentrantLock} lock that can be unlocked using an {@link AutoCloseable}. This allows for easy locking of
 * resources, using a specific class as a namespace. Typical usage:
 * <pre>
 *     try (final AutoCloseableReentrantLock.AutoCloseableLock ignored = new AutoCloseableReentrantLock(Clazz.class, user.getUsername()).lock()) {
 *         user.performNonThreadSafeTask();
 *     }
 * </pre>
 * <p>
 * This essentially has the same effect as:
 * <pre>
 *     synchronised ((Clazz.class.getName() + user.getUsername()).intern()) {
 *         user.performNonThreadSafeTask();
 *     }
 * </pre>
 * <p>
 * but has advantages in that the current status of the lock can interrogated, the lock can be acquired interruptibly, etc.
 */
public class AutoCloseableReentrantLock {

    // This is a WeakHashMap - when there are no references to the key, the entry will be removed
    private static final Map<String, ReentrantLock> LOCK_MAP = Collections.synchronizedMap(new WeakHashMap<>());
    private final ReentrantLock lock;
    private final AutoCloseableLock autoCloseable;
    private String key;

    /**
     * Create a class and resource specific lock. If another thread has not closed another AutoCloseableReentrantLock
     * with the same class and resource then this will block until it is closed.
     *
     * @param clazz    The class for which the lock should be created.
     * @param resource The resource for which the lock should be created.
     */
    public AutoCloseableReentrantLock(final Class clazz, final String resource) {
        key = (clazz.getName() + '#' + resource).intern();
        lock = LOCK_MAP.computeIfAbsent(key, missingKey -> new ReentrantLock());
        autoCloseable = new AutoCloseableLock(this);
    }

    private synchronized void close() throws IllegalMonitorStateException {
        lock.unlock();
        // Clear the reference to the key so the GC can remove the entry from the WeakHashMap if no-one else has it
        if (!lock.isHeldByCurrentThread()) {
            key = null;
        }
    }

    private synchronized void checkNotReleased() throws IllegalStateException {
        if (key == null) {
            throw new IllegalStateException("Lock has already been released");
        }
    }

    /**
     * Acquires the lock, blocking indefinitely.
     *
     * @return An AutoCloseableLock
     * @throws IllegalStateException if this lock has already been released by the last thread to hold it
     */
    public AutoCloseableLock lock() throws IllegalStateException {
        checkNotReleased();
        lock.lock();
        return autoCloseable;
    }

    /**
     * Tries to acquire the lock, returning immediately.
     *
     * @return An AutoCloseableLock if the lock was required, otherwise empty.
     * @throws IllegalStateException if this lock has already been released by the last thread to hold it
     */
    public Optional<AutoCloseableLock> tryLock() {
        checkNotReleased();
        if (lock.tryLock()) {
            return Optional.of(autoCloseable);
        } else {
            return Optional.empty();
        }
    }

    /**
     * Acquires the lock, blocking until the lock is acquired or the thread is interrupted.
     *
     * @return An AutoCloseableLock
     * @throws InterruptedException  if the thread was interrupted before the lock could be acquired
     * @throws IllegalStateException if this lock has already been released by the last thread to hold it
     */
    public AutoCloseableLock lockInterruptibly() throws InterruptedException, IllegalStateException {
        checkNotReleased();
        lock.lockInterruptibly();
        return autoCloseable;
    }

    /**
     * Queries if this lock is held by the current thread.
     *
     * @return {@code true} if current thread holds this lock and {@code false} otherwise
     * @see ReentrantLock#isHeldByCurrentThread()
     */
    public boolean isHeldByCurrentThread() {
        return lock.isHeldByCurrentThread();
    }

    /**
     * Queries if this lock is held by any thread. This method is
     * designed for use in monitoring of the system state,
     * not for synchronization control.
     *
     * @return {@code true} if any thread holds this lock and {@code false} otherwise
     * @see ReentrantLock#isLocked()
     */
    public boolean isLocked() {
        return lock.isLocked();
    }

    public static final class AutoCloseableLock implements AutoCloseable {

        private final AutoCloseableReentrantLock lock;

        private AutoCloseableLock(final AutoCloseableReentrantLock lock) {
            this.lock = lock;
        }

        /**
         * Releases the lock.
         *
         * @throws IllegalMonitorStateException if the current thread does not hold the lock.
         */
        @Override
        public void close() throws IllegalMonitorStateException {
            lock.close();
        }
    }

}

```

### 关于弱引用的一个小实验

demo1 的 key 得不到释放, 因为其所在对象被外部 list 持有
demo2 的 key 可以被 GC, 因为其所在对象到 GC ROOTS 不可达(没有被其他对象持有, new 之后就结束了短暂的一声)

```java
/*
 * Copyright (c) 2020. www.gomyck.com. All rights reserved.
 */

package reference;

import org.junit.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.WeakHashMap;

/**
 * @author gomyck
 * @version 1.0.0
 * @contact qq: 474798383
 * @blog https://blog.gomyck.com
 */
public class Demo {

    private String key;

    @Test
    public void demo1() {
        int totalNum = 10000;
        List<Demo> list = new ArrayList<>();
        WeakHashMap<String, Object> w = new WeakHashMap<>();
        for(int i=0;i<totalNum;i++){
            Demo d = new Demo();
            list.add(d);
            d.key = ("xxx" + i).intern();
            w.put(d.key, new Object());
            System.gc();
            System.out.println(w.size());
        }
    }

    @Test
    public void demo2() {
        int totalNum = 10000;
        WeakHashMap<String, Object> w = new WeakHashMap<>();
        for(int i=0;i<totalNum;i++){
            Demo d = new Demo();
            d.key = ("xxx" + i).intern();
            w.put(d.key, new Object());
            System.gc();
            System.out.println(w.size());
        }
    }

}

```
