let timer = null;

export default function debounce(callback, wait) {
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    callback();
  }, wait);
}
