const _ = require('lodash');
const fs = require('fs');
const nodeExcel = require('excel-export');

const babelRegister = require('./babel-register.js').default;

const utils = require('./utils');

function exportExcel() {
  const { enObj, zhObj } = readLangFiles();
  let conf = {};
  conf.name = 'new_translate';
  conf.rows = [];
  conf.cols = [
    {
      caption: '文件',
      type: 'string',
      width: 30,
    },
    {
      caption: 'KEY',
      type: 'string',
      width: 30,
    },
    {
      caption: '中文',
      type: 'string',
      width: 50,
    },
    {
      caption: '英文',
      type: 'string',
      width: 50,
    },
  ];

  const setRow = (val, key, fileName) => {
    let objKey = key;
    if (_.isString(val)) {
      conf.rows.push([
        fileName,
        objKey,
        val,
        _.get(enObj, fileName + '.' + objKey),
      ]);
    } else if (_.isPlainObject(val)) {
      for (let i in val) {
        setRow(val[i], key ? key + '.' + i : i, fileName);
      }
    }
  };
  for (let i in zhObj) {
    setRow(zhObj[i], '', i);
  }

  const root = process.cwd();

  const result = nodeExcel.execute(conf);
  const filePath = root + '/new_translate.xlsx';
  fs.writeFile(filePath, result, 'binary', function (err) {
    if (err) {
      console.log(err);
    }
  });
}

function readLangFiles() {
  const root = process.cwd();
  const zhLangPath = root + '/src/locales/zh-CN';
  const enLangPath = root + '/src/locales/en-US';
  let path = fs.readdirSync(zhLangPath);
  let newPath = fs.readdirSync(enLangPath);

  let zhObj = {};
  let enObj = {};

  const readFile = (files, basePath, directory = '', output) => {
    files.forEach((element) => {
      if (element === 'index.js') {
        return;
      }
      const fullPath = basePath + '/' + element;
      if (utils.isDirectory(fullPath)) {
        const newFiles = fs.readdirSync(fullPath);
        readFile(newFiles, fullPath, element + '/', output);
        return;
      }
      babelRegister([fullPath]);
      const obj = utils.requireEnhance(fullPath);
      const name = element.replace('.js', '');
      _.set(output, directory + name, obj);
    });
  };

  readFile(path, zhLangPath, '', zhObj);
  readFile(newPath, enLangPath, '', enObj);

  return { enObj, zhObj };
}

module.exports = {
  readLangFiles,
  exportExcel,
};
