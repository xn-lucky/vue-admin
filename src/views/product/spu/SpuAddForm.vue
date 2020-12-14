<template>
  <el-card style="margin-top: 20px">
    <el-form label-width="80px" :model="spu">
      <el-form-item label="SPU名称" prop="spuName">
        <el-input placeholder="请输入SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请输入品牌" v-model="spu.tmId">
          <el-option
            v-for="trademark in trademarkList"
            :key="trademark.id"
            :label="trademark.tmName"
            :value="trademark.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述" prop="description">
        <el-input
          type="textarea"
          placeholder="请输入SPU描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!--   :on-preview="handlePictureCardPreview"
               :on-remove="handleRemove" -->
        <el-upload
          :action="`${$BASE_API}/admin/product/fileUpload`"
          list-type="picture-card"
          :file-list="spuImgList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <!--
        prop用来做表单校验的
       -->
      <el-form-item label="销售属性" prop="saleAttrId">
        <el-select
          :placeholder="
            filterSaleAttrsList.length === 0
              ? '没有啦'
              : `还有${filterSaleAttrsList.length}个未选择`
          "
          v-model="spu.saleAttrId"
        >
          <!--   <el-select
          :placeholder="`还有${filterSaleAttrsList.length}个未选择`"
          v-model="spu.saleAttrId"
        > -->
          <el-option
            v-for="saleAttr in filterSaleAttrsList"
            :key="saleAttr.id"
            :label="saleAttr.name"
            :value="saleAttr.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="filterSaleAttrsList.length === 0"
          >添加销售属性
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-table
          class="table"
          :data="spuAttrsList"
          border
          style="width: 100%; margin-bottom: 20px"
        >
          <el-table-column type="index" label="序号" width="80px">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="150px">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称列表">
            <template v-slot="{ row }">
              <el-tag
                class="tag"
                v-for="spuSaleAttr in row.spuSaleAttrValueList"
                :key="spuSaleAttr.id"
                closable
                >{{ spuSaleAttr.saleAttrValueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="attrName" label="操作" width="150px">
            <template v-slot="{ row }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                title="删除"
                @click="delSpuAttr(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="$emit('updShowSpuList', true)">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "SpuAddForm",
  data() {
    return {
      trademarkList: [], // 全部品牌数据
      saleAttrsList: [], // 销售属性
      spuImgList: [], // 某spu下的img列表
      spuAttrsList: [], // 某spu下的attr列表
      dialogImageUrl: "", // dialog的url
      dialogVisible: false, // 放大图片的dialog
    };
  },
  computed: {
    filterSaleAttrsList() {
      // 过滤销售属性下拉框数据
      // 销售属性与spu属性进行对比，若spu中存在销售属性的值，销售属性下拉框就不显示
      return this.saleAttrsList.filter((sale) => {
        // 找到了就说明spuAttrsList中存在saleAttrsList的数据为true,没找到就为false,我要的是没找到，找到的就不返回了，所以取反
        return !this.spuAttrsList.find((spu) => spu.baseSaleAttrId === sale.id);
      });
    },
  },
  props: {
    spu: Object,
  },
  methods: {
    delSpuAttr(row) {
      // console.log("row", row.baseSaleAttrId);
      // 删除某spu对应的spuAttrsList的某个属性
      this.spuAttrsList = this.spuAttrsList.filter(
        (spuAttr) => spuAttr.baseSaleAttrId !== row.baseSaleAttrId
      );
    },
    // 对于图片的处理 会接收file参数
    handlePictureCardPreview(file) {
      // console.log(file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file, fileList) {
      // file是你删掉的图片的信息,fileList是图片列表中还剩的图片信息
      console.log(file, fileList, this.spuImgList);
      this.spuImgList = this.spuImgList.filter(
        (spuImg) => spuImg.name !== file.name
      );
    },
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
      this.publicCode(result, "trademarkList", "品牌");
    },
    async getBaseSaleAttrList() {
      const result = await this.$API.spu.getBaseSaleAttrList();
      this.publicCode(result, "saleAttrsList", "销售属性");
    },
    async getSpuImageList() {
      const result = await this.$API.spu.getSpuImageList(this.spu.id);
      this.publicCode(result, "spuImgList", "图片");
    },
    async getSpuSaleAttrList() {
      const result = await this.$API.spu.getSpuSaleAttrList(this.spu.id);
      this.publicCode(result, "spuAttrsList", "spu属性");
    },
    publicCode(result, validateCode, mes) {
      if (result.code === 200) {
        // 对图片列表数据进行单独处理
        if (validateCode === "spuImgList") {
          this[validateCode] = result.data.map((img) => {
            return {
              name: img.imgName,
              url: img.imgUrl,
            };
          });
        } else {
          this[validateCode] = result.data;
        }

        this.$message.success(`获取${mes}数据成功~`);
      } else {
        this.$message.error("获取数据出错了");
      }
    },
  },
  mounted() {
    // 因为SpuAddForm组件中有些数据是要发请求获取的，比如品牌/销售属性/图片列表/spu属性
    // 1- 获取品牌
    this.getTrademarkList();
    // 2- 获取销售属性
    this.getBaseSaleAttrList();
    // 3- 图片列表
    this.getSpuImageList();
    // 4- spu属性
    this.getSpuSaleAttrList();
  },
};
</script>

<style lang="less" scoped>
</style>
