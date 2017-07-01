<template>
    <div class="app">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
        <loading v-model="show" :text="text"></loading>
    </div>
</template>

<script>
    import {Loading} from 'vux';

    export default {
        name: 'app',
        components: {
            Loading
        },
        computed: {
            show(){
                return this.$store.state.loading.show;
            },
            text(){
                return this.$store.state.loading.text;
            }
        },
        mounted(){
            // 监听 物理返回键
            if (app.config.setting.isApp) {
                let first = null;
                plus.key.addEventListener('backbutton', (e) => {
                    if (this.$route.path == "/mall/index" || this.$route.path == "/shelf/index") {
                        if (!first) {
                            first = new Date().getTime();
                            this.$vux.toast.show({
                                text: '再按一次退出',
                                type: 'text',
                                position: 'bottom'
                            });
                            setTimeout(function () {
                                first = null;
                            }, 1500);
                        } else {
                            if (new Date().getTime() - first < 1000) {
                                plus.runtime.quit();
                            }
                        }
                    } else {
                        this.$router.go(-1);
                    }
                }, false);
            }
        }
    }
</script>

<style>
    /* 引入Reset样式*/
    @import "../css/reset.css";

    .fade-enter-active, .fade-leave-active {
        -webkit-transition: opacity .5s;
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-active {
        opacity: 0;
    }
</style>
