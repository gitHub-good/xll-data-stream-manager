package com.xll.data.stream.manager.interfaces.web.liteflow;

import com.alibaba.fastjson.JSON;
import com.xll.data.stream.manager.domain.service.liteflow.dto.TestPO;
import com.xll.data.stream.manager.domain.service.liteflow.slot.TestContext;
import com.xll.data.stream.manager.infrastructure.common.core.controller.BaseController;
import com.xll.data.stream.manager.infrastructure.common.core.domain.AjaxResult;
import com.xll.data.stream.manager.infrastructure.common.core.page.TableDataInfo;
import com.xll.data.stream.manager.interfaces.facade.web.lineFlow.LineFlowServiceFacade;
import com.xll.data.stream.manager.interfaces.facade.web.lineFlow.model.po.LineFlowPO;
import com.yomahub.liteflow.core.FlowExecutor;
import com.yomahub.liteflow.flow.LiteflowResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@RestController
@RequestMapping("/lineFlow")
public class LineFlowController extends BaseController {
    @Resource
    private FlowExecutor flowExecutor;
    @Autowired
    private LineFlowServiceFacade lineFlowServiceFacade;

    @PostMapping(value = "/testLineFlow")
    public String submit(@Nullable @RequestBody String reqData){
        try{
            TestPO req = JSON.parseObject(reqData,TestPO.class);
            LiteflowResponse response = flowExecutor.execute2Resp("mainChain", req, TestContext.class);

            return response.getContextBean(TestContext.class).getPrintLog();
        }catch (Throwable t){
            t.printStackTrace();
            return "error";
        }
    }

    /**
     * 流程列表查询
     */
    @GetMapping("/list")
    public TableDataInfo list(LineFlowPO flowPo) {
        return getDataTable(lineFlowServiceFacade.list(flowPo));
    }

    /**
     * 获取详细信息
     */
    @GetMapping(value = "/{flowId}")
    public AjaxResult getInfo(@PathVariable Long flowId) {
        return AjaxResult.success(lineFlowServiceFacade.selectFlowById(flowId));
    }

    /**
     * 新增
     * @param flowPo
     * @return
     */
    @PostMapping()
    public AjaxResult add(@RequestBody LineFlowPO flowPo) {
        return AjaxResult.success(lineFlowServiceFacade.add(flowPo));
    }
}
