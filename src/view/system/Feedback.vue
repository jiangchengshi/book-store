<template>
    <div class="system-feedback">
        <x-header :title="$store.state.header.title"
                  :left-options="{showBack: $store.state.header.showBack, backText: $store.state.header.backText}">
        </x-header>
        <div style="background: #F8F8F8;padding-top: 2px;" :style="{height:height+'px'}">
            <group>
                <x-textarea required v-model="content" placeholder="您的问题和意见"></x-textarea>
            </group>
            <group>
                <x-input required v-model="contact" placeholder="联系方式"></x-input>
            </group>
            <x-button type="primary" action-type="button" :disabled="disabled" @click.native="handleSubmit"
                      style="background-color: #35B4EB;color: #FFFFFF;margin-top: 5px;">提交
            </x-button>
        </div>
    </div>
</template>

<script>
    import {XHeader, Group, XTextarea, XInput, XButton} from 'vux';

    export default {
        data () {
            return {
                height: app.config.setting.height.display - app.config.setting.height.header - 5,
                content: '',
                contact: ''
            }
        },
        components: {
            XHeader, Group, XTextarea, XInput, XButton
        },
        methods: {
            handleSubmit(){
                // 校验内容信息
                if (this.content == '' || this.contact == '') {
                    this.$vux.toast.show({
                        type: 'warn',
                        text: '内容不能为空',
                        isShowMask: true
                    });
                    return;
                }

                // 请求接口
                app.ajax.post(app.config.api.setting.feedback, {
                    uid: this.$store.state.user.uid,
                    content: this.content,
                    contact: this.contact
                }, (data) => {
                    if (data.result.result == 1) { // 1:成功
                        this.$vux.toast.show({
                            text: '感谢您的反馈'
                        });
                        this.$router.go(-1);
                    } else if (data.result.result == 2) {   // 2:用户不存在
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
                return (this.content != '' && this.contact != '') ? false : 'disabled';
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '意见反馈',
                showBack: true
            });
        }
    }
</script>

<style>
    .system-feedback .weui-cells.vux-no-group-title {
        margin: 10px;
    }
</style>