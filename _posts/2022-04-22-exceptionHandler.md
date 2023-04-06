---
layout: post
title:  "Spring 全局异常处理原理剖析"
crawlertitle: "Spring 全局异常处理原理剖析"
subtitle: "SPRING exception handler controllerAdvice"
ext: ""
date:  2022-04-22
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['JAVA', '原创']
musicUri: 1325711964
musicTitle: Talking to the moon
musicFrom: gomyck
author: gomyck
openPay: true
---

通过对源码解读, 来了解 Spring 异常处理机制

### 分析一下常见的 starter 配置原理

众所周知, 如果我们想自定义一个 springboot 的 starter, 那么需要在编码完成之后, 在 META-INF 文件夹中编写个 spring.factories 文件, 其内需要
指定改 starter 的入口配置在哪:

```properties
org.springframework.boot.autoconfigure.EnableAutoConfiguration=com.gomyck.jdbc.converter.GomyckConverterConfiguration
```

那其实仔细看这个配置, 不难发现, EnableAutoConfiguration其实是一个类, 其是 springboot autoconfigure 包下的一个注解, 而且应用到了 importSelector

其 import 的值就是
```java
@Override
public String[] selectImports(AnnotationMetadata annotationMetadata) {
    if (!isEnabled(annotationMetadata)) {
        return NO_IMPORTS;
    }
    AutoConfigurationEntry autoConfigurationEntry = getAutoConfigurationEntry(annotationMetadata);
    return StringUtils.toStringArray(autoConfigurationEntry.getConfigurations());
}
```

**那么 spring.factories 是如何被 spring 加载并执行的呢?**

其实 spring framework 是提供一种类似 java SPI 的一种动态加载机制的: SpringFactoriesLoader, 该类可以加载.factories 文件, 并且收集相关配置信息

通过代码跟踪, 我们能看到, AutoConfigurationImportSelector这个类的

selectImports -> getAutoConfigurationEntry -> fireAutoConfigurationImportEvents -> getAutoConfigurationImportListeners

通过上述方法, 把所有的 starter 入口类加载实例化

而AutoConfigurationImportSelector这个类是如何被加载实例化的呢? 看注解: @EnableAutoConfiguration, 这个注解被包含在: @SpringBootApplication 之中, 被显式声明到服务函数入口类中

### 了解 spring 异常处理机制

spring 中如果想拦截并处理指定异常, 需要声明类, 并使用注解: @RestControllerAdvice 或 @ControllerAdvice

通过追踪两个注解, 最终可得到一个该注解的包装类: ControllerAdviceBean, 该类描述了一个 controller 增强类的一些详细信息, 包括名称, 包名等信息

追踪该类可得到, 该类是由 ExceptionHandlerExceptionResolver 初始化, 追踪该类, 可看到, 该类实现了 InitializingBean, 在初始化之后, 扫描了上下文, 过滤出有ControllerAdvice注解的 bean


```java
private void initExceptionHandlerAdviceCache() {
    if (getApplicationContext() == null) {
        return;
    }

    List<ControllerAdviceBean> adviceBeans = ControllerAdviceBean.findAnnotatedBeans(getApplicationContext());
    for (ControllerAdviceBean adviceBean : adviceBeans) {
        Class<?> beanType = adviceBean.getBeanType();
        if (beanType == null) {
            throw new IllegalStateException("Unresolvable type for ControllerAdviceBean: " + adviceBean);
        }
        ExceptionHandlerMethodResolver resolver = new ExceptionHandlerMethodResolver(beanType);
        if (resolver.hasExceptionMappings()) {
            this.exceptionHandlerAdviceCache.put(adviceBean, resolver);
        }
        if (ResponseBodyAdvice.class.isAssignableFrom(beanType)) {
            this.responseBodyAdvice.add(adviceBean);
        }
    }

    if (logger.isDebugEnabled()) {
        int handlerSize = this.exceptionHandlerAdviceCache.size();
        int adviceSize = this.responseBodyAdvice.size();
        if (handlerSize == 0 && adviceSize == 0) {
            logger.debug("ControllerAdvice beans: none");
        }
        else {
            logger.debug("ControllerAdvice beans: " +
                    handlerSize + " @ExceptionHandler, " + adviceSize + " ResponseBodyAdvice");
        }
    }
}
```

并且, 初始化了内部的参数解析器(argumentResolver) 和 返回值处理器(returnValueHandler), 感兴趣的可以看看这两个处理器的作用

而具体的处理异常的方法块, 可以去看 mvc 的核心类: dispatchServlet

```java

// line: 1125
if (exception != null) {
    if (exception instanceof ModelAndViewDefiningException) {
        logger.debug("ModelAndViewDefiningException encountered", exception);
        mv = ((ModelAndViewDefiningException) exception).getModelAndView();
    }
    else {
        Object handler = (mappedHandler != null ? mappedHandler.getHandler() : null);
        mv = processHandlerException(request, response, handler, exception);
        errorView = (mv != null);
    }
}

```

