package com.xll.data.stream.manager.infrastructure.common.core.domain;

import java.util.List;

/**
 * 功能描述: <br>
 * <p>
 * 〈Rest result utils.〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 14:28
 */
public class RestResultUtils {

    /**
     * 成功。
     *
     * @param <T> 数据类型。
     * @return Rest 结果。
     */
    public static <T> RestResult<T> success()
    {
        return RestResult.<T>builder().withSuccess(true).build();
    }

    /**
     * 成功。
     *
     * @param list 数据列表。
     * @param <T>  数据类型。
     * @return Rest 结果。
     */
    public static <T> RestResult<T> success(List<T> list)
    {
        return RestResult.<T>builder().withSuccess(true).withDataList(list).withDataCurrent(1).withDataPageSize(list.size()).withDataTotal(list.size()).build();
    }

    /**
     * 成功。
     *
     * @param list         数据列表。
     * @param errorMessage 消息。
     * @param <T>          数据类型。
     * @return Rest 结果。
     */
    public static <T> RestResult<T> success(List<T> list, String errorMessage)
    {
        return RestResult.<T>builder().withSuccess(true).withDataList(list).withDataCurrent(1).withDataPageSize(list.size()).withDataTotal(list.size()).withErrorMessage(errorMessage).build();
    }

    /**
     * 成功。
     *
     * @param list     数据列表。
     * @param current  当前页数。
     * @param pageSize 每页数据量。
     * @param total    数据总量。
     * @param <T>      数据类型。
     * @return Rest 结果。
     */
    public static <T> RestResult<T> success(List<T> list, int current, int pageSize, int total)
    {
        return RestResult.<T>builder().withSuccess(true).withDataList(list).withDataCurrent(current).withDataPageSize(pageSize).withDataTotal(total).build();
    }

    /**
     * 成功。
     *
     * @param list         数据列表。
     * @param current      当前页数。
     * @param pageSize     每页数据量。
     * @param total        数据总量。
     * @param errorMessage 消息。
     * @param <T>          数据类型。
     * @return Rest 结果。
     */
    public static <T> RestResult<T> success(List<T> list, int current, int pageSize, int total, String errorMessage)
    {
        return RestResult.<T>builder().withSuccess(true).withDataList(list).withDataCurrent(current).withDataPageSize(pageSize).withDataTotal(total).withErrorMessage(errorMessage).build();
    }

    /**
     * 错误。
     *
     * @param errorCode    错误代码。
     * @param errorMessage 错误消息。
     * @param <T>          数据类型。
     * @return Rest 结果。
     */
    public static <T> RestResult<T> failed(String errorCode, String errorMessage)
    {
        return RestResult.<T>builder().withSuccess(false).withErrorCode(errorCode).withErrorMessage(errorMessage).withShowType(RestResult.ErrorShowType.ERROR_MESSAGE).build();
    }

    /**
     * 错误。
     *
     * @param errorCode    错误代码。
     * @param errorMessage 错误消息。
     * @param showType     错误显示类型。
     * @param <T>          数据类型。
     * @return Rest 结果。
     */
    public static <T> RestResult<T> failed(String errorCode, String errorMessage, RestResult.ErrorShowType showType)
    {
        return RestResult.<T>builder().withSuccess(false).withErrorCode(errorCode).withErrorMessage(errorMessage).withShowType(showType).build();
    }

    /**
     * 错误。
     *
     * @param errorCode    错误代码。
     * @param errorMessage 错误消息。
     * @param traceId      唯一的请求ID。
     * @param host         当前访问服务器的主机。
     * @param <T>          数据类型。
     * @return Rest 结果。
     */
    public static <T> RestResult<T> failed(String errorCode, String errorMessage, String traceId, String host)
    {
        return RestResult.<T>builder().withSuccess(false).withErrorCode(errorCode).withErrorMessage(errorMessage).withShowType(RestResult.ErrorShowType.ERROR_MESSAGE).withTraceId(traceId).withHost(host).build();
    }

    /**
     * 错误。
     *
     * @param errorCode    错误代码。
     * @param errorMessage 错误消息。
     * @param showType     错误显示类型。
     * @param traceId      唯一的请求ID。
     * @param host         当前访问服务器的主机。
     * @param <T>          数据类型。
     * @return Rest 结果。
     */
    public static <T> RestResult<T> failed(String errorCode, String errorMessage, RestResult.ErrorShowType showType, String traceId, String host)
    {
        return RestResult.<T>builder().withSuccess(false).withErrorCode(errorCode).withErrorMessage(errorMessage).withShowType(showType).withTraceId(traceId).withHost(host).build();
    }
}
