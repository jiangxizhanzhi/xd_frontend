let config = {
  open: '{{',
  close: '}}',
};

let tool = {
  exp: function (str) {
    return new RegExp(str, 'g');
  },
  //匹配满足规则内容
  query: function (type, _, __) {
    let types = [
      '#([\\s\\S])+?', //js语句
      '([^{#}])*?', //普通字段
    ][type || 0];
    return exp((_ || '') + config.open + types + config.close + (__ || ''));
  },
  escape: function (html) {
    return String(html || '')
      .replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/'/g, '&#39;')
      .replace(/"/g, '&quot;');
  },
  error: function (e, tplog) {
    let error = 'Laytpl Error：';
    typeof console === 'object' &&
      console.error(error + e + '\n' + (tplog || ''));
    return error + e;
  },
};

let exp = tool.exp,
  Tpl = function (tpl) {
    this.tpl = tpl;
  };

Tpl.pt = Tpl.prototype;

//编译模版
Tpl.pt.parse = function (tpl, data) {
  let that = this,
    tplog = tpl;
  let jss = exp('^' + config.open + '#', ''),
    jsse = exp(config.close + '$', '');

  tpl = tpl
    .replace(/\s+|\r|\t|\n/g, ' ')
    .replace(exp(config.open + '#'), config.open + '# ')

    .replace(exp(config.close + '}'), '} ' + config.close)
    .replace(/\\/g, '\\\\')

    .replace(/(?="|')/g, '\\')
    .replace(tool.query(), function (str) {
      str = str.replace(jss, '').replace(jsse, '');
      return '";' + str.replace(/\\/g, '') + ';view+="';
    })

    .replace(tool.query(1), function (str) {
      let start = '"+(';
      if (str.replace(/\s/g, '') === config.open + config.close) {
        return '';
      }
      str = str.replace(exp(config.open + '|' + config.close), '');
      if (/^=/.test(str)) {
        str = str.replace(/^=/, '');
        start = '"+_escape_(';
      }
      return start + str.replace(/\\/g, '') + ')+"';
    });

  tpl = '"use strict";let view = "' + tpl + '";return view;';

  try {
    that.cache = tpl = new Function('d, _escape_', tpl);
    return tpl(data, tool.escape);
  } catch (e) {
    delete that.cache;
    return tool.error(e, tplog);
  }
};

Tpl.pt.render = function (data, callback) {
  let that = this,
    tpl;
  if (!data) return tool.error('no data');
  tpl = that.cache ? that.cache(data, tool.escape) : that.parse(that.tpl, data);
  if (!callback) return tpl;
  callback(tpl);
};

export const laytpl = function (tpl) {
  if (typeof tpl !== 'string') return tool.error('Template not found');
  return new Tpl(tpl);
};

laytpl.config = function (options) {
  options = options || {};
  for (let i in options) {
    config[i] = options[i];
  }
};

laytpl.v = '1.2.0';
