/*
  sku的请求
*/
import request from '@/utils/request';
const BASE_URL = '/admin/product';
export default {
	/*
    获取此spu下的所有Sku列表
    GET /admin/product/findBySpuId/{spuId}
  */
	findBySpuId(spuId) {
		return request({
			method: 'GET',
			url: `${BASE_URL}/findBySpuId/${spuId}`
		});
	},
	/* 
  修改sku信息
  POST /admin/product/updateSkuInfo
  */
	updateSkuInfo(data) {
		return request({
			method: 'POST',
			url: `${BASE_URL}/updateSkuInfo`,
			data
		});
	},
	/* 
  增加sku信息
   POST /admin/product/saveSkuInfo
  */
	saveSkuInfo(data) {
		return request({
			method: 'POST',
			url: `${BASE_URL}/saveSkuInfo`,
			data
		});
	}
};
