<template>
    <div class="system-setting">
        <x-header :title="$store.state.header.title"
                  :left-options="{showBack: $store.state.header.showBack, backText: $store.state.header.backText}">
        </x-header>
        <div style="background: #F8F8F8;padding-top: 2px;" :style="{height: height+'px'}">
            <group style="margin-top: 10px;">
                <x-switch title="接受推送消息" v-model="pushMsg" @on-change="changePushMsg"></x-switch>
            </group>
            <group style="margin-top: 10px;">
                <x-switch title="仅在Wi-Fi时下载" v-model="wifiDown" @on-change="changeWifiDown"></x-switch>
                <x-switch title="自动订购下一章" v-model="autoBuy" @on-change="changeAutoBuy"></x-switch>
                <cell title="清理缓存" @click.native="clearCache">({{cacheSize}}M)</cell>
            </group>
            <group style="margin-top: 10px;">
                <cell title="给阅读书城评价" @click.native="handleAppraise"></cell>
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
                pushMsg: true,
                wifiDown: true,
                autoBuy: true,
                cacheSize: 0
            }
        },
        components: {
            XHeader, Group, XSwitch, Cell, XButton
        },
        methods: {
            initSettingData(){
                this.pushMsg = app.util.localStorage(app.config.storage.pushMsg) == 1 ? true : false;
                this.wifiDown = app.util.localStorage(app.config.storage.wifiDown) == 1 ? true : false;
                this.autoBuy = app.util.localStorage(app.config.storage.autoBuy) == 1 ? true : false;
                if (app.config.setting.isApp) {
                    plus.cache.calculate((size) => {
                        this.cacheSize = size;
                    });
                }
            },
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
            },
            changePushMsg(value){
                app.util.localStorage(app.config.storage.pushMsg, value ? 1 : 2);
            },
            changeWifiDown(value){
                app.util.localStorage(app.config.storage.wifiDown, value ? 1 : 2);
            },
            changeAutoBuy(value){
                app.util.localStorage(app.config.storage.autoBuy, value ? 1 : 2);
            },
            clearCache(){
                if (app.config.setting.isApp) {
                    plus.cache.clear(() => {
                        this.$vux.toast.show({
                            text: '缓存清理完毕'
                        })
                    });
                }
            },
            handleAppraise(){
                if (app.config.setting.isApp) {
                    if (app.config.setting.platform == 'iOS') {
                        /*
                        直接进入appStore
                        */
                        plus.runtime.openURL('https://itunes.apple.com/cn/app/id1230321620');
                    } else if (app.config.setting.platform == 'Android') {
                        /*
                         第一个参数固定为"market://details?id=xxx"，xxx替换为你已上传到应用市场的apk包名
                         第二个参数为失败回调
                         第三个参数为目标程序包名，例如应用宝则为"com.tencent.android.qqdownloader"；若不传第三个参数，则会列出当前所有应用商店，供用户选择。

                         最新版本还需额外配置manifest.json文件，plus节点下增加："schemeWhitelist":["market"]
                         */
                        plus.runtime.openURL('market://details?id=com.sjyt.jyf');
                    }
                }
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '设置',
                showBack: true
            });
        },
        mounted(){
            this.initSettingData();
        }
    }
</script>