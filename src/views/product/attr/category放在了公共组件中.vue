<template>
  <el-card>
    <!-- <el-form :inline="true" :model="formInline" class="demo-form-inline"> -->
    <!-- 属性为true时可以简写 inline -->
    <el-form inline v-model="category" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select
          v-model="category.category1Id"
          placeholder="请选择"
          @change="categoryIdChange(2, $event)"
          :disabled="isShow"
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
        <!-- $event 是获取事件函数中默认传递的第一个值 -->
        <el-select
          v-model="category.category2Id"
          placeholder="请选择"
          @change="categoryIdChange(3, $event)"
          :disabled="isShow"
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
          :disabled="isShow"
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
  props: ["isShow"],
  methods: {
    categoryIdChange(id, value) {
      // console.log(id, value); // 1,2
      // id为2 说明是一级分类，但是请求的是2级分类 value是选中的一级分类的category1Id

      // 一级分类改变要清空二级分类和三级分类的值 // 二级分类改变要清空三级分类的值
      this.category[`category${id}Id`] = "";
      this.category[`category${id}List`] = "";
      if (id === 2) {
        this.category[`category${id + 1}Id`] = "";
        this.category[`category${id + 1}List`] = "";
      }

      // 一级分类/二级分类改变 也要将table中的数据清空
      this.$emit("change-category", []);
      // 一级分类和二级分类一修改，属性按钮就变灰
      this.$emit("change-attrShow", true);
      // 发送请求
      this.publicGetCategory(id, value);
      // 一级二级分类改变要清空属性数据
      this.$emit("clearAttrsList");
    },
    async category3IdChange() {
      // 三级分类改变发送请求所有的属性数据
      const { category1Id, category2Id, category3Id } = this.category;
      if (!category1Id || !category2Id || !category3Id) {
        return;
      }
      // 发送请求
      // this.loading = true;
      // this.$emit("change-load", true);
      // // 请求数据
      // // await this.publicGetCategory(null, {
      // //   category1Id,
      // //   category2Id,
      // //   category3Id,
      // // });
      // this.$emit("change-load", false);
      // 触发添加属性按钮显示
      this.$emit("change-attrShow", false);
      // 触发父组件函数，获取全部数据
      this.$emit("change", {
        category1Id,
        category2Id,
        category3Id,
      });
    },
    // 公共代码
    async publicGetCategory(id, value) {
      let result = await this.$API.category[`getCategorys${id}`](value);
      /* if (!id) {
        result = await this.$API.category.getAttrInfoList(value);
      } else {
        // 请求汇总(一级二级三级请求)
        result
      } */

      // console.log("result", result);
      if (result.code === 200) {
        /*    if (!id) {
          // this.attrsList = result.data;
          // 触发父组件传过来的自定义事件
          this.$emit("change-category", result.data);
        } else {
          this.category[`category${id}List`] = result.data;
        } */
        this.category[`category${id}List`] = result.data;
      } else {
        this.$message.error(`获取数据失败~`);
      }
    },
  },
  mounted() {
    this.publicGetCategory(1);
  },
};
</script>

<style lang="less" scoped>
</style>
