<template>
    <div class="package">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">{{title}}</h1>
        </header>
        <div class="intro">
            <ul class="mui-table-view">
                <li class="mui-table-view-cell mui-media">
                    <a href="javascript:void(0);" @tap.stop="handleTapView(monthly.id)">
                        <img class="mui-media-object mui-pull-left" :src="monthly.image">
                        <div class="mui-media-body">
                            <span class="name">人民的名义{{monthly.name}}</span>
                        </div>
                        <div class="mui-ellipsis">
                            <span class="desc">最热门的女频小说{{monthly.desc}}</span>
                            <span style="font-size: 14px;color: #989A9C;line-height: 33px;">原价：
                                <label style="text-decoration:line-through;">¥134</label>
                            </span>
                            <span style="font-size: 16px;line-height: 28px;">现价：
                                <label style="color: #FF0000;">¥10/月</label>
                            </span>
                        </div>
                    </a>
                </li>
                <li v-if="isOrdered" class="mui-table-view-cell">
                    <label>2016-12-30到期</label>
                    <button type="button" class="mui-btn mui-btn-primary mui-btn-outlined">续订</button>
                </li>
                <li v-if="isOrdered" class="mui-table-view-cell">
                    <label>到期自动续订</label>
                    <div class="mui-switch mui-active">
                        <div class="mui-switch-handle"></div>
                    </div>
                </li>
            </ul>
            <div v-if="!isOrdered" class="subscribe">
                <button class="mui-btn mui-btn-primary" type="button">
                    立即订阅
                </button>
            </div>
        </div>
        <ListViewBook :url="url" :param="param" @tapView="handleTapView"></ListViewBook>
    </div>
</template>

<script>
    import ListViewBook from '../../components/ListViewBook.vue';

    export default {
        data () {
            return {
                title: '加载中',
                monthly: {},
                url: '',
                param: {},
                isOrdered: false
            }
        },
        components: {
            ListViewBook
        },
        methods: {
            handleTapView(e){
                console.log('child');
                console.log(e);
            }
        }
    }
</script>

<style scoped>
    .package {
        margin: 0;
        padding: 0;
    }

    .package header {
        background-color: white;
    }

    .package .intro {
        background-color: white;
        padding: 60px 10px 0px 10px;
        margin-bottom: 10px;
    }

    .package .intro .mui-table-view:before {
        height: 0px;
    }

    .package .intro .mui-table-view .mui-table-view-cell.mui-media .mui-media-object {
        max-width: 86px;
        height: 120px;
    }

    .package .intro .mui-table-view .mui-media-body {
        margin: 10px 0px;
    }

    .package .intro .mui-table-view .name {
        color: #162636;
        font-size: 18px;
    }

    .package .intro .mui-table-view .mui-ellipsis {
        margin-bottom: 10px;
    }

    .package .intro .mui-table-view span {
        display: block;
    }

    .package .intro .mui-table-view .desc {
        color: #989A9C;
    }

    .package .intro .subscribe {
        border-top: solid 1px #D9D9D9;
        padding: 10px 0px;
    }

    .package .intro button {
        width: 100%;
        line-height: 30px;
    }
</style>