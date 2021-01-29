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
                            <el-tag
                            closable
                             @close="removeTagById(scope.row, item1.id)"
                            >{{item1.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col >   
                        <!-- for循环第二层 -->
                        <el-col :span='19'>
                             <el-row  v-for="(item2 , index2 ) in item1.children" :key="item2.id" 
                             :class="[ index2===0 ? '' : 'bdtop','veenter' ]">
                                 <el-col :span="8" >
                                     <el-tag 
                                     closable
                                    @close="removeTagById(scope.row, item2.id)"
                                      type="success">{{item2.authName}}</el-tag>
                                     <i class="el-icon-caret-right"></i>
                                 </el-col>
                                 <!-- for循环第三层 -->
                                <el-col  :span="11" >
                                    <el-tag  type="warning" v-for="(item3 , index3 ) in  item2.children " :key= "item3.id"
                                    closable
                                    @close="removeTagById(scope.row, item3.id)"
                                    >{{item3.authName}}</el-tag>
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
                         <el-button type="warning" icon="el-icon-star-off" size="mini"  @click="openRightDislog(scope.row)"  @close="closeRightDialog">分配权限</el-button>
                  </template>
              </el-table-column>          
        </el-table>
    </el-card>

<!-- 权限列表对话框 -->

<el-dialog
  title="权限"
  :visible.sync="dialogVisible"
  width="50%"
  @close="closeRightDialog"
  >
  <el-tree :data="rightlist" :props="defaultProps" show-checkbox node-key="id" default-expand-all 
   :default-checked-keys="defaultCheck"
   ref="treeRef"
   ></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRoles">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
    name:'roles',
    data() {
        return {
            ruleslist:[],
            dialogVisible:false ,
            rightlist:[],
            defaultProps:{
                 children: 'children',
                 label: 'authName'
            },
            defaultCheck:[],
            roleId:''
        }
    },
    created() {
        this.getRulesListData()
    },
    methods: {
        getRulesListData(){
            this.$http.get('roles').then(res=>{
              this.ruleslist = res.data.data           
            })
        },
      async removeTagById(role,rightId){
          console.log(role);
          console.log(rightId);

          const ressoltconfirm = await   this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
         }).catch(err => err )
         if(ressoltconfirm !== 'confirm' ){
             return this.$message.error('已取消删除')
         }

       const { data:res } = await this.$http.delete( `roles/${role.id}/rights/${rightId}` )
       if(res.meta.status !== 200 ){
            this.$message.error('删除权限失败')
       }
            role.children = res.data
    //    console.log(role.id);
    //      console.log( res );
         //以下出现错误  删除权限后不会自动移除tagss 
        //   this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   this.$http.delete(`roles/${role.id}/rights/${rightId}`).then( res =>{
        //       console.log(res);
        //       if(res.status == 200){                
        //           this.$message({
        //              type: 'success',
        //               message: '删除成功!'
        //            });
                 
        //         // this.getRulesListData()
        //       }
        //        role.children.data = res.data
        //   })        
        //   }).catch(() => {
        //   this.$message({
        //     type: 'info',
        //     message: '已取消删除'
        //   });          
        // });   
        },
      async openRightDislog(role){     
          this.roleId = role.id  
            const {data : res } =  await this.$http.get('rights/tree')
         
            if(res.meta.status !==200 ){
                this.$message.error('获取权限列表失败')
            }
            this.rightlist = res.data 
            this.getLeafkey( role , this.defaultCheck)
            this.dialogVisible= true
            console.log(this.defaultCheck);
        },
        //递归函数
        getLeafkey(node ,arr){
            if(!node.children){return arr.push(node.id)}
            node.children.forEach(item => this.getLeafkey(item,arr));
        },
        closeRightDialog(){
            this.defaultCheck = []
        },
      async  allotRoles(){
        //   this.dialogVisible  = false 
          const treearr = [
              ...this.$refs.treeRef.getCheckedKeys(),
              ...this.$refs.treeRef.getHalfCheckedKeys()
          ]
          const idstr = treearr.join(',')
          const {data:res } =   await this.$http.post(`roles/${this.roleId}/rights`,{rids: idstr})
          console.log( res );
          if (res.meta.status!==200){
                return this.$message.error('更新权限失败')
          }
          this.$message.success('更新权限成功')
          this.getRulesListData()
          this.dialogVisible  = false 
        }
    },
//  
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