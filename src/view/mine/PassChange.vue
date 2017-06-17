<template>
    <div class="pass-change" style="text-align: center;">
        <x-header :title="$store.state.header.title"
                  :left-options="{showBack: $store.state.header.showBack, backText: $store.state.header.backText}">
        </x-header>
        <group>
            <x-input required placeholder="输入旧密码" v-model="password.old" type="password"></x-input>
        </group>
        <group>
            <x-input required placeholder="输入新密码" v-model="password.new" type="password"></x-input>
            <x-input required placeholder="确认新密码" v-model="password.confirm" type="password"></x-input>
        </group>
        <x-button type="primary" action-type="button" :disabled="disabled"
                  style="width:95%;background-color: #35B4EB;line-height: 50px;margin-top: 10px;"
                  @click.native="handlePass">确定修改
        </x-button>
    </div>
</template>

<script>
    import {XHeader, Group, XInput, XButton} from 'vux';

    export default {
        data () {
            return {
                password: {
                    old: '',
                    new: '',
                    confirm: ''
                }
            }
        },
        components: {
            XHeader, Group, XInput, XButton
        },
        methods: {
            handlePass(e){
                if (this.password.new != this.password.confirm) {
                    this.$vux.toast.show({
                        text: '新密码与确认密码不一致',
                        type: 'warn'
                    });
                    return;
                }

                // 修改密码
                app.ajax.post(app.config.api.mine.password, {
                    uid: this.$store.state.user.uid,
                    oldpwd: this.password.old,
                    newpwd: this.password.new,
                    renewpwd: this.password.confirm
                }, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            if (data.result == 1) { // 1:成功
                                this.$vux.toast.show({
                                    text: '修改成功',
                                    type: 'info'
                                });
                                this.$router.push({path: '/entry/login'});
                            } else if (data.result == 2) { // 2：用户不存在
                                this.$vux.toast.show({
                                    type: 'warn',
                                    text: '用户不存在'
                                });
                            } else if (data.result == 3) {   // 3：旧密码不正确
                                this.$vux.toast.show({
                                    type: 'warn',
                                    text: '旧密码不正确'
                                });
                            } else if (data.result == 4) {   // 4：两次输入的密码不一致
                                this.$vux.toast.show({
                                    type: 'warn',
                                    text: '两次输入的密码不一致'
                                });
                            }
                        }
                    }
                }, (err) => {
                    console.error(err);
                });
            }
        },
        computed: {
            disabled(){
                return (this.password.old != '' && this.password.new != '' && this.password.confirm != '') ? false : 'disabled';
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '修改密码',
                showBack: true
            });
        }
    }
</script>

<style>
    .pass-change .weui-cells {
        background: #FFFFFF;
        margin: 8px 0px;
    }
</style>