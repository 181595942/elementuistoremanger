<template>
<el-container class="home-container">
  <el-header>
      <div>
          <img src="../assets/heima.png" alt="">
          <span>后台管理系统</span>
      </div>
      <el-button type ="info"  @click="exit"> 退出 </el-button>
  </el-header>
  <el-container>
      <!-- asaide侧边栏区域 -->
    <el-aside  :width="iscollapse ? '64px' : '200px' " >

    <el-menu
      :default-active="activeptth"
      class="el-menu-vertical-demo"
      background-color="#333744"
      text-color="#fff"
      unique-opened
      active-text-color="#409eff"
      :collapse="iscollapse"
      :collapse-transition="false"
      router
      
    >
        <!-- 单击折叠或展开所有 -->
      <div class=" topclooer" @click="OpenOrCloseAll" >|  |  |</div>

      <el-submenu :index="item.id + ''" v-for=" item in menulist" :key="item.id">
        <template slot="title">
          <i :class="FonticonObj[item.id]"></i>
          <span>{{item.authName}}</span>         
        </template>  

        <!-- 二级菜单 -->
        <el-menu-item :index=" '/' + subitem.path " v-for="subitem in item.children" :key="subitem.id" @click="getpathsave('/' + subitem.path)">
            <template slot="title">
               <i class="el-icon-menu"></i>
               <span>{{subitem.authName}}</span>         
            </template>
        </el-menu-item>                   
        </el-submenu>
      </el-submenu>
    </el-menu>
    </el-aside>
    <el-main><router-view></router-view></el-main>
  </el-container>
</el-container>


</template>

<script>
export default {
  name: "home",
  data() {
    return {
        menulist:[],
        FonticonObj:{
            '125' : 'el-icon-user-solid',
            '103' : 'el-icon-setting',
            '101' : 'el-icon-s-goods' ,
            '102' : 'el-icon-s-order',
            '145' : 'el-icon-s-marketing'

        },
        iscollapse: false,
        activeptth :''
    };
  },
  created() {
      this.getMemuData()
      this.activeptth = window.sessionStorage.getItem('activePath')
  },
  methods: {
    exit() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMemuData(){
     const { data :res } =  await this.$http.get('menus');
     if(res.meta.status !==200)  return this.$message.error(res.meta.msg)
     this.menulist = res.data   
    },
    OpenOrCloseAll(){
       this.iscollapse =  !this.iscollapse
        
    },
    getpathsave(activeptth){
      console.log(activeptth);
      window.sessionStorage.setItem('activePath' , activeptth)
      this.activeptth = activeptth
    }
  },
};
</script>

<style lang="less" scoped>

.home-container {
  height: 100%;
}
.el-menu {
   border-right: 0;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  > div {
    display: flex;
    align-items: center;
    > span {
      margin-left: 20px;
    }
  }
}


.el-header div span {
  color: white;
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #e9eef3;
}

.el-menu-item span {
    color: white;
}

.topclooer {
    background-color: 333744;
    line-height: 25px;
    text-align: center;
    color: #fff;
    font-size: 10px;
    
}
</style>