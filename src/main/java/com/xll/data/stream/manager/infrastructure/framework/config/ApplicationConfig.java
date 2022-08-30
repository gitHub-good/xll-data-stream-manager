package com.xll.data.stream.manager.infrastructure.framework.config;

import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import java.util.TimeZone;

/**
 * 功能描述: <br>
 * <p>
 * 〈程序注解配置〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 21:03
 */
@Configuration
//表示通过aop框架暴露该代理对象,AopContext能够访问
@EnableAspectJAutoProxy(exposeProxy = true)
public class ApplicationConfig {
    /**
     * 时区配置
     */
    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jacksonObjectMapperCustomization() {
        return jacksonObjectMapperBuilder -> jacksonObjectMapperBuilder.timeZone(TimeZone.getDefault());
    }
}
