package com.xll.data.stream.manager.domain.service.liteflow.component;

import com.yomahub.liteflow.core.NodeComponent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
/**
 * 功能描述: <br>
 * <p>
 * 〈A原子组件〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/9/11 16:40
 */
@Slf4j
@Component("AComponent")
public class AComponent extends NodeComponent {
    @Override
    public void process() throws Exception {
        Object requestData = this.getSlot().getRequestData();
    }
}
