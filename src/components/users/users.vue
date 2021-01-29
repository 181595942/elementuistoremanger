<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>    
    <el-row  :gutter="30">
     <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="queryinfo.query"  clearable  @clear="getUsersData">
          <el-button slot="append" icon="el-icon-search"  @click="getUsersData"></el-button>
        </el-input>
     </el-col>
     <el-col :span="4">
          <el-button  type="primary"  @click="isdialogVisible"> 添加用户</el-button>
        </el-input>
     </el-col>
    </el-row>
    <!-- 表格区域 -->

    <template>
    <el-table
      :data="userlist"
      border
      stripe
      style="width: 100%">
         <el-table-column
        type= 'index'
         label="#"
        width="50">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="180">
      </el-table-column>
      <el-table-column
        prop="role_name"
        label="角色"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="状态"
        width="150">
        <template slot-scope="scope">          
            <el-switch
                 v-model="scope.row.mg_state"
                 active-color="#13ce66"
                 inactive-color="#ff4949"
                 @change="usersStateChanged(scope.row)"
                 >                
            </el-switch>
        </template>
      </el-table-column>
      <el-table-column    
        label="操作"
        width="180">  
        <template slot-scope="scope">            
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="iseditDialogVisible(scope.row.id )"></el-button>
            <el-button type="primary" icon="el-icon-delete" size="mini" @click="deleteUserByid(scope.row.id )"></el-button>
          <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false">  
            <el-button type="primary" icon="el-icon-share" size="mini" @click="editRoles(scope.row)"> </el-button>
          </el-tooltip>
        </template>       
      </el-table-column>
    </el-table>
  </template>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- dailog 对话框区域   添加用户  -->
    <el-dialog
    title="添加用户"
    :visible.sync="dialogVisible"
     width="50%"
     @close="addFormclose"
    >
  <!-- 主体 -->  
 <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="70px" >
    <el-form-item label="用户名" prop="username">
         <el-input v-model="addFrom.username"></el-input>
     </el-form-item>

     <el-form-item label="密码" prop="password">
         <el-input v-model="addFrom.password"></el-input>
     </el-form-item>

     <el-form-item label="邮箱" prop="email">
         <el-input v-model="addFrom.email"></el-input>
     </el-form-item>

     <el-form-item label="手机" prop="mobile">
         <el-input v-model="addFrom.mobile"></el-input>
     </el-form-item>
  </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="isdailogcheck">确 定</el-button>
      </span>
       </el-dialog>
  <!-- dailog 对话框区域   编缉用户   -->
  <el-dialog
  title="提示"
  :visible.sync="editDialogVisible"
  width="50%"
  @close= "editfromclose"
  >
<el-form :model="EditusersDataFrom" :rules="EditusersDataFromRules" ref="EditusersDataFromref" label-width="80px" >
    <el-form-item label="用户名"   >
    <el-input v-model="EditusersDataFrom.username" disabled></el-input>
  </el-form-item>
  <el-form-item label="手机号" prop="mobile">
    <el-input v-model="EditusersDataFrom.mobile"></el-input>
  </el-form-item>
    <el-form-item label="邮箱" prop="email">
    <el-input v-model="EditusersDataFrom.email"></el-input>
  </el-form-item>
  
</el-form>
    <span slot="footer" class="dialog-footer">
       <el-button @click="editDialogVisible = false">取 消</el-button>
       <el-button type="primary" @click="editUserInfo">确 定</el-button>
    </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
  title="分配角色"
  :visible.sync="rolesDialogVisible"
  width="50%"
  @close="setRoleDalogClose"
  >
  <div>
    <p> 当前的用户：  {{roles.username}}</p>
    <p> 当前的角色：  {{roles.role_name}}</p>
    <p> 分配新角色：  
      <el-select v-model="selectRoleID" placeholder="请选择">
       <el-option
        v-for="item in roleslistinfo"
        :key="item.id"
        :label="item.roleName"
        :value="item.id">
       </el-option>
    </el-select>
   </p>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="rolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveUsersRoles"  >确 定</el-button>
  </span>
</el-dialog>
</el-card>
</div>
</template>

