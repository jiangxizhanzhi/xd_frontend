export const trim = {
  bind: (el) => {
    const inputEl =
      el.getElementsByTagName('input')[0] ||
      el.getElementsByTagName('textarea')[0];
    if (!inputEl) {
      return;
    }

    inputEl.addEventListener('blur', () => {
      inputEl.value = inputEl.value.trim();
      const ev = new Event('input');
      inputEl.dispatchEvent(ev);
    });
  },
};
