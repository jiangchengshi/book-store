<template>
    <div class="sex">
        <x-header :title="$store.state.header.title"
                  :left-options="{showBack: $store.state.header.showBack, backText: $store.state.header.backText}">
        </x-header>
        <radio v-model="sex" :options="options"></radio>
        <x-button type="primary" action-type="button" :disabled="disabled"
                  style="width:95%;background-color: #35B4EB;line-height: 50px;margin: 20px auto;"
                  @click.native="handleNickName">确定修改
        </x-button>
    </div>
</template>

<script>
    import {XHeader, Radio, XButton} from 'vux';

    export default {
        data () {
            return {
                sex: 3,
                options: [
                    {
                        key: 1,
                        value: '男'
                    },
                    {
                        key: 2,
                        value: '女'
                    },
                    {
                        key: 3,
                        value: '保密'
                    }
                ]
            }
        },
        components: {
            XHeader, Radio, XButton
        },
        methods: {
            getData(){
                app.ajax.get(app.config.api.mine.sex + this.$store.state.user.uid, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            this.sex = data.sex;
                        }
                    }
                }, (err) => {
                    console.error(err);
                });
            },
            handleNickName(e){
                app.ajax.post(app.config.api.mine.sex, {
                    uid: this.$store.state.user.uid,
                    sex: this.sex
                }, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            if (data.result == 1) { // 1:成功
                                this.$vux.toast.show({
                                    text: '修改成功',
                                    type: 'info'
                                });
                                this.$router.push({path: '/mine/info'});
                            } else if (data.result == 2) { // 2：用户不存在
                                this.$vux.toast.show({
                                    type: 'warn',
                                    text: '用户不存在'
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
                return (this.sex > 0 ) ? false : 'disabled';
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '性别',
                showBack: true
            });
        },
        mounted(){
            this.getData();
        }
    }
</script>

<style>
    .sex .weui-cells_radio {
        background: #FFFFFF;
        margin: 8px 0px;
    }

    .sex .weui-btn {
        display: block;
    }
</style>