<template>
  <div>
    <!-- 因为三级分类的组件是要在很多页面使用,所以封装成了一个组件, -->
    <!-- <Category
      @change-category="getAttrsList"
      @change-load="updLoading"
      @change-attrShow="updIsAttrShow"
      @change="getAttrsInfoList"
      :isShow="!isShow"
    /> -->
    <!-- <Category
      @change-attrShow="updIsAttrShow"
      @change="getAttrsInfoList"
      @clearAttrsList="clearAttrsList"
      :isShow="!isShow"
    /> -->
    <Category :isShow="!isShow" />
    <el-card v-show="isShow">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addAttr"
        :disabled="isAttrShow"
        >添加属性</el-button
      >
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
          <template v-slot="{ row, $index }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              class="handle-btn"
              @click="updAttr(row)"
            ></el-button>

            <el-popconfirm
              :title="`确认删除' ${row.attrName} ' 吗？`"
              @onConfirm="delAttrValueList(row, $index)"
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
    </el-card>

    <el-card v-show="!isShow">
      <el-form inline
        ><el-form-item label="属性名">
          <el-input
            placeholder="请输入属性名"
            v-model="attrValue.attrName"
          ></el-input> </el-form-item
      ></el-form>
      <el-button
        type="primary"
        icon="el-icon-plus"
        class="add-btn"
        @click="addAttrValue"
        :disabled="!attrValue.attrName"
        >添加属性值</el-button
      >
      <!-- 表格 -->
      <el-table
        :data="attrValue.attrValueList"
        border
        style="width: 100%"
        class="table"
      >
        <!-- type='index' 是写序号从1开始 -->
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>

        <el-table-column prop="valueName" label="属性值名称">
          <template v-slot="{ row, $index }">
            <!--   @blur="inputValue(row, $index)" -->
            <el-input
              v-if="row.edit"
              v-model="row.valueName"
              @blur="inputValue(row, $index)"
              @keyup.enter.native="row.edit = false"
              autofocus
              size="mini"
              ref="input"
            ></el-input>
            <span
              v-else
              @click="editAttr(row)"
              style="display: block; width: 100%"
              >{{ row.valueName }}</span
            >
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template v-slot="{ row, $index }">
            <el-popconfirm
              :title="`确认删除' ${row.valueName} ' 吗？`"
              @onConfirm="delConfirm($index)"
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
      <el-button type="primary" class="add-btn" @click="save">保存</el-button>
      <el-button class="add-btn" @click="isShow = true">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import Category from "@/components/Category/category";
import { mapState } from "vuex";

export default {
  name: "AttrList",
  data() {
    return {
      attrsList: [],
      isAttrShow: true, // 添加属性按钮是否可按
      loading: false, // 是否正在请求中
      isShow: true,
      // 保存修改/添加时的分类的属性列表
      attrValue: {
        attrName: "",
        attrValueList: [],
      },
      isInput: false, // 是否显示输入框
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  watch: {
    // 监视三个分类id,可以监视对象中的属性
    "category.category3Id"(category3Id) {
      if (!category3Id) return;
      // 三级Id有值 就发送请求数据
      this.getAttrsInfoList();
      // 添加属性按钮显示可按
      this.updIsAttrShow(false);
    },
    "category.category2Id"(category2Id) {
      if (!category2Id) return;
      // 清空属性列表数据
      this.clearAttrsList();
      // 添加属性按钮显示可按
      this.updIsAttrShow(true);
    },
    "category.category1Id"(category1Id) {
      if (!category1Id) return;
      // 清空属性列表数据
      this.clearAttrsList();
      // 添加属性按钮显示可按
      this.updIsAttrShow(true);
    },
  },
  components: {
    Category,
  },
  methods: {
    async delAttrValueList(row, index) {
      // console.log("attrsList", this.attrsList);
      // console.log("delete", row.id, index);
      // 删除此属性，通过id
      await this.$API.category.deleteAttr(row.id);
      // 手动更新数据，或者发送请求获取
      // 发送请求获取属性数据
      this.getAttrsInfoList(this.category);
    },
    async getAttrsInfoList() {
      this.loading = true;
      // this.category = category;
      const result = await this.$API.category.getAttrInfoList(this.category);
      if (result.code === 200) {
        this.attrsList = result.data;
        this.$message.success("获取属性数据成功");
      } else {
        this.$message.error(result.message);
      }
      this.loading = false;
    },
    // 清空数据
    clearAttrsList() {
      this.attrsList = [];
    },
    updIsAttrShow(isAttrShow) {
      this.isAttrShow = isAttrShow;
    },
    /*  updLoading(flag) {
      this.loading = flag;
    }, */
    addAttr() {
      this.isShow = false;
      // 每次点击的时候，清楚之前的内容
      this.attrValue = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category.category3Id,
        categoryLevel: 3,
      };
    },
    // 点击修改按钮 修改属性页面显示并且获取当前行的数据
    updAttr(row) {
      this.isShow = false;
      // console.log(row);
      // 深度克隆row,防止修改原数据
      this.attrValue = JSON.parse(JSON.stringify(row));
    },
    // 点击span时,给当前行数据加个edit属性为true，目的是显示input输入框
    editAttr(row) {
      this.$set(row, "edit", true);
      this.$nextTick(() => {
        // 当页面渲染完 就获取焦点
        this.$refs.input.focus();
      });
    },
    delConfirm(index) {
      // console.log(index);
      // 1- 删除按钮确认 先将页面上显示的对应的属性删掉(其实并没有删除真是数据)
      // this.attrValue.attrValueList = this.attrValue.attrValueList.filter(
      //   (attr) => attr.id !== id
      // );
      // 2- 根据下标删除
      this.attrValue.attrValueList.splice(index, 1);
    },
    // 添加属性值
    addAttrValue() {
      // console.log(111111111111);
      // 创建一个新的数据 并且焦点为这个输入框
      this.attrValue.attrValueList.push({ valueName: "", edit: true });
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    inputValue(row, index) {
      row.edit = false;
      if (!row.valueName) {
        this.attrValue.attrValueList.splice(index, 1);
      }
    },
    // 保存按钮
    async save() {
      console.log(this.attrValue);
      // return;
      // 获取所有数据 ,发送请求
      const result = await this.$API.category.saveAttrInfo(this.attrValue);
      if (result.code === 200) {
        // 发送请求获取属性数据
        this.getAttrsInfoList(this.category);
        this.isShow = true;
      } else {
        this.$message.error("出错了~");
      }
    },
  },
  mounted() {
    /*
       @change="getAttrsInfoList"
       @clearAttrsList="clearAttrsList"
    */
    // 绑定事件
    // this.$bus.$on("change", this.getAttrsInfoList);
    // this.$bus.$on("clearAttrsList", this.clearAttrsList);
  },
  beforeDestroy() {
    // 全局事件总线, 一定要做收尾工作,否则会出现绑定多个相同事件
    // this.$bus.$off("change", this.getAttrsInfoList);
    // this.$bus.$off("clearAttrsList", this.clearAttrsList);
  },
};
</script>
<style lang="sass">
.handle-btn
  width: 45px
  height: 28px
  font-size: 13px
  padding: 0
.add-btn
  margin: 20px 0
</style>
