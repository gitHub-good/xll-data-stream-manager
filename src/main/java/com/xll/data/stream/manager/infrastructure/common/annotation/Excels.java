package com.xll.data.stream.manager.infrastructure.common.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 功能描述: <br>
 * <p>
 * 〈Excel注解集〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 14:17
 */
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Excels {
    Excel[] value();
}
