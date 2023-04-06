---
layout: post
title:  "SPI 与 ContextClassLoader"
crawlertitle: "SPI 与 ContextClassLoader"
subtitle: "JDBC SPI ContextClassLoader"
ext: "getContextClassLoader"
date:  2022-08-26
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['JAVA', '转载']
musicUri: 406072775
musicTitle: Move Up
musicFrom: Mr. Polska
author: Jurrivh
openPay: true
---

通过JDBC为例谈谈双亲委派模型的破坏

双亲委派模型并不是一个强制约束模型,而是java设计者推荐给开发者的类加载实现方式; 但是也会有例外; 今天我们主要来讲一讲 类似于SPI这种设计导致的双亲委派模型被"破坏"的情况;

![image](/img/in-post/res2022-08-26/2022-08-26-000.png)

**JDBC 不破坏双亲委派模型使用驱动**
```java
 // 1.加载数据访问驱动
Class.forName("com.mysql.cj.jdbc.Driver"); //这句会主动去加载类
// 2.连接到数据库
Connection conn= DriverManager.getConnection("jdbc:mysql://localhost:3306/test", "root", "root");

public class Driver extends NonRegisteringDriver implements java.sql.Driver {
    static {
        try {
            java.sql.DriverManager.registerDriver(new Driver());
        } catch (SQLException E) {
            throw new RuntimeException("Can't register driver!");
        }
    }
}
```

**JDBC 破坏双亲委派模型使用驱动**
```java
//省去了上面的Class.forName()注册过程
Connection conn= DriverManager.getConnection("jdbc:mysql://localhost:3306/test", "root", "root");
```

**SPI 实现方式如下:**

```text
1.从META-INF/services/java.sql.Driver文件中获取具体的实现类名"com.mysql.cj.jdbc.Driver"
2.加载这个类，用Class.forName("com.mysql.jdbc.Driver")来加载
```

Class.forName()加载用的是调用者的Classloader, 这个调用者DriverManager是在rt.jar中的，ClassLoader是启动类加载器，而com.mysql.jdbc.Driver肯定不在/lib下，所以肯定是无法加载mysql中的这个类的。这就是双亲委派模型的局限性了，父级加载器无法加载子级类加载器路径中的类。

**如何解决父加载器无法加载子级类加载器路径中的类**

想要正常的加载，启动类加载器肯定不能加载，那么只能用应用类加载器能够加载,那么如果有什么办法能够获取到应用类加载器就可以解决问题了;

**我们看看 jdk是怎么做的;**

```java
public class DriverManager {
    static {
        loadInitialDrivers();
        println("JDBC DriverManager initialized");
    }
    private static void loadInitialDrivers() {
        //省略代码
        //这里就是查找各个sql厂商在自己的jar包中通过spi注册的驱动
        ServiceLoader<Driver> loadedDrivers = ServiceLoader.load(Driver.class);
        Iterator<Driver> driversIterator = loadedDrivers.iterator();
        try{
             while(driversIterator.hasNext()) {
                driversIterator.next();
             }
        } catch(Throwable t) {
                // Do nothing
        }
    }
}

public static <S> ServiceLoader<S> load(Class<S> service) {
    ClassLoader cl = Thread.currentThread().getContextClassLoader();
    return ServiceLoader.load(service, cl);
}
```

**获取线程上下文类加载器Thread.currentThread().getContextClassLoader(); 这个值如果没有特定设置,一般默认使用的是应用程序类加载器;**

**总结**

为了实现SPI这种模式,实现可插拔 做出了不符合双亲委派原则行为,但是这种破坏并不具备贬义的感情色彩,只要有足够意义和理由，突破已有的原则就可以认为是一种创新;

对于线程上下文类加载器 的实现类似于ThreadLocal 将变量传递到整个线程的生命周期; 这里无非就是将ThreadLocal里面存放的是应用类加载器;

原文链接: <a href="https://cloud.tencent.com/developer/article/1846796">https://cloud.tencent.com/developer/article/1846796</a>
