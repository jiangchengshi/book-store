<template>
    <div class="app">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
        <mt-tabbar v-model="selected" v-show="$store.state.mall.tabBar">
            <mt-tab-item id="mall">
                <span slot="icon" class="mui-icon iconfont icon-shuchengxuanzhong"></span>
                <span class="tab-label">书城</span>
            </mt-tab-item>
            <mt-tab-item id="search">
                <span slot="icon" class="mui-icon iconfont icon-sousuo1"></span>
                <span class="tab-label">搜索</span>
            </mt-tab-item>
            <mt-tab-item id="shelf">
                <span slot="icon" class="mui-icon iconfont icon-bookshelf"></span>
                <span class="tab-label">书架</span>
            </mt-tab-item>
            <mt-tab-item id="mime">
                <span slot="icon" class="mui-icon iconfont icon-wode3"></span>
                <span class="tab-label">我的</span>
            </mt-tab-item>
        </mt-tabbar>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                selected: 'shelf'
            }
        },
        watch: {
            selected(val, oldVal){
                this.$router.push({path: val});
            }
        }
    }
</script>

<style scoped>
    .fade-enter-active, .fade-leave-active {
        -webkit-transition: opacity .5s;
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-active {
        opacity: 0;
    }

    .app .iconfont {
        font-size: 20px;
    }
</style>