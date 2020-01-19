const { override, fixBabelImports, addWebpackAlias } = require('customize-cra')
const path = require('path')
function resolve (dir) {
  return path.join(__dirname, '.', dir)
}
module.exports = override(
  // 配置路径别名
  addWebpackAlias({
    components: path.resolve(__dirname, 'src/components'),
    '@': path.resolve(__dirname, 'src')
  }),
  // antd按需加载
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css'
  })
)
