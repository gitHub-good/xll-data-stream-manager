package com.xll.data.stream.manager.infrastructure.common.exception.file;


import com.xll.data.stream.manager.infrastructure.common.exception.base.BaseException;

/**
 * 功能描述: <br>
 * <p>
 * 〈文件信息异常类〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 23:40
 */
public class FileException extends BaseException {
    public FileException(String code, Object[] args)
    {
        super("file", code, args, null);
    }

}
