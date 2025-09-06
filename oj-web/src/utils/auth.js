import Cookies from 'js-cookie';

const TokenKey = 'cr_csrftoken';
const JWTTokenKey = 'cr_jwttoken';

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 1, path: '/' });
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function getJWTToken() {
  return Cookies.get(JWTTokenKey);
}

export function setJWTToken(jwt) {
  return Cookies.set(JWTTokenKey, jwt);
}

export function removeJWTToken() {
  return Cookies.remove(JWTTokenKey);
}
