<template>
    <div class="in">
        <div class="logo">
            <img src="../../image/logo.png" style="width: 100px;height: 100px;">
        </div>
        <div class="info" style="text-align: center;">
            <group>
                <x-input required placeholder="请输入账号" v-model="username">
                    <i slot="label" class="iconfont icon-shouji"></i>
                </x-input>
                <x-input required placeholder="请输入密码" v-model="password" type="password">
                    <i slot="label" class="iconfont icon-mima1"></i>
                </x-input>
            </group>
            <div style="padding: 8px 40px;font-size: 15px;">
                <a style="float: left;color: #35B4EB;" @click="handleForget">忘记密码</a>
                <a style="float: right;color: #35B4EB;" @click="handleLogon">立即注册</a>
            </div>
            <x-button type="primary" action-type="button" :disabled="disabled"
                      style="width:90%;background-color: #35B4EB;line-height: 45px;margin-top: 20px;"
                      @click.native="handleLogin">登 录
            </x-button>
        </div>
        <div class="link" style="margin-top: 80px;">
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
                username: '',
                password: ''
            }
        },
        components: {
            Group, Cell, XInput, XButton, Divider
        },
        methods: {
            handleLogin(e){
                // 校验用户名、密码
                if (this.username == '' || this.password == '') {
                    this.$vux.toast.show({
                        type: 'warn',
                        text: '账号或密码不能为空',
                        isShowMask: true
                    });
                    return;
                }

                // 请求登录
                app.ajax.post(app.config.api.entry.login, {
                    username: this.username,
                    password: this.password
                }, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            if (data.result == 2) { // 账号密码错误
                                this.$vux.toast.show({
                                    type: 'warn',
                                    text: '账号或密码错误'
                                });
                            } else if (data.result == 3) {   // 用户不存在
                                this.$vux.toast.show({
                                    type: 'warn',
                                    text: '用户不存在'
                                });
                            } else {
                                app.webSql.insert(app.config.webSql.login, {
                                    id: data.uid,
                                    egold: data.egold,
                                    time: new Date()
                                }, () => {
                                    this.$store.commit('updateUser', {
                                        uid: data.uid,
                                        egold: data.egold
                                    });

                                    // 跳转
                                    this.$router.go(-1);
                                });
                            }
                        }
                    }
                }, (err) => {
                    console.error(err);
                });
            },
            handleForget(e){
                this.$router.push({path: '/entry/password/forget'});
            },
            handleLogon(e){
                this.$router.push({path: '/entry/logon'});
            }
        },
        computed: {
            disabled(){
                return (this.username != '' && this.password != '') ? false : 'disabled';
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '登录',
                showBack: true
            });

            // 如果username参数不为空或undefined，则是从注册页面跳转过来的，默认赋值
            if (this.$route.query.username) {
                this.username = this.$route.query.username;
                this.password = '';
            }
        }
    }
</script>

<style>
    .in .logo {
        text-align: center;
        padding: 25px 0px 25px 0px;
    }

    .in .logo img {
        /* 更好支持border-radius */
        border-top-left-radius: 999px; /* 左上角 */
        border-top-right-radius: 999px; /* 右上角 */
        border-bottom-right-radius: 999px; /* 右下角 */
        border-bottom-left-radius: 999px; /* 左下角 */
        border-radius: 999px;
        /*background-color: #ccc;*/
        /*background-clip: padding-box;*/
    }

    .in .info .weui-cells {
        background: rgba(255, 255, 255, 0);
        width: 95%;
        margin: 0px auto;
    }

    .in .info .weui-cells:before, .in .info .weui-cells:after {
        border: initial;
    }

    .in .info .iconfont {
        font-size: 22px;
        padding-right: 15px;
        display: block;
    }

    .in .link .vux-divider {
        color: #999999;
    }

    .in .link .iconfont {
        color: white;
        font-size: 36px;
        border-radius: 10px;
        margin: 0px 20px;
    }
</style>