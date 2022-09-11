import BaseRestResult = FrameApi.BaseRestResult;

export interface CpuInfo {
  cpuNum?: number;
  total?: number;
  sys?: number;
  used?: number;
  wait?: number;
  free?: number;
}

export interface MemInfo {
  total?: number;
  used?: number;
  free?: number;
  usage?: number;
}

export interface JvmInfo {
  total?: number;
  max?: number;
  free?: number;
  version?: string;
  home?: string;
  name?: string;
  startTime?: string;
  usage?: number;
  used?: number;
  runTime?: string;
  inputArgs?: string;
}

export interface SysInfo {
  computerName?: string;
  computerIp?: string;
  userDir?: string;
  osName?: string;
  osArch?: string;
}

export interface SysFile {
  dirName?: string;
  sysTypeName?: string;
  typeName?: string;
  total?: string;
  free?: string;
  used?: string;
  usage?: number;
}

export interface ServerInfo extends BaseRestResult {
  cpu?: CpuInfo;
  mem?: MemInfo;
  jvm?: JvmInfo;
  sys?: SysInfo;
  sysFiles?: SysFile[];
}
