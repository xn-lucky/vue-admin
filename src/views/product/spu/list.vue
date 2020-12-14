<template>
  <div>
    <Category />
    <!-- spu列表 -->
    <SpuShowList v-if="isShowSpuList" @updShowSpuList="updShowSpuList" />
    <!-- spu添加的页面 -->
    <SpuAddForm v-else @updShowSpuList="updShowSpuList" :spu="item" />
  </div>
</template>

<script>
import Category from "@/components/Category/category";
import SpuShowList from "./SpuShowList";
import SpuAddForm from "./SpuAddForm";

export default {
  name: "SpuList",
  data() {
    return {
      isShowSpuList: true, // 用于判断展示spu列表还是添加的页面
      item: {}, // SpuShowList传给SpuAddForm组件的数据(当前修改的行数据)
    };
  },
  components: {
    Category,
    SpuShowList,
    SpuAddForm,
  },
  methods: {
    updShowSpuList(flag, row) {
      this.isShowSpuList = flag;
      if (row) {
        // 浅复制 防止修改原数据
        this.item = { ...row };
      }
    },
  },
};
</script>
