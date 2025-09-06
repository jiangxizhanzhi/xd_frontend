/*
 * @Author: wangzhongjie
 * @Date: 2021-09-18 10:51:47
 * @LastEditors: wangzhongjie
 * @LastEditTime: 2021-09-18 14:07:45
 * @Description: 白天黑夜切换
 * @Email: UvDream@163.com
 */
import cssVars from 'css-vars-ponyfill';
import { dayTheme } from './day';
import { nightTheme } from './night';
const themeArr = {
  day: dayTheme,
  night: nightTheme,
};
export const changeTime = (theme) => {
  cssVars({
    rootElement: document.getElementById('visual-screen'),
    preserveStatic: true,
    watch: true,
    variables: themeArr[theme],
    onlyLegacy: true,
  });
};
