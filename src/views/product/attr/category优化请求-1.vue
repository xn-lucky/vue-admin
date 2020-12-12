<template>
  <el-card>
    <!-- <el-form :inline="true" :model="formInline" class="demo-form-inline"> -->
    <!-- 属性为true时可以简写 inline -->
    <el-form inline v-model="category" class="demo-form-inline">
      <el-form-item label="一级分类">
        <!-- <el-select
            v-model="category.category1Id"
            placeholder="请选择"
            @change="category1IdChange"
          > -->
        <el-select
          v-model="category.category1Id"
          placeholder="请选择"
          @change="category1IdChange"
        >
          <el-option
            v-for="item1Id in category.category1List"
            :key="item1Id.id"
            :label="item1Id.name"
            :value="item1Id.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <!-- <el-select
            v-model="category.category2Id"
            placeholder="请选择"
            @change="category2IdChange"
          > -->
        <el-select
          v-model="category.category2Id"
          placeholder="请选择"
          @change="category2IdChange"
        >
          <el-option
            v-for="item2Id in category.category2List"
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
        >
          <el-option
            v-for="item3Id in category.category3List"
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
export default {
  name: "Category",
  data() {
    return {
      category: {
        category1List: [],
        category2List: [],
        category3List: [],
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  methods: {
    category1IdChange(value) {
      // 一级分类改变要清空二级分类和三级分类的值
      this.category.category2Id = "";
      this.category.category3Id = "";
      this.category.category2List = [];
      this.category.category3List = [];
      // 一级分类改变 也要将table中的数据清空
      this.$emit("change-category", []);

      this.publicGetCategory(2, value);
      /* // 一级分类的选项改变时,要发送请求 对应的二级分类 value值是value1Id选中的一级分类的id
      const result = await this.$API.category.getCategorys2(value);
      // console.log("result2", result);
      if (result.code === 200) {
        this.category.category2List = result.data;
      } else {
        this.$message.error("获取二级分类列表失败~");
      } */
    },
    category2IdChange(value) {
      // 一级分类改变要清空二级分类和三级分类的值
      this.category.category3Id = "";
      this.category.category3List = [];
      // 二级分类改变 也要将table中的数据清空
      this.$emit("change-category", []);

      this.publicGetCategory(3, value);
      /*     // 二级分类的选项改变时,要发送请求 对应的三级分类 value值是value1Id选中的二级分类的id
      // console.log("value2", value);
      const result = await this.$API.category.getCategorys3(value);

      if (result.code === 200) {
        this.category.category3List = result.data;
      } else {
        this.$message.error("获取三级分类列表失败~");
      } */
    },
    async category3IdChange() {
      // 三级分类改变发送请求所有的属性数据
      const { category1Id, category2Id, category3Id } = this.category;
      if (!category1Id || !category2Id || !category3Id) {
        return;
      }
      // 发送请求
      // this.loading = true;
      this.$emit("change-load", true);
      const result = await this.$API.category.getAttrInfoList({
        category1Id,
        category2Id,
        category3Id,
      });
      // console.log("attrinfo", result);
      if (result.code === 200) {
        // this.attrsList = result.data;
        // 触发父组件传过来的自定义事件
        this.$emit("change-category", result.data);
      } else {
        this.$message.error("获取数据失败~");
      }
      // 发送请求结束
      // this.loading = false;
      this.$emit("change-load", false);
    },
    // 公共代码
    async publicGetCategory(id, value) {
      // 请求汇总(一级二级三级请求)
      const result = await this.$API.category[`getCategorys${id}`](value);
      // console.log("result", result);
      if (result.code === 200) {
        this.category[`category${id}List`] = result.data;
      } else {
        this.$message.error(`获取${id}级分类列表失败~`);
      }
    },
  },
  mounted() {
    this.publicGetCategory(1);
    // 首先获取一级分类的列表
    /*   const result = await this.$API.category.getCategorys1();
    // console.log("result", result);
    if (result.code === 200) {
      this.category.category1List = result.data;
    } else {
      this.$message.error("获取一级分类列表失败~");
    } */
  },
};
</script>

<style lang="less" scoped>
</style>
