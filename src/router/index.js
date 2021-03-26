import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import users from '../components/users/users.vue'
import Rights  from '../components/power/Right.vue'
import Roles from  '../components/power/roles.vue'
import Cate from '../components/goods/cate.vue'
import cateParams from '../components/goods/goods_params.vue'
import goodsList from '../components/goods/goods_list.vue'
import Add from '../components/goods/add.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    redirect: '/welcome',
    component: home,
    children:[
       {path:'/welcome',component:welcome},
       { path:'/users',component: users},
       { path:'/rights',component: Rights},
       { path:'/roles',component: Roles},
       { path:'/categories', component: Cate},
       { path:'/params', component: cateParams},
       { path:'/goods', component: goodsList},
       { path:'/goods/add', component: Add},

   ]
  },

  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import( '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next)=>{
  if(to.path === '/login') return next()
  const tokenstr = window.sessionStorage.getItem('token')
  if(!tokenstr) return next('/login')
  next()
})

export default router
