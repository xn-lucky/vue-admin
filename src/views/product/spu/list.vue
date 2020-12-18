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
  </div>
</template>

<script>
import Category from "@/components/Category/category";
import SpuShowList from "./spuShowList";
import SpuAddForm from "./spuAddForm";
import SkuList from "./skuList";
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
    };
  },
  components: {
    Category,
    SpuShowList,
    SpuAddForm,
    SkuList,
  },
  methods: {
    ...mapMutations(["category/RESET_CATEGORY_ID"]),
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
