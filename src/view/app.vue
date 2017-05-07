<template>
    <div class="main">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import '../css/mui.css';
    import '../css/iconfont.css';
    export default {
        data () {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        }
    }
</script>

<style scoped>
    body {
        margin: 0;
        padding: 0;
    }

    .fade-enter-active, .fade-leave-active {
        -webkit-transition: opacity .5s;
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-active {
        opacity: 0;
    }
</style>