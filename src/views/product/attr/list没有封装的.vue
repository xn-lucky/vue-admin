<template>
  <div>
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
    <el-card style="margin-top: 20px">
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
              v-for="attrValue in scope.row.attrValueList"
              :key="attrValue.id"
              type="info"
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
  </div>
</template>

<script>
export default {
  name: "AttrList",
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
      attrsList: [],
      loading: false, // 是否正在请求中
    };
  },
  methods: {
    async category1IdChange(value) {
      // 一级分类改变要清空二级分类和三级分类的值
      this.category.category2Id = "";
      this.category.category3Id = "";
      // 一级分类改变 也要将table中的数据清空
      this.attrsList = [];

      // 一级分类的选项改变时,要发送请求 对应的二级分类 value值是value1Id选中的一级分类的id
      const result = await this.$API.category.getCategorys2(value);
      // console.log("result2", result);
      if (result.code === 200) {
        this.category.category2List = result.data;
      } else {
        this.$message.error("获取二级分类列表失败~");
      }
    },
    async category2IdChange(value) {
      // 一级分类改变要清空二级分类和三级分类的值
      this.category.category3Id = "";
      // 二级分类改变 也要将table中的数据清空
      this.attrsList = [];

      // 二级分类的选项改变时,要发送请求 对应的三级分类 value值是value1Id选中的二级分类的id
      // console.log("value2", value);
      const result = await this.$API.category.getCategorys3(value);

      if (result.code === 200) {
        this.category.category3List = result.data;
      } else {
        this.$message.error("获取三级分类列表失败~");
      }
    },
    async category3IdChange() {
      // 三级分类改变发送请求所有的属性数据
      const { category1Id, category2Id, category3Id } = this.category;
      if (!category1Id || !category2Id || !category3Id) {
        return;
      }
      // 发送请求
      this.loading = true;
      const result = await this.$API.category.getAttrInfoList({
        category1Id,
        category2Id,
        category3Id,
      });
      // console.log("attrinfo", result);
      if (result.code === 200) {
        this.attrsList = result.data;
      } else {
        this.$message.error("获取数据失败~");
      }
      // 发送请求结束
      this.loading = false;
    },
  },
  async mounted() {
    // 首先获取一级分类的列表
    const result = await this.$API.category.getCategorys1();
    // console.log("result", result);
    if (result.code === 200) {
      this.category.category1List = result.data;
    } else {
      this.$message.error("获取一级分类列表失败~");
    }
  },
};
</script>
<style lang="sass">
.handle-btn
  width: 45px
  height: 28px
  font-size: 13px
  padding: 0
</style>
