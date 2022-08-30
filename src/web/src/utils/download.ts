import { request } from "umi";
import { message } from "antd";
import { saveAs } from 'file-saver';
import { errorCode } from "./sysCode";

export async function commonDownload(url: string, params: Record<string, any> | URLSearchParams, filename: string) {
  const data = await request<Blob>(url, {
    method: 'POST',
    params: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
  });
  const isBlob = await blobValidate(data);
  if (isBlob) {
    const blob = new Blob([data])
    saveAs(blob, filename)
  } else {
    const resText = await data.text();
    const rspObj = JSON.parse(resText);
    const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode.default
    message.error(errMsg);
  }
}

// 验证是否为blob格式
export async function blobValidate(data: Blob) {
  try {
    const text = await data.text();
    JSON.parse(text);
    return false;
  } catch (error) {
    return true;
  }
}
