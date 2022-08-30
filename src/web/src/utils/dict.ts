import { getDicts as _getDicts } from "@/pages/system/dict/components/DictData/service";

/** 按字典类型获取字典值列表 GET /system/dict/data/type/字典类型 */
export async function getDicts(dictTypes: string[]) {
  const dicts: Record<string, { label: string, value: string }[]> = {};
  const promiseArray = [];
  for (const dictType of dictTypes) {
    const _promise = _getDicts(dictType);
    promiseArray.push(_promise);
  }
  const promiseResultArray = await Promise.all(promiseArray);
  for (const promiseResult of promiseResultArray) {
    const _data: { label: string, value: string; }[] = [];
    for (const _dataItem of promiseResult?.data) {
      _data.push({ label: _dataItem.dictLabel as string, value: _dataItem.dictValue as string });
    }
    if (promiseResult?.data[0]?.dictType) {
      dicts[promiseResult?.data[0]?.dictType] = _data;
    }
  }
  return dicts;
}

// 回显数据字典
export function selectDictLabel(dict: { label: string, value: string }[], value: string) {
  const labels: string[] = [];
  dict.forEach((dictItem) => {
    if (dictItem.value === ('' + value)) {
      labels.push(dictItem.label);
    }
  });
  return labels.join(',');
}
