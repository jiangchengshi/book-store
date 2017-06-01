<template>
    <div class="mall">
        <x-header :title="$store.state.header.title"
                  :left-options="{showBack: $store.state.header.showBack, backText: $store.state.header.backText}">
            <router-link to="/search" slot="right">
                <i v-show="$store.state.header.showSearch" class="iconfont icon-sousuo_sousuo"></i>
            </router-link>
            <router-link to="/share" slot="right">
                <i v-show="$store.state.header.showShare" class="iconfont icon-zuihouyibanfenxiang"></i>
            </router-link>
        </x-header>
        <div style="overflow: scroll" :style="{height: height+'px'}">
            <router-view></router-view>
        </div>
        <tabbar>
            <tabbar-item link="/mall" selected>
                <span slot="icon"><i class="iconfont icon-shuchengxuanzhong"></i></span>
                <span slot="label">书城</span>
            </tabbar-item>
            <tabbar-item link="/search">
                <span slot="icon"><i class="iconfont icon-sousuo2"></i></span>
                <span slot="label">搜索</span>
            </tabbar-item>
            <tabbar-item link="/shelf">
                <span slot="icon"><i class="iconfont icon-bookshelf"></i></span>
                <span slot="label">书架</span>
            </tabbar-item>
            <tabbar-item link="/mine">
                <span slot="icon"><i class="iconfont icon-wode1"></i></span>
                <span slot="label">我的</span>
            </tabbar-item>
        </tabbar>
    </div>
</template>

<script>
    import {XHeader, Tabbar, TabbarItem} from 'vux';

    export default {
        name: 'app',
        data(){
            return {
                width: app.config.setting.width.screen,
                height: app.config.setting.height.main
            }
        },
        components: {
            XHeader, Tabbar, TabbarItem
        },
        methods: {
            handleSearch(){
                this.$router.push({path: '/search'})
            }
        }
    }
</script>

<style>
    .mall {
        background: #F8F8F8;
    }

    .fade-enter-active, .fade-leave-active {
        -webkit-transition: opacity .5s;
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-active {
        opacity: 0;
    }
</style>