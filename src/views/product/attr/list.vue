<template>
  <div>
    <!-- 因为三级分类的组件是要在很多页面使用,所以封装成了一个组件, -->
    <Category @change-category="getAttrsList" @change-load="updLoading" />
    <el-card v-show="isShow">
      <el-button type="primary" icon="el-icon-plus">添加属性</el-button>
      <!-- 表格 -->
      <el-table
        :data="attrsList"
        border
        style="width: 100%"
        class="table"
        v-loading="loading"
      >
        <!-- type='index' 是写序号从1开始 -->
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template v-slot="scope">
            <!-- 通过scope可以获取到行和列等数据 scope.row获取的是这一行的数据,scope.column获取的是这一列的数据 -->
            <el-tag
              class="tag"
              v-for="attrValue in scope.row.attrValueList"
              :key="attrValue.id"
              >{{ attrValue.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template>
            <el-button
              type="warning"
              icon="el-icon-edit"
              class="handle-btn"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              class="handle-btn"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card v-show="!isShow">
      <el-form inline
        ><el-form-item label="属性名" prop="tmName">
          <el-input></el-input> </el-form-item
      ></el-form>
      <el-button type="primary" icon="el-icon-plus" class="add-btn"
        >添加属性值</el-button
      >
      <!-- 表格 -->
      <el-table :data="attrsList" border style="width: 100%" class="table">
        <!-- type='index' 是写序号从1开始 -->
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性值名称"> </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="danger"
              icon="el-icon-delete"
              class="handle-btn"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" class="add-btn">保存</el-button>
      <el-button class="add-btn">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import Category from "./category";

export default {
  name: "AttrList",
  data() {
    return {
      attrsList: [],
      loading: false, // 是否正在请求中
      isShow: false,
    };
  },
  components: {
    Category,
  },
  methods: {
    getAttrsList(attrList) {
      this.attrsList = attrList;
    },
    updLoading(flag) {
      this.loading = flag;
    },
  },
};
</script>
<style lang="sass">
.handle-btn
  width: 45px
  height: 28px
  font-size: 13px
  padding: 0
.tag
  margin-right: 10px
.add-btn
  margin: 20px 0
</style>
