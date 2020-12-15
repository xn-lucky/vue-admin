/*
  spu的请求
*/

import request from '@/utils/request'
const BASE_URL = '/admin/product'

export default {
  /*
  分页获取spu数据
   GET /admin/product/{page}/{limit}

*/
  getSpuList(page, limit, category3Id) {
    return request({
      method: 'GET',
      url: `${BASE_URL}/${page}/${limit}?category3Id=${category3Id}`
    })
  },
  /*
  获取品牌数据列表
  GET /admin/product/baseTrademark/getTrademarkList
*/
  getTrademarkList() {
    return request({
      method: 'GET',
      url: `${BASE_URL}/baseTrademark/getTrademarkList`
    })
  },
  /*
  获取销售属性列表
 GET /admin/product/baseSaleAttrList
*/
  getBaseSaleAttrList() {
    return request({
      method: 'GET',
      url: `${BASE_URL}/baseSaleAttrList`
    })
  },
  /*
  获取某个spu下的图片列表
GET /admin/product/spuImageList/{spuId}
*/
  getSpuImageList(spuId) {
    return request({
      method: 'GET',
      url: `${BASE_URL}/spuImageList/${spuId}`
    })
  },
  /*
  获取某个spu下的属性列表
GET /admin/product/spuSaleAttrList/{spuId}
*/
  getSpuSaleAttrList(spuId) {
    return request({
      method: 'GET',
      url: `${BASE_URL}/spuSaleAttrList/${spuId}`
    })
  },
  /*
  保存(修改)spu
POST /admin/product/updateSpuInfo
*/
  updateSpuInfo(data) {
    return request({
      method: 'POST',
      url: `${BASE_URL}/updateSpuInfo/`,
      data
    })
  },
  /*
  增加spu
POST /admin/product/saveSpuInfo
*/
  saveSpuInfo(data) {
    return request({
      method: 'POST',
      url: `${BASE_URL}/saveSpuInfo`,
      data
    })
  },
  /*
  删除spu
DELETE /admin/product/deleteSpu/{spuId}
*/
  deleteSpu(spuId) {
    return request({
      method: 'DELETE',
      url: `${BASE_URL}/deleteSpu/${spuId}`,
    })
  },

}
