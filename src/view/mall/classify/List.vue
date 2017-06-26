<template>
    <div class="mall-classify-list" style="overflow: scroll;" :style="{height:height+'px'}">
        <template v-for="(data, index) in dataList">
            <group-title>{{data.caption}}</group-title>
            <grid :rows="2">
                <grid-item :link="'/mall/classify/detail?id='+child.id+'&name='+child.name"
                           v-for="(child, index) in data.children" :key="index">
                    <div style="padding-right: 20px;">
                        <label style="color: #162636;">{{child.name}}</label><br>
                        <label style="color: #989A9C;font-size: 13px;">{{child.num}}本</label>
                    </div>
                    <div style="margin-top: -45px;" v-if="child.cover">
                        <img :src="child.cover[1]"
                             style="width: 45px;height: 60px;transform: scale3d(0.8,0.8,1);position: relative;left: 72px;box-shadow: 2px 5px 2px #888888;">
                        <img :src="child.cover[2]"
                             style="width: 45px;height: 60px;transform: scale3d(0.8,0.8,1);position: relative;left: 62px;box-shadow: 2px 5px 2px #888888;">
                        <img :src="child.cover[0]"
                             style="width: 45px;height: 60px;transform: scale3d(1,1,1);position: relative;left: -5px;box-shadow: 2px 5px 2px #888888;">
                    </div>
                </grid-item>
            </grid>
        </template>
    </div>
</template>

<script>
    import {GroupTitle, Grid, GridItem} from 'vux';

    export default {
        data () {
            return {
                height: app.config.setting.height.display - app.config.setting.height.header - app.config.setting.height.tabbar,
                dataList: []
            }
        },
        components: {
            GroupTitle, Grid, GridItem
        },
        methods: {
            getData(){
                app.ajax.get(app.config.api.classify, {},
                    (data) => {
                        this.dataList = data.result;
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '分类',
                showBack: true,
                showSearch: true
            });
        },
        mounted(){
            this.getData();
        }
    }
</script>

<style>
    .mall .mall-classify-list .weui-grids {
        background-color: #FFFFFF;
    }
</style>