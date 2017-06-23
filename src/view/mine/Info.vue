<template>
    <div class="mine-info">
        <x-header :title="$store.state.header.title"
                  :left-options="{showBack: $store.state.header.showBack, backText: $store.state.header.backText}">
        </x-header>
        <group>
            <cell title="头像" is-link link="/mine/avatar">
                <img :src="info.avatar" style="width: 60px;height: 60px;">
            </cell>
            <cell title="昵称" is-link link="/mine/nickname">
                <span>{{info.username}}</span>
            </cell>
            <cell title="性别" is-link link="/mine/sex">
                <span v-if="info.sex==0">男</span>
                <span v-if="info.sex==1">女</span>
                <span v-if="info.sex==2">保密</span>
            </cell>
        </group>
        <group>
            <cell title="修改密码" is-link link="/mine/password/change"></cell>
        </group>
    </div>
</template>

<script>
    import {XHeader, Group, Cell, XButton} from 'vux';

    export default {
        data () {
            return {
                info: {
                    username: '',
                    avatar: '',
                    sex: 0
                }
            }
        },
        components: {
            XHeader, Group, Cell, XButton
        },
        methods: {
            getUserBaseData(){
                app.ajax.get(app.config.api.mine.base + this.$store.state.user.uid, {},
                    (data) => {
                        this.info = data.result;
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '个人资料',
                showBack: true
            });
        },
        mounted(){
            this.getUserBaseData();
        }
    }
</script>

<style>
    .mine-info div img {
        /* 更好支持border-radius */
        border-top-left-radius: 999px; /* 左上角 */
        border-top-right-radius: 999px; /* 右上角 */
        border-bottom-right-radius: 999px; /* 右下角 */
        border-bottom-left-radius: 999px; /* 左下角 */
        border-radius: 999px;
        /*background-color: #ccc;*/
        /*background-clip: padding-box;*/
    }

    .mine-info .weui-cells.vux-no-group-title {
        margin: 8px 0px;
    }
</style>