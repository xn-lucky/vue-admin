<template>
  <el-card style="margin-top: 20px">
    <el-form label-width="100px" :model="sku" :rules="rules" ref="skuForm">
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
      <el-form-item label="规格描述" prop="skuDesc">
        <el-input
          type="textarea"
          placeholder="SKU规格描述"
          v-model="sku.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性" prop="skuAttrInfoList">
        <el-form-item
          :label="attr.attrName"
          v-for="attr in attrInfoList"
          :key="attr.id"
          class="attr"
        >
          <el-select placeholder="请输入" v-model="attr.attrValueId">
            <el-option
              v-for="attrValue in attr.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
              :value="`${attr.id}-${attrValue.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label="销售属性" prop="skuSaleAttrInfoList">
        <el-form-item
          :label="sale.saleAttrName"
          v-for="sale in saleAttrList"
          :key="sale.id"
          class="attr"
        >
          <el-select placeholder="请输入" v-model="sale.saleAttrId">
            <el-option
              v-for="saleAttrValue in sale.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
              :value="saleAttrValue.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <!--
        prop用来做表单校验的
       -->
      <el-form-item label="图片列表" prop="skuImgList">
        <el-table
          class="table"
          border
          style="width: 100%; margin: 20px 0"
          ref="multipleTable"
          :data="imgList"
          @select="selectEvent"
          row-key="id"
        >
          <el-table-column type="selection" reserve-selection width="80px">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="图片">
            <template v-slot="{ row }">
              <img :src="row.imgUrl" alt="" style="width: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"> </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row, $index }">
              <el-button
                class="default-btn"
                @click="setDefault(row, $index)"
                type="primary"
                v-show="!+row.isDefault"
                >设置默认
              </el-button>
              <el-tag type="success" v-show="+row.isDefault">默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="$emit('updShowList')">取消</el-button></el-form-item
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
      sku: {
        category3Id: this.spuItem.category3Id,
        spuId: this.spuItem.id,
        tmId: this.spuItem.tmId,
        // skuImageList: [], //选中的img图片信息
        // skuSaleAttrValueList: [], //选择的销售属性
        // skuAttrValueList: [], //选中的平台属性
      }, //保存页面上的form表单数据(收集)
      /* 校验规则 */
      rules: {
        skuName: [
          { required: true, message: "请输入sku名称", trigger: "change" },
        ],
        price: [
          { required: true, message: "请输入sku价格", trigger: "change" },
        ],
        weight: [
          { required: true, message: "请输入sku重量", trigger: "change" },
        ],
        skuDesc: [
          { required: true, message: "请输入sku描述", trigger: "change" },
        ],
        skuAttrInfoList: [
          { required: true, validator: this.skuAttrInfoListValidate },
        ],
        skuSaleAttrInfoList: [
          { required: true, validator: this.skuSaleAttrInfoListValidate },
        ],
        skuImgList: [{ required: true, validator: this.skuImgListValidate }],
      },
      /*
        {
  "category3Id": 0,//spuItem中有
  "id": 0,// 不需要
  "isSale": 0,//上架还是下架
  "price": 0,//sku
  "skuAttrValueList": [
    {
      "attrId": 0,//指的是属性id即平台属性的id，不是skuAttrValueList中每个下拉数据的id
      "id": 0,
      "skuId": 0,
      "valueId": 0//指的是你在平台属性中选中的value的id
    }
  ],
  "skuDefaultImg": "string",//默认图片地址
  "skuDesc": "string",//sku
  "skuImageList": [//获取的就是选中的图片数据
    {
      "id": 0,
      "imgName": "string",
      "imgUrl": "string",
      "isDefault": "string", //是否是默认图片 是1否0
      "skuId": 0,
      "spuImgId": 0
    }
  ],
  "skuName": "string",//sku
  "skuSaleAttrValueList": [
    {
      "id": 0, // 值id对应的属性id
      "saleAttrValueId": 0, 选中的值id
      "skuId": 0,
      "spuId": 0 //spuItem
    }
  ],
  "spuId": 0,//spuItem
  "tmId": 0,//spuItem
  "weight": "string"//sku
}
      */
    };
  },
  props: {
    spuItem: Object,
  },
  methods: {
    // 保存按钮
    save() {
      this.$refs.skuForm.validate(async (valid) => {
        if (valid) {
          //校验成功
          //收集数据
          // 1- 平台属性
          const skuAttrValueList = this.attrInfoList.map((attr) => {
            const [attrId, valueId] = attr.attrValueId;
            return {
              attrId,
              valueId,
            };
          });
          // 2- 销售属性
          const skuSaleAttrValueList = this.saleAttrList.map((saleAttr) => {
            return {
              id: saleAttr.id,
              saleAttrValueId: saleAttr.saleAttrId,
              spuId: this.spuItem.Id, //spuItem
            };
          });
          // 3- 图片列表（保留选中的图片）
          const skuImageList = this.imgList.filter((img) => +img.isChecked);
          // 4-默认图片的路径
          const defaultImg = this.imgList.find((img) => +img.isDefault);

          const options = {
            ...this.sku,
            skuDefaultImg: defaultImg.imgUrl,
            skuAttrValueList,
            skuSaleAttrValueList,
            skuImageList,
          };
          // console.log(options);
          await this.$API.sku.saveSkuInfo(options);
          // 发送请求成功跳转回去
          this.$emit("updShowList");
        }
      });
    },
    //校验规则 平台属性
    skuAttrInfoListValidate(rules, value, callback) {
      // 平台属性要全部选择才可以校验成功attrValueId
      if (!this.attrInfoList.every((attr) => attr.attrValueId)) {
        callback("平台属性需要全部选择~");
        return;
      }
      callback();
    },
    //校验规则 销售属性
    skuSaleAttrInfoListValidate(rules, value, callback) {
      //销售属性要全部选择才可以校验成功saleAttrId
      if (!this.saleAttrList.every((saleAttr) => saleAttr.saleAttrId)) {
        callback("销售属性需要全部选择~");
        return;
      }
      callback();
    },
    //校验规则 图片
    skuImgListValidate(rules, value, callback) {
      // 1- 图片需要至少勾选一条数据,并且至少要有一个默认选项
      // 2- 若勾选了一项也默认选择了一项,但是勾选的并不是默认的,也要提示
      /*     if (!this.imgList.some((img) => +img.isChecked)) {
        callback("至少勾选一天图片数据~");
        return;
      } */
      /*   if (!this.imgList.some((img) => +img.isDefault)) {
        callback("至少选择一个默认图片数据~");
        return;
      } */
      // 找到勾选的数据(过滤得到)
      const isCheckedList = this.imgList.filter((img) => +img.isChecked);
      // 找到默认选中的数据(find)
      const isDefaultList =
        isCheckedList.length > 0 && isCheckedList.find((img) => +img.isDefault);
      if (isCheckedList.length === 0) {
        callback("至少勾选一条图片数据~");
        return;
      }
      if (!isDefaultList || isDefaultList.length === 0) {
        callback("请在选中的图片中设置默认图片~~");
        return;
      }
      callback();
    },
    // 图片表格选中事件
    selectEvent(checkedData) {
      // checkedData是一个数组,保存着选中的所有数据
      this.imgList = this.imgList.map((img) => {
        return {
          ...img,
          isChecked: checkedData.find((data) => data.id === img.id) ? "1" : "0",
        };
      });
    },
    // 给图片设置默认按钮
    setDefault(row, index) {
      /*
      方法一:将所有的按钮改成false（显示设置默认），再将当前的设置为true
         this.imgList = this.imgList.map((img) => {
        img.showDefault = false;
        return img;
      });
      this.$set(row, "showDefault", "true"); */
      // 方法二 需要传过来index,根据index来判断
      this.imgList = this.imgList.map((img, i) => {
        return {
          ...img,
          isDefault: i === index ? "1" : "0",
        };
      });
    },
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
  width: 30%
  display: inline-block
  margin: 0 20px 10px 0
.default-btn
  width: 80px
  height: 32px
  line-height: .6
  font-size: 12px
</style>
