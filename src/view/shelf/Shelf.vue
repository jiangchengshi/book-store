<template>
    <div class="shelf">
        <x-header :title="$store.state.header.title"
                  :left-options="{showBack: $store.state.header.showBack, backText: $store.state.header.backText}">
            <span slot="right" @click="handleTidy" style="color:#35B4EB;">{{$store.state.header.tidyText}}</span>
        </x-header>
        <div style="overflow: scroll;background-color: #F8F8F8;" :style="{height: height+'px'}">
            <router-view></router-view>
        </div>
        <tabbar>
            <tabbar-item link="/mall">
                <span slot="icon"><i class="iconfont icon-shuchengxuanzhong"></i></span>
                <span slot="label">书城</span>
            </tabbar-item>
            <tabbar-item link="/search">
                <span slot="icon"><i class="iconfont icon-sousuo2"></i></span>
                <span slot="label">搜索</span>
            </tabbar-item>
            <tabbar-item link="/shelf" selected>
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
        data () {
            return {
                width: app.config.setting.width.display,
                height: app.config.setting.height.display - app.config.setting.height.header - app.config.setting.height.tabbar
            }
        },
        components: {
            XHeader, Tabbar, TabbarItem
        },
        methods: {
            handleTidy(){
                let tidyText = this.$store.state.header.tidyText == '整理' ? '完成' : '整理';
                this.$store.commit('updateHeader', {
                    title: '书架',
                    tidyText: tidyText
                });
            }
        }
    }
</script>