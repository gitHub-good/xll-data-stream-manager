package com.xll.data.stream.manager;

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

/**
 * 功能描述: <br>
 * <p>
 * 〈web容器中进行部署〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/28 00:12
 */
public class DataStreamServletInitializer extends SpringBootServletInitializer {
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(DataStreamManagerApplication.class);
    }
}
