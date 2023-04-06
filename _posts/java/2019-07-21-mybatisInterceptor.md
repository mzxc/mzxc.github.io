---
layout: post
title:  "MyBatis拦截器的业务应用"
crawlertitle: "MyBatis拦截器的业务应用"
subtitle: "MyBatis 数据字典 拦截器"
ext:
date:  2019-07-21
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['JAVA', '原创']
musicUri: 553386230
musicTitle: 念诗之王
musicFrom: 小可儿
author: gomyck
openPay: true
---

MyBatis拦截器在项目中的应用(建议PC端查看)

### MyBatis拦截器介绍(摘自mybatis官网)
```text
MyBatis 允许你在已映射语句执行过程中的某一点进行拦截调用。默认情况下，MyBatis 允许使用插件来拦截的方法调用包括：

Executor (update, query, flushStatements, commit, rollback, getTransaction, close, isClosed)
ParameterHandler (getParameterObject, setParameters)
ResultSetHandler (handleResultSets, handleOutputParameters)
StatementHandler (prepare, parameterize, batch, update, query)

这些类中方法的细节可以通过查看每个方法的签名来发现，或者直接查看 MyBatis 发行包中的源代码。
如果你想做的不仅仅是监控方法的调用，那么你最好相当了解要重写的方法的行为。
因为如果在试图修改或重写已有方法的行为的时候，你很可能在破坏 MyBatis 的核心模块。
这些都是更低层的类和方法，所以使用插件的时候要特别当心。

通过 MyBatis 提供的强大机制，使用插件是非常简单的，只需实现 Interceptor 接口，并指定想要拦截的方法签名即可。
```
>简单点来说, mybatis的拦截器类似spring的拦截器, 但是把执行过程中, 程序操作的步骤拆解成三大块(handler), 由Executor统一管理调用,
我们可以对这四个类进行拦截, 来达到在不同的执行阶段(sql编译, 执行, 结果集), 干预mybatis的执行效果

### ----应用篇----
在数据库设计过程中, 总会涉及到一张或多张数据字典表(以代码来映射现实中的名词), 数据字典在存储时为代码, 但是在终端展示时, 需要转换为人类可读的
语言类型(001:北京, 002:上海)

##### 数据字典代码可以用两种方式进行转换:
> 1.数据冗余, 在业务表中存储当前字典类型数据时, 把代码(code)和值(value)同时存储到业务表对应字段中 exp: area_code | 001  area_name | 北京,
这种方式存储的字典数据, 在展示的时候, code可以当做条件过滤, name可以当做展示文字展示到客户端
> 此种做法的缺点是, 存储和更新都需要维护两个字段, 当字典表的名词(值)发生细微改变时(北京市 -> 中国北京市), 原有冗余数据并不能同步改变, 需要在相关业务表
中全量更新

> 2.业务表只存储数据字典的code, 在查询业务记录时, 业务表与字典表做关联查询, 用字典表的value来替换业务表中的code
> 此种做法的缺点是, 当业务表中字典类型过多时(国家, 省份, 城市, 区县, 性别....), 需要多次关联字典表, 进行转换, 增加了开发人员的工作内容, 也加重了数
据库的运行负载

虽然上述两种解决方案都能满足实际生产需求, 但为了把更多的精力放在核心业务开发上(其实是懒), 我们从尽量简洁的sql角度出发(方案1), 但在存储和展示时, 不要
加入冗余的value, 那在不使用连表查询的前提下, 如何把code翻译成value呢?

在数据库的设计维度来看, 数据字典的**字典大类**与业务表中存储其code的**字段名**其实是一一对应的
> 数据字典表中存储 dic_type: country
> 业务表存储国家字典数据的字段名: dic_country

##### 在最理想的情况下, 可以把字典表中的dic_type存储的名称与业务表的存储对应code字段名设计成一样的名称, 如下图所示:
![image](/img/in-post/res2019-07-21/dicTable.jpg)
字典表数据

