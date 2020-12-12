import request from '@/utils/request'

const BASE_URL = '/admin/product'

export default {

  /*
  查找一级分类列表
  */
  getCategorys1() {
    /* return request({
      url: '/admin/product/getCategory1',
      method: 'get'
    }) */
    // 修改为request.xxx()
    return request.get(`${BASE_URL}/getCategory1`)
  },

  /*
  查找二级分类列表
  */
  getCategorys2(category1Id) {
    /* return request({
      url: '/admin/product/getCategory2/' + category1Id,
      method: 'get'
    }) */
    return request.get(`${BASE_URL}/getCategory2/${category1Id}`)
  },

  /*
  查找三级分类列表
  */
  getCategorys3(category2Id) {
    /* return request({
      url: '/admin/product/getCategory3/' + category2Id,
      method: 'get'
    }) */
    return request.get(`${BASE_URL}/getCategory3/${category2Id}`)
  },
  /*
   查找符合条件的数据(一级二级三级)
   /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  */
  getAttrInfoList({ category1Id, category2Id, category3Id }) {
    /* return request({
      method: 'GET',
      url: `${BASE_URL}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
    }) */
    return request.get(`${BASE_URL}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  }
}
