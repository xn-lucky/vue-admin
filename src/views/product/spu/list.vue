<template>
  <div>
    <Category :isShow="!isShowSpuList" v-show="!isShowSku" />
    <!-- 添加sku页面 -->
    <SkuList v-if="isShowSku" :spuItem="spuItem" @updShowList="updShowList" />
    <!-- spu列表 -->
    <SpuShowList
      v-if="isShowSpuList"
      @updShowSpuList="updShowSpuList"
      @updIsShowSku="updIsShowSku"
    />

    <!-- spu添加的页面 -->
    <SpuAddForm
      v-if="!isShowSpuList && !isShowSku"
      :spu="item"
      @updShowSpuList="updShowSpuList"
      @updShowList="updShowList"
      @cancelShow="cancelShow"
      :isAdd="isAdd"
    />
    <div>
      <el-input
        v-if="show"
        v-model="num"
        size="mini"
        autofocus
        @blur="show = false"
        ref="input"
      ></el-input>
      <span v-else @click="clickSpan">点我</span>
      <p>{{ num }}</p>
      <p>{{ count }}</p>
      <!--
        :num.sync='count'// 传过去的是num参数,值为count ,修改数据的方法是update:num,修改的值是我传过去的值count
        :num.sync='count'相当于 给子组件绑定了@update:num方法  <Child :num="count" @update:num='count++'></Child>
         自定义事件子向父传递数据,修改父组件中的数据
        <Child @updNum="updNum"></Child> -->
      <!-- <Child :num.sync="count"></Child> -->
      <Child :num="count" @update:num="count++"></Child>
    </div>
  </div>
</template>

<script>
import Category from "@/components/Category/category";
import SpuShowList from "./spuShowList";
import SpuAddForm from "./spuAddForm";
import SkuList from "./skuList";
import Child from "./Child";
import { mapMutations } from "vuex";

export default {
  name: "SpuList",
  data() {
    return {
      isShowSpuList: true, // 用于判断展示spu列表还是添加的页面
      item: {}, // SpuShowList传给SpuAddForm组件的数据(当前修改的行数据)
      isAdd: false, // 判断是否是增加spu还是修改spu
      isShowSku: false, // 判断是否显示增加sku的页面
      spuItem: {},

      num: 0, //测试用的
      count: 3, //测试用的
      show: false, //测试用的
    };
  },
  components: {
    Category,
    SpuShowList,
    SpuAddForm,
    SkuList,
    Child,
  },
  methods: {
    ...mapMutations(["category/RESET_CATEGORY_ID"]),
    clickSpan() {
      this.show = true;
      /*   this.$nextTick(() => {
        this.$refs.input.focus();
      }); */
    },
    // 修改num的方法
    updNum(count) {
      this.num += count;
    },
    updShowSpuList(flag, row, isAdd) {
      this.isShowSpuList = flag;
      this.isShowSku = false;
      // 浅复制 防止修改原数据
      this.item = { ...row };
      if (typeof isAdd) {
        this.isAdd = isAdd;
      }
    },
    updShowList() {
      this.isShowSpuList = true;
      this.isShowSku = false;
      this.isAdd = false;
      // 等组件渲染完成就发送请求
      /*   this.$nextTick(() => {
        this.$bus.$emit("change", { category3Id });
      }); */
    },
    updIsShowSku(spuItem) {
      this.isShowSku = true;
      this.isShowSpuList = false;
      this.isAdd = false;
      this.spuItem = spuItem;
    },
    cancelShow() {
      this.isShowSku = false;
      this.isShowSpuList = true;
    },
  },
  /* 在spu组件卸载的时候,将categoryId清空,防止跳到下一个页面(路由地址不一样的组件)时,发送请求 */
  beforeDestroy() {
    // console.log(this.$store);
    this["category/RESET_CATEGORY_ID"]();
  },
};
</script>
