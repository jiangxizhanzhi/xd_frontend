export function codeLang() {
  function createElement(tag, innerHTML, className, id) {
    const element = document.createElement(tag);
    element.className = className;
    id ? (element.id = id) : '';
    element.innerHTML = innerHTML;
    return element;
  }
  return {
    // @ts-ignore
    viewerEffect({ markdownBody }) {
      ((markdownBody) => {
        const els = markdownBody.querySelectorAll('pre');
        els.forEach((el) => {
          const operateBtn = createElement('div', '', 'operate-btn');
          // lang
          const lang = el.childNodes[0]['className']
            .split(' ')[0]
            .split('-')[1];
          if (lang) {
            const langBtn = createElement('span', lang, 'lang-btn');
            operateBtn.appendChild(langBtn);
          }
          el.appendChild(operateBtn);
        });
      })(markdownBody);
    },
  };
}
