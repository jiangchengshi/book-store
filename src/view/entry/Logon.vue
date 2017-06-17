<template>
    <div class="up" style="text-align: center;">
        <group label-margin-right="10px">
            <x-input required placeholder="请输入账号" v-model="username">
                <i slot="label" class="iconfont icon-shouji"></i>
            </x-input>
            <x-input required placeholder="请输入验证码" v-model="code">
                <i slot="label" class="iconfont icon-yanzhengma"></i>
                <x-button slot="right" :mini="true" :plain="true" action-type="button" :disabled="codeDisabled"
                          @click.native="handleSendCode">
                    <label :style="{color: codeTxtColor}">{{codeTxt}}</label>
                </x-button>
            </x-input>
            <x-input required placeholder="请输入密码" v-model="password" type="password">
                <i slot="label" class="iconfont icon-mima1"></i>
            </x-input>
        </group>
        <x-button type="primary" action-type="button" :disabled="disabled"
                  style="width:95%;background-color: #35B4EB;line-height: 50px;margin-top: 10px;"
                  @click.native="handleLogon">立即注册
        </x-button>
    </div>
</template>

<script>
    import {Group, Cell, XInput, XButton} from 'vux';

    export default {
        data () {
            return {
                username: '',
                password: '',
                code: '',
                codeTime: app.config.setting.codeTime,
                codeDisabled: false
            }
        },
        components: {
            Group, Cell, XInput, XButton
        },
        methods: {
            handleLogon(e){
                app.ajax.post(app.config.api.entry.logon, {
                    username: this.username,
                    password: this.password,
                    code: this.code
                }, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            if (data.result == 1) {
                                this.$vux.toast.show({
                                    text: '注册成功',
                                    type: 'info'
                                });
                                setTimeout(() => {
                                    this.$router.push({path: '/entry/login', query: {username: this.username}});
                                }, 2000);
                            } else if (data.result == 2) { // 验证码错误
                                this.$vux.toast.show({
                                    type: 'warn',
                                    text: '验证码错误'
                                });
                            } else if (data.result == 3) {   // 用户名已存在
                                this.$vux.toast.show({
                                    type: 'warn',
                                    text: '用户名已存在'
                                });
                            }
                        }
                    }
                }, (err) => {
                    console.error(err);
                });
            },
            handleSendCode(e){
                if (this.codeDisabled) {
                    return;
                }
                if (this.username == '') {
                    this.$vux.toast.show({
                        text: '账号不能为空',
                        type: 'warn'
                    });
                    return;
                }

                // 禁用获取验证码按钮
                this.codeDisabled = true;
                // 倒计时
                let task = setInterval(() => {
                    this.codeTime--;
                    if (this.codeTime == 0) {
                        clearInterval(task);
                        this.codeTime = app.config.setting.codeTime;
                        this.codeDisabled = false;
                    }
                }, 1000);

                // 请求发送验证码
                app.ajax.get(app.config.api.entry.sms + this.username, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            validateCode = data.code;
                            this.$vux.toast.show({
                                text: '验证码已发送，请注意查收',
                                type: 'info'
                            });
                        }
                    }
                }, (err) => {
                    console.error(err);
                });
            }
        },
        computed: {
            disabled(){
                return (this.username != '' && this.password != '' && this.code != '') ? false : 'disabled';
            },
            codeTxt(){
                if (this.codeTime == app.config.setting.codeTime) {
                    return '获取验证码';
                } else {
                    return this.codeTime + '秒后重新获取';
                }
            },
            codeTxtColor(){
                if (this.codeTime == app.config.setting.codeTime) {
                    return '#EE4D22';
                } else {
                    return '#C1CDD6';
                }
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '快速注册',
                showBack: true
            });
        }
    }
</script>

<style>
    .up .weui-cells {
        background: rgba(255, 255, 255, 0);
        width: 95%;
        margin: 0px auto;
    }

    .up .iconfont {
        font-size: 22px;
        margin-right: 15px;
    }

    .up .weui-btn.weui-btn_mini.weui-btn_default.weui-btn_plain-default {
        border-width: 0px;
    }
</style>