---
layout: post
title:  "HttpClient 异常解决"
crawlertitle: "HttpClient 异常解决"
subtitle: "HttpClient PoolingHttpClientConnectionManager"
ext: "apache http connect manager"
date:  2020-11-18
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['JAVA', '原创']
musicUri: 31081299
musicTitle: Counting Sheep
musicFrom: SAFIA
author: gomyck
openPay: true
---

遇见个 httpclient 异常, 查看源码, 记录下解决过程

### Exception

> org.apache.http.conn.ConnectionPoolTimeoutException: Timeout waiting for connection from pool

### Cause By

看异常信息, 是等待连接池的连接超时了, 那么进一步分析, 应该是连接池连接数不够

### Resolve It!

查看 HttpClients (工厂类), 找到 build 方法, 查看源代码, 找有关连接池的相关代码, 发现代码片段如下:
```java
HttpClientConnectionManager connManagerCopy = this.connManager;
if (connManagerCopy == null) {
    LayeredConnectionSocketFactory sslSocketFactoryCopy = this.sslSocketFactory;
    if (sslSocketFactoryCopy == null) {
        final String[] supportedProtocols = systemProperties ? split(
                System.getProperty("https.protocols")) : null;
        final String[] supportedCipherSuites = systemProperties ? split(
                System.getProperty("https.cipherSuites")) : null;
        HostnameVerifier hostnameVerifierCopy = this.hostnameVerifier;
        if (hostnameVerifierCopy == null) {
            hostnameVerifierCopy = new DefaultHostnameVerifier(publicSuffixMatcherCopy);
        }
        if (sslContext != null) {
            sslSocketFactoryCopy = new SSLConnectionSocketFactory(
                    sslContext, supportedProtocols, supportedCipherSuites, hostnameVerifierCopy);
        } else {
            if (systemProperties) {
                sslSocketFactoryCopy = new SSLConnectionSocketFactory(
                        (SSLSocketFactory) SSLSocketFactory.getDefault(),
                        supportedProtocols, supportedCipherSuites, hostnameVerifierCopy);
            } else {
                sslSocketFactoryCopy = new SSLConnectionSocketFactory(
                        SSLContexts.createDefault(),
                        hostnameVerifierCopy);
            }
        }
    }
    @SuppressWarnings("resource")
    final PoolingHttpClientConnectionManager poolingmgr = new PoolingHttpClientConnectionManager(
            RegistryBuilder.<ConnectionSocketFactory>create()
                .register("http", PlainConnectionSocketFactory.getSocketFactory())
                .register("https", sslSocketFactoryCopy)
                .build(),
            null,
            null,
            dnsResolver,
            connTimeToLive,
            connTimeToLiveTimeUnit != null ? connTimeToLiveTimeUnit : TimeUnit.MILLISECONDS);
    if (defaultSocketConfig != null) {
        poolingmgr.setDefaultSocketConfig(defaultSocketConfig);
    }
    if (defaultConnectionConfig != null) {
        poolingmgr.setDefaultConnectionConfig(defaultConnectionConfig);
    }
    if (systemProperties) {
        String s = System.getProperty("http.keepAlive", "true");
        if ("true".equalsIgnoreCase(s)) {
            s = System.getProperty("http.maxConnections", "5");
            final int max = Integer.parseInt(s);
            poolingmgr.setDefaultMaxPerRoute(max);
            poolingmgr.setMaxTotal(2 * max);
        }
    }
    if (maxConnTotal > 0) {
        poolingmgr.setMaxTotal(maxConnTotal);
    }
    if (maxConnPerRoute > 0) {
        poolingmgr.setDefaultMaxPerRoute(maxConnPerRoute);
    }
    connManagerCopy = poolingmgr;
}
```

**默认的连接池只有 5 个!!!!**

解决方式分为多种, 一种是设置系统属性, 但是前提是得开启系统属性支持(systemProperties = true)

另外一种是在 build 前, 设置 HttpClientConnectionManager

### Code Opt

在我的工具类中, 加入了以下代码:

```java
PoolingHttpClientConnectionManager cm = new PoolingHttpClientConnectionManager();

{
    cm.setMaxTotal(300);
    cm.setDefaultMaxPerRoute(75);
    HttpHost localhost = new HttpHost("locahost", 80);
    cm.setMaxPerRoute(new HttpRoute(localhost), 50);
}

public CloseableHttpClient httpclient = HttpClients.custom().setDefaultRequestConfig(defaultRequestConfig).setConnectionManager(cm).useSystemProperties().build();
```

#### 属性说明:

> cm.setMaxTotal(300); // 设置最大连接数, 也就是最大并发连接数
> cm.setDefaultMaxPerRoute(75); // 设置单个路由的最大连接数 比如要请求两个 host: a.com  b.com 那么同时高并发访问, a 和 b 每个 host 最大可发起 75 个连接(不是 300)
> cm.setMaxPerRoute(new HttpRoute(localhost), 50); // 指定路由最大连接数

