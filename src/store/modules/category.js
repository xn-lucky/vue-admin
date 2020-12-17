/*
  保存三级分类数据
*/
import * as API from '@/api'
import { Message } from 'element-ui';

export default {
  namespaced: true,//命名空间
  state: {
    category: {
      category1Id: "",
      category2Id: "",
      category3Id: "",
    },
    category1List: [],
    category2List: [],
    category3List: [],
  },
  actions: {
    /* 请求一级分类下拉数据 */
    async getCategory1List({ commit }) {
      const result = await API.category.getCategorys1();
      if (result.code === 200) {
        // Message.success('获取一级列表成功~')
        commit('SET_CATEGORY_1LIST', result.data)
      } else {
        Message.error(result.message)
      }
    },
    /*
    请求二级分类下拉数据
      1- 一级分类改变请求二级分类下拉数据，并保存一级分类id，
      2- 不管成功还是失败，清空二级分类Id和三级分类Id(所以这边mutation分了成功和失败两个函数处理)
    */
    async getCategory2List({ commit }, category1Id) {
      const result = await API.category.getCategorys2(category1Id);
      if (result.code === 200) {
        // Message.success('获取二级列表成功~')
        commit('SET_CATEGORY_2LIST_SUCCESS', { category1Id, category2List: result.data })
      } else {
        Message.error(result.message)
        commit('SET_CATEGORY_2LIST_ERROR')
      }
    },
    /*
    请求三级分类下拉数据
      1- 二级分类改变请求三级分类下拉数据，并保存二级分类id
      2- 不管成功还是失败，清空三级分类Id(所以这边mutation分了成功和失败两个函数处理)
     */
    async getCategory3List({ commit }, category2Id) {
      const result = await API.category.getCategorys3(category2Id);
      if (result.code === 200) {
        // Message.success('获取三级列表成功~')
        commit('SET_CATEGORY_3LIST_SUCCESS', { category2Id, category3List: result.data })
      } else {
        Message.error(result.message)
        commit('SET_CATEGORY_3LIST_ERROR')
      }
    }
  },
  mutations: {
    SET_CATEGORY_1LIST(state, category1List) {
      state.category1List = category1List;
    },
    SET_CATEGORY_2LIST_SUCCESS(state, { category1Id, category2List }) {
      state.category.category1Id = category1Id;
      state.category2List = category2List;
      // 清空
      state.category.category2Id = '';
      state.category.category3Id = '';
      state.category3List = '';
    },
    SET_CATEGORY_2LIST_ERROR(state) {
      // 清空
      state.category.category2Id = '';
      state.category.category3Id = '';
      state.category3List = '';
    },
    SET_CATEGORY_3LIST_SUCCESS(state, { category2Id, category3List }) {
      state.category.category2Id = category2Id;
      state.category3List = category3List;
      // 清空
      state.category.category3Id = '';
    },
    SET_CATEGORY_3LIST_ERROR(state) {
      // 清空
      state.category.category3Id = '';
    },
    SET_CATEGORY3_ID(state, category3Id) {
      state.category.category3Id = category3Id;
    }
  }
}
