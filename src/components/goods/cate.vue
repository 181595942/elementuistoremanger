<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡面视图区域 -->
    <el-card>
      <el-button type="primary" @click="showAddDalog">添加分类</el-button>

      <!-- 表格区域  -->
      <!-- 分类名称 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :show-index="true"
        index-text="#"
        border
        :show-row-hover="false"
        class="treetable"
        :expand-type="false"
        :selection-type="false"
      >
        <!-- 是否有效区域 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: green"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序区域 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>

        <!-- 操作区域 -->
        <template slot="edit" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分面区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querryinfo.pagesize"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加分类对话框 -->
      <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" @close="addCateclose">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="ruleForm.cat_name"></el-input>
          </el-form-item>
          <!-- 级联选择器 -->
          <el-form-item label="父级分类：">
            <el-cascader
              :options="parentcatelist"
              v-model="sleletedKeys"
              :props="cascaderprops"
              @change="prentGateChangeed"
              clearable
            >
            </el-cascader>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCatelist"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "cate",
  data() {
    return {
      querryinfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //商品分类数据列表
      catelist: [],
      //父级分类数据列表
      parentcatelist: [],
      cascaderprops: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly:true
      },
      sleletedKeys: [],

      //数据总条数
      total: 0,
      //添加分类显示隐藏
      dialogVisible: false,

      //tree-table数据
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "edit",
        },
      ],
      ruleForm: {
        //添加的分类名称
        cat_name: "",
        //分类的父ID
        cat_pid: 0,
        //分类的层次 默认为0
        cat_level: 0,
      },
      rules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.querryinfo,
      });

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品数据失败");
      } else {
        this.catelist = res.data.result;
        // console.log(this.catelist);
        this.total = res.data.total;
      }
    },
    handleSizeChange(val) {
      this.querryinfo.pagesize = val;
      this.getCateList();
    },
    handleCurrentChange(val) {
      this.querryinfo.pagenum = val;
      this.getCateList();
    },
    showAddDalog() {
      this.getPrentCateList();
      this.dialogVisible = true;
    },
    async getPrentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级列表失败");
      } else {
        this.parentcatelist = res.data;
        // console.log(this.parentcatelist);
      }
    },
    prentGateChangeed() {
      console.log(this.sleletedKeys);
      if(this.sleletedKeys.length>0){
       this.ruleForm.cat_pid = this.sleletedKeys[this.sleletedKeys.length -1]
       this.ruleForm.cat_level = this.sleletedKeys.length
       return
      }else{
        this.ruleForm.cat_pid = 0
       this.ruleForm.cat_level = 0
      }
    },
    addCatelist(){
      this.$refs.ruleForm.validate(async valid => {
        if(!valid){
          return
        }else{
         const {data:res} = await this.$http.post('categories' ,this.ruleForm)
         if(res.meta.status !== 201 ){
           return this.$message.error('添加失败')
         }else{
           this.$message.success('添加分类成功')
           this.getCateList()
           this.dialogVisible = false
         }
        }
      })
    },
    addCateclose(){
      this.$refs.ruleForm.resetFields()
      this.sleletedKeys=[]
      this.ruleForm.cat_pid = 0
      this.ruleForm.cat_level = 0
    }
  },
};
</script>

<style>
.treetable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
/* 
.el-cascader-menu__list {
  min-height: none;
} */
</style>