import type { FC, Key } from "react";
import { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";

import DictDataTable from "./components/DictDataTable";
import type { DictTypeItem } from "../../data";
import { getType } from "../../service";

const DictData: FC<{ dictId: Key; }> = (props) => {
  // 表单对话框显示标识
  const [modalVisibleState, setModalVisibleState] = useState<boolean>(false);
  // 字典类型信息状态
  const [dictTypeItemState, setDictTypeItemState] = useState<DictTypeItem>();

  useEffect(() => {
    if (modalVisibleState) {
      (async function _() {
        const _dictTypeItem = await getType(props.dictId);
        setDictTypeItemState(_dictTypeItem);
      })();
    } else {
      setDictTypeItemState(undefined);
    }
  }, [modalVisibleState, props.dictId]);

  return (
    <>
      <Button icon={<EditOutlined />} type="link" size='small' onClick={() => setModalVisibleState(true)}>
        字典数据
      </Button>
      <Modal
        title={`字典数据-${dictTypeItemState?.dictName}[${dictTypeItemState?.dictType}]`}
        centered={false}
        destroyOnClose={true}
        keyboard={false}
        maskClosable={false}
        visible={modalVisibleState}
        onOk={() => setModalVisibleState(false)}
        onCancel={() => setModalVisibleState(false)}
        width={1800}
        footer={
          <Button type="default" size='small' onClick={() => setModalVisibleState(false)}>
            关闭
          </Button>
        }
      >
        {(modalVisibleState && dictTypeItemState) && (
          <DictDataTable dictType={dictTypeItemState.dictType as string} />
        )}
      </Modal>
    </>
  );
}

export default DictData;
