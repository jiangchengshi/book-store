<template>
    <div class="mall-classify-list" style="overflow: scroll;" :style="{height:height+'px'}">
        <template v-for="(data, index) in dataList">
            <group-title>{{data.caption}}</group-title>
            <grid :rows="2">
                <grid-item :link="'/mall/classify/detail?id='+child.id+'&name='+child.name"
                           v-for="(child, index) in data.children" :key="index">
                <span style="float: left;padding-right: 20px;">
                    <label style="color: #162636;">{{child.name}}</label><br>
                    <label style="color: #989A9C;font-size: 13px;">{{child.num}}本</label>
                </span>
                    <img style="width: 40%;" :src="child.cover"/>
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