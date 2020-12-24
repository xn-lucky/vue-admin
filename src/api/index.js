export { default as login } from './acl/login' // {default: {}}
export { default as user } from './acl/user'
export { default as role } from './acl/role'
export { default as permission } from './acl/permission'
export { default as category } from './category'
export { default as clientUser } from './clientUser'
export { default as order } from './order'
export { default as trademark } from './product/trademark'
export { default as spu } from './product/spu'
export { default as sku } from './product/sku'

const context = require.context('.', true, /\.js$/)
// console.log('context.keys()', context.keys())
// 1- 首先过滤掉当前文件
const pathKeys = context.keys().filter((value) => value !== "./index.js")
// 2- 循环遍历每一项,根据/拆分
const modules = pathKeys.reduce((modules, modulePath) => {
  // modulePath 是数组的每个元素，modules将路径放到这边
  //拆分modulePath,directory=acl,fileName=login
  const [directory, fileName] = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1').split('/');
  if (fileName === 'index') {
    // modules[directory] = context(modulePath).default
    modules[directory] = context(modulePath).default
  } else {
    modules[fileName] = context(modulePath).default
  }
  return modules
}, {})
// 3- 最后将modules默认暴露出去,但是其他引入的地方也要对应修改,因为暴露方式不一样了





// console.log('pathKeys', pathKeys)
/* const modules = context.keys().reduce((modules, modulePath) => {
  // './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  modules[moduleName] = context(modulePath).default
  return modules
}, {}) */

/*
0: "./acl/login.js"
1: "./acl/permission.js"
2: "./acl/role.js"
3: "./acl/user.js"
4: "./category/index.js"
5: "./clientUser/index.js"
6: "./index.js"
7: "./order/index.js"
8: "./product/sku.js"
9: "./product/spu.js"
10: "./product/trademark.js"

*/
