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
  },

  /*
获取属性的属性值列表（暂时没有用）
*/
  getAttrValueList(attrId) {
    /*  return request({
       url: `${BASE_URL}/getAttrValueList/${attrId}`,
       method: "GET"
     }); */
    return request.get(`${BASE_URL}/getAttrValueList/${attrId}`)

  },

  /*
    增加（保存）属性 POST /admin/product/saveAttrInfo
  */
  saveAttrInfo(attr) {
    return request({
      method: 'POST',
      url: `${BASE_URL}/saveAttrInfo`,
      data: attr
    })

    // return request.post(`${BASE_URL}/saveAttrInfo`, { data: attr })
  },

  /*
    删除属性 DELETE /admin/product/deleteAttr/{attrId}
  */
  deleteAttr(attrId) {
    return request({
      method: 'DELETE',
      url: `${BASE_URL}/deleteAttr/${attrId}`
    })
  }
}
