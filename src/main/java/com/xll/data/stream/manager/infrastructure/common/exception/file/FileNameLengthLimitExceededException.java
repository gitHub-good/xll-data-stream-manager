package com.xll.data.stream.manager.infrastructure.common.exception.file;

/**
 * 功能描述: <br>
 * <p>
 * 〈文件名称超长限制异常类〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 23:41
 */
public class FileNameLengthLimitExceededException extends FileException
{
    private static final long serialVersionUID = 1L;

    public FileNameLengthLimitExceededException(int defaultFileNameLength)
    {
        super("upload.filename.exceed.length", new Object[] { defaultFileNameLength });
    }
}
