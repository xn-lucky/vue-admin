<template>
  <el-card style="margin-top: 20px">
    <el-form label-width="80px" :model="sku">
      <el-form-item label="SPU名称">
        <span>{{ spuItem.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU名称" prop="skuName">
        <el-input placeholder="请输入SKU名称" v-model="sku.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)" prop="price">
        <el-input type="number" placeholder="SKU价格" v-model="sku.price">
        </el-input>
      </el-form-item>
      <el-form-item label="重量(千克)" prop="weight">
        <el-input
          type="number"
          placeholder="SKU重量"
          v-model="sku.weight"
        ></el-input>
      </el-form-item>
      <el-form-item label="规格描述" prop="description">
        <el-input
          type="textarea"
          placeholder="SKU规格描述"
          v-model="sku.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <div v-for="(attr, index) in attrInfoList" :key="index" class="attr">
          <span>{{ attr.attrName }}</span>
          <el-select placeholder="请输入" v-model="sku.attrId">
            <el-option
              v-for="spuAttr in attr.attrValueList"
              :key="spuAttr.attrId"
              :label="spuAttr.valueName"
              :value="spuAttr.attrId"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="销售属性">
        <div v-for="(sale, index) in saleAttrList" :key="index" class="attr">
          <span>{{ sale.saleAttrName }}</span>
          <el-select placeholder="请输入" v-model="sku.saleAttrId">
            <el-option
              v-for="spuSale in sale.spuSaleAttrValueList"
              :key="spuSale.id"
              :label="spuSale.saleAttrValueName"
              :value="spuSale.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <!--
        prop用来做表单校验的
       -->
      <el-form-item label="图片列表" prop="saleAttr">
        <el-table
          class="table"
          border
          style="width: 100%; margin: 20px 0"
          ref="multipleTable"
          :data="imgList"
        >
          <el-table-column type="selection" width="80px"> </el-table-column>
          <el-table-column prop="saleAttrName" label="图片">
            <template v-slot="{ row }">
              <img :src="row.imgUrl" alt="" style="width: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"> </el-table-column>
          <el-table-column label="操作"> </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button @click="$emit('updShowList', spuItem.category3Id)"
          >取消</el-button
        ></el-form-item
      >
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "SkuList",
  data() {
    return {
      attrInfoList: [], // 平台属性
      saleAttrList: [], // 销售属性
      imgList: [], // 图片列表
      sku: {},
    };
  },
  props: {
    spuItem: Object,
  },
  methods: {
    // 获取平台属性
    async getAttrInfoList() {
      const result = await this.$API.category.getAttrInfoList({
        category1Id: this.spuItem.category1Id,
        category2Id: this.spuItem.category2Id,
        category3Id: this.spuItem.category3Id,
      });
      this.publicCode(result, "attrInfoList", "平台");
    },
    // 获取销售属性
    async getSpuSaleAttrList() {
      const result = await this.$API.spu.getSpuSaleAttrList(this.spuItem.id);
      this.publicCode(result, "saleAttrList", "销售");
    },
    // 获取图片列表
    async getSpuImageList() {
      const result = await this.$API.spu.getSpuImageList(this.spuItem.id);
      this.publicCode(result, "imgList", "图片");
    },
    publicCode(result, validate, info) {
      if (result.code === 200) {
        this[validate] = result.data;
        this.$message.success(`获取${info}数据成功~`);
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {
    // 获取平台属性
    this.getAttrInfoList();
    // 获取销售属性
    this.getSpuSaleAttrList();
    // 获取图片列表
    this.getSpuImageList();
  },
};
</script>

<style lang="sass" scoped>
.attr
  display: inline-block
  margin-right: 20px
</style>
