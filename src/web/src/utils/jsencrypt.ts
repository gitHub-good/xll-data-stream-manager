import JSEncrypt from 'jsencrypt'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAL6xs5rhCIDy8xyKiOlx6pheWKTStsP0\n' +
  'f7Tq5eOU0Hw0etzmMYgzbXjYRPs/Wo8ZFhaH66eNWIlo8xmmY5Ft/hsCAwEAAQ==';

const privateKey = 'MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAvrGzmuEIgPLzHIqI\n' +
  '6XHqmF5YpNK2w/R/tOrl45TQfDR63OYxiDNteNhE+z9ajxkWFofrp41YiWjzGaZj\n' +
  'kW3+GwIDAQABAkBsSD+ybKIFhu9hf5Dq7lLGHpy7SyOY9dcmhlPv/Oq9+5pbvfyq\n' +
  'gtZn2BsNZ+P2msNBW6whtbmFibLc4R0uGIThAiEA90oqvIWHRrI+Y11SKNNm1DdI\n' +
  'oBzsRTIB3Bax1lOwLkMCIQDFaTUa1dn5U9qJ+umC6tO+8pXBaa3cvWzyuh6Dlpuv\n' +
  'SQIgKY8XW5N9Ro5SGdTnJ+FPWL7pv67crkxXL6vIu2JZK40CIE7jwlMdDuSye+0U\n' +
  'Fmk5CrGOJAaNAuvpzzYY5sTTVRfxAiEAmPoyqJJDuy++t2aJ86sGuUMThWPHFbcL\n' +
  '1DNoRg570Nw=';

// 加密
export function encrypt(txt: string) {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey); // 设置公钥
  return encryptor.encrypt(txt); // 对数据进行加密
}

// 解密
export function decrypt(txt: string) {
  const encryptor = new JSEncrypt();
  encryptor.setPrivateKey(privateKey); // 设置私钥
  return encryptor.decrypt(txt); // 对数据进行解密
}

