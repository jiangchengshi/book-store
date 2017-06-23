<template>
    <div class="nickname" style="text-align: center;">
        <x-header :title="$store.state.header.title"
                  :left-options="{showBack: $store.state.header.showBack, backText: $store.state.header.backText}">
        </x-header>
        <group>
            <x-input required placeholder="输入昵称" v-model="nickname"></x-input>
        </group>
        <x-button type="primary" action-type="button" :disabled="disabled"
                  style="width:95%;background-color: #35B4EB;line-height: 50px;margin-top: 10px;"
                  @click.native="handleNickName">确定修改
        </x-button>
    </div>
</template>

<script>
    import {XHeader, Group, XInput, XButton} from 'vux';

    export default {
        data () {
            return {
                nickname: ''
            }
        },
        components: {
            XHeader, Group, XInput, XButton
        },
        methods: {
            getData(){
                app.ajax.get(app.config.api.mine.nickname + this.$store.state.user.uid, {},
                    (data) => {
                        this.nickname = data.result.nickname;
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            handleNickName(e){
                app.ajax.post(app.config.api.mine.nickname, {
                    uid: this.$store.state.user.uid,
                    nickname: this.nickname
                }, (data) => {
                    if (data.result.result == 1) { // 1:成功
                        this.$vux.toast.show({
                            text: '修改成功',
                            type: 'info'
                        });
                        this.$router.push({path: '/mine/info'});
                    } else if (data.result.result == 2) { // 2：用户不存在
                        this.$vux.toast.show({
                            type: 'warn',
                            text: '用户不存在'
                        });
                    }
                }, (err) => {
                    this.$vux.toast.show({
                        text: '系统异常，请稍后重试...',
                        type: 'warn'
                    });
                    app.log.error(err);
                });
            }
        },
        computed: {
            disabled(){
                return (this.nickname != '') ? false : 'disabled';
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '昵称',
                showBack: true
            });
        },
        mounted(){
            this.getData();
        }
    }
</script>

<style>
    .nickname .weui-cells {
        background: #FFFFFF;
        margin: 8px 0px;
    }
</style>