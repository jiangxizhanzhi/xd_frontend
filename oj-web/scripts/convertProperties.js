const fs = require('fs');
const path = require('path');

function convert(inputPath, outputPath) {
  const content = fs.readFileSync(inputPath, 'utf8');
  const lines = content.split('\r\n');

  const obj = {};

  for (let line of lines) {
    const pair = line.split('=');
    const keyFields = pair[0].split('.');

    let parent = obj;
    keyFields.forEach((key, i) => {
      if (!parent[key]) {
        parent[key] = {};
      }
      if (i === keyFields.length - 1) {
        parent[key] = pair[1];
      }

      parent = parent[key];
    });
  }

  fs.writeFileSync(
    outputPath,
    `export default ${JSON.stringify(obj, undefined, 2)}`,
  );
}

function walkDir(source, files) {
  const dirs = fs.readdirSync(source, 'utf8');
  dirs.forEach((dir) => {
    if (fs.lstatSync(path.join(source, dir)).isDirectory()) {
      walkDir(path.join(source, dir), files);
    } else if (isProperties(dir)) {
      files.push(path.join(source, dir));
    }
  });
}

function isProperties(file) {
  return /\.properties$/.test(file);
}

function start(source) {
  const files = [];
  walkDir(source, files);
  files.forEach((file) => {
    convert(file, file.replace(/\.properties/, '.js'));
  });
}

start('./src/lang');
