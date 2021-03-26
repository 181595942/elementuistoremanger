<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警示提示 -->
      <el-alert title="添加商品信息" type="info" effect="dark"> </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeNum - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品修改"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tap栏区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeNum"
          :before-leave="tabsBeforeOrLeave"
          @tab-click="tabsClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cate">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="goods_cate"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyTabData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTabData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
             
              :action="UploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
          <el-tab-pane label="完成" name="5">完成</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeNum: "0",
      // 表单验证数据对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //分割的分类列表
        goods_cat: [],
      },
      // 表单验证数据规则
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cate: [
          { required: true, message: "请选择商品数据", trigger: "blur" },
        ],
      },
      //商品分类数据
      cateList: [],
      goods_cate: {
        expandTrigger: "hover",
        children: "children",
        label: "cat_name",
        value: "cat_id",
      },
      manyTabData: [],
      onlyTabData: [],
      UploadUrl:'http://127.0.0.1:8888/api/private/v1/upload'
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      } else {
        this.cateList = res.data;
        // console.log(this.cateList);
      }
    },
    //级联选择器发生变化时触发的事件
    handleChange() {
      console.log(this.addForm.goods_cat);
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    tabsBeforeOrLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("失败，请先选择或输入相关内容");
        return false;
      }
    },
    async tabsClick() {
      if (this.activeNum === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateID}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message("请求参数失败");
        } else {
          res.data.forEach((item) => {
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
          });

          this.manyTabData = res.data;
        }
      } else {
        if (this.activeNum === "2") {
          const {
            data: res,
          } = await this.$http.get(`categories/${this.cateID}/attributes`, {
            params: { sel: "only" },
          });
          if (res.meta.status !== 200) {
            //  console.log(res);
            this.$message.error("请求参数失败");
          } else {
            this.onlyTabData = res.data;
            console.log(res.data);
          }
        }
      }
    },
    handlePreview(){},
    handleRemove(){}
  },
  computed: {
    cateID() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
};
</script>

<style lang='less' scope>
.el-steps {
  margin: 10px 0px;
}
.el-steps .el-step__title {
  font-size: 13px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
</style>