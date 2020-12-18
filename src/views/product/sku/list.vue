<template>
  <el-card>
    <!-- 表格  -->
    <el-table :data="skuList" border style="width: 100%" class="table">
      <!-- type='index' 是写序号从1开始 -->
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称"></el-table-column>
      <el-table-column prop="skuDesc" label="描述"> </el-table-column>
      <el-table-column label="默认图片" width="150" align="center">
        <template v-slot="{ row }">
          <img :src="row.skuDefaultImg" alt="" style="width: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)"> </el-table-column>
      <el-table-column prop="price" label="价格(元)" width="80">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="{ row }">
          <el-button
            type="success"
            icon="el-icon-bottom"
            class="btn"
            @click="upSale"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            class="btn"
            @click="upd"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            class="btn"
            @click="info(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            class="btn"
            @click="del"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--
      @size-change="handleSizeChange"

      :total="total"
     -->
    <el-pagination
      class="pagination"
      :page-sizes="[5, 10, 15]"
      @size-change="handleSizeChange"
      :current-page="page"
      @current-change="handleCurrentChange"
      :page-size.sync="limit"
      layout="prev, pager, next, jumper,sizes,total"
      :total="total"
    >
    </el-pagination>

    <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      :with-header="false"
      size="50%"
    >
      <el-row :gutter="20">
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            style="margin-right: 10px"
            v-for="attrValue in skuInfo.skuAttrValueList"
            :key="attrValue.id"
            >{{ attrValue.valueId }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5">销售属性</el-col>
        <el-col :span="16">
          <el-tag
            style="margin-right: 10px"
            v-for="saleAttr in skuInfo.skuSaleAttrValueList"
            :key="saleAttr.id"
            >{{ saleAttr.saleAttrValueId }}</el-tag
          ></el-col
        >
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <!--
            skuImageList: Array(1)
            0:
            id: 3154
            imgName: "banner4.jpg"
            imgUrl: "http://182.92.128.115:8080/group1/M00/00/C4/rBFUDF_cmEGACbC5AAHHUlNc7PI258.jpg"
            isDefault: "true"
            skuId: 1449
            spuImgId: null
           -->
          <div style="width: 400px; height: 400px">
            <el-carousel autoplay="false">
              <el-carousel-item
                v-for="img in skuInfo.skuImageList"
                :key="img.id"
              >
                <img style="width: 400px; height: 400px" :src="img.imgUrl" />
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-col>
      </el-row>
    </el-drawer>
  </el-card>
</template>

<script>
export default {
  name: "SkuList",
  data() {
    return {
      page: 1,
      total: 20,
      limit: 5,
      skuList: [],
      drawer: false, //是否显示sku信息框
      skuInfo: {},
      /*
        category3Id: 994
        id: 1435
        isSale: 1
        price: 222
        skuAttrValueList: null
        skuDefaultImg: "http://182.92.128.115:8080/group1/M00/00/C4/rBFUDF_chZuAC_3sAAA7f9DfoVI309.png"
        skuDesc: "444"
        skuImageList: null
        skuName: "11"
        skuSaleAttrValueList: null
        spuId: 2629
        tmId: 247
        weight: "33.00"
      */
    };
  },
  methods: {
    // 删除sku
    del() {
      this.$message("还在开发中~~~");
    },
    // sku信息
    async info(row) {
      this.drawer = true;
      // 发送请求获取sku信息
      const result = await this.$API.sku.getSkuById(row.id);
      console.log(result);
      if (result.code === 200) {
        this.skuInfo = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    //上架
    upSale() {
      this.$message("还在开发中~~~");
    },
    // 修改
    upd() {
      this.$message("还在开发中~~~");
    },
    // 每页展示条数改变
    handleSizeChange(size) {
      this.limit = size;
      // 发送请求
      this.getSkuInfo();
    },
    // 当前页码改变
    handleCurrentChange(current) {
      this.page = current;
      // 发送请求
      this.getSkuInfo();
    },
    //请求数据
    async getSkuInfo() {
      // 发送请求 获取所有sku数据
      const result = await this.$API.sku.getSkuInfo(this.page, this.limit);
      /*
      格式:
      current: 1
      pages: 14
      records: (5) [{…}, {…}, {…}, {…}, {…}]
      size: 5
      total: 67
    */
      if (result.code === 200) {
        const { records, current, size, total } = result.data;
        this.skuList = records;
        this.page = current;
        this.limit = size;
        this.total = total;
        this.$message.success("获取sku列表数据成功");
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {
    this.getSkuInfo();
  },
};
</script>
<style lang='sass' scoped>
.btn
  width: 44px
  height: 28px
.el-button
  padding: 0
.el-row .el-col
  height: 40px
  line-height: 40px
.el-row .el-col.el-col-5
  font-size: 18px
  font-weight: bold
  text-align: right
  margin-right: 20px
.el-row .el-col.el-col-16
  font-size: 18px
  margin-right: 20px
</style>
