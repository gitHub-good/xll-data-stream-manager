import type { FC } from 'react';
import { useEffect, useState } from "react";
import { PageContainer } from "@ant-design/pro-layout";

const Swagger: FC = () => {
  const url = REACT_APP_BASE_API + '/swagger-ui/index.html';
  const [clientHeightState, setClientHeightState] = useState<string>();
  useEffect(() => {
    setClientHeightState(document.documentElement.clientHeight - 94.5 + "px");
  }, []);
  return (
    <PageContainer header={{ title: undefined }}>
      <iframe
        frameBorder={'no'}
        src={url}
        style={{ width: '100%', height: clientHeightState }}
        scrolling={'auto'}
      />
    </PageContainer>
  );
};

export default Swagger;