![image](/img/in-post/res2019-07-21/bizTable.jpg)
业务表数据

根据这一特性, 可以在结果集中, 对字典数据进行转译
```sql
select * from biz_table where t_id = 1; -- 此sql为模拟业务数据查询, 具体以实际生产需要为准

select * from dic_table; -- 此sql结果集可以缓存到内存中, 仅当字典数据发生改变时, 手动全量更新一次缓存即可

```
返回的结果集以entity或者map数据格式进行存储(List<T extends BizTable> || List<Map<String, Object>>)

以实体形式返回结果集的, 可以使用反射知晓每个字段是否属于字典类型(因为实体字段名称与字典表biz_type全局唯一且一一对应)

以map形式返回结果集的, 可以对entry.key进行判断, 来知晓其是否属于字典类型

循环每一条结果集, 之后遍历每条结果集中的属性, 因字典数据的dic_type名称与属性名|entry.key一一对应且全局唯一, 所以可以使用事先在内存中
缓存的字典数据, 对结果集中的字典数据进行转译

#### 根据上述分析, 可得到如下代码:

```java
package com.gomyck.util.mybatis;

import com.gomyck.util.FieldUtils;
import com.gomyck.util.ParaUtils;
import com.gomyck.util.StringJudge;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author gomyck QQ:474798383
 * @version [版本号/1.0]
 *
 * @since [2019-07-17]
 */
public class DicColConvertUtils {

    /**
     * 数据字典表结构适配器
     */
    private static Adaptor adaptor = new Adaptor("key", "value", "columnName");
    /**
     * 字典表信息
     */
    private final static Map<String, Map<String, Object>> DIC_INFO = new ConcurrentHashMap<>();

    /**
     * 字典表信息(反转)
     */
    private final static Map<String, Map<String, Object>> DIC_INFO_OVERTURN = new ConcurrentHashMap<>();

    /**
     *
     * @param keyName 字典表的  [键]  字段名   在集合里的 key 名
     * @param valueName 字典表的   [值]   字段名  在集合里的 key 名
     * @param columnName 字典表的  [翻译属性]  字段名  在集合里的 key 名
     */
    public static Adaptor initAdaptor(String keyName, String valueName, String columnName){
        return new Adaptor(keyName, valueName, columnName);
    }

    /**
     *
     * @param keyName 字典表的  [键]  字段名   在集合里的 key 名
     * @param valueName 字典表的   [值]   字段名  在集合里的 key 名
     * @param columnName 字典表的  [翻译属性]  字段名  在集合里的 key 名
     * @param i18n 字典表的 [国际化] 字段名  在集合里的 key 名
     * @param defaultI18nFlag 默认的国际化标识 比如: CN
     */
    public static Adaptor initAdaptor(String keyName, String valueName, String columnName, String i18n, String defaultI18nFlag){
        return new Adaptor(keyName, valueName, columnName, i18n, defaultI18nFlag);
    }

    /**
     * 初始化工具类
     *
     * @param _dicInfo 从数据库查询到的字典信息, 字典信息必须包含三个属性[KEY_NAME][VALUE_NAME][COLUMN_NAME]
     */
    public DicColConvertUtils(List<Map<String, Object>> _dicInfo) {
        initDicInfo(_dicInfo);
        initDicInfoOverturn(_dicInfo);
    }

    public DicColConvertUtils(List<Map<String, Object>> _dicInfo, Adaptor adaptor) {
        this.adaptor = adaptor;
        initDicInfo(_dicInfo);
        initDicInfoOverturn(_dicInfo);
    }

    /**
     * 初始化方法
     * @param _dicInfo 字典表信息
     */
    public void initDicInfo(List<Map<String, Object>> _dicInfo) {
        for (Map<String, Object> _dic : _dicInfo) {
            //todo 下划线转驼峰并大写, 统一格式
            final String colName = (ParaUtils.underlineToHump(_dic.get(adaptor.COLUMN_NAME) + "")).toUpperCase(); //获取字段名> 转驼峰大写
            String code = _dic.get(adaptor.CODE) + "";
            //todo 加入国际化
            if(StringJudge.notNull(adaptor.I18N)){
                code = code + _dic.get(adaptor.I18N) + "";
            }
            Map<String, Object> maps = DIC_INFO.get(colName); // 获取以当前分类为键的map
            if (maps != null) {
                maps.put(code, _dic.get(adaptor.VALUE)); // 存储code, value
            } else {
                maps = new ConcurrentHashMap<>();
                maps.put(code, _dic.get(adaptor.VALUE));
                DIC_INFO.put(colName, maps); // 把字典信息存到大类下
            }
        }
    }


    /**
     * 初始化方法(反转)
     * @param _dicInfo 字典表信息
     */
    public void initDicInfoOverturn(List<Map<String, Object>> _dicInfo) {
        for (Map<String, Object> dic : _dicInfo) {
            //todo 下划线转驼峰并大写, 统一格式
            final String colName = (ParaUtils.underlineToHump(dic.get(adaptor.COLUMN_NAME) + "")).toUpperCase();
            final String value = dic.get(adaptor.VALUE) + "";
            Map<String, Object> maps = DIC_INFO_OVERTURN.get(colName);
            if (maps != null) {
                maps.put(value, dic.get(adaptor.CODE));  // 以 值 为键  code为码  为了翻转字典
            } else {
                maps = new ConcurrentHashMap<>();
                maps.put(value, dic.get(adaptor.CODE));
                DIC_INFO_OVERTURN.put(colName, maps);
            }
        }
    }


    /**
     * 翻译业务数据中的字典字段数据
     * @param result 结果集
     * @param ifOverturn 是否翻转翻译
     */
    public static void convertDicInfo(List<Object> result, boolean ifOverturn) {
        for (Object res : result) {
            if(res == null) continue; //#修复空数据, 但是结果集SIZE>0的bug
            if (res instanceof Map) { //map类型数据
                DicColConvertUtils.convertDicColumnInfo4Map((Map) res, ifOverturn);
            } else if (FieldUtils.isBaseType(res.getClass().getTypeName()) == null) { //非基本类型
                DicColConvertUtils.convertDicColumnInfo(res, ifOverturn);
            }
        }
    }

    /**
     * 递归翻译
     * @param _value 当前数据中的子集
     * @param ifOverturn 是否翻转翻译
     * @return boolean 是否发生递归动作
     */
    private static boolean recursion(Object _value, boolean ifOverturn) {
        if (_value == null) return true;
        if (_value instanceof Map) {
            convertDicColumnInfo4Map((Map) _value, ifOverturn);
            return true;
        } else if (_value instanceof List) {
            convertDicInfo((List) _value, ifOverturn);
            return true;
        }
        return false; //都不满足的话, 说明当前属性不可继续下钻, 返回false, 释放foreach的循环继续向下, 反之返回true, 转换方法里return相当于普通for的continue
    }

    /**
     * 翻译map类数据
     * @param result 结果集
     * @param ifOverturn 是否翻转翻译
     */
    private static void convertDicColumnInfo4Map(Map<String, Object> resultSet, boolean ifOverturn) {
        resultSet.keySet().forEach(resultColName -> {
            if(recursion(resultSet.get(resultColName), ifOverturn)) return;
            //todo 字段名下划线转驼峰, 并大写, 与工具类统一格式
            String colName = ParaUtils.underlineToHump(resultColName).toUpperCase();
            Map<String, Object> usedDicInfo = null;
            if(!ifOverturn) usedDicInfo = DIC_INFO.get(colName);
            if(ifOverturn) usedDicInfo = DIC_INFO_OVERTURN.get(colName);
            if (usedDicInfo != null) {
                String biz_code = resultSet.get(resultColName) + ""; //当前字段的结果  exp: name(resultColName): 001(biz_value)
                if(!ifOverturn) {
                    //todo 加入国际化
                    if(StringJudge.notNull(adaptor.I18N)){
                        String currentFlag = ResultSetConvert.getI18nFlag();
                        biz_code = biz_code + (StringJudge.isNull(currentFlag) ? adaptor.DEFAULT_I18N_FLAG : currentFlag);
                    }
                }
                Object convert_biz_value = usedDicInfo.get(biz_code);
                resultSet.put(resultColName, convert_biz_value == null ? biz_code : convert_biz_value);
            }
        });
    }

    /**
     * 翻译实体类数据
     * @param result 结果集
     * @param ifOverturn 是否翻转翻译
     */
    private static void convertDicColumnInfo(Object resultSet, boolean ifOverturn) {
        List<Field> allFields = FieldUtils.getAllFields(resultSet.getClass());
        allFields.forEach(field -> {
            try {
                Method getMethod = FieldUtils.getMethod(resultSet.getClass(), field.getName());
                Object value = getMethod.invoke(resultSet);
                if(recursion(value, ifOverturn)) return;
                //todo 下划线转驼峰并大写, 与工具类统一格式
                String colName = ParaUtils.underlineToHump(field.getName()).toUpperCase();
                Map<String, Object> usedDicInfo = null;
                if(!ifOverturn) usedDicInfo = DIC_INFO.get(colName);
                if(ifOverturn) usedDicInfo = DIC_INFO_OVERTURN.get(colName);
                if (usedDicInfo != null) {
                    Method setMethod = FieldUtils.setMethod(resultSet.getClass(), field.getName(), String.class);
                    if(!ifOverturn) {
                        //todo 加入国际化
                        if(StringJudge.notNull(adaptor.I18N)){
                            String currentFlag = ResultSetConvert.getI18nFlag();
                            value = value + (StringJudge.isNull(currentFlag) ? adaptor.DEFAULT_I18N_FLAG : currentFlag);
                        }
                    }
                    Object convert_biz_value = usedDicInfo.get(value);
                    setMethod.invoke(resultSet, convert_biz_value == null ? value : convert_biz_value);
                }
            } catch (Exception ignored) {}
        });
    }

    static class Adaptor{
        /**
         * 字典表的code
         */
        String CODE;
        /**
         * 字典表的value
         */
        String VALUE;
        /**
         * 对应业务表的字段名称 exp: key=1 value=中国 columnName=country 这个country就是业务表存储国家的字段
         */
        String COLUMN_NAME;
        /**
         * 国际化标识字段名称
         */
        String I18N;
        /**
         * 默认的国际化标识
         */
        String DEFAULT_I18N_FLAG;

        public Adaptor(String code, String value, String columnName) {
            CODE = code;
            VALUE = value;
            COLUMN_NAME = columnName;
        }

        public Adaptor(String code, String value, String columnName, String i18n, String defaultI18nFlag) {
            CODE = code;
            VALUE = value;
            COLUMN_NAME = columnName;
            I18N = i18n;
            DEFAULT_I18N_FLAG = defaultI18nFlag;
        }
    }

}


```

