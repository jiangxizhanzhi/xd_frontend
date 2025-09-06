const execFileSync = require('child_process').execFileSync;

let currentBranch = execFileSync('git', ['name-rev', '--name-only', 'HEAD'])
  .toString()
  .trim();

currentBranch = currentBranch.trim().replace('remotes/origin/', '');
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

writeFileSync('./gitlog.js', commits);
writeVersionFileSync('./public/version.json', commits);

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
  const branchLog =
    'window.top.__cy_ct_gitbranch__ = ' + JSON.stringify(currentBranch);
  let code =
    branchLog +
    ';' +
    'window.top.__cy_ct_gitlog__ = ' +
    JSON.stringify(commits);
  code = prettierCode(code);
  fs.writeFileSync(path, code);
}

function writeVersionFileSync(path, commits) {
  const jsonStr = `{"branch":"${currentBranch}","version_log":${JSON.stringify(
    commits,
  )}}`;
  fs.writeFileSync(path, jsonStr);
}
