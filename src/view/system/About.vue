<template>
    <div class="setting-about">
        <x-header :title="$store.state.header.title"
                  :left-options="{showBack: $store.state.header.showBack, backText: $store.state.header.backText}">
        </x-header>
        <div style="text-align: center;background: #F8F8F8;" :style="{height:height+'px'}">
            <img src="../../image/icon.png" width="100px" style="margin-top: 100px;">
            <div style="font-family: PingFangSC-Medium;font-size: 18px;color: #162636;margin-top: 10px;">{{appName}}
            </div>
            <div style="opacity: 0.56;font-family: PingFangSC-Regular;font-size: 15px;color: #162636;margin-top: 10px;">
                {{version.versionname}}
            </div>
            <x-button action-type="button" @click.native="checkUpdate"
                      style="background: #35B4EB;border-radius: 4px;color: #FFFFFF;margin-top: 50px;width: 80%;">检查更新
            </x-button>
        </div>

        <!-- 更新 -->
        <c-dialog type="updates" :show="show.updates" :data="version" @confirm="handleUpdate"
                  @cancel="show.updates=false"></c-dialog>
    </div>
</template>

<script>
    import {XHeader, XButton} from 'vux';
    import CDialog from '../components/Dialog.vue';

    export default {
        data () {
            return {
                height: app.config.setting.height.display - app.config.setting.height.header,
                appName: app.config.setting.appName,
                version: {},
                show: {
                    updates: false
                }
            }
        },
        components: {
            XHeader, XButton, CDialog
        },
        methods: {
            checkUpdate(){
                app.service.checkUpdate((version) => {
                    this.version = version;
                }, (version) => {
                    this.version = version;
                    this.$vux.toast.show({
                        text: '当前已是最新版本'
                    });
                });
            },
            handleUpdate(){

            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '关于书城',
                showBack: true
            });
        },
        mounted(){
            this.checkUpdate();
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