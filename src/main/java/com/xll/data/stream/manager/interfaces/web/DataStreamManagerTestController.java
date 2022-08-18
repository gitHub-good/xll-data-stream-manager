package com.xll.data.stream.manager.interfaces.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * 功能描述: <br>
 * <p>
 * 〈测试〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/18 22:37
 */
@Controller
public class DataStreamManagerTestController {

    @GetMapping("test")
    public String test(){
        return "test.html";
    }
}
