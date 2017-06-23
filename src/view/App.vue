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
                plus.key.addEventListener('backbutton', function (e) {
                    console.log(JSON.stringify(e));
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
