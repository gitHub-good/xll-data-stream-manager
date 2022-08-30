import { Modal } from "antd";

/**
 * 确认对话框
 * @param content 内容
 * @param onOk 点击确定回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭
 * @param onCancel 取消回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭
 */
export function confirm(content?: string, onOk?: (...args: any[]) => any, onCancel?: (...args: any[]) => any) {
  return Modal.confirm(
    {
      autoFocusButton: 'cancel',// 指定自动获得焦点的按钮
      centered: true,// 垂直居中展示 Modal
      content,// 内容
      closable: true,// 是否显示右上角的关闭按钮
      maskClosable: false,// 点击蒙层是否允许关闭
      keyboard: false,// 是否支持键盘 esc 关闭
      mask: true,// 是否展示遮罩
      title: '系统提示',// 标题
      onCancel,// 取消回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭
      onOk,// 点击确定回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭
    }
  );
}
