<template>
    <div class="mine-avatar" :style="{height:height+'px'}" style="background: #000000;">
        <x-header :title="$store.state.header.title"
                  :left-options="{showBack: $store.state.header.showBack, backText: $store.state.header.backText}">
            <span slot="right" @click="show.avatar=true">更改</span>
        </x-header>
        <div style="margin: 100px 0px;">
            <img :src="avatar" :style="{width: width+'px', maxHeight: width+'px'}">
        </div>
        <div style="text-align: center;position: absolute; bottom: 0px;background: #FFFFFF;opacity: 0.5;"
             :style="{width: width+'px'}" v-show="show.upload">
            <span style="display: inline-block; height: 40px;line-height: 40px;" @click="uploadImage">上传</span>
        </div>

        <!-- 更改头像 -->
        <actionsheet v-model="show.avatar" show-cancel :menus="menus" @on-click-menu="clickMenu"></actionsheet>
    </div>
</template>

<script>
    import {XHeader, Actionsheet} from 'vux';
    export default {
        data () {
            return {
                width: app.config.setting.width.display,
                height: app.config.setting.height.display,
                avatar: '',
                show: {
                    avatar: false,
                    upload: false
                },
                menus: [{
                    label: "拍照",
                    value: 'photo'
                }, {
                    label: "从手机相册选择",
                    value: 'album'
                }]
            }
        },
        components: {
            XHeader, Actionsheet
        },
        methods: {
            getData(){
                app.ajax.get(app.config.api.mine.avatar + this.$store.state.user.uid, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            this.avatar = data.avatar;
                        }
                    }
                }, (err) => {
                });
            },
            clickMenu(key){
                switch (key) {
                    case 'photo':
                        if (app.config.setting.isApp) {
                            let camera = plus.camera.getCamera();
                            camera.captureImage((path) => {
                                plus.gallery.save(path, () => {
                                    this.avatar = path;
                                    this.show.upload = true;
                                }, (err) => {
                                    this.$vux.toast.show({
                                        text: '拍照失败：' + err,
                                        type: 'warn'
                                    });
                                }, {filename: '_doc/gallery/', index: 1});
                            })
                        }
                        break;
                    case 'album':
                        if (app.config.setting.isApp) {
                            plus.gallery.pick((path) => {
                                this.avatar = path;
                                this.show.upload = true;
                            }, (err) => {
                                this.$vux.toast.show({
                                    text: '选择图片失败：' + err,
                                    type: 'warn'
                                });
                            }, {filter: 'image'});
                        }
                        break;
                }
            },
            uploadImage(){
                let task = plus.uploader.createUpload(app.config.setting.server + app.config.api.user.avatar,
                    {method: 'POST'}, (upload, status) => { //上传完成
                        if (status == 200) {
                            this.show.upload = false;
                            this.$router.go(-1);
                        } else {
                            this.$vux.toast.show({
                                text: '上传失败，请稍后重试',
                                type: 'warn'
                            });
                        }
                    }
                );
                task.addData('uid', (this.$store.state.user.uid).toString());
                task.addFile(this.avatar, {key: 'pic'});
                task.start();
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '个人头像',
                showBack: true
            });
        },
        mounted(){
            this.getData();
        }
    }
</script>

<style>
    .mine-avatar .vux-header {
        background: #000000;
    }

    .mine-avatar .vux-header .vux-header-title {
        color: #FFFFFF;
    }
</style>