上述代码为字典数据翻译工具类, 已经满足简单sql编写, 同步翻译数据字典的效果, 但需要在业务代码中重复编码(手动处理结果集)

根据mybatis拦截器的使用说明, 我们可以在sql执行完毕之后, 对结果集进行拦截, 如下代码:
```java


package com.gomyck.util.mybatis;

import com.gomyck.util.StringJudge;
import org.apache.ibatis.executor.resultset.ResultSetHandler;
import org.apache.ibatis.plugin.*;

import java.sql.Statement;
import java.util.List;
import java.util.Properties;

/**
 * @author 郝洋 QQ:474798383
 * @version [版本号/1.0]
 *
 * @since [2019-07-17]
 */
@Intercepts({@Signature(type = ResultSetHandler.class, method = "handleResultSets", args = {Statement.class})})
public class ResultSetConvert implements Interceptor {

    //忽略转换的文件后缀
    private final String methodSuffix = "_Dc";

    /**
     * 是否转换开关
     */
    private static ThreadLocal<Boolean> convertStatus = new ThreadLocal<>();

    /**
     * 国际化标识
     */
    private static ThreadLocal<String> i18nFlag = new ThreadLocal<>();

    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        List<Object> result = (List<Object>) invocation.proceed();
        if(convertStatus.get() == null || convertStatus.get()){
            StackTraceElement[] stackTrace = Thread.currentThread().getStackTrace();
            for (StackTraceElement stackTraceElement : stackTrace) {
                if(stackTraceElement.getMethodName().contains(methodSuffix)) return result;
            }
            DicColConvertUtils.convertDicInfo(result, false);
        }
        close();
        return result;
    }

    @Override
    public Object plugin(Object o) {
        return Plugin.wrap(o, this);
    }

    @Override
    public void setProperties(Properties properties) {

    }

    /**
     * 设置国际化
     */
    public static void setI18nFlag(String flag){
        i18nFlag.set(StringJudge.isNull(flag) ? "" : flag);
    }

    /**
     * 设置国际化
     */
    protected static String getI18nFlag(){
        return i18nFlag.get();
    }

    /**
     * 跳过转译
     */
    public static void skip(){
        convertStatus.set(false);
    }

    /**
     * 清空
     */
    private static void close(){
        convertStatus.remove();
    }


}


```

