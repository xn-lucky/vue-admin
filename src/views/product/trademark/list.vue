<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="addTradeMark"
      >添加</el-button
    >
    <!-- 表格 -->
    <el-table
      :data="tradeList"
      border
      style="width: 100%"
      class="table"
      v-loading="loading"
    >
      <!-- type='index' 是写序号从1开始 -->
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <!-- 通过scope可以获取到行和列等数据 scope.row获取的是这一行的数据,scope.column获取的是这一列的数据 -->
          <img class="trademask-img" :src="scope.row.logoUrl" alt="" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="warning"
            icon="el-icon-edit"
            class="handle-btn"
            @click="updTradeMark(scope.row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            class="handle-btn"
            @click="delTradeMark(scope.row.id, scope.row.tmName)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
     -->
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      layout="prev, pager, next, jumper,sizes,total"
      :total="total"
    >
    </el-pagination>

    <!-- 点击添加显示的对话框 -->
    <el-dialog
      :title="isPlus ? '添加品牌' : '修改品牌'"
      :visible.sync="visibleDialog"
    >
      <el-form
        :model="trademarkForm"
        :rules="rules"
        ref="trademarkForm"
        label-width="120px"
        style="width: 80%"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademarkForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkForm.logoUrl"
              :src="trademarkForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="visibleDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('trademarkForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TrademarkList",
  data() {
    return {
      tradeList: [],
      total: 0, // 分页数据的总数
      page: 1, // 当前页
      limit: 3, // 每页显示的数据条数

      loading: false, // 是否正在请求,正在请求时显示转圈圈
      visibleDialog: false, //是否显示添加的对话框
      isPlus: false,
      trademarkForm: {
        // 保存添加对话框中的form数据
        tmName: "",
        logoUrl: "",
      },
      // 表单对应表单项校验规则
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
        ],
        logoUrl: [{ required: true, message: "请上传品牌logo" }],
      },
    };
  },
  methods: {
    // 将请求封装成一个函数,为了复用
    async getTradeList() {
      this.loading = true; // 正在发送请求
      // 发送请求数据(参数page和limit)
      // api文件夹下的请求都在main.js中挂载到了Vue.prototype.$API上,所以我们可以直接获取请求
      // console.log("当前页", this.page);
      // console.log("条数", this.limit);
      const result = await this.$API.trademark.getPageList(
        this.page,
        this.limit
      );
      this.loading = false; // 请求结束
      // console.log("result", result);
      // code为200 说明是成功,失败处理在util的响应拦截器中有写，这边就不需要做其他处理了
      if (result.code === 200) {
        // current当前页 pages总页数 size每页条数 records当前页数据 total总数
        const { current, pages, size, total, records } = result.data;
        // 将数据赋值给tradeList
        this.tradeList = records;
        this.page = current;
        this.limit = size;
        this.total = total;
      }
    },
    // 当前页码改变触发的函数
    handleCurrentChange(current) {
      // 直接改变data中的数据，因为请求的时候传的page和limit是从this上获取的
      this.page = current;
      this.getTradeList(); // 因为改了this中的数据所以这边不需要传
    },
    // 每页显示的条数发生改变触发的函数
    handleSizeChange(size) {
      // 与页码改变一致
      this.limit = size;
      this.getTradeList(); // 因为改了this中的数据所以这边不需要传
    },
    // 添加按钮 添加品牌数据
    addTradeMark() {
      // console.log(this.trademarkForm);
      // 点击添加时，清空之前写的数据
      // this.trademarkForm.tmName = "";
      // this.trademarkForm.logoUrl = "";
      this.trademarkForm = {};
      // 使用dialog弹框,点击添加 visibleDialog为true 显示弹框
      this.visibleDialog = true;
      this.isPlus = true; // 此时是添加
    },
    // 图片上传之后触发的函数
    handleAvatarSuccess(res) {
      // 图片上传成功后返回的信息
      // console.log(res);
      this.trademarkForm.logoUrl = res.data;
    },
    // 图片上传之前触发的函数
    beforeAvatarUpload(file) {
      // 触发函数时参数file是文件的信息
      const imgType = ["image/jpeg", "image/jpg", "image/png"];
      const isValidateType = imgType.indexOf(file.type) > -1;
      const isLt = file.size / 1024 < 50;

      if (!isValidateType) {
        this.$message.error("上传头像图片应是 JPG/JPEG/PNG 格式!");
      }
      if (!isLt) {
        this.$message.error("上传头像图片大小不能超过 50kb!");
      }
      return isValidateType && isLt;
    },
    // 点击确定 添加品牌数据 请求
    submitForm(trademarkForm) {
      // 点击确定要先校验，获取表单调用方法校验
      this.$refs[trademarkForm].validate(async (valid) => {
        // console.log("valid", valid);
        if (valid) {
          // 这边进行判断也是可以通过trademarkForm.id来判断的,因为修改数据才会有id
          if (this.isPlus) {
            // 增加品牌请求
            await this.$API.trademark.addTradeMark(this.trademarkForm);
          } else {
            // 发送修改数据请求
            await this.$API.trademark.updTradeMark(this.trademarkForm);
          }
          this.visibleDialog = false;
          // 此时增加完数据希望重新请求下数据
          this.getTradeList();
        }
      });
    },
    // (方法一,获取id发了请求)点击修改按钮 对品牌数据进行修改
    /*  async updTradeMark(id) {
      // console.log(id);
      // 使用dialog弹框,点击添加 visibleDialog为true 显示弹框
      this.visibleDialog = true;
      this.isPlus = false; // 此时是修改

      // 修改时，要获取此时你点击的行的数据,显示在页面上
      const result = await this.$API.trademark.getTradeMarkById(id);
      // console.log("tradeMark", tradeMark);
      if (result.code === 200) {
        // 说明查询到了数据,这样弹框就可以显示你选中的数据信息了
        this.trademarkForm.logoUrl = result.data.logoUrl;
        this.trademarkForm.tmName = result.data.tmName;
        this.trademarkForm.id = result.data.id;
      }
    }, */
    // (方法二:直接传过来row,获取每行数据,row中含有id 可以直接获取)点击修改按钮 对品牌数据进行修改
    async updTradeMark(row) {
      // console.log(id);
      // 使用dialog弹框,点击添加 visibleDialog为true 显示弹框
      this.visibleDialog = true;
      this.isPlus = false; // 此时是修改

      // 修改时，要获取此时你点击的行的数据,显示在页面上
      this.trademarkForm = { ...row };
    },
    // 删除当前数据
    delTradeMark(id, tmName) {
      this.$confirm(`确认删除 ${tmName} 的数据吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 确认删除后,调用删除请求
          await this.$API.trademark.delTradeMark(id);
          this.$message({
            type: "info",
            message: "删除成功",
          });
          // 删除数据后 更新数据
          this.getTradeList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  mounted() {
    this.getTradeList();
  },
};
</script>
<style lang="sass">
.table
  margin: 20px 0
.pagination
  text-align: right
.el-pagination__sizes
  margin-left: 382px
.handle-btn
  width: 73px
  height: 28px
  font-size: 13px
  padding: 0
.trademask-img
  width: 100px
.add-dialog
  width: 760px
  height: 510px

.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden
  &:hover
    border-color: #409EFF

.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center

.avatar
  width: 178px
  height: 178px
  display: block
</style>
