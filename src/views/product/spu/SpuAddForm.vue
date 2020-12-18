<template>
  <el-card style="margin-top: 20px">
    <el-form label-width="80px" :model="spu" :rules="rules" ref="spuForm">
      <el-form-item label="SPU名称" prop="spuName">
        <el-input placeholder="请输入SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌" prop="tmId">
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
      <el-form-item label="SPU图片" prop="spuImg">
        <!--   :on-preview="handlePictureCardPreview"
               :on-remove="handleRemove" -->
        <el-upload
          :action="`${$BASE_API}/admin/product/fileUpload`"
          list-type="picture-card"
          :file-list="formatImgList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
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
      <el-form-item label="销售属性" prop="saleAttr">
        <el-select
          :placeholder="
            filterSaleAttrsList.length === 0
              ? '没有啦'
              : `还有${filterSaleAttrsList.length}个未选择`
          "
          v-model="spusaleAttr"
        >
          <!--   <el-select
          :placeholder="`还有${filterSaleAttrsList.length}个未选择`"
          v-model="spu.saleAttrId"
        > -->
          <!--   <el-option
            v-for="saleAttr in filterSaleAttrsList"
            :key="saleAttr.id"
            :label="saleAttr.name"
            :value="saleAttr.id"
          ></el-option> -->
          <el-option
            v-for="saleAttr in filterSaleAttrsList"
            :key="saleAttr.id"
            :label="saleAttr.name"
            :value="`${saleAttr.id}-${saleAttr.name}`"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!spusaleAttr"
          @click="addSpuSaleAttr(spusaleAttr)"
          >添加销售属性
        </el-button>

        <el-table
          class="table"
          :data="spuSaleAttrsList"
          border
          style="width: 100%; margin: 20px 0"
        >
          <el-table-column type="index" label="序号" width="80px">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="150px">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称列表">
            <template v-slot="{ row }">
              <el-tag
                class="tag"
                v-for="(spuSaleAttr, index) in row.spuSaleAttrValueList"
                :key="spuSaleAttr.id"
                closable
                @close="delSpuSaleAttrSingle(row, index)"
                >{{ spuSaleAttr.saleAttrValueName }}</el-tag
              >
              <el-input
                style="width: 80px"
                v-if="row.edit"
                ref="input"
                size="mini"
                v-model="spuAttr"
                @blur="updSpuSaleAttrSingle(row)"
                @keyup.enter.native="row.edit = false"
              ></el-input>
              <el-button
                icon="el-icon-plus"
                v-else
                @click="addSpuSaleAttrSingle(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="attrName" label="操作" width="150px">
            <template v-slot="{ row }">
              <el-popconfirm
                :title="`确定删除 '${row.saleAttrName}' 吗？`"
                @onConfirm="delSpuSaleAttr(row)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  title="删除"
                ></el-button>
              </el-popconfirm>
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
  name: "SpuAddForm",
  data() {
    return {
      trademarkList: [], // 全部品牌数据
      saleAttrsList: [], // 销售属性
      spuImgList: [], // 某spu下的img列表
      spuSaleAttrsList: [], // 某spu下的attr列表
      dialogImageUrl: "", // dialog的url
      dialogVisible: false, // 放大图片的dialog

      spuAttr: "", // spu的attr
      spusaleAttr: "", // 选中的销售属性
      // form中字段的校验规则 在点击保存的时候触发
      rules: {
        spuName: [{ required: true, message: "请输入SPU名称" }],
        tmId: [{ required: true, message: "请选择品牌" }],
        spuImg: [{ validator: this.validatorSpuImg }],
        saleAttr: [
          {
            validator: this.validatorSaleAttr,
          },
        ],
      },
    };
  },
  computed: {
    filterSaleAttrsList() {
      // 过滤销售属性下拉框数据
      // 销售属性与spu属性进行对比，若spu中存在销售属性的值，销售属性下拉框就不显示
      return this.saleAttrsList.filter((sale) => {
        // 找到了就说明spuSaleAttrsList中存在saleAttrsList的数据为true,没找到就为false,我要的是没找到，找到的就不返回了，所以取反
        return !this.spuSaleAttrsList.find(
          (spu) => spu.baseSaleAttrId === sale.id
        );
      });
    },
    formatImgList() {
      return this.spuImgList.map((img) => {
        return {
          uid: img.uid || img.id, // 后台返回来的数据是没有uid的，所以就用了id
          name: img.imgName,
          url: img.imgUrl,
        };
      });
    },
  },
  props: {
    spu: Object,
    isAdd: Boolean,
    /*
          category3Id: 1007
          description: "生活包~"
          id: 2220
          spuImageList: null
          spuName: "生活包"
          spuSaleAttrList: null
          tmId: 5923
    */
  },

  methods: {
    // 校验图片
    validatorSpuImg(rule, value, callback) {
      // console.log(rule, value, callback);
      if (this.spuImgList.length === 0) {
        callback(new Error("请上传至少一张图片~"));
        return;
      }
      callback();
    },
    // 校验销售属性
    validatorSaleAttr(rule, value, callback) {
      if (this.spuSaleAttrsList.length === 0) {
        callback(new Error("请至少选择一个销售属性~"));
        return;
      }
      // 校验spu销售属性 若找到就为true，否则为false
      const spuSaleAttrValue = this.spuSaleAttrsList.some(
        (spuSaleAttr) => spuSaleAttr.spuSaleAttrValueList.length === 0
      );
      if (spuSaleAttrValue) {
        callback("请至少写一个spu销售属性");
        return;
      }
      callback();
    },
    // 保存按钮做的事
    save() {
      //1- 进行校验
      this.$refs.spuForm.validate(async (valid) => {
        if (valid) {
          // 校验成功
          // 2- 收集数据（看那些需要传，并且在哪里存在）
          /*
        category3Id: this.spu.category3Id,
        description: this.spu.description,
        id: 0, // 修改需要id 增加不需要
        spuImageList: this.spuImgList,
        spuName: this.spu.spuName,
        spuSaleAttrList: this.spuSaleAttrsList,
        tmId: this.spu.tmId,

      */
          const options = {
            ...this.spu,
            spuImageList: this.spuImgList,
            spuSaleAttrList: this.spuSaleAttrsList,
          };
          // 3- 发送请求进行保存
          let result;
          if (this.isAdd) {
            result = await this.$API.spu.saveSpuInfo(options);
          } else {
            result = await this.$API.spu.updateSpuInfo(options);
          }

          // console.log(result);
          // 4- 保存成功后跳转页面并重新查询数据
          if (result.code === 200) {
            this.$emit("updShowList");
          } else {
            this.$message.error(result.message);
          }
        }
      });
    },
    // 对单个属性进行删除
    delSpuSaleAttrSingle(row, index) {
      // console.log(row, index);
      row.spuSaleAttrValueList.splice(index, 1);
    },
    // 对单个属性进行修改
    updSpuSaleAttrSingle(row) {
      // console.log(row);
      /*
      baseSaleAttrId: 1
      edit: false
      id: 7422
      saleAttrName: "选择颜色"
      spuId: 2220
      spuSaleAttrValueList: Array(3)
          baseSaleAttrId: 1
          id: 4632
          isChecked: null
          saleAttrName: "选择颜色"
          saleAttrValueName: "黑"
          spuId: 2220

      */

      if (this.spuAttr) {
        // 将输入框的值添加到对应的spuSaleAttrsList中
        row.spuSaleAttrValueList.push({
          baseSaleAttrId: row.baseSaleAttrId,
          saleAttrName: row.saleAttrName,
          saleAttrValueName: this.spuAttr,
          spuId: row.spuId,
        });
      }
      // 失去焦点和按enter键将输入框变为按钮
      row.edit = false;
      // 要清空输入在输入框的值
      this.spuAttr = "";
    },
    // 添加某个销售属性的某个属性
    addSpuSaleAttrSingle(row) {
      //1- 添加edit属性(是否显示输入框)
      this.$set(row, "edit", true);
      //2- 等DOM结构渲染结束,获取焦点
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    // 添加spu销售属性
    addSpuSaleAttr(spusaleAttr) {
      // debugger;
      //1- 首先要获取到,然后看保存spu销售属性的数据中的格式是什么样的,再添加到spuSaleAttrsList中
      /*  const saleAttr = this.saleAttrsList.find(
        (sale) => sale.id === saleAttrId  // 不查找了，改用新的方法
           this.spuSaleAttrsList.push({
              baseSaleAttrId: saleAttr.id,
              saleAttrName: saleAttr.name,
              spuId: this.spu.spuId,
              spuSaleAttrValueList: [],
      });
      ); */
      // 优化---现在获取的saleAttr是id和name值都有的（查找的话，若数据量多，会比较慢）
      const [baseSaleAttrId, saleAttrName] = spusaleAttr.split("-");
      this.spuSaleAttrsList.push({
        baseSaleAttrId: +baseSaleAttrId,
        saleAttrName,
        spuId: this.spu.id,
        spuSaleAttrValueList: [],
      });
      // 2- 添加完要清空销售属性的表单显示的数据
      this.spusaleAttr = "";
    },
    delSpuSaleAttr(row) {
      // console.log("row", row.baseSaleAttrId);
      // 删除某spu对应的spuSaleAttrsList的某个属性
      this.spuSaleAttrsList = this.spuSaleAttrsList.filter(
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
        (spuImg) => spuImg.imgName !== file.name
      );
    },
    handleSuccess(res, file) {
      // console.log(res, file);
      this.spuImgList.push({
        uid: file.uid,
        imgName: file.name,
        imgUrl: res.data,
        spuId: this.spu.id,
      });
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
      this.publicCode(result, "spuSaleAttrsList", "spu属性");
    },
    publicCode(result, validateCode, mes) {
      if (result.code === 200) {
        this[validateCode] = result.data;
        // 控制信息弹出个数
        if (document.getElementsByClassName("el-message").length >= 3) return;
        this.$message.success(`获取${mes}数据成功~`);
      } else {
        if (document.getElementsByClassName("el-message").length >= 3) return;
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
    // 如果是增加的话，这些就不用发送请求
    if (!this.isAdd) {
      // 3- 图片列表
      this.getSpuImageList();
      // 4- spu属性
      this.getSpuSaleAttrList();
    }
  },
};
</script>

<style lang="sass" scoped>
</style>
