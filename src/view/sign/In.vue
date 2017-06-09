<template>
    <div class="in">
        <div class="header">
            <img src="../../image/logo.png">
        </div>
        <div class="main" style="text-align: center;">
            <group>
                <x-input required placeholder="请输入账号" v-model="login.account">
                    <i slot="label" class="iconfont icon-shouji"></i>
                </x-input>
                <x-input required placeholder="请输入密码" v-model="login.password" type="password">
                    <i slot="label" class="iconfont icon-mima1"></i>
                </x-input>
            </group>
            <div style="padding: 8px 40px;font-size: 14px;">
                <a style="float: left;" @click="handleForget">忘记密码</a>
                <a style="float: right;" @click="handleLogon">立即注册</a>
            </div>
            <x-button type="primary" action-type="button"
                      style="width:95%;background-color: #35B4EB;line-height: 50px;margin-top: 10px;"
                      @click.native="handleLogin">登 录
            </x-button>
        </div>
        <div class="footer" style="margin-top: 100px;">
            <divider>其他登录方式</divider>
            <div style="text-align: center;margin-top: 20px;">
                <i class="iconfont icon-weibo" style="background-color: orange;"></i>
                <i class="iconfont icon-qq" style="background-color: dodgerblue;"></i>
                <i class="iconfont icon-weixin" style="background-color: green;"></i>
            </div>
        </div>
    </div>
</template>

<script>
    import {Group, Cell, XInput, XButton, Divider} from 'vux';

    export default {
        data () {
            return {
                login: {
                    account: '',
                    password: ''
                }
            }
        },
        components: {
            Group, Cell, XInput, XButton, Divider
        },
        methods: {
            handleLogin(e){
                // 校验用户名、密码
                if (this.in.account == '' || this.in.password == '') {
                    this.$vux.toast.show({
                        type: 'warn',
                        text: '用户名或密码不能为空',
                        isShowMask: true
                    });
//                    return;
                }
                // 跳转
                this.$router.replace('/index');
            },
            handleForget(e){
                this.$vux.toast.show({
                    text: '忘记密码功能未开放',
                    type: 'info'
                });
            },
            handleLogon(e){
                this.$vux.toast.show({
                    text: '注册功能未开放',
                    type: 'info'
                });
            }
        },
        computed: {
            disabled(){
                return (this.in.account != '' && this.in.password != '') ? false : 'disabled';
            }
        }
    }
</script>

<style>
    .in .header {
        text-align: center;
        padding: 55px 0px 40px 0px;
    }

    .in .header img {
        width: 100px;
        height: 100px;
        border: initial;
    }

    .in .main .weui-cells {
        background: rgba(255, 255, 255, 0);
        width: 95%;
        margin: 0px auto;
    }

    .in .main .weui-cells:before, .in .main .weui-cells:after {
        border: initial;
    }

    .in .main .iconfont {
        font-size: 22px;
        padding: 0px 30px;
        display: block;
    }

    .in .footer .vux-divider {
        color: #999999;
    }

    .in .footer .iconfont {
        color: white;
        font-size: 36px;
        border-radius: 10px;
        margin: 0px 20px;
    }
</style>