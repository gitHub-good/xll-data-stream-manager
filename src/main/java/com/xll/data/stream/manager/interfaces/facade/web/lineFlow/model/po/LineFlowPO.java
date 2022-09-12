package com.xll.data.stream.manager.interfaces.facade.web.lineFlow.model.po;

import lombok.Data;

import java.io.Serializable;

/**
 * 功能描述: <br>
 * <p>
 * 〈前端请求接收参数实体〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/9/12 20:44
 */
@Data
public class LineFlowPO implements Serializable {
    private Long flowId;
    private String flowCode;
    private String flowName;
}