#### 在mybatis上下文中加入此拦截器:

```java
package com.holystar.project.config.mybatis;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.PaginationInterceptor;
import com.gomyck.util.mybatis.DicColConvertUtils;
import com.gomyck.util.mybatis.ResultSetConvert;
import com.holystar.project.service.sys.PropertyService;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author gomyck QQ:474798383
 * @version [版本号/1.0]
 * @see [相关类/方法]
 * @since [2019-07-17]
 */
@Configuration
public class MybatisPlusConfig {

    @Autowired
    DicTableService dts;

    @Bean
    public DicColConvertUtils initDicConvert(){
      return new DicColConvertUtils(dts.selectMaps(new EntityWrapper<>()));
    }

    //这个类有依赖调解问题, 要根据自己项目的环境动态调整这个 bean 所处的位置
    @Bean
    public ResultSetConvert resultSetConvert(){
      return new ResultSetConvert();
    }

}

```
#### 通过上述代码, 可以达到以下目的:
> 1.业务代码无感知字典转译, 只需要关注自己的业务代码编写即可, 无需额外的转译工作
> 2.简单sql编写, 无需关联字典表查询转译, 只许关注业务表的sql编写

### ----MyBatis拦截器原理篇----
关注mybatis拦截器底层原理, 可以对自身技术水平得到提高, 并且在遇到其他应用场景时, 可以对号入座, 明确可行性.
因为Executor类为mybatis核心调度类接口, 所以我们从这里开始看一个映射sql从编译到返回结果集的全部过程, 如果想要实现
拦截, 要么在代码中写死, 要么以当前类为被代理对象, 进行动态代理, 我们搜索Executor的使用位置, 可以在Configuration类
中发现如下代码:
```java

public ParameterHandler newParameterHandler(MappedStatement mappedStatement, Object parameterObject, BoundSql boundSql) {
    ParameterHandler parameterHandler = mappedStatement.getLang().createParameterHandler(mappedStatement, parameterObject, boundSql);
    parameterHandler = (ParameterHandler) interceptorChain.pluginAll(parameterHandler);
    return parameterHandler;
}

public ResultSetHandler newResultSetHandler(Executor executor, MappedStatement mappedStatement, RowBounds rowBounds, ParameterHandler parameterHandler,
    ResultHandler resultHandler, BoundSql boundSql) {
    ResultSetHandler resultSetHandler = new DefaultResultSetHandler(executor, mappedStatement, parameterHandler, resultHandler, boundSql, rowBounds);
    resultSetHandler = (ResultSetHandler) interceptorChain.pluginAll(resultSetHandler);
    return resultSetHandler;
}

public StatementHandler newStatementHandler(Executor executor, MappedStatement mappedStatement, Object parameterObject, RowBounds rowBounds, ResultHandler resultHandler, BoundSql boundSql) {
    StatementHandler statementHandler = new RoutingStatementHandler(executor, mappedStatement, parameterObject, rowBounds, resultHandler, boundSql);
    statementHandler = (StatementHandler) interceptorChain.pluginAll(statementHandler);
    return statementHandler;
}

public Executor newExecutor(Transaction transaction) {
    return newExecutor(transaction, defaultExecutorType);
}

public Executor newExecutor(Transaction transaction, ExecutorType executorType) {
    executorType = executorType == null ? defaultExecutorType : executorType;
    executorType = executorType == null ? ExecutorType.SIMPLE : executorType;
    Executor executor;
    if (ExecutorType.BATCH == executorType) {
        executor = new BatchExecutor(this, transaction);
    } else if (ExecutorType.REUSE == executorType) {
        executor = new ReuseExecutor(this, transaction);
    } else {
        executor = new SimpleExecutor(this, transaction);
    }
    if (cacheEnabled) {
        executor = new CachingExecutor(executor);
    }
    executor = (Executor) interceptorChain.pluginAll(executor);
    return executor;
}
```

