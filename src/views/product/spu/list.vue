<template>
  <div>
    <Category :isShow="!isShowSpuList" />
    <!-- spu列表 -->
    <SpuShowList v-if="isShowSpuList" @updShowSpuList="updShowSpuList" />
    <!-- spu添加的页面 -->
    <SpuAddForm
      v-else
      @updShowSpuList="updShowSpuList"
      :spu="item"
      :isAdd="isAdd"
      @updShowList="updShowList"
    />
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
      isAdd: false,
    };
  },
  components: {
    Category,
    SpuShowList,
    SpuAddForm,
  },
  methods: {
    updShowSpuList(flag, row, isAdd) {
      this.isShowSpuList = flag;

      // 浅复制 防止修改原数据
      this.item = { ...row };
      if (isAdd) {
        this.isAdd = isAdd;
      }
    },
    updShowList(category3Id) {
      this.isShowSpuList = true;
      // 等组件渲染完成就发送请求
      this.$nextTick(() => {
        this.$bus.$emit("change", { category3Id });
      });
    },
  },
};
</script>
