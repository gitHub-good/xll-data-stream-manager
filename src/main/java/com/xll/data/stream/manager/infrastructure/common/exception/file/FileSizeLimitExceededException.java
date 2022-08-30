package com.xll.data.stream.manager.infrastructure.common.exception.file;

/**
 * 功能描述: <br>
 * <p>
 * 〈文件名大小限制异常类〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 23:41
 */
public class FileSizeLimitExceededException extends FileException
{
    private static final long serialVersionUID = 1L;

    public FileSizeLimitExceededException(long defaultMaxSize)
    {
        super("upload.exceed.maxSize", new Object[] { defaultMaxSize });
    }
}
