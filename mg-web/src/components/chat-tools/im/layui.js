export const Lay = function () {
  this.v = 'c.b.1'; //版本号
};

Lay.fn = Lay.prototype;
let win = window.rawWindow || window;
export let layui = new Lay();

let doc = document,
  config = (Lay.fn.cache = {}),
  //获取layui所在目录
  getPath = (function () {
    let js = doc.scripts,
      jsPath = js[js.length - 1].src;
    return jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
  })(),
  //异常提示
  error = function (msg) {
    console.error('Layui hint: ' + msg);
  },
  isOpera =
    typeof opera !== 'undefined' && opera.toString() === '[object Opera]',
  //内置模块
  modules = {
    layer: 'modules/layer', //弹层
    laytpl: 'modules/laytpl', //模板引擎
    layim: 'modules/layim', //web通讯
    upload: 'modules/upload', //上传
  };

config.modules = {}; //记录模块物理路径
config.status = {}; //记录模块加载状态
config.timeout = 10; //符合规范的模块请求最长等待秒数
config.event = {}; //记录模块自定义事件

//定义模块
Lay.fn.define = function (deps, callback) {
  let that = this,
    type = typeof deps === 'function',
    mods = function () {
      typeof callback === 'function' &&
        callback(function (app, exports) {
          layui[app] = exports;
          config.status[app] = true;
        });
      return this;
    };
  type && ((callback = deps), (deps = []));
  if (layui['layui.all']) {
    return mods.call(that);
  }
  that.use(deps, mods);
  return that;
};

