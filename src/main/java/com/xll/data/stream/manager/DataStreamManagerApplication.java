package com.xll.data.stream.manager;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 功能描述: <br>
 * <p>
 * 〈启动器〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/18 21:46
 */
@Slf4j
@SpringBootApplication
public class DataStreamManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(DataStreamManagerApplication.class, args);
        log.info("service start data-stream-manager");
    }
}
