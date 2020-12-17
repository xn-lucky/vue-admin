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
          <!-- 将category信息传过去和当前行的spu名称等数据 -->
          <el-button
            type="primary"
            icon="el-icon-plus"
            class="handle-btn"
            @click="$emit('updIsShowSku', { ...row, ...category })"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            class="handle-btn"
            @click="$emit('updShowSpuList', false, row, false)"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            class="handle-btn"
            @click="findBySpuId(row)"
          ></el-button>

          <el-popconfirm
            :title="`确认删除 '${row.spuName}'  吗？`"
            @onConfirm="delSpu(row.id)"
          >
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

    <!-- spu的Sku详情 -->
    <el-dialog :title="`${spuName} => SKU列表`" :visible.sync="isSkuListInfo">
      <el-table :data="spuSkuList">
        <el-table-column
          prop="skuName"
          label="名称"
          width="150"
        ></el-table-column>
        <el-table-column prop="price" label="价格(元)"></el-table-column>
        <el-table-column prop="weight" label="重量(千克)"></el-table-column>
        <el-table-column label="默认图片">
          <template v-slot="{ row }">
            <img :src="row.skuDefaultImg" alt="" style="width: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-card>
</template>

<script>
/*
  因为数据是在spushowlist组件中，并且分页也在，所以更新数据的方法放在此组件中
  请求数据需要admin/product/1/3?category3Id=61
*/
import { mapState } from "vuex";

export default {
  name: "SpuShowList",
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      spuList: [], // spuList展示当前页的数据

      // category: {
      //   category1Id: "",
      //   category2Id: "",
      //   category3Id: "",
      // },
      loading: false, // 是否正在发送请求
      isSkuListInfo: false,
      spuSkuList: [], // 某spu下的sku列表
      spuName: "", //保存当前spu的名称
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  watch: {
    // 监视三个分类id,可以监视对象中的属性
    "category.category3Id": {
      handler(category3Id) {
        if (!category3Id) return;
        // 三级Id有值 就发送请求数据
        this.getSpuInfoList();
      },
      immediate: true, // 一上来就触发获取请求数据
    },
    "category.category2Id"(category2Id) {
      if (!category2Id) return;
      // 清空属性列表数据
      this.clearAttrsList();
    },
    "category.category1Id"(category1Id) {
      if (!category1Id) return;
      // 清空属性列表数据
      this.clearAttrsList();
    },
  },
  methods: {
    // 点击获取spu下的sku列表
    async findBySpuId(row) {
      this.isSkuListInfo = true;
      this.spuName = row.spuName;
      // 获取sku列表
      // console.log(row);
      // 发送请求
      const result = await this.$API.sku.findBySpuId(row.id);
      if (result.code === 200) {
        this.spuSkuList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    // 删除Spu
    async delSpu(spuId) {
      const result = await this.$API.spu.deleteSpu(spuId);
      if (result.code === 200) {
        this.getSpuInfoList();
      } else {
        this.$message.error(result.message);
      }
    },
    async getSpuInfoList() {
      this.loading = true;
      // category是Category传过来的参数
      // this.category = category;
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
      // this.category = {
      //   category1Id: "",
      //   category2Id: "",
      //   category3Id: "",
      // };
    },
    // 页面显示条数改变
    handleSizeChange(size) {
      this.limit = size;
      // 重新发送请求
      this.getSpuInfoList();
    },
    // 当前页改变
    handleCurrentChange(page) {
      this.page = page;
      // 重新发送请求
      this.getSpuInfoList();
    },
  },
  mounted() {
    // 绑定获取当前页面的事件
    // this.$bus.$on("change", this.getSpuInfoList);
    // this.$bus.$on("clearAttrsList", this.clearAttrsList);
  },
  beforeDestroy() {
    // 全局事件总线绑定后一定要销毁
    // this.$bus.$off("change", this.getSpuInfoList);
    // this.$bus.$off("clearAttrsList", this.clearAttrsList);
  },
};
</script>

<style lang="less" scoped>
</style>
