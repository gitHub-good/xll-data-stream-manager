package com.xll.data.stream.manager.infrastructure.common.utils;

import com.github.pagehelper.PageHelper;
import com.xll.data.stream.manager.infrastructure.common.core.page.PageDomain;
import com.xll.data.stream.manager.infrastructure.common.core.page.TableSupport;
import com.xll.data.stream.manager.infrastructure.common.utils.sql.SqlUtil;

/**
 * 功能描述: <br>
 * <p>
 * 〈分页工具类〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 14:47
 */
public class PageUtils extends PageHelper {
    /**
     * 设置请求分页数据
     */
    public static void startPage()
    {
        PageDomain pageDomain = TableSupport.buildPageRequest();
        Integer pageNum = pageDomain.getPageNum();
        Integer pageSize = pageDomain.getPageSize();
        String orderBy = SqlUtil.escapeOrderBySql(pageDomain.getOrderBy());
        Boolean reasonable = pageDomain.getReasonable();
        PageHelper.startPage(pageNum, pageSize, orderBy).setReasonable(reasonable);
    }

    /**
     * 清理分页的线程变量
     */
    public static void clearPage()
    {
        PageHelper.clearPage();
    }
}
