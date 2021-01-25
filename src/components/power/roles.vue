<template>
  <div> 
  <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-button type ="primary">添加角色</el-button>
        <el-table :data = "ruleslist" border >  
             <el-table-column  type="expand" >
                 <template  slot-scope="scope">
                     <el-row :class="['bdbuttom' , index1===0 ? 'bdtop' : '', 'veenter' ]"  v-for=" (item1 , index1 ) in scope.row.children" :key="item1.id">   
                        <!-- for循环第一层 -->
                        <el-col :span='5'>
                            <el-tag>{{item1.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col >   
                        <!-- for循环第二层 -->
                        <el-col :span='19'>
                             <el-row  v-for="(item2 , index2 ) in item1.children" :key="item2.id" 
                             :class="[ index2===0 ? '' : 'bdtop','veenter' ]">
                                 <el-col :span="8" >
                                     <el-tag  type="success">{{item2.authName}}</el-tag>
                                     <i class="el-icon-caret-right"></i>
                                 </el-col>
                                 <!-- for循环第三层 -->
                                <el-col  :span="11" >
                                    <el-tag  type="warning" v-for="(item3 , index3 ) in  item2.children " :key= "item3.id">{{item3.authName}}</el-tag>
                                </el-col>
                             </el-row>
                        </el-tag></el-col>                                           
                     </el-row>
                 </template>
             </el-table-column>
             <el-table-column  type = "index" label="#" ></el-table-column>
             <el-table-column  label=" 角色名称" prop="roleName"></el-table-column>
             <el-table-column  label=" 角色描述" prop="roleDesc"></el-table-column>
             <el-table-column  label=" 操作"  width="300px">
                  <template  slot-scope="scope">
                         <el-button type="primary" icon="el-icon-edit" size="mini">编缉</el-button>
                         <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                         <el-button type="warning" icon="el-icon-star-off" size="mini">分配权限</el-button>
                  </template>
              </el-table-column>          
        </el-table>
    </el-card>

  </div>
</template>

<script>
export default {
    name:'roles',
    data() {
        return {
            ruleslist:[]
        }
    },
    created() {
        this.getRulesListData()
    },
    methods: {
        getRulesListData(){
            this.$http.get('roles').then(res=>{
              this.ruleslist = res.data.data
              console.log(res.data.data);
            })
        }
    },
 
}
</script>

<style scope>
 .bdtop{
     border-top: solid 1px #eee;
 }

 .bdbuttom{
     border-bottom: solid 1px #eee;
 }

 .el-tag {
     margin: 7px;
 }

 /* .el-col {
     margin: 7px;
 } */

 .veenter{
     display: flex;
     align-items: center;
 }
</style>