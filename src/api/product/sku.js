/*
  sku的请求
*/
import request from '@/utils/request'
const BASE_URL = '/admin/product'
export default {
  /*
    获取此spu下的所有Sku列表
    GET /admin/product/findBySpuId/{spuId}
  */
  findBySpuId(spuId) {
    return request({
      method: 'GET',
      url: `${BASE_URL}/findBySpuId/${spuId}`
    })
  }
}
