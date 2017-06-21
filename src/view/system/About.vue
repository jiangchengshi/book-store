<template>
    <div class="setting-about">
        <x-header :title="$store.state.header.title"
                  :left-options="{showBack: $store.state.header.showBack, backText: $store.state.header.backText}">
        </x-header>
        <div style="text-align: center;background: #F8F8F8;" :style="{height:height+'px'}">
            <img src="../../image/icon.png" width="100px" style="margin-top: 100px;">
            <div style="font-family: PingFangSC-Medium;font-size: 18px;color: #162636;margin-top: 10px;">书城名称</div>
            <div style="opacity: 0.56;font-family: PingFangSC-Regular;font-size: 15px;color: #162636;margin-top: 10px;">
                1.0.0版本
            </div>
            <x-button action-type="button" @click.native="handleUpdate"
                      style="background: #35B4EB;border-radius: 4px;color: #FFFFFF;margin-top: 50px;width: 80%;">检查更新
            </x-button>
        </div>
    </div>
</template>

<script>
    import {XHeader, XButton} from 'vux';

    export default {
        data () {
            return {
                height: app.config.setting.height.display - app.config.setting.height.header
            }
        },
        components: {
            XHeader, XButton
        },
        methods: {
            handleUpdate(){
                this.$vux.toast.show({
                    text: '当前已是最新版本'
                });
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '关于书城',
                showBack: true
            });
        }
    }
</script>
<style>
    .setting-about img {
        /* 更好支持border-radius */
        border-top-left-radius: 999px; /* 左上角 */
        border-top-right-radius: 999px; /* 右上角 */
        border-bottom-right-radius: 999px; /* 右下角 */
        border-bottom-left-radius: 999px; /* 左下角 */
        border-radius: 999px;
        /*background-color: #ccc;*/
        /*background-clip: padding-box;*/
    }
</style>