### 其他的异常处理器

**DefaultErrorAttributes** 这个类, 在 ErrorMvcAutoConfiguration 中初始化了实例, 其主要作用为配合 **BasicErrorController** 组合使用(我们平时看见的 spring 错误白页)

```java
@Override
public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler,
        Exception ex) {
    storeErrorAttributes(request, ex);
    return null;
}

private void storeErrorAttributes(HttpServletRequest request, Exception ex) {
    request.setAttribute(ERROR_ATTRIBUTE, ex);
}

@Override
public Map<String, Object> getErrorAttributes(WebRequest webRequest, ErrorAttributeOptions options) {
    Map<String, Object> errorAttributes = getErrorAttributes(webRequest, options.isIncluded(Include.STACK_TRACE));
    if (Boolean.TRUE.equals(this.includeException)) {
        options = options.including(Include.EXCEPTION);
    }
    if (!options.isIncluded(Include.EXCEPTION)) {
        errorAttributes.remove("exception");
    }
    if (!options.isIncluded(Include.STACK_TRACE)) {
        errorAttributes.remove("trace");
    }
    if (!options.isIncluded(Include.MESSAGE) && errorAttributes.get("message") != null) {
        errorAttributes.put("message", "");
    }
    if (!options.isIncluded(Include.BINDING_ERRORS)) {
        errorAttributes.remove("errors");
    }
    return errorAttributes;
}
```

**DefaultHandlerExceptionResolver**这个类, 可以为异步请求返回各种不支持的错误:

```java
@Override
@Nullable
protected ModelAndView doResolveException(
        HttpServletRequest request, HttpServletResponse response, @Nullable Object handler, Exception ex) {

    try {
        if (ex instanceof HttpRequestMethodNotSupportedException) {
            return handleHttpRequestMethodNotSupported(
                    (HttpRequestMethodNotSupportedException) ex, request, response, handler);
        }
        else if (ex instanceof HttpMediaTypeNotSupportedException) {
            return handleHttpMediaTypeNotSupported(
                    (HttpMediaTypeNotSupportedException) ex, request, response, handler);
        }
        else if (ex instanceof HttpMediaTypeNotAcceptableException) {
            return handleHttpMediaTypeNotAcceptable(
                    (HttpMediaTypeNotAcceptableException) ex, request, response, handler);
        }
        else if (ex instanceof MissingPathVariableException) {
            return handleMissingPathVariable(
                    (MissingPathVariableException) ex, request, response, handler);
        }
        else if (ex instanceof MissingServletRequestParameterException) {
            return handleMissingServletRequestParameter(
                    (MissingServletRequestParameterException) ex, request, response, handler);
        }
        else if (ex instanceof ServletRequestBindingException) {
            return handleServletRequestBindingException(
                    (ServletRequestBindingException) ex, request, response, handler);
        }
        else if (ex instanceof ConversionNotSupportedException) {
            return handleConversionNotSupported(
                    (ConversionNotSupportedException) ex, request, response, handler);
        }
        else if (ex instanceof TypeMismatchException) {
            return handleTypeMismatch(
                    (TypeMismatchException) ex, request, response, handler);
        }
        else if (ex instanceof HttpMessageNotReadableException) {
            return handleHttpMessageNotReadable(
                    (HttpMessageNotReadableException) ex, request, response, handler);
        }
        else if (ex instanceof HttpMessageNotWritableException) {
            return handleHttpMessageNotWritable(
                    (HttpMessageNotWritableException) ex, request, response, handler);
        }
        else if (ex instanceof MethodArgumentNotValidException) {
            return handleMethodArgumentNotValidException(
                    (MethodArgumentNotValidException) ex, request, response, handler);
        }
        else if (ex instanceof MissingServletRequestPartException) {
            return handleMissingServletRequestPartException(
                    (MissingServletRequestPartException) ex, request, response, handler);
        }
        else if (ex instanceof BindException) {
            return handleBindException((BindException) ex, request, response, handler);
        }
        else if (ex instanceof NoHandlerFoundException) {
            return handleNoHandlerFoundException(
                    (NoHandlerFoundException) ex, request, response, handler);
        }
        else if (ex instanceof AsyncRequestTimeoutException) {
            return handleAsyncRequestTimeoutException(
                    (AsyncRequestTimeoutException) ex, request, response, handler);
        }
    }
    catch (Exception handlerEx) {
        if (logger.isWarnEnabled()) {
            logger.warn("Failure while trying to resolve exception [" + ex.getClass().getName() + "]", handlerEx);
        }
    }
    return null;
}
```

### springboot 中使用 @ControllerAdvice 来处理异常

如果使用 @ControllerAdvice + @ExceptionHandler + @ResponseBody + @ResponseStatus(HttpStatus.OK) 来处理跨域请求异常,
HttpStatus 必须是 200, 否则浏览器则认为跨域请求被拒绝, 导致浏览器 302 错误
