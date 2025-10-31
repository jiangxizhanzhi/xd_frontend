export class Overlay {
  wrapper: HTMLDivElement | null;
  overlay: HTMLDivElement | undefined;
  commonStyle: string;

  constructor(selector: string) {
    this.wrapper = document.querySelector(selector);
    this.commonStyle = ` position:absolute;
      background-color:#2B374D;
      color:#fff;
      outline:0;
      border:0.5px solid #fff;
    `;
  }

  init() {
    const overlay = document.createElement('div');
    overlay.className = 'painter-overlay';
    // TODO
    overlay.style.cssText = `width: 0; height: 0; position: absolute; left: 0; top: 0`;
    this.wrapper?.appendChild(overlay);
    this.overlay = overlay;
  }

  updateInput(
    x: number,
    y: number,
    size: {
      height: number;
      width: number;
    },
    value: string,
    id: string,
    cb: (value: any) => void,
  ) {
    const input = document.createElement('textarea');
    input.id = `label_${id}`;
    input.value = value || '';
    input.style.cssText =
      `
      min-width: ${size.width || 10 + 10}px;
      min-height: ${size.height || 10 + 10}px;
      left: ${x}px;
      top: ${y}px;
    ` + this.commonStyle;
    this.overlay?.appendChild(input);
    document.getElementById(`label_${id}`)?.focus();

    input.onblur = function (e) {
      // @ts-ignore
      let value = e.target.value;
      cb(value);
    };
  }

  removeInput() {
    document.querySelector<HTMLElement>('.painter-overlay textarea')?.blur();
    document.querySelector<HTMLElement>('.painter-overlay textarea')?.remove();
  }
}
