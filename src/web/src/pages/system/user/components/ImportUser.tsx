import type { FC, MutableRefObject } from "react";
import { useState } from "react";
import { Button, message } from "antd";
import {
  DrawerForm, ProFormCheckbox, ProFormUploadDragger , ActionType
} from '@ant-design/pro-components';
import { ImportOutlined } from "@ant-design/icons";
import { download } from "@/utils";
import { importUserFile } from "../service";

/** 用户导入按钮处理方法 */
const handleSubmit = async (file: File, updateSupport: boolean = false, tableActionRef: MutableRefObject<ActionType | undefined>) => {
  try {
    await importUserFile(file, updateSupport);
    message.success('用户导入成功');
  } catch (e) {
    return false;
  }
  tableActionRef?.current?.reload();
  return true;
};

const ImportUser: FC<{ tableActionRef: MutableRefObject<ActionType | undefined> }> = (props) => {
  const [downloadButtonSpinning, setDownloadButtonSpinning] = useState(false);

  return (
    <DrawerForm<{
      files: { originFileObj: File }[];
      updateSupport: boolean;
    }>
      autoFocusFirstInput
      trigger={
        <Button icon={<ImportOutlined />} size="small" type="primary">
          导入
        </Button>
      }
      title="用户导入"
      width={900}
      onFinish={async (values) => {
        return await handleSubmit(values.files[0].originFileObj, values.updateSupport, props.tableActionRef);
      }}
    >
      <ProFormUploadDragger
        name="files"
        label="上传文件"
        description={
          <>
            <span>仅允许导入xls、xlsx格式文件</span>
          </>
        }
        width="lg"
        fieldProps={{
          accept: '.xls,.xlsx',
          maxCount: 1,
          multiple: false,
          beforeUpload: () => false,
        }}
        rules={[
          { required: true, message: '请选择要上传的文件' },
        ]}
      />
      <ProFormCheckbox
        noStyle={true}
        name="updateSupport"
        fieldProps={{
          defaultChecked: false,
        }}
      >是否更新已经存在的用户数据</ProFormCheckbox>
      <Button loading={downloadButtonSpinning} size="small" type="link" onClick={async () => {
        setDownloadButtonSpinning(true);
        try {
          await download.commonDownload(
            '/system/user/importTemplate',
            {},
            `user_template_${new Date().getTime()}.xlsx`
          )
        } finally {
          setDownloadButtonSpinning(false);
        }
      }}>下载模板</Button>
    </DrawerForm>
  );
};

export default ImportUser;
