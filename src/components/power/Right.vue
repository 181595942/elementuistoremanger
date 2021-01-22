<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
   <!-- 卡片视图 -->
    <el-card>
      <el-table  :data="rightslist"  border  stripe>  
        <el-table-column  type= 'index' label= "#" ></el-table-column>
         <el-table-column  label="权限名称"  prop="authName"></el-table-column>
          <el-table-column  label="路径"  prop="path"></el-table-column>
           <el-table-column   label="权限等级" prop="level">
              <template  slot-scope="scope">
                   <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
                   <el-tag type="success" v-else-if="scope.row.level ==='1'">二级权限</el-tag>
                   <el-tag type="warning" v-else >三级权限</el-tag>
              </template>
           </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "right",
  data() {
    return {
      rightslist: [],
    };
  },
  created() {
    this.getrightslistdata(); 
  },
  methods: {
    getrightslistdata() {
      this.$http.get("rights/list").then( res  => {
        console.log(res.data);
        this.rightslist = res.data.data
        
        
      });
    },
  },
};
</script>




<style lang="less" scope >
</style>>

</style>