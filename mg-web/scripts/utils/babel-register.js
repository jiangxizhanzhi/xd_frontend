/**
 * 注册 @babel/register
 * @param only
 */
exports.default = function (only) {
  require('@babel/register')({
    presets: ['@babel/preset-env'],
    ignore: [/node_modules/],
    extensions: ['.js'],
    babelrc: false,
    cache: false,
    only,
  });
};
