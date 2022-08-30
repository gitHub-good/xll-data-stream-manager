package com.xll.data.stream.manager.infrastructure.mybatisplus;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * 功能描述: <br>
 * <p>
 * 〈配置〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 16:03
 */
@Component
@Slf4j
public class CustomMetaObjectHandler implements MetaObjectHandler {
    @Override
    public void insertFill(MetaObject metaObject) {
        log.info("CustomMetaObjectHandler start insert .. ");
        this.setFieldValByName("createTime", new Date(), metaObject);
        this.setFieldValByName("updateTime", new Date(), metaObject);
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        log.info("CustomMetaObjectHandler start update .. ");
        this.setFieldValByName("updateTime", new Date(),metaObject);
    }
}
