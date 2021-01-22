<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <el-form
        label-width="0px"
        class="login_form"
        :model="loginform"
        :rules="loginFromRlue"
        ref="loginfromRef"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="loginform.username"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="loginform.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="loginFromReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      loginform: {
        username: "admin",
        password: "123456",
      },
      loginFromRlue: {
        username: [
          { required: true, message: "请输入登陆名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入登陆密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    loginFromReset() {
      this.$refs.loginfromRef.resetFields();
    },
    login() {
      this.$refs.loginfromRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginform);
        if (res.meta.status !== 200) {
          this.$message({
            showClose: true,
            message: "登陆失败，请输入正确的用户名或密码",
            center: true,          
            type: "error",      
          });
        } else {
        
          this.$message.success("登陆成功");
          window.sessionStorage.setItem('token' , res.data.token)
          this.$router.push('/home')
        }
      });
    },   
  },
};
</script>

// <style lang="less" scoped>
html {
  height: 100%;
}
.login_container {
  background-color: #2b4b6b;
}
.login_box {
  background-color: #fff;
  width: 450px;
  height: 300px;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translate(-50%, 50%);
  border-radius: 50%;
  border: 3px solid #fff;
  padding: 5px;
  box-shadow: 0px 0px 10px #ddd;

  background-color: #fff;
  width: 130px;
  height: 130px;
}

.avatar_box img {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  background-color: #eee;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}

</style>