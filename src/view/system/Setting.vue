<template>
    <div class="system-setting">
        <x-header :title="$store.state.header.title"
                  :left-options="{showBack: $store.state.header.showBack, backText: $store.state.header.backText}">
        </x-header>
        <div style="background: #F8F8F8;padding-top: 2px;" :style="{height: height+'px'}">
            <group style="margin-top: 10px;">
                <x-switch title="接受推送消息" v-model="acceptPush"></x-switch>
            </group>
            <group style="margin-top: 10px;">
                <x-switch title="仅在Wi-Fi时下载" v-model="wifiDownload"></x-switch>
                <x-switch title="自动订购下一章" v-model="autoBuyNext"></x-switch>
                <cell title="清理缓存">(20M)</cell>
            </group>
            <group style="margin-top: 10px;">
                <cell title="给阅读书城评价"></cell>
                <cell title="关于书城" link="/about"></cell>
            </group>
            <x-button style="height:50px;margin-top: 10px;background: #FFFFFF;color: #35B4EB;" action-type="button"
                      @click.native="handleLogout">退出登录
            </x-button>
        </div>
    </div>
</template>

<script>
    import {XHeader, Group, XSwitch, Cell, XButton} from 'vux';

    export default {
        data () {
            return {
                height: app.config.setting.height.display - app.config.setting.height.header - 2,
                acceptPush: true,
                wifiDownload: true,
                autoBuyNext: true
            }
        },
        components: {
            XHeader, Group, XSwitch, Cell, XButton
        },
        methods: {
            handleLogout(){
                let _this = this;
                this.$vux.confirm.show({
                    title: '系统提示',
                    content: '确认退出系统?',
                    onConfirm () {
                        _this.$store.commit('updateUser', undefined);
                        _this.$router.push({path: '/entry/logout'});
                    }
                });
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '设置',
                showBack: true
            });
        }
    }
</script>

<style scoped>
    .main {
        margin: 0;
        padding: 0;
    }
</style>