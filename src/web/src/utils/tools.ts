import lodash from "lodash";

/**
 * 判断值是否为空，null、undefined和''。
 * @param value
 */
export function isBlank(value: any) {
  return value === null || typeof (value) === 'undefined' || value as string === '';
}

/**
 * 日期格式化
 * @param time
 * @param pattern
 */
export function parseTime(time: Date | string | number, pattern?: string) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  let _time = lodash.cloneDeep(time);
  if (typeof _time === 'object') {
    date = _time;
  } else {
    if ((typeof _time === 'string') && (/^[0-9]+$/.test(_time))) {
      _time = parseInt(_time);
    } else if (typeof _time === 'string') {
      _time = _time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.[\d]{3}/gm), '');
    }
    if ((typeof _time === 'number') && (_time.toString().length === 10)) {
      _time = _time * 1000;
    }
    date = new Date(_time as number);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  return format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
}