<script>
export default {
  name: "users",
  data() {
    // 验证邮箱正则
    var checkEmail = ( rule , value ,callback )=>{
         const regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
       if (regEmail.test(value))  {
         return callback()}
         else{
           return callback( new Error('请输入合法的邮箱'))
         }      
    }
    //验证手机正则
    var  checkMobile = (rule , value ,callback)=>{
          const regMoblie = /^[1]([3-9])[0-9]{9}$/ 
          if(regMoblie.test(value)) {
            return callback()
          }else{
            return callback(new Error('请输入正确的手机号'))
          }
    };

    return {
      queryinfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userlist: [],
      total: 0,
      dialogVisible: false,
      editDialogVisible : false,
      EditusersDataFrom : '',
      rolesDialogVisible:false,
      roles:{},
      selectRoleID:'',
      roleslistinfo:[],

      addFrom:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      
      addFromRules:{
        username:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
           { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
         password:[
           { required: true, message: '请输入密码', trigger: 'blur' },
           { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
         email:[
            { required: true, message: '请输入邮箱', trigger: 'blur' },       
            { validator: checkEmail, trigger: 'blur' }
        ],
         mobile:[
           { required: true, message: '请输入手机号', trigger: 'blur' },      
           { validator: checkMobile, trigger: 'blur' }
        ],
      },
      EditusersDataFromRules:{
           mobile:[
           { required: true, message: '请输入手机号', trigger: 'blur' },      
           { validator: checkMobile, trigger: 'blur' }
        ],
          email:[
            { required: true, message: '请输入邮箱', trigger: 'blur' },       
            { validator: checkEmail, trigger: 'blur' }
        ],
      }
    };
  },
  created() {
    this.getUsersData();
  },
  methods: {
    async getUsersData() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryinfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户数据失败");
      } else {
        // console.log(res);
        this.userlist = res.data.users;
        this.total = res.data.total;
        // console.log(this.total);
      }
    },
    handleSizeChange(index) {
      this.queryinfo.pagesize = index;
      this.getUsersData();
    },
    handleCurrentChange(index) {
      // console.log(index);
      this.queryinfo.pagenum = index;
      this.getUsersData();
    },
    usersStateChanged(userinfo) {
      // console.log(userinfo);
      this.$http
        .put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        .then((res) => {
          // console.log(res.data);
          if (res.data.meta.status !== 200) {
            // console.log(this.userinfo)
            this.$message.error("获取用户数据失败");
          }
        });
    },
    isdialogVisible() {
      this.dialogVisible = true;
    },
    addFormclose(){
      this.$refs.addFromRef.resetFields()
    },
    isdailogcheck(){
      this.$refs.addFromRef.validate( async  valid =>{
         if(!valid ){
              return
         }else{
         const {data : res } =   await  this.$http.post('users' , this.addFrom)
         console.log(res);
         if ( res.meta.status == 201 )  {
           this.$message.success('添加用户成功')
           this.dialogVisible = false 
           this.getUsersData()           
         }else{
           return this.$message.error('添加用户失败')
         }
         
         }
      }    
      )
    },
    async  iseditDialogVisible( id ){      
      const  { data : res  } = await this.$http.get('users/' + id )
      if(res.meta.status !== 200 )   return this.$message.error ('获取用户信息失败')
      this.EditusersDataFrom =  res.data 
      this.editDialogVisible = true 
    },
    editfromclose(){
      this.$refs.EditusersDataFromref.resetFields()
    },
    editUserInfo(){
      this.$refs.EditusersDataFromref.validate( async  vaild => {
        if(!vaild) {
          return 
        }else {
         const  {data:res }  =  await this.$http.put('users/'  + this.EditusersDataFrom.id,{
           email: this.EditusersDataFrom.email , mobile : this.EditusersDataFrom.mobile
          })
          if(res.meta.status == 200 ){
            this.$message.success('更新用户成功')
            this.editDialogVisible = false
            this.getUsersData()
          }else {
            this.$message.error ('更新用户失败')
          }
        }
      })
    },
    deleteUserByid(id) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete("users/" + id).then(
            res => {
              if(res.status == 200 ){               
                  this.$message({
                   type: 'success',
                    message: '删除成功!'
                          });
                          this.getUsersData()
              }
            }
          )                 
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
   async  editRoles(roles){
      
      this.roles = roles 
      const {data : res } = await this.$http.get('roles')
      if(res.meta.status !== 200 ){
        return this.$message.error('请求角色列表失败')
      } else {
         this.roleslistinfo = res.data
      }
      this.rolesDialogVisible = true
    },

   async  saveUsersRoles(){
      if(!this.selectRoleID){
        this.$message.error('请选择要分配的角色')
      }

      // console.log(this.roles);
      // console.log(this.roleslistinfo);
      console.log(this.selectRoleID);
     const {data:res } =  await this.$http.put(`users/${this.roles.id}/role`,{rid:this.selectRoleID})
       if(res.meta.status !== 200){
         return this.$message.error('分配角色失败')
       }
         this.$message.success('更新成功')
         this.getUsersData()
         this.rolesDialogVisible = false
       
       
       
    },
    //重置角色分配对话框
    setRoleDalogClose(){
        this.selectRoleID = '',
        this.roles = {}
    }
  },
};
</script>

<style lang="less" scope>
.el-pagination {
  margin-top: 15px;
}
</style>

