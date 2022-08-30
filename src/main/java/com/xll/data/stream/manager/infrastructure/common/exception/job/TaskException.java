package com.xll.data.stream.manager.infrastructure.common.exception.job;
/**
 * 功能描述: <br>
 * <p>
 * 〈计划策略异常〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 23:41
 */
public class TaskException extends Exception
{
    private static final long serialVersionUID = 1L;

    private Code code;

    public TaskException(String msg, Code code)
    {
        this(msg, code, null);
    }

    public TaskException(String msg, Code code, Exception nestedEx)
    {
        super(msg, nestedEx);
        this.code = code;
    }

    public Code getCode()
    {
        return code;
    }

    public enum Code
    {
        TASK_EXISTS, NO_TASK_EXISTS, TASK_ALREADY_STARTED, UNKNOWN, CONFIG_ERROR, TASK_NODE_NOT_AVAILABLE
    }
}