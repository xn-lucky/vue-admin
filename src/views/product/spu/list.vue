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
      :isAdd="isAdd"
    />
  </div>
</template>

<script>
import Category from "@/components/Category/category";
import SpuShowList from "./spuShowList";
import SpuAddForm from "./spuAddForm";
import SkuList from "./skuList";

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
    updShowSpuList(flag, row, isAdd) {
      this.isShowSpuList = flag;
      this.isShowSku = false;
      // 浅复制 防止修改原数据
      this.item = { ...row };
      if (typeof isAdd) {
        this.isAdd = isAdd;
      }
    },
    updShowList(category3Id) {
      this.isShowSpuList = true;
      this.isShowSku = false;
      this.isAdd = false;
      // 等组件渲染完成就发送请求
      this.$nextTick(() => {
        this.$bus.$emit("change", { category3Id });
      });
    },
    updIsShowSku(spuItem) {
      debugger;
      this.isShowSku = true;
      this.isShowSpuList = false;
      this.isAdd = false;
      this.spuItem = spuItem;
    },
  },
};
</script>
