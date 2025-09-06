const sass = require('sass');
const fs = require('fs');
const path = require('path');

function style() {
  // 删除文件夹
  deleteFolderRecursive('./lib');
  // 创建文件夹
  fs.mkdirSync('./lib');
  fs.mkdirSync('./lib/css');
  const result = sass.compile('./src/theme/index.scss', {
    style: 'compressed',
  });
  fs.writeFileSync('./lib/css/index.css', result.css, {
    encoding: 'utf-8',
    flag: 'w+',
  });
}

/**
 * 递归删除指定目录
 * @param {*} url
 */
function deleteFolderRecursive(url) {
  let files = [];
  if (fs.existsSync(url)) {
    files = fs.readdirSync(url);
    files.forEach((file, index) => {
      let curPath = path.join(url, file);
      if (fs.statSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(url);
  } else {
    console.log('lib目录不存在');
  }
}

style();