//使用特定模块
Lay.fn.use = function (apps, callback, exports) {
  let that = this,
    dir = (config.dir = config.dir ? config.dir : getPath);
  let head = doc.getElementsByTagName('head')[0];

  apps = typeof apps === 'string' ? [apps] : apps;

  let item = apps[0],
    timeout = 0;
  exports = exports || [];

  //静态资源host
  config.host =
    config.host ||
    (dir.match(/\/\/([\s\S]+?)\//) || ['//' + location.host + '/'])[0];

  if (apps.length === 0 || (layui['layui.all'] && modules[item])) {
    return (
      typeof callback === 'function' && callback.apply(layui, exports), that
    );
  }

  //加载完毕
  function onScriptLoad(e, url) {
    let readyRegExp =
      navigator.platform === 'PLaySTATION 3'
        ? /^complete$/
        : /^(complete|loaded)$/;
    if (
      e.type === 'load' ||
      readyRegExp.test((e.currentTarget || e.srcElement).readyState)
    ) {
      config.modules[item] = url;
      head.removeChild(node);
      (function poll() {
        if (++timeout > (config.timeout * 1000) / 4) {
          return error(item + ' is not a valid module');
        }
        config.status[item] ? onCallback() : setTimeout(poll, 4);
      })();
    }
  }

  //加载模块
  let node = doc.createElement('script'),
    /* url =
        (modules[item] ? dir + 'public/static/layui/lay/' : config.base || '') +
        (that.modules[item] || item) +
        '.js'; */
    url =
      '/page/oj/public/static/layui/lay/' +
      (that.modules[item] || item) +
      '.js';

  node.async = true;
  node.charset = 'utf-8';
  node.src =
    url +
    (function () {
      let version =
        config.version === true
          ? config.v || new Date().getTime()
          : config.version || '';
      return version ? '?v=' + version : '';
    })();

  //首次加载
  if (!config.modules[item]) {
    head.appendChild(node);
    if (
      node.attachEvent &&
      !(
        node.attachEvent.toString &&
        node.attachEvent.toString().indexOf('[native code') < 0
      ) &&
      !isOpera
    ) {
      node.attachEvent('onreadystatechange', function (e) {
        onScriptLoad(e, url);
      });
    } else {
      node.addEventListener(
        'load',
        function (e) {
          onScriptLoad(e, url);
        },
        false,
      );
    }
  } else {
    (function poll() {
      if (++timeout > (config.timeout * 1000) / 4) {
        return error(item + ' is not a valid module');
      }
      typeof config.modules[item] === 'string' && config.status[item]
        ? onCallback()
        : setTimeout(poll, 4);
    })();
  }

  config.modules[item] = url;

  //回调
  function onCallback() {
    exports.push(layui[item]);
    apps.length > 1
      ? that.use(apps.slice(1), callback, exports)
      : typeof callback === 'function' && callback.apply(layui, exports);
  }

  return that;
};

//获取节点的style属性值
Lay.fn.getStyle = function (node, name) {
  let style = node.currentStyle
    ? node.currentStyle
    : win.getComputedStyle(node, null);
  return style[style.getPropertyValue ? 'getPropertyValue' : 'getAttribute'](
    name,
  );
};

//css外部加载器
Lay.fn.link = function (href, fn, cssname) {
  let that = this,
    link = doc.createElement('link');
  let head = doc.getElementsByTagName('head')[0];
  if (typeof fn === 'string') cssname = fn;
  let app = (cssname || href).replace(/\.|\//g, '');
  let id = (link.id = 'layuicss-' + app),
    timeout = 0;

  link.rel = 'stylesheet';
  link.href = href + (config.debug ? '?v=' + new Date().getTime() : '');
  link.media = 'all';

  if (!doc.getElementById(id)) {
    head.appendChild(link);
  }

  if (typeof fn !== 'function') return;

  //轮询css是否加载完毕
  (function poll() {
    if (++timeout > (config.timeout * 1000) / 100) {
      return error(href + ' timeout');
    }
    parseInt(that.getStyle(doc.getElementById(id), 'width')) === 1989
      ? (function () {
          fn();
        })()
      : setTimeout(poll, 100);
  })();
};

//css内部加载器
Lay.fn.addcss = function (firename, fn, cssname) {
  /* layui.link(config.dir + 'public/static/layui/css/' + firename, fn, cssname); */
  layui.link('/page/oj/public/static/layui/css/' + firename, fn, cssname);
};

//图片预加载
Lay.fn.img = function (url, callback, error) {
  let img = new Image();
  img.src = url;
  if (img.complete) {
    return callback(img);
  }
  img.onload = function () {
    img.onload = null;
    callback(img);
  };
  img.onerror = function (e) {
    img.onerror = null;
    error(e);
  };
};

//全局配置
Lay.fn.config = function (options) {
  options = options || {};
  for (let key in options) {
    config[key] = options[key];
  }
  return this;
};

//记录全部模块
Lay.fn.modules = (function () {
  let clone = {};
  for (let o in modules) {
    clone[o] = modules[o];
  }
  return clone;
})();

//拓展模块
Lay.fn.extend = function (options) {
  let that = this;

  //验证模块是否被占用
  options = options || {};
  for (let o in options) {
    if (that[o] || that.modules[o]) {
      error('\u6A21\u5757\u540D ' + o + ' \u5DF2\u88AB\u5360\u7528');
    } else {
      that.modules[o] = options[o];
    }
  }

  return that;
};

//路由
Lay.fn.router = function (hash) {
  let hashs = (hash || location.hash).replace(/^#/, '').split('/') || [];
  let item,
    param = {
      dir: [],
    };
  for (let i = 0; i < hashs.length; i++) {
    item = hashs[i].split('=');
    /^\w+=/.test(hashs[i])
      ? (function () {
          if (item[0] !== 'dir') {
            param[item[0]] = item[1];
          }
        })()
      : param.dir.push(hashs[i]);
    item = null;
  }
  return param;
};

//本地存储
Lay.fn.data = function (table, settings) {
  let data = {};
  table = table || 'layui';

  if (!win.JSON || !win.JSON.parse) return;

  //如果settings为null，则删除表
  if (settings === null) {
    return delete localStorage[table];
  }

  settings = typeof settings === 'object' ? settings : { key: settings };

  try {
    data = JSON.parse(localStorage[table]);
  } catch (e) {
    data = {};
  }

  if (settings.value) data[settings.key] = settings.value;
  if (settings.remove) delete data[settings.key];
  localStorage[table] = JSON.stringify(data);

  return settings.key ? data[settings.key] : data;
};

//设备信息
Lay.fn.device = function (key) {
  let agent = navigator.userAgent.toLowerCase();

  //获取版本号
  let getVersion = function (label) {
    let exp = new RegExp(label + '/([^\\s\\_\\-]+)');
    label = (agent.match(exp) || [])[1];
    return label || false;
  };

  let result = {
    os: (function () {
      //底层操作系统
      if (/windows/.test(agent)) {
        return 'windows';
      } else if (/linux/.test(agent)) {
        return 'linux';
      } else if (/iphone|ipod|ipad|ios/.test(agent)) {
        return 'ios';
      }
    })(),
    ie: (function () {
      //ie版本
      return !!win.ActiveXObject || 'ActiveXObject' in win
        ? (agent.match(/msie\s(\d+)/) || [])[1] || '11' //由于ie11并没有msie的标识
        : false;
    })(),
    weixin: getVersion('micromessenger'), //是否微信
  };

  //任意的key
  if (key && !result[key]) {
    result[key] = getVersion(key);
  }

  //移动设备
  result.android = /android/.test(agent);
  result.ios = result.os === 'ios';

  return result;
};

//提示
Lay.fn.hint = function () {
  return {
    error: error,
  };
};

//遍历
Lay.fn.each = function (obj, fn) {
  let that = this,
    key;
  if (typeof fn !== 'function') return that;
  obj = obj || [];
  if (obj.constructor === Object) {
    for (key in obj) {
      if (fn.call(obj[key], key, obj[key])) break;
    }
  } else {
    for (key = 0; key < obj.length; key++) {
      if (fn.call(obj[key], key, obj[key])) break;
    }
  }
  return that;
};

//阻止事件冒泡
Lay.fn.stope = function (e) {
  e = e || win.event;
  e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
};

//自定义模块事件
Lay.fn.onevent = function (modName, events, callback) {
  if (typeof modName !== 'string' || typeof callback !== 'function')
    return this;
  config.event[modName + '.' + events] = [callback];

  //不再对多次事件监听做支持
  /*
  config.event[modName + '.' + events]
    ? config.event[modName + '.' + events].push(callback)
  : config.event[modName + '.' + events] = [callback];
  */

  return this;
};

//执行自定义模块事件
Lay.fn.event = function (modName, events, params) {
  let that = this,
    result = null,
    filter = events.match(/\(.*\)$/) || []; //提取事件过滤器
  let set = (events = modName + '.' + events).replace(filter, ''); //获取事件本体名
  let callback = function (_, item) {
    let res = item && item.call(that, params);
    res === false && result === null && (result = false);
  };
  layui.each(config.event[set], callback);
  filter[0] && layui.each(config.event[events], callback); //执行过滤器中的事件
  return result;
};
