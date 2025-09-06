export class MoveItem {
  element = null;
  instance = null;
  text = '';
  width = 0;
  top = 0;
  offset = 0;
  option = {};
  line = 0;
  context = null;
  constructor(element, text, top, width, option, context) {
    this.element = element;
    this.text = text;
    this.top = top;
    this.width = width;
    this.option = option;
    this.context = context;
  }

  init() {
    this.instance = document.createElement('div');
    this.instance.className = this.option.className;
    this.instance.innerHTML = this.text;
    this.instance.style.top = this.top + 'px';
    this.offset -= this.instance.offsetWidth;
  }

  append() {
    this.element.appendChild(this.instance);
    this.offset -= this.instance.offsetWidth;
  }

  update() {
    const { direction, speed } = this.option;
    this.offset += speed;
    if (direction === 'left') {
      this.instance.style.right = this.offset + 'px';
    } else if (direction === 'right') {
      this.instance.style.left = this.offset + 'px';
    }
    this.instance.style.top = this.top + 'px';
    if (this.offset >= this.element.offsetWidth) {
      this.destroyed();
    }
  }

  destroyed() {
    this.instance?.remove();
  }
}

const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame;

const cancelAnimationFrame =
  window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  window.oCancelAnimationFrame ||
  window.msCancelAnimationFrame;

export class Barrage {
  el;
  option = {
    direction: 'left',
    speed: 1,
    lineCount: 4,
    className: '',
    loop: false,
    interval: 20,
    dislocate: false,
  };
  data = [];
  unInList = [];
  lineManager = {};
  dom = null;
  clock = null;
  constructor(el, data, option) {
    this.data = data;
    this.el = el;
    this.option = Object.assign(this.option, option || {});
  }

  start() {
    this.initLineManger();
    this.unInList = _.cloneDeep(this.data);
    this.clock = setInterval(() => {
      this.init();
    }, 10);
  }

  init() {
    const { offsetWidth: width, offsetHeight: height } = this.el;
    const { loop, lineCount, dislocate } = this.option;
    if (this.unInList.length > 0 || this.dom) {
      if (!this.dom) {
        this.dom = new MoveItem(
          this.el,
          this.unInList.shift(),
          0,
          width,
          this.option,
          this,
        );
        this.dom.init();
      }

      let line = this.canInsertLine();
      if (line) {
        let lineHeight = ~~(height / lineCount);
        this.lineManager[line].nodeList.push(this.dom);
        this.dom.top = this.lineManager[line].top;
        this.update();
        this.dom.append();
        if (dislocate) {
          let h = this.dom.instance.offsetHeight;
          this.dom.top =
            ~~(Math.random() * (lineHeight - h)) + lineHeight * (line - 1);
        }
        this.dom.update();
        this.dom = null;
      }
    } else {
      if (loop) this.unInList = _.cloneDeep(this.data);
    }
    this.update();
    // this.clock = requestAnimationFrame(() => {
    //   this.init();
    // });
  }

  initLineManger() {
    const { lineCount } = this.option;
    const { offsetHeight: height, offsetWidth: width } = this.el;
    const lineHeifht = height / lineCount;
    for (let i = 0; i < lineCount; i++) {
      this.lineManager[i + 1] = {
        nodeList: [],
        canUseWidth: width,
        top: lineHeifht * i,
      };
    }
  }

  canInsertLine() {
    const { interval } = this.option;
    for (const line in this.lineManager) {
      if (this.lineManager[line].canUseWidth > interval) {
        return line;
      }
    }
    return false;
  }

  update() {
    for (const line in this.lineManager) {
      if (this.lineManager[line].nodeList.length > 0) {
        let len = this.lineManager[line].nodeList.length;
        let last = this.lineManager[line].nodeList[len - 1];
        let canUseWidth = last.offset;
        this.lineManager[line].canUseWidth = canUseWidth;
        this.lineManager[line].nodeList.forEach((el) => el.update());
      }
    }
  }

  destroyed() {
    this.dom = null;
    clearInterval(this.clock);
    for (const key in this.lineManager) {
      this.lineManager[key].nodeList.forEach((item) => {
        item.destroyed();
      });
    }
  }

  setData(data) {
    this.data = data;
  }

  addItem(data) {
    this.data.push(data);
  }
}
