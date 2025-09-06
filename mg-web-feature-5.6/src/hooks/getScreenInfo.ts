import { onMounted, onUnmounted, reactive, ref } from '@vue/composition-api';
interface ScreenInfo {
  width: number;
  height: number;
}
export function getScreenInfo(): ScreenInfo {
  let screen: ScreenInfo = reactive({
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  });

  onMounted(() => {
    window.addEventListener('resize', () => {
      screen.width = document.body.clientWidth;
      screen.height = document.body.clientHeight;
    });
  });
  onUnmounted(() => {
    window.removeEventListener('resize', () => {});
  });

  return screen;
}
