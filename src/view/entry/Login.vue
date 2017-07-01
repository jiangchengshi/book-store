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
        <div class="link" style="margin-top: 80px;" v-if="services && services.length>0">
            <divider>其他登录方式</divider>
            <div style="text-align: center;margin-top: 20px;">
                <template v-for="(service, index) in services">
                    <i v-if="service.id=='sinaweibo'" class="iconfont icon-weibo" style="background-color: orange;"
                       @click="handleOAuth(index)"></i>
                    <i v-else-if="service.id=='qq'" class="iconfont icon-qq" style="background-color: dodgerblue;"
                       @click="handleOAuth(index)"></i>
                    <i v-else-if="service.id=='weixin'" class="iconfont icon-weixin" style="background-color: green;"
                       @click="handleOAuth(index)"></i>
                </template>
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
                password: '',
                services: []
            }
        },
        components: {
            Group, Cell, XInput, XButton, Divider
        },
        methods: {
            getOauthService(){
                if (app.config.setting.isApp) {
                    plus.oauth.getServices((services) => {
                        this.services = services;
                        app.log.info(JSON.stringify(services));
                    }, (e) => {
                        this.$vux.toast.show({
                            text: '获取授权登录服务失败',
                            type: 'warn'
                        });
                        app.log.error("获取授权登录服务失败：" + e.message + " - " + e.code)
                    });
                }
            },
            handleLogin(e){
                // 校验用户名、密码
                if (this.username == '' || this.password == '') {
                    this.$vux.toast.show({
                        text: '账号或密码不能为空',
                        type: 'warn',
                        isShowMask: true
                    });
                    return;
                }

                // 请求登录
                app.ajax.post(app.config.api.entry.login, {
                    username: this.username,
                    password: this.password
                }, (data) => {
                    if (data.result.result == 2) { // 账号密码错误
                        this.$vux.toast.show({
                            text: '账号或密码错误',
                            type: 'warn'
                        });
                    } else if (data.result.result == 3) {   // 用户不存在
                        this.$vux.toast.show({
                            text: '用户不存在',
                            type: 'warn'
                        });
                    } else {
                        app.webSql.insert(app.config.webSql.login, {
                            uid: data.result.uid,
                            username: data.result.username,
                            egold: data.result.egold,
                            time: new Date()
                        }, () => {
                            this.$store.commit('updateUser', {
                                uid: data.result.uid,
                                egold: data.result.egold
                            });

                            // 跳转
                            this.$router.push({path: '/'})
                        });
                    }
                }, (err) => {
                    this.$vux.toast.show({
                        text: '系统异常，请稍后重试...',
                        type: 'warn'
                    });
                    app.log.error(err);
                });
            },
            handleForget(e){
                this.$router.push({path: '/entry/password/forget'});
            },
            handleLogon(e){
                this.$router.push({path: '/entry/logon'});
            },
            handleOAuth(i){
                // OAuth 配置参数
                let authOptions = {};
                if (i == 0) {   // 微信
                    authOptions = {
                        appid: 'wx9ec62c00f58c0532',
                        appsecret: '9f5da10a12bb519932e783eac1e6611b'
                    }
                } else if (i == 1) { // QQ
                    authOptions = {
                        appid: '101407616',
                        appkey: 'b9be0b5a03d22e619e1daf9924e8ab63'
                    }
                } else if (i == 2) { // 微博
                    authOptions = {
                        appkey: '382241986',
                        appsecret: '1ac860ccdf3c500ec1d5926b72e96efb',
                        redirect_url: ''
                    }
                }

                // 判断是否已经授权过
                let service = this.services[i];
                if (!service.authResult) {
                    service.login(function (e) {
                        alert("登录认证成功！");
                        app.log.info(e.target.authResult.openid);
                        app.log.info(e.target.authResult.access_token);
                        app.log.info(e.target.authResult.expires_in);
                    }, function (e) {
                        alert("登录认证失败！");
                        app.log.error(JSON.stringify(e));
                        app.log.error(JSON.stringify(e.target));
                    }, authOptions);
                } else {
                    let userInfo = service.userInfo;
                    if (userInfo) {
                        app.log.info(userInfo.openid);
                        app.log.info(userInfo.headimgurl);
                        app.log.info(userInfo.nickname);
                    }
                }
            }
        },
        computed: {
            disabled(){
                return (this.username != '' && this.password != '') ? false : 'disabled';
            }
        },
        created(){
            // 非全屏显示
            if (app.config.setting.isApp) {
                plus.navigator.setFullscreen(false);
            }

            this.$store.commit('updateHeader', {
                title: '登录',
                showBack: true
            });

            // 如果username参数不为空或undefined，则是从注册页面跳转过来的，默认赋值
            if (this.$route.query.username) {
                this.username = this.$route.query.username;
                this.password = '';
            }
        },
        mounted(){
            this.getOauthService();
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
        font-size: 30px;
        border-radius: 25px;
        margin: 0px 20px;
        padding: 4px;
    }
</style>