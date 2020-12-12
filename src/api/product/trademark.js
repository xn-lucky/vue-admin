/*
  品牌数据API接口
*/
import request from '@/utils/request'
// 公共的地址
const api_name = '/admin/product/baseTrademark'

export default {
  /*
    获取品牌数据通过id  GET /admin/product/baseTrademark/get/{id}
  */
  getTradeMarkById(id) {
    return request({
      method: 'GET',
      url: `${api_name}/get/${id}`
    })
  },
  /*
    获取品牌数据(参数page:当前页 limit:每页显示的条数)
  */
  getPageList(page, limit) {
    return request({
      method: 'GET',
      url: `${api_name}/${page}/${limit}`
    })
  },
  /*
   添加品牌数据 POST /admin/product/baseTrademark/save
  */
  addTradeMark(data) {
    return request({
      method: 'POST',
      url: `${api_name}/save`,
      data
    })
  },
  /*
   修改品牌数据 PUT /admin/product/baseTrademark/update
  */
  updTradeMark(data) {
    return request({
      method: 'PUT',
      url: `${api_name}/update`,
      data
    })
  },
  /*
   删除品牌数据  /admin/product/baseTrademark/remove/{id}
  */
  delTradeMark(id) {
    return request({
      method: 'DELETE',
      url: `${api_name}/remove/${id}`,
    })
  },

}
