const fs = require('fs');
const fileName = '../package.json';
const file = require(fileName);
const prettier = require('prettier');
const childProcess = require('child_process');

console.log('old version', file.version);
const oldVersion = file.version.match(/\.([0-9]+)$/)[1];

const prefix = file.version.split(oldVersion)[0];

const newVersion = prefix + (parseInt(oldVersion) + 1);
console.log('new version', newVersion);
file.version = newVersion;

fs.writeFileSync('./package.json', prettierCode(JSON.stringify(file)));
childProcess.execSync('git add .', { encoding: 'utf8' });
childProcess.execSync(
  `git commit -m "release:@cyber/ui@${newVersion}" --no-verify`,
  { encoding: 'utf8' },
);
childProcess.execSync(`git push`, { encoding: 'utf8' });

function prettierCode(code) {
  const formConfig = {
    singleQuote: false,
    parser: 'json',
    printWidth: 80,
  };
  return prettier.format(code, formConfig);
}
