<template>
    <div class="app">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
        <loading v-model="loading" text="拼命加载中"></loading>
    </div>
</template>

<script>
    import {Loading} from 'vux'

    export default {
        name: 'app',
        components: {
            Loading
        },
        computed: {
            loading(){
                return this.$store.state.loading;
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
