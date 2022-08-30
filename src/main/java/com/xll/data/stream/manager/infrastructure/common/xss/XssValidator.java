package com.xll.data.stream.manager.infrastructure.common.xss;

import com.xll.data.stream.manager.infrastructure.common.utils.StringUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 功能描述: <br>
 * <p>
 * 〈自定义xss校验注解实现〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 14:45
 */
public class XssValidator implements ConstraintValidator<Xss, String> {
    private static final String HTML_PATTERN = "<(\\S*?)[^>]*>.*?|<.*? />";

    @Override
    public boolean isValid(String value, ConstraintValidatorContext constraintValidatorContext) {
        if (StringUtils.isBlank(value)) {
            return true;
        }
        return !containsHtml(value);
    }

    public static boolean containsHtml(String value) {
        Pattern pattern = Pattern.compile(HTML_PATTERN);
        Matcher matcher = pattern.matcher(value);
        return matcher.matches();
    }
}