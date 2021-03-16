<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数!"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>

      <!--选择商品分类区域  -->
      <el-row class="params_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择器区域 -->
          <el-cascader
            v-model="selectCatelistKeys"
            :options="catelist"
            :props="cateListProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs标签区域 -->
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isdisable"
            @click="adddialogVisible = true"
            >动态参数</el-button
          >

          <!-- 动态参数表格 -->
          <el-table :data="manyData" border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="saveAttrvals(i,scope.row)"
                  >{{ item }}</el-tag
                >
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(scope.row)"
                >+ New Tag</el-button
              >
              </template>

            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditdialog(scope.row.attr_id)"
                  >编缉</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only"
          ><el-button
            type="primary"
            size="mini"
            :disabled="isdisable"
            @click="adddialogVisible = true"
            >静态属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyData" border>
                        <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="saveAttrvals(i,scope.row)"
                  >{{ item }}</el-tag
                >
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(scope.row)"
                >+ New Tag</el-button
              >
              </template>

            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditdialog(scope.row.attr_id)"
                  >编缉</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 弹出 添加属性dialog对话框 -->
    <el-dialog
      :title="'添加' + dialogTitle"
      :visible.sync="adddialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        :model="addFrom"
        :rules="addFromRules"
        ref="addFromRef"
        label-width="100px"
      >
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="addFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹出编辑属性dialog对话框 -->
    <el-dialog
      :title="'编辑' + dialogTitle"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        :model="editFrom"
        :rules="editFromRules"
        ref="editFromRef"
        label-width="100px"
      >
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="editFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "goodsparams",
  data() {
    return {
      // 获取到的列表数据
      catelist: [],
      // 双向绑定所选择的数据
      selectCatelistKeys: [],
      // prop选项
      cateListProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      //   所选择的TABS栏
      activeName: "many",
      manyData: [],
      onlyData: [],
      //添加参数对话框数据
      adddialogVisible: false,
      addFrom: {
        attr_name: "",
      },
      addFromRules: {
        attr_name: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
      //参数编辑行为区域数据
      editdialogVisible: false,
      editFrom: {
        attr_name: "",
      },
      editFromRules: {
        attr_name: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
    
    };
  },
  created() {
    this.getCatelistData();
  },
  methods: {
    async getCatelistData() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 3 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据列表失败");
      } else {
        this.catelist = res.data;
        // console.log(this.catelist);
      }
    },
    //获取参数列表
    async getParamsData() {
      if (this.selectCatelistKeys.length !== 3) {
        this.selectCatelistKeys = [];
        this.manyData=[]
        this.onlyData=[]
        return;
      }
      //   console.log(this.selectCatelistKeys);

      const { data: res } = await this.$http.get(
        `categories/${this.categoriesid}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );

      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败！");
      }
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        item.inputVisible = false
        item.inputValue = ''
      });
      console.log(res.data);
      if (this.activeName === "many") {
        this.manyData = res.data;
        // console.log(this.manyData);
      } else {
        this.onlyData = res.data;
      }
      //   console.log(res.data);
    },
    handleChange() {
      this.getParamsData();
    },
    handleClick() {
      //   console.log(this.activeName);
      this.getParamsData();
    },
    addDialogClose() {
      this.$refs.addFromRef.resetFields();
    },
    addParams() {
      this.$refs.addFromRef.validate(async (vaild) => {
        if (!vaild) {
          return;
        } else {
          const {
            data: res,
          } = await this.$http.post(
            `categories/${this.categoriesid}/attributes`,
            { attr_name: this.addFrom.attr_name, attr_sel: this.activeName }
          );
          if (res.meta.status !== 201) {
            return this.$message.error("请求添加参数失败");
          } else {
            this.$message.success("添加参数成功");
            this.adddialogVisible = false;
            this.getParamsData();
          }
        }
      });
    },
    async showEditdialog(attr_id) {
      console.log(attr_id);
      const {
        data: res,
      } = await this.$http.get(
        `categories/${this.categoriesid}/attributes/${attr_id}`,
        { params: { attr_sel: this.activeName } }
      );
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("查询失败");
      } else {
        console.log(this.editFrom);
        this.editFrom = res.data;
        this.editdialogVisible = true;
        // this.getParamsData
      }
    },
    editDialogClose() {
      this.$refs.editFromRef.resetFields();
    },
    editParams() {
      this.$refs.editFromRef.validate(async (valid) => {
        if (!valid) {
          return;
        } else {
          const {
            data: res,
          } = await this.$http.put(
            `categories/${this.categoriesid}/attributes/${this.editFrom.attr_id}`,
            { attr_name: this.editFrom.attr_name, attr_sel: this.activeName }
          );
          if (res.meta.status !== 200) {
            return this.$http.message("编辑参数失败");
          } else {
            this.getParamsData();
            this.editdialogVisible = false;
          }
        }
      });
    },
    //根据ID删除对应的参数
    async removeParams(attr_id) {
      const confirmResolt = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      console.log(confirmResolt);
      if (confirmResolt !== "confirm") {
        return;
      } else {
        const { data: res } = await this.$http.delete(
          `categories/${this.categoriesid}/attributes/${attr_id}`
        );
        if (res.meta.status !== 200) {
          return this.$message.error("删除参数失败");
        } else {
          this.$message.success("删除参数成功");
          this.getParamsData();
        }
      }
    },
    //tag标签键盘抬起和失去焦点时执行的操作 
    async handleInputConfirm(row){
      if(row.inputValue.trim().length===0){
        row.inputValue=''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim(''))
      row.inputValue=''
      row.inputVisible = false
      this.editPushParams(row)
     
    },
    //编辑提交参数修改tag标签
    async editPushParams(row){
      const {data:res} = await  this.$http.put(`categories/${this.categoriesid}/attributes/${row.attr_id}`,
      {attr_name:row.attr_name,
      attr_sel:row.attr_sel,
      attr_vals:row.attr_vals.join(' ')
      })
      console.log(res);
      if(res.meta.status !== 200){
        return this.$message.error('编辑提交参数失败')
      }else{
        this.$message.success('编辑提交成功')
      }
    },
    showInput(row){
      row.inputVisible = true 
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    saveAttrvals(i,row){
      row.attr_vals.splice(i,1)
      this.editPushParams(row)
    }
   
  },

  computed: {
    isdisable() {
      if (this.selectCatelistKeys.length !== 3) {
        return true;
      } else {
        return false;
      }
    },
    categoriesid() {
      if (this.selectCatelistKeys.length === 3) {
        return this.selectCatelistKeys[2];
      } else {
        return null;
      }
    },
    // 动态获取dialog对话框title.
    dialogTitle() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
};
</script>

<style style='less'  scope>
.params_opt {
  margin: 15px 0;
}
.el-cascader {
  width: 200px;
}
.el-tag {
  margin: 10px;
}
 .el-table__expanded-cell  .input-new-tag {
    width: 90px; 
  
  }
 .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
</style>