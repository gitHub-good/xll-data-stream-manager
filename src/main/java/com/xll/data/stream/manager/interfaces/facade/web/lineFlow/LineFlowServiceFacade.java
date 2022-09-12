package com.xll.data.stream.manager.interfaces.facade.web.lineFlow;

import com.xll.data.stream.manager.infrastructure.common.core.redis.RedisCache;
import com.xll.data.stream.manager.interfaces.facade.web.lineFlow.model.po.LineFlowPO;
import com.xll.data.stream.manager.interfaces.facade.web.lineFlow.model.vo.LineFlowVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 功能描述: <br>
 * <p>
 * 〈〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/9/12 20:40
 */
@Component
public class LineFlowServiceFacade {
    @Autowired
    private RedisCache redisCache;
    private String cacheKey = "lineFlow:list:key";

    public List<LineFlowVO> list(LineFlowPO lineFlowPO){
        return redisCache.getCacheList(cacheKey);
    }

    public boolean add(LineFlowPO flowPo) {
        List<LineFlowPO> cacheList = redisCache.getCacheList(cacheKey);
        flowPo.setFlowId((long) cacheList.size());
        cacheList.add(flowPo);
        List<LineFlowPO> collect = cacheList.stream().filter(lineFlowPO -> lineFlowPO.getFlowId() != null).collect(Collectors.toList());
        redisCache.setCacheList(cacheKey, collect);
        return true;
    }

    public LineFlowPO selectFlowById(Long flowId) {
        List<LineFlowPO> cacheList = redisCache.getCacheList(cacheKey);
        return cacheList.stream().filter(lineFlowPo -> lineFlowPo.getFlowId().equals(flowId)).findFirst().orElse(new LineFlowPO());
    }
}
