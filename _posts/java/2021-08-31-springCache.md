---
layout: post
title:  "Spring Cache 底层代码剖析"
crawlertitle: "Spring Cache 底层代码剖析"
subtitle: "JAVA spring cache"
ext: ""
date:  2021-08-31
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['JAVA', '原创']
musicUri: 1868943615
musicTitle: 时光洪流
musicFrom: 程响
author: gomyck
openPay: true
---

抛开常用的注解一类, 专注于 AOP 的实现细节

**阅读本篇文章的前置: 需要理解 Spring AOP 的基本原理**

### cache

spring cache 在 springframework 的 context 包下, 有两个顶级接口

org.springframework.cache.Cache

org.springframework.cache.CacheManager

#### 1. Cache 接口定义了一些基本的缓存操作函数(也可以理解为缓存的声明周期)

**exp: put get evict clear invalidate**

Cache 中定义的内部类, ValueWrapper 对后续衍生的缓存类中间件接口有很大的示范作用

代码如下:

```java
/**
 * A (wrapper) object representing a cache value.
 */
@FunctionalInterface
interface ValueWrapper {

    /**
     * Return the actual value in the cache.
     */
    @Nullable
    Object get();
}
```

#### 2. CacheManager 接口定义了获取缓存操作对象的函数

exp:
```java
Cache getCache(String name);
Collection<String> getCacheNames();
```

**CacheManager 的实现类很多, 常用的: RedisCacheManager 详见: springboot-autoconfigure - cache 包**

##### 3. 缓存组件底层

有了缓存对象的抽象和抽象管理, 如何把实际的缓存功能提供到运行时代码中呢: AOP, spring 利用切面, 把缓存织入到实际的业务代码中(有点不完美)

**1. CompositeCacheManager -> 缓存管理对象集合 这个对象后面要用**

2. BeanFactoryCacheOperationSourceAdvisor -> 缓存操作增强 工厂类 : 这个类是 AOP 具体的实现, 需要传入拦截器实例(CacheInterceptor)  与切入点实例(CacheOperationSource)

**看下代码:**

```java
public class BeanFactoryCacheOperationSourceAdvisor extends AbstractBeanFactoryPointcutAdvisor {

    @Nullable
    private CacheOperationSource cacheOperationSource;

    private final CacheOperationSourcePointcut pointcut = new CacheOperationSourcePointcut() {
        @Override
        @Nullable
        protected CacheOperationSource getCacheOperationSource() {
            return cacheOperationSource;
        }
    };

    public void setCacheOperationSource(CacheOperationSource cacheOperationSource) {
        this.cacheOperationSource = cacheOperationSource;
    }

    public void setClassFilter(ClassFilter classFilter) {
        this.pointcut.setClassFilter(classFilter);
    }

    @Override
    public Pointcut getPointcut() {
        return this.pointcut;
    }

}
```

BeanFactoryCacheOperationSourceAdvisor 内部实例化了一个切入点

实际上依赖于 CacheOperationSource -> AnnotationCacheOperationSource 这个类中定义了 CacheAnnotationParser -> SpringCacheAnnotationParser

CacheOperationSource -> isCandidateClass -> SpringCacheAnnotationParser -> isCandidateClass 用于确定是否匹配指定类, 被用于 CacheOperationSourcePointcut 的内部 classFilter 中

CacheOperationSource -> getCacheOperations -> AbstractFallbackCacheOperationSource -> getCacheOperations 用于快速匹配当前类所用缓存增强, 以及分析当前类所有方法的缓存操作行为

看代码:

```java
public Collection<CacheOperation> getCacheOperations(Method method, @Nullable Class<?> targetClass) {
    if (method.getDeclaringClass() == Object.class) {
        return null;
    }

    Object cacheKey = getCacheKey(method, targetClass); // 使用当前方法和目标类名, 生成唯一 key
    Collection<CacheOperation> cached = this.attributeCache.get(cacheKey);  // 在本地缓存中取出缓存增强类 (针对当前方法)

    if (cached != null) {
        return (cached != NULL_CACHING_ATTRIBUTE ? cached : null);
    }
    else {
        Collection<CacheOperation> cacheOps = computeCacheOperations(method, targetClass); // 使用 cacheOperationSource 实现类 (AnnotationCacheOperationSource) 的方法获取当前方法的所有缓存行为
        if (cacheOps != null) {
            if (logger.isTraceEnabled()) {
                logger.trace("Adding cacheable method '" + method.getName() + "' with attribute: " + cacheOps);
            }
            this.attributeCache.put(cacheKey, cacheOps); // 缓存起来
        }
        else {
            this.attributeCache.put(cacheKey, NULL_CACHING_ATTRIBUTE);
        }
        return cacheOps;
    }
}
```

**后面的就很好理解了..就这样吧~**


