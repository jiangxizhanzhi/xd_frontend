/*
 * @Author: wangzhongjie
 * @Date: 2021-09-18 14:28:03
 * @LastEditors: wangzhongjie
 * @LastEditTime: 2021-09-23 15:15:11
 * @Description:
 * @Email: UvDream@163.com
 */
import { onMounted, onUnmounted, ref } from '@vue/composition-api';
import dayjs from 'dayjs';

export function useTime() {
  const time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'));
  let handle: any;
  onMounted(() => {
    handle = setInterval(() => {
      time.value = dayjs().format('YYYY-MM-DD HH:mm:ss');
    }, 1000);
  });
  onUnmounted(() => {
    handle && clearInterval(handle);
  });

  return time;
}
