import { getCurrentTheme } from './themes';
// class ListenDomChange {

//   constructor({ dom, callback }) {
//     this.callback = callback;
//     dom ? (this.dom = dom) : (this.dom = document.body);
//     MutationObserver =
//       window.MutationObserver ||
//       window.WebKitMutationObserver ||
//       window.MozMutationObserver;
//     this.Observer = new MutationObserver((mutations, instance) => {
//       console.log(mutations[0].target.className, instance);
//       console.log(localStorage.getItem("cb-theme"));
//       this.callback(getCurrentTheme());
//     });
//   }

//   //创建监听
//   createListen() {
//     this.Observer.observe(this.dom, {
//       attributes: true,
//     });
//   }
//   //销毁
//   destroyListen() {
//     this.Observer.disconnect();
//   }
// }
// export default ListenDomChange;
function Listen() {
  let theme = '';
  return function ({ dom, callback }) {
    this.theme = '';
    this.callback = callback;
    MutationObserver =
      window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver;
    this.Observer = new MutationObserver((mutations, instance) => {
      theme = mutations[0].target.className.split(' ').filter((element) => {
        return element.indexOf('theme-') !== -1;
      })[0];
      if (this.theme !== theme) {
        this.theme = theme;
        this.callback(getCurrentTheme());
      }
    });
    this.createListen = function () {
      this.Observer.observe(dom, {
        attributes: true,
      });
    };
    this.destroyListen = function () {
      this.Observer.disconnect();
    };
  };
}

let ListenDomChange = Listen();
export default ListenDomChange;
