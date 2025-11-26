const gitlog = require('gitlog').default;
const fs = require('fs');

const prettier = require('prettier');

const options = {
  repo: './',
  number: 5,
  nameStatus: false,
  fields: ['hash', 'abbrevHash', 'subject', 'authorName', 'authorDate'],
};
let commits = [];
try {
  commits = gitlog(options);
} catch (error) {}

writeFileSync('./src/gitlog.js', commits);

function prettierCode(code) {
  const formConfig = {
    semi: true,
    parser: 'babel',
    singleQuote: true,
    printWidth: 80,
  };
  return prettier.format(code, formConfig);
}

function writeFileSync(path, commits) {
  let code = 'window.__cyber_ui_log__ =  ' + JSON.stringify(commits);
  code = prettierCode(code);
  fs.writeFileSync(path, code);
}
