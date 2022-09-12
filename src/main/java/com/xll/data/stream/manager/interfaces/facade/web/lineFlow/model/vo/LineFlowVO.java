package com.xll.data.stream.manager.interfaces.facade.web.lineFlow.model.vo;

import com.xll.data.stream.manager.infrastructure.common.core.domain.BasePO;
import lombok.Data;
/**
 * 功能描述: <br>
 * <p>
 * 〈后端数据展示前端实体〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/9/12 20:44
 */
@Data
public class LineFlowVO extends BasePO {
    private Long flowId;
    private String flowCode;
    private String flowName;
}
