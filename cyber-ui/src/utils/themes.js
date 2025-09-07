import cssVars from 'css-vars-ponyfill';
import { bus } from './bus.js';
import style from '../theme/themify/_export.module.scss';
import _ from 'lodash';

const themes = {};
const THEME_KEY = 'cb-theme';

for (let key in style) {
  const theme = key.split('&&');
  const value = style[key];
  const [themeName, varKey] = theme;
  _.set(themes, `theme-${themeName}.${varKey}`, value);
}

const themesNameList = Object.keys(themes);

export function setThemeClass(theme) {
  changeTheme(theme);
  const body = document.body;
  const classArr = [];
  body.className.split(' ').map(function (val) {
    if (!themesNameList.includes(val)) {
      classArr.push(val);
    }
  });
  const newClsName = classArr.join(' ') + ' ' + theme;
  if (body.className !== newClsName) {
    body.className = newClsName;
  }
}
function initTheme(theme) {
  const localTheme = localStorage.getItem(THEME_KEY);
  const currentTheme =
    localTheme && localTheme.indexOf('theme') > -1 ? localTheme : theme;
  setThemeClass(currentTheme);
  localStorage.setItem(THEME_KEY, currentTheme);
  return currentTheme;
}

export function setTheme(theme) {
  if (theme) {
    localStorage.setItem(THEME_KEY, theme);
    setThemeClass(theme);
    bus.$emit('theme_change', theme);
  } else {
    const currentTheme = getCurrentTheme();
    initTheme(currentTheme);
  }
}

export function getCurrentTheme() {
  const currentTheme = localStorage.getItem(THEME_KEY)
    ? localStorage.getItem(THEME_KEY)
    : 'theme-dark';

  return currentTheme;
}

export const changeTheme = (theme) => {
  cssVars({
    preserveStatic: true,
    watch: true,
    variables: themes[theme],
    onlyLegacy: true,
  });
};

export function themed(data, theme) {
  if (data.indexOf('--') === -1) {
    data = '--' + data;
  }
  const curTheme = theme || getCurrentTheme();
  return _.get(themes, `${curTheme}.${data}`) || data;
}

export function getComputedThemedVar(node, variable) {
  const computedStyle = getComputedStyle(node);
  if (variable.indexOf('--') === -1) {
    variable = '--' + variable;
  }
  return (
    computedStyle &&
    computedStyle.getPropertyValue &&
    computedStyle.getPropertyValue(variable)
  );
}

export function HEXToRGB(color, opacity) {
  color = color.trim();
  let r = parseInt(color.substring(1, 3), 16);
  let g = parseInt(color.substring(3, 5), 16);
  let b = parseInt(color.substring(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
