import _ from 'lodash';

export default {
  mouseClientPosition: { x: 0, y: 0 },
  updateMouseClientPosition(e) {
    _.assign(this.mouseClientPosition, {
      x: e.clientX,
      y: e.clientY,
    });
    return this.mouseClientPosition;
  },
  getRelativeMousePosition(element) {
    const elementClientPos = element.getBoundingClientRect();
    const relativePos = {
      x:
        this.mouseClientPosition.x -
        (elementClientPos.x || elementClientPos.left),
      y:
        this.mouseClientPosition.y -
        (elementClientPos.y || elementClientPos.top),
    };
    relativePos.onElement =
      relativePos.x >= 0 &&
      relativePos.y >= 0 &&
      relativePos.x <= elementClientPos.width &&
      relativePos.y <= elementClientPos.height;
    return relativePos;
  },
  getTop(element, container) {
    let offset = 0;
    if (!container || (container && element !== container)) {
      offset = element.offsetTop;
      if (element.offsetParent) {
        offset -= element.offsetParent.scrollTop;
        offset += this.getTop(element.offsetParent, container);
      }
    }

    return offset;
  },
  getLeft(element, container) {
    let offset = 0;
    if (!container || (container && element !== container)) {
      offset = element.offsetLeft;
      if (element.offsetParent) {
        offset -= element.offsetParent.scrollLeft;
        offset += this.getLeft(element.offsetParent, container);
      }
    }

    return offset;
  },
  getElementPosition(element, container) {
    return {
      x: this.getLeft(element, container),
      y: this.getTop(element, container),
    };
  },
  fixBoundPosition(element, container) {
    const pos = this.getElementPosition(element, container);
    const endPos = {
      x: pos.x + element.offsetWidth,
      y: pos.y + element.offsetHeight,
    };

    let fixLeft;
    if (endPos.x < 0) {
      fixLeft = -pos.x;
    } else {
      const offsetLeft = endPos.x - (container || document.body).offsetWidth;
      if (offsetLeft > 0) {
        fixLeft = -offsetLeft;
      }
    }

    let fixTop;
    if (endPos.y < 0) {
      fixTop = -pos.y;
    } else {
      const offsetTop = endPos.y - (container || document.body).offsetHeight;
      if (offsetTop > 0) {
        fixTop = -offsetTop;
      }
    }

    if (fixLeft) {
      element.style.left = `${
        Number(element.style.left.replace('px', '')) + fixLeft
      }px`;
    }
    if (fixTop) {
      element.style.top = `${
        Number(element.style.top.replace('px', '')) + fixTop
      }px`;
    }
  },
  startListen() {
    if (this.mousemoveHandler) {
      return;
    }

    this.mousemoveHandler = (e) => {
      this.updateMouseClientPosition(e);
    };
    document.body.addEventListener('mousemove', this.mousemoveHandler);
  },
  stopListen() {
    if (!this.mousemoveHandler) {
      return;
    }
    document.body.removeEventListener('mousemove', this.mousemoveHandler);
    this.mousemoveHandler = null;
  },
};
