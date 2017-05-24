<!-- 书籍列表 -->
<template>
    <ul class="mui-table-view list-view-book">
        <li class="mui-table-view-cell mui-media" v-for="data in dataList">
            <a href="javascript:void(0);" @tap.stop="handleTapView">
                <img class="mui-media-object mui-pull-left" :src="data.image">
                <div class="mui-media-body">
                    <span class="title">{{data.name}}</span>
                    <span class="score">
                        <i class="mui-icon iconfont icon-star active" v-for="s in data.score"></i>
                        <i class="mui-icon iconfont icon-star" v-for="s in (5-data.score)"></i>
                    </span>
                    <p class="mui-ellipsis">{{data.intro}}</p>
                    <p class="mui-ellipsis author">{{data.author}}</p>
                </div>
            </a>
        </li>
    </ul>
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
                console.log('parent');
                console.log(e);
                this.$emit('tapView');
            }
        },
        created(){
            this.getData();
        }
    }
</script>

<style>
    .mui-table-view.list-view-book {
        padding-top: 44px;
        padding-bottom: 50px;
    }

    .mui-table-view.list-view-book .mui-table-view-cell.mui-media .mui-media-object {
        max-width: 60px;
        height: 80px;
    }

    .mui-table-view.list-view-book .mui-media-body .title {
        font-size: 18px;
        font-weight: bold;
    }

    .mui-table-view.list-view-book .mui-media-body .score {
        display: block;
    }

    .mui-table-view.list-view-book .mui-media-body .score .active {
        color: #FFAC2D;
    }

    .mui-table-view.list-view-book .mui-media-body .author {
        font-size: 15px;
    }
</style>