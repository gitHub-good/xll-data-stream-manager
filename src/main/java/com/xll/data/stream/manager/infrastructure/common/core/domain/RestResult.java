package com.xll.data.stream.manager.infrastructure.common.core.domain;

import java.io.Serializable;
import java.util.List;

/**
 * 功能描述: <br>
 * <p>
 * 〈Rest result.〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 14:28
 */
public class RestResult<T> implements Serializable {

    /**
     * if request is success
     */
    private boolean success;

    /**
     * response data
     */
    private RestResultData<T> data;

    /**
     * code for errorType
     */
    private String errorCode;

    /**
     * message display to user
     */
    private String errorMessage;

    /**
     * error display type： 0 silent; 1 message.warn; 2 message.error; 4 notification; 9 page
     */
    private int showType;

    /**
     * Convenient for back-end Troubleshooting: unique request ID
     */
    private String traceId;

    /**
     * onvenient for backend Troubleshooting: host of current access server
     */
    private String host;

    public RestResult()
    {
    }

    public boolean isSuccess()
    {
        return success;
    }

    public void setSuccess(boolean success)
    {
        this.success = success;
    }

    public RestResultData<T> getData()
    {
        return data;
    }

    public void setData(RestResultData<T> data)
    {
        this.data = data;
    }

    public String getErrorCode()
    {
        return errorCode;
    }

    public void setErrorCode(String errorCode)
    {
        this.errorCode = errorCode;
    }

    public String getErrorMessage()
    {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage)
    {
        this.errorMessage = errorMessage;
    }

    public int getShowType()
    {
        return showType;
    }

    public void setShowType(int showType)
    {
        this.showType = showType;
    }

    public String getTraceId()
    {
        return traceId;
    }

    public void setTraceId(String traceId)
    {
        this.traceId = traceId;
    }

    public String getHost()
    {
        return host;
    }

    public void setHost(String host)
    {
        this.host = host;
    }

    @Override
    public String toString()
    {
        return "RestResult{" +
                "success=" + success +
                ", data=" + data +
                ", errorCode='" + errorCode + '\'' +
                ", errorMessage='" + errorMessage + '\'' +
                ", showType=" + showType +
                ", traceId='" + traceId + '\'' +
                ", host='" + host + '\'' +
                '}';
    }

    public static <T> RestResultBuilder<T> builder() {
        return new RestResultBuilder<>();
    }

    public static final class RestResultBuilder<T> {

        /**
         * if request is success
         */
        private boolean success;

        /**
         * response data
         */
        private final RestResultData<T> data;

        /**
         * code for errorType
         */
        private String errorCode;

        /**
         * message display to user
         */
        private String errorMessage;

        /**
         * error display type： 0 silent; 1 message.warn; 2 message.error; 4 notification; 9 page
         */
        private int showType;

        /**
         * Convenient for back-end Troubleshooting: unique request ID
         */
        private String traceId;

        /**
         * onvenient for backend Troubleshooting: host of current access server
         */
        private String host;

        private RestResultBuilder()
        {
            this.data = new RestResultData<>();
        }

        public RestResultBuilder<T> withSuccess(boolean success)
        {
            this.success = success;
            return this;
        }

        public RestResultBuilder<T> withDataList(List<T> list)
        {
            this.data.setList(list);
            return this;
        }

        public RestResultBuilder<T> withDataCurrent(int current)
        {
            this.data.setCurrent(current);
            return this;
        }

        public RestResultBuilder<T> withDataPageSize(int pageSize)
        {
            this.data.setPageSize(pageSize);
            return this;
        }

        public RestResultBuilder<T> withDataTotal(int total)
        {
            this.data.setTotal(total);
            return this;
        }

        public RestResultBuilder<T> withErrorCode(String errorCode)
        {
            this.errorCode = errorCode;
            return this;
        }

        public RestResultBuilder<T> withErrorMessage(String errorMessage)
        {
            this.errorMessage = errorMessage;
            return this;
        }

        public RestResultBuilder<T> withShowType(ErrorShowType errorShowType)
        {
            this.showType = errorShowType.getShowType();
            return this;
        }

        public RestResultBuilder<T> withTraceId(String traceId)
        {
            this.traceId = traceId;
            return this;
        }

        public RestResultBuilder<T> withHost(String host)
        {
            this.host = host;
            return this;
        }

        /**
         * Build result.
         *
         * @return result
         */
        public RestResult<T> build()
        {
            RestResult<T> restResult = new RestResult<>();
            restResult.setSuccess(success);
            restResult.setData(data);
            restResult.setErrorCode(errorCode);
            restResult.setErrorMessage(errorMessage);
            restResult.setShowType(showType);
            restResult.setTraceId(traceId);
            restResult.setHost(host);
            return restResult;
        }
    }

    public static final class RestResultData<T> implements Serializable
    {

        private static final long serialVersionUID = 8076026054911146022L;

        private List<T> list;

        private int current;

        private int pageSize;

        private int total;

        public RestResultData()
        {
        }

        public List<T> getList()
        {
            return list;
        }

        public void setList(List<T> list)
        {
            this.list = list;
        }

        public int getCurrent()
        {
            return current;
        }

        public void setCurrent(int current)
        {
            this.current = current;
        }

        public int getPageSize()
        {
            return pageSize;
        }

        public void setPageSize(int pageSize)
        {
            this.pageSize = pageSize;
        }

        public int getTotal()
        {
            return total;
        }

        public void setTotal(int total)
        {
            this.total = total;
        }

        @Override
        public String toString()
        {
            return "RestResultData{" +
                    "list=" + list +
                    ", current=" + current +
                    ", pageSize=" + pageSize +
                    ", total=" + total +
                    '}';
        }
    }

    public enum ErrorShowType
    {
        /**
         * SILENT = 0, // 不提示错误
         */
        SILENT(0),
        /**
         * WARN_MESSAGE = 1, // 警告信息提示
         */
        WARN_MESSAGE(1),
        /**
         * ERROR_MESSAGE = 2, // 错误信息提示
         */
        ERROR_MESSAGE(2),
        /**
         * NOTIFICATION = 4, // 通知提示
         */
        NOTIFICATION(4),
        /**
         * REDIRECT = 9, // 页面跳转
         */
        REDIRECT(9);

        private final int showType;

        ErrorShowType(int showType)
        {
            this.showType = showType;
        }

        public int getShowType()
        {
            return showType;
        }
    }
}
