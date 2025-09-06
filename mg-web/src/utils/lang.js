import { getI18N } from '@cyber/helper';

export function getI18n() {
  return getI18N();
}

export function gettext(str) {
  let data = getI18n().messages[getI18n().locale];
  for (const key of str.split('.')) {
    data = data[key];
  }
  if (!data) {
    data = str;
  }

  return data;
}
