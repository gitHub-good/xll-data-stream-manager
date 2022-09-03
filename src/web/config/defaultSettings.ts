import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  "navTheme": "realDark",
  "primaryColor": "#13C2C2",
  "layout": "mix",
  "contentWidth": "Fluid",
  "fixedHeader": false,
  "fixSiderbar": true,
  "pwa": true,
  title: '数据管理平台',
  "logo": "/logo.svg",
  "headerHeight": 48,
  "splitMenus": true
};

export default Settings;
