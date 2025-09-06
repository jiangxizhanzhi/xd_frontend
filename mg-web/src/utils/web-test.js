window.__cyWebTest = {
  getButtonsByLabel: (label) => {
    let buttons = [];
    for (const b of document.querySelectorAll('.cb-button button')) {
      const l = b.querySelector('span span');
      if (l.textContent.includes(label)) {
        buttons.push(b);
      }
    }
    return buttons;
  },
  getFormContentByLabel: (label, element) => {
    let ele = [];
    for (const i of document.querySelectorAll('.el-form-item')) {
      const l = i.querySelector('label');

      if (l && l.textContent && l.textContent.includes(label)) {
        const contentWrapper = i.querySelector('.el-form-item__content');
        if (element) {
          ele = contentWrapper.querySelectorAll(element);
        } else {
          ele.push(contentWrapper);
        }
      }
    }
    return ele;
  },
  formLabelScrollIntoView: (label) => {
    window.__cyWebTest.getFormContentByLabel(label)[0].scrollIntoView();
  },
  setMarkdownContent: (element, content) => {
    let md = element;
    if (typeof element === 'string') {
      md = window.__cyWebTest.getFormContentByLabel(element, '.cb-markdown')[0];
    }
    const line = md.querySelector('.bytemd-body .bytemd-editor textarea');
    if (line) {
      line.dispatchEvent(new Event('focus'));
      line.value = content;
    }
  },
};
