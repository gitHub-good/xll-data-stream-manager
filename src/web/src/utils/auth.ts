import Cookies from 'js-cookie';

const TokenKey: string = 'Token-1637822519';

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token: string) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
