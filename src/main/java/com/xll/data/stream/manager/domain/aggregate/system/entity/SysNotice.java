package com.xll.data.stream.manager.domain.aggregate.system.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xll.data.stream.manager.infrastructure.common.core.domain.BaseEntity;
import lombok.Data;

/**
 * 功能描述: <br>
 * <p>
 * 〈通知公告表 sys_notice〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 18:22
 */
@Data
@TableName("t_sys_notice")
public class SysNotice extends BaseEntity {

    /** 公告ID */
    @TableId
    private Long noticeId;

    /** 公告标题 */
    private String noticeTitle;

    /** 公告类型（1通知 2公告） */
    private String noticeType;

    /** 公告内容 */
    private String noticeContent;

    /** 公告状态（0正常 1关闭） */
    private String status;
}
