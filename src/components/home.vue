<template>
  <div>
      <el-button type ="info"  @click="exit"> 退出 </el-button>
  </div>
</template>

<script>
export default {
    name:'home',
    data() {
        return {
        
        }
    },
    methods: {
        exit(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        }
    },
}
</script>

<style>

</style>