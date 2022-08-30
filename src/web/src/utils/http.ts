import { isBlank } from "@/utils/tools";

/**
 * URL参数对象转换，将params对象中属性值为object的对象的属性转换到params中。
 * @param params
 */
export function transformUrlParams(params: Record<string, any> | URLSearchParams) {
  const _params: Record<string, any> | URLSearchParams = {};
  for (const propName1 of Object.keys(params)) {
    const propValue1 = params[propName1];
    if (typeof propValue1 === 'object' && !Array.isArray(propValue1) && propValue1 !== null && typeof (propValue1) !== 'undefined') {
      for (const propName2 of Object.keys(propValue1)) {
        const propValue2 = propValue1[propName2];
        if (!isBlank(propValue2)) {
          const _propName1 = propName1 + '[' + propName2 + ']';
          _params[_propName1] = propValue2;
        }
      }
    } else if (!isBlank(propValue1)) {
      _params[propName1] = Array.isArray(propValue1) ? propValue1?.toString() : propValue1;
    }
  }
  return _params;
}
