<template>
  <el-card style="margin-top: 20px">
    <el-button
      type="primary"
      icon="el-icon-plus"
      @click="$emit('updShowSpuList', false, category, true)"
      :disabled="!this.category.category3Id"
      >添加SPU</el-button
    >
    <!-- 表格 -->
    <el-table
      :data="spuList"
      border
      style="width: 100%"
      class="table"
      v-loading="loading"
    >
      <!-- type='index' 是写序号从1开始 -->
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
      <el-table-column prop="description" label="SPU描述"> </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button
            type="primary"
            icon="el-icon-plus"
            class="handle-btn"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            class="handle-btn"
            @click="$emit('updShowSpuList', false, row)"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            class="handle-btn"
          ></el-button>

          <el-popconfirm :title="`确认删除 吗？`">
            <el-button
              type="danger"
              icon="el-icon-delete"
              class="handle-btn"
              slot="reference"
            ></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--

     -->
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      layout="prev, pager, next, jumper,sizes,total"
      :total="total"
    >
    </el-pagination>
  </el-card>
</template>

<script>
/*
  因为数据是在spushowlist组件中，并且分页也在，所以更新数据的方法放在此组件中
  请求数据需要admin/product/1/3?category3Id=61
*/
export default {
  name: "SpuShowList",
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      spuList: [], // spuList展示当前页的数据

      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      loading: false, // 是否正在发送请求
    };
  },
  methods: {
    async getSpuInfoList(category) {
      this.loading = true;
      // category是Category传过来的参数
      this.category = category;
      // 若三级分类改变,则发送请求获取对应数据
      const result = await this.$API.spu.getSpuList(
        this.page,
        this.limit,
        this.category.category3Id
      );
      // console.log(result);
      if (result.code === 200) {
        this.spuList = result.data.records;
        this.page = result.data.current;
        this.limit = result.data.size;
        this.total = result.data.total;
      }
      this.loading = false;
    },
    clearAttrsList() {
      this.spuList = [];
      // 清完数组,category也是要清下的
      this.category = {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      };
    },
    // 页面显示条数改变
    handleSizeChange(size) {
      this.limit = size;
      // 重新发送请求
      this.getSpuInfoList(this.category);
    },
    // 当前页改变
    handleCurrentChange(page) {
      this.page = page;
      // 重新发送请求
      this.getSpuInfoList(this.category);
    },
  },
  mounted() {
    // 绑定获取当前页面的事件
    this.$bus.$on("change", this.getSpuInfoList);
    this.$bus.$on("clearAttrsList", this.clearAttrsList);
  },
  beforeDestroy() {
    // 全局事件总线绑定后一定要销毁
    this.$bus.$off("change", this.getSpuInfoList);
    this.$bus.$off("clearAttrsList", this.clearAttrsList);
  },
};
</script>

<style lang="less" scoped>
</style>
