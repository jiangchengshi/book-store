<!-- 包月列表 -->
<template>
    <div class="list-view-monthly">
        <div class="super">
            <i class="mui-icon iconfont icon-chaozhilibao"></i> 超值包月推荐
        </div>
        <ul class="mui-table-view">
            <li class="mui-table-view-cell mui-media" v-for="data in dataList">
                <a href="javascript:void(0);" class="mui-navigate-right" @tap.stop="handleTapView(data.id)">
                    <span class="mui-badge">共{{data.num}}本</span>
                    <img class="mui-media-object mui-pull-left" :src="data.image">
                    <div class="mui-media-body">
                        <span class="name">{{data.name}}</span>
                    </div>
                    <div class="mui-ellipsis">
                        <span class="desc">{{data.desc}}</span>
                    </div>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                dataList: []
            }
        },
        props: ['url', 'param'],
        methods: {
            getData(){
                app.ajax.get(this.url, this.param, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            this.dataList = data;
                        }
                    }
                }, (err) => {

                });
            },
            handleTapView(e){
                this.$emit('tapView', e);
            }
        },
        created(){
            this.getData();
        }
    }
</script>

<style scoped>
    .list-view-monthly .super {
        line-height: 50px;
        background-color: white;
    }

    .list-view-monthly .super i {
        color: #FCD208;
        margin: 0px 10px;
    }

    .list-view-monthly .mui-table-view {
        padding-top: 44px;
        padding-bottom: 50px;
    }

    .list-view-monthly .mui-table-view .mui-table-view-cell.mui-media .mui-media-object {
        max-width: 60px;
        height: 80px;
    }

    .list-view-monthly .mui-table-view {
        margin: 0;
        padding: 0;
    }

    .list-view-monthly .mui-table-view .mui-media-body {
        margin: 10px 0px;
    }

    .list-view-monthly .mui-table-view .name {
        color: #162636;
        font-size: 18px;
    }

    .list-view-monthly .mui-table-view .mui-ellipsis {
        margin-bottom: 10px;
    }

    .list-view-monthly .mui-table-view .desc {
        color: #989A9C;
    }
</style>