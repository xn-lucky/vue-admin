<template>
  <el-card>
    <!-- <el-form :inline="true" :model="formInline" class="demo-form-inline"> -->
    <!-- 属性为true时可以简写 inline -->
    <el-form inline v-model="category" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select
          v-model="category.category1Id"
          placeholder="请选择"
          @change="category1IdChange"
          :disabled="isShow"
        >
          <el-option
            v-for="item1Id in category1List"
            :key="item1Id.id"
            :label="item1Id.name"
            :value="item1Id.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <!-- $event 是获取事件函数中默认传递的第一个值 -->
        <el-select
          v-model="category.category2Id"
          placeholder="请选择"
          @change="category2IdChange"
          :disabled="isShow"
        >
          <el-option
            v-for="item2Id in category2List"
            :key="item2Id.id"
            :label="item2Id.name"
            :value="item2Id.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="category.category3Id"
          placeholder="请选择"
          @change="category3IdChange"
          :disabled="isShow"
        >
          <el-option
            v-for="item3Id in category3List"
            :key="item3Id.id"
            :label="item3Id.name"
            :value="item3Id.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "Category",
  data() {
    return {
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  props: ["isShow"],
  computed: {
    ...mapState({
      category1List: (state) => state.category.category1List,
      category2List: (state) => state.category.category2List,
      category3List: (state) => state.category.category3List,
    }),
  },
  methods: {
    ...mapActions([
      "category/getCategory1List",
      "category/getCategory2List",
      "category/getCategory3List",
    ]),
    ...mapMutations(["category/SET_CATEGORY3_ID"]),
    category1IdChange(category1Id) {
      // 1- 清空category2Id，category3Id
      this.category.category2Id = "";
      this.category.category3Id = "";
      // 2- 一级分类改变,发送请求二级分类
      this["category/getCategory2List"](category1Id);
    },
    category2IdChange(category2Id) {
      // 1- 清空category3Id
      this.category.category3Id = "";
      // 2- 二级分类改变,发送请求三级分类
      this["category/getCategory3List"](category2Id);
    },
    category3IdChange(category3Id) {
      // 三级分类分类改变要请求数据,但是数据更新的方法在另外的组件中,所以先只更新store中的三级分类ID
      // 直接触发mutations,进行修改state中的category3Id
      this["category/SET_CATEGORY3_ID"](category3Id);
    },
  },
  mounted() {
    // 使用了命名空间 在store中写了属性 namespaced为true，引入和使用的时候加上模块的路径
    this["category/getCategory1List"]();
  },
};
</script>

<style lang="less" scoped>
</style>