##### 查看interceptorChain类

```java

package org.apache.ibatis.plugin;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * @author Clinton Begin
 */
public class InterceptorChain {

    private final List<Interceptor> interceptors = new ArrayList<Interceptor>();

    public Object pluginAll(Object target) {
      for (Interceptor interceptor : interceptors) {
          target = interceptor.plugin(target);
      }
      return target;
    }

    public void addInterceptor(Interceptor interceptor) {
        interceptors.add(interceptor);
    }

    public List<Interceptor> getInterceptors() {
        return Collections.unmodifiableList(interceptors);
    }

}

```

可以发现, 这个类就是把所有的拦截器实例, 遍历一遍, 然后调用plugin方法, 那plugin方法又是什么呢:
```java
@Override
public Object plugin(Object o) {
    return Plugin.wrap(o, this);
}
```
以上的代码摘自我编写的拦截器插件, plugin方法就是返回代理对象的方法, 使用mybatis的工具类, 来生成的拦截器代理对象, 点击查看
wrap方法的实现:
```java
public static Object wrap(Object target, Interceptor interceptor) {
    Map<Class<?>, Set<Method>> signatureMap = getSignatureMap(interceptor);
    Class<?> type = target.getClass();
    Class<?>[] interfaces = getAllInterfaces(type, signatureMap);
    if (interfaces.length > 0) {
        return Proxy.newProxyInstance(
            type.getClassLoader(),
            interfaces,
            new Plugin(target, interceptor, signatureMap));
    }
    return target;
}
```
经过层层查看, 可以得到: mybatis的拦截器, 就是把原有的目标对象, 经过层层代理, 最终返回, 当调用指定签名方法时, 触发intercept方法
```text
代理时序:

DefaultResultSetHandler implements ResultSetHandler
->
DefaultResultSetHandler$proxy1  (拦截器1, 代理的DefaultResultSetHandler)
->
DefaultResultSetHandler$proxy2  (拦截器2, 代理的DefaultResultSetHandler$proxy1)
->
DefaultResultSetHandler$proxy3  (拦截器2, 代理的DefaultResultSetHandler$proxy2)
.....

因为所有代理类都具有相同的方法表, 所以在最后的代理类指定方法被调用时, 一层层进行链式调用(入栈),
最终调用原始DefaultResultSetHandler的方法, 在一层层返回(出栈)

```


