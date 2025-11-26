export default {
  name: 'drag',

  bind: function (el) {},
  //inserted表示一个元素，插入到DOM中会执行inserted函数，只触发一次
  inserted: function (el) {
    let dragDom = el; //获取当前元素
    let firstTime = '',
      lastTime = '';
    el.onmousedown = function (e) {
      var disx = e.pageX - el.offsetLeft;
      var disy = e.pageY - el.offsetTop;
      // 给当前元素添加属性，用于元素状态的判断
      dragDom.setAttribute('ele-flag', false);
      dragDom.setAttribute('draging-flag', true);
      firstTime = new Date().getTime();
      document.onmousemove = function (e) {
        el.style.left = e.pageX - disx + 'px';
        el.style.top = e.pageY - disy + 'px';
      };
      document.onmouseup = function (event) {
        document.onmousemove = document.onmouseup = null;
        lastTime = new Date().getTime();
        if (lastTime - firstTime > 200) {
          dragDom.setAttribute('ele-flag', true);
          event.stopPropagation();
        }
        setTimeout(function () {
          dragDom.setAttribute('draging-flag', false);
        }, 100);
      };
    };
  },
};
