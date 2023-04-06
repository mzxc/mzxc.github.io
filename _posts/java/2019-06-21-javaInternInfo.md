---
layout: post
title:  "Java常量池以及intern方法详解"
crawlertitle: "Java常量池以及intern方法详解"
subtitle: "Java 常量池 intern"
ext:
date:  2019-06-21
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['JVM', '原创']
musicUri: 441612737
musicTitle: Jackpot
musicFrom: TheFatRat
author: gomyck
openPay: true
---


对比版本之间常量池的区别, 以及intern的用法及作用

#### 1.在jdk1.6（包括1.6）之前，所有使用双引号生成的字符串，都会在常量池生成

#### 2.jdk1.6之前的常量池实现在方法区（perm区），使用new关键字初始化的String，会在堆和常量池中分别生成对象

但是在1.6中，如果intern()方法检测到只有堆中存在对象，而常量池没有，则会在常量池里也存入等值对象
```java
String xxx = new String("1") + new String("1")
xxx.intern();
String ccc = "11";
```
常量池中只存在1，堆内存中则为11的对象，在调用了xxx.intern()方法之后，检测到常量池没有，则在常量池加入11的等值对象

ccc在创建的时候，会检查11这个值在常量池是否存在，结果是存在的（但是与xxx的引用地址不同，xxx的引用地址为堆内存地址，而非常量池内存地址，ccc引用地址为常量池对象地址）

#### 3.jdk1.7之后，常量池的实现为堆内存，此时调用intern(),如果常量池中不存在，则直接在常量池中存储其堆内存的引用
```java
String xxx = new String("1") + new String("1")
xxx.intern();
String ccc = "11";
```
这时候，常量池只存在1，堆内存中为11的对象，在调用了intern()方法之后，常量池会加入一个值，该值直接引用堆内11（xxx对象）的内存地址

ccc在创建的时候，会检查11这个值在常量池是否存在，结果是存在的（也就是xxx的引用）

##### 运行以下代码
```java
String str1 = new String("go") + new String("myck");
System.out.println(str1.intern() == str1);
System.out.println(str1 == "gomyck");
```
#### jdk1.6结果：

false(常量池没有，则在常量池生成并返回地址与str1的堆内存地址比较)
false(str1的堆内存地址与常量池返回的地址做比较)

#### jdk1.7结果：

true(常量池没有，则在常量池存储str1的堆内存地址，并返回地址与str1的堆内存地址比较)
true(str1的堆内存地址与常量池的地址比较，而常量池的地址是上一步调用存的值)

##### 运行以下代码
```java
String str2 = "gomyck";//新加的一行代码，其余不变
String str1 = new String("go")+ new String("myck");
System.out.println(str1.intern() == str1);
System.out.println(str1 == "gomyck");
```
#### jdk1.6结果：

false(常量池有，则返回常量池地址与str1的堆内存地址比较)
false(str1的堆内存地址与常量池返回的地址做比较)

#### jdk1.7结果：

false(常量池有，则返回常量池的堆内存地址与str1的堆内存地址比较)
false(str1的堆内存地址与常量池的地址比较)

### String类使用final关键字修饰

其内部的实现方式： char[] value, int hash 都是使用final修饰的
通常使用的replace sub..方法都是在逻辑操作之后，返回的新字符串引用
说明String的值不可改变，String值不可变保证了并发安全性, 以及提高hash计算效率
但是因为其存储值依旧是引用类型，所以在程序内部依旧可以改变其值(得到引用，直接操作)。

### intern 的应用场景

在一个长期持有 String 对象的业务中, 使用 intern 可避免内存浪费

比如 StringBuffer 的 toString 是 new String(), 如果两次的字符串内容一致, 并且该字符串所在线程长期持有, 那么使用 intern 可释放多余的重复对象(指内容相同的对象)


```java
String str = "gomyck";
Field strField = str.getClass().getDeclaredField("value");
strField.setAccessible(true);
char[] c = (char[])strField.get(str);
c[1] = 'g';
System.out.println(str);
```
StringBuilder实现为char[] 其append方法为arraycopy(native)
