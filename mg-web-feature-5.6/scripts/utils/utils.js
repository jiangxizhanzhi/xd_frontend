const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const prettier = require('prettier');
const _ = require('lodash');

function isDirectory(path) {
  return fs.lstatSync(path).isDirectory();
}

function isFile(path) {
  return fs.lstatSync(path).isFile();
}

function isExists(path) {
  return fs.existsSync(path);
}

function absPath(path, context) {
  if (!path.isAbsolute(path) && context) {
    path = path.join(context, path);
  }
  return path;
}

/**
 * copy
 * @param source source
 * @param destination destination
 * @param context
 */
function copy(source, destination, context) {
  source = absPath(source, context);
  destination = absPath(destination, context);
  if (isDirectory(source)) {
    const subDirs = fs.readdirSync(source, 'utf-8');
    subDirs.forEach((dir) => {
      copy(path.join(source, dir), path.join(destination, dir));
    });
  } else if (isFile(source)) {
    const parentDir = path.dirname(destination);
    if (!isExists(parentDir)) {
      fs.mkdirSync(parentDir, {
        recursive: true,
      });
    }
    if (isExists(destination)) {
      rimraf.sync(destination);
    }
    fs.copyFileSync(source, destination);
  }
}

function toFirstUpperCase(word) {
  let arr = word.split(' ');
  let len = arr.length;
  if (len <= 3) {
    arr = arr.map((el) => el.substring(0, 1).toUpperCase() + el.substring(1));
  }
  return arr.join(' ');
}

function requireEnhance(modulePath) {
  if (modulePath === undefined) {
    return;
  }

  let module;
  try {
    module = require(modulePath);
  } catch (e) {
    return;
  }
  if (module.__esModule == true) {
    return module.default;
  }

  return module;
}

function prettierCode(code) {
  const formConfig = {
    semi: true,
    parser: 'babel',
    singleQuote: true,
    printWidth: 80,
  };
  return prettier.format(code, formConfig);
}

module.exports = {
  toFirstUpperCase,
  copy,
  isDirectory,
  absPath,
  isExists,
  isFile,
  requireEnhance,
  prettierCode,
};
