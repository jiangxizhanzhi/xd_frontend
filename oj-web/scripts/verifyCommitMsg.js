/* eslint-disable */
const fs = require('fs');
const chalk = require('chalk');

const msg = fs.readFileSync(process.env.GIT_PARAMS, 'utf-8').trim();
const prefixes = [
  'build',
  'ci',
  'docs',
  'feat',
  'fix',
  'perf',
  'refactor',
  'test',
  'chore',
  'release',
];
const VERSION_MSG_RE = /v\d+\.\d+\.\d+/;
const MERGE_MSG_RE = /^Merge.*/;
const COMMIT_MSG_RE = new RegExp(
  `^(revert: )?(${prefixes.join('|')})(\\(.*\\))?: .{1,50}`,
);
if (!VERSION_MSG_RE.test(msg) && !MERGE_MSG_RE && !COMMIT_MSG_RE.test(msg)) {
  console.log();
  console.log(`🚫 ${chalk.red('无效的提交信息格式')}`);
  console.log(`🛎 ${chalk.yellow(`提交信息必须以${prefixes.join('、')}开头`)}`);
  console.log(`✅  例如：${chalk.green('feat: initial commit (Closes #1)')}`);
  process.exit(1);
}
