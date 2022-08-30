package com.xll.data.stream.manager;

import lombok.extern.slf4j.Slf4j;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

/**
 * 功能描述: <br>
 * <p>
 * 〈启动器〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/18 21:46
 */
@Slf4j
//@MapperScan("com.xll.data.stream.manager.domain.aggregate.system.mapper")
@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })
public class DataStreamManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(DataStreamManagerApplication.class, args);
        log.info("service start data-stream-manager");
    }
}
