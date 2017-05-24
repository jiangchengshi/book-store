<template>
    <div class="login">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">{{title}}</h1>
        </header>
        <div class="logo">
            <img src="../image/logo.png">
        </div>
        <form class="mui-input-group">
            <div class="mui-input-row">
                <label><i class="mui-icon iconfont icon-shouji1"></i></label>
                <input type="text" v-model="login.telephone" placeholder="请输入手机号">
            </div>
            <div class="mui-input-row">
                <label><i class="mui-icon iconfont icon-mima1"></i></label>
                <input type="text" v-model="login.password" class="mui-input-clear" placeholder="请输入密码">
            </div>
            <div class="mui-href-row">
                <span class="logon">立即注册</span>
                <span class="forget">忘记密码</span>
            </div>
            <button type="button" :disabled="disabled" class="mui-btn mui-btn-primary" onclick="return false;">登录
            </button>
        </form>
        <div class="otherLogin">
            <span>其他登录方式</span>
            <i class="mui-icon iconfont icon-weixin" style="color: green;"></i>
            <i class="mui-icon iconfont icon-weibo" style="color: red"></i>
            <i class="mui-icon iconfont icon-qq" style="color: skyblue"></i>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                title: '登录',
                login: {
                    telephone: '',
                    password: ''
                }
            }
        },
        computed: {
            disabled(){
                return (this.login.telephone != '' && this.login.password != '') ? false : 'disabled';
            }
        },
        created(){
            // 隐藏书城底部导航菜单
            this.$store.commit('updateMallBar', false);
        }
    }
</script>

<style scoped>
    .login {
        margin: 0;
        padding: 0;
    }

    header {
        background-color: white;
    }

    .logo {
        padding: 80px 0px 50px 0px;
        text-align: center;
    }

    .logo img {
        width: 110px;
        height: 110px;
    }

    .mui-input-group, .mui-input-group:before, .mui-input-group:after {
        background-color: initial;
    }

    .mui-input-group .mui-input-row {
        height: 50px;
        line-height: 50px;
    }

    .mui-input-row label {
        padding: 4px 20px;
        width: 15%;
    }

    .mui-input-group .mui-input-row label i {
        font-size: 28px;
    }

    .mui-input-row label ~ input {
        width: 80%;
    }

    .mui-input-group .mui-input-row:after {
        right: 15px;
        bottom: 10px;
    }

    .mui-input-group .mui-href-row {
        height: 40px;
        line-height: 40px;
        margin-bottom: 15px;
    }

    .mui-input-group .mui-href-row span {
        width: 50%;
        font-size: 15px;
        color: #35B4EB;
    }

    .mui-input-group .mui-href-row .logon {
        float: left;
        padding-left: 20px;
    }

    .mui-input-group .mui-href-row .forget {
        float: right;
        text-align: right;
        padding-right: 20px;
    }

    .mui-input-group button {
        display: block;
        line-height: 35px;
        margin: 0px auto;
        width: 90%;
    }

    .otherLogin {
        position: absolute;
        bottom: 10px;
        text-align: center;
    }

    .otherLogin span {
        display: block;
        padding: 0px 25px;
        color: #A3A5A7;
        font-family: PingFangSC-Light;
        font-size: 14px;
    }

    .otherLogin span:before {
        content: '';
        height: 1px;
        display: block;
        background-color: #D8D8D8;
        float: left;
        width: 100px;
        margin-top: 10px;
        margin-right: 10px;
    }

    .otherLogin span:after {
        content: '';
        display: block;
        height: 1px;
        background-color: #D8D8D8;
        float: right;
        width: 100px;
        margin-top: 10px;
        margin-left: 10px;
    }

    .otherLogin i {
        font-size: 35px;
        margin: 10px 20px;
    }
</style>