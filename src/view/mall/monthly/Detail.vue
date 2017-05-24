<template>
    <div class="detail">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">{{title}}</h1>
        </header>
        <div class="intro">
            <ul class="mui-table-view">
                <li class="mui-table-view-cell mui-media">
                    <a href="javascript:void(0);" class="mui-navigate-right" @tap.stop="handleTapView(monthly.id)">
                        <span class="mui-badge">共{{monthly.num}}本</span>
                        <img class="mui-media-object mui-pull-left" :src="monthly.image">
                        <div class="mui-media-body">
                            <span class="name">{{monthly.name}}</span>
                        </div>
                        <div class="mui-ellipsis">
                            <span class="desc">{{monthly.desc}}</span>
                        </div>
                    </a>
                </li>
                <li class="mui-table-view-cell">
                    <label>2016-12-30到期</label>
                    <button type="button" class="mui-btn mui-btn-primary mui-btn-outlined" v-if="isOrder" >续订</button>
                    <button type="button" class="mui-btn mui-btn-danger mui-btn-outlined" v-else>订购</button>
                </li>
                <li class="mui-table-view-cell">
                    <label>到期自动续订</label>
                    <div class="mui-switch mui-active">
                        <div class="mui-switch-handle"></div>
                    </div>
                </li>
            </ul>
        </div>
        <ListViewMonthly :url="url" :param="param" @tapView="handleTapView"></ListViewMonthly>

        <!-- 底部弹出： 购买包月 -->
        <div class="mui-popover mui-popover-bottom mui-popover-action popover-monthly">
            <img src="http://jjckb.xinhuanet.com/2016-05/20/135374404_14637120163591n.jpg"/>
            <div class="book-intro">
                <span style="font-family:PingFangSC-Medium;font-size: 20px;color: #162636;">人民的名义</span>
                <span style="font-size: 16px;color: #989A9C;">陆毅</span>
                <span style="font-size: 16px;color: #162636;">价格：200乐豆</span>
            </div>
            <div class="book-buy" style="font-size: 16px;">
                <span style="color: #989A9C;">共计支付：<label style="color: #EE4D22;">200乐豆</label></span>
                <span style="color: #989A9C;">账户余额：<label style="color: #162636;">10乐豆</label></span>
            </div>
            <button class="mui-btn mui-btn-primary" type="button" @tap.stop="handlePopBuyBook">购买并下载</button>
        </div>
    </div>
</template>

<script>
    import ListViewMonthly from '../../components/ListViewMonthly.vue';

    export default {
        data () {
            return {
                title: '加载中',
                monthly: {},
                url: app.config.api.monthly,
                param: {},
                isOrder: false
            }
        },
        components: {
            ListViewMonthly
        },
        methods: {
            getData(){
                app.ajax.get(this.url + this.$route.query.id, this.param, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            this.monthly = data;
                        }
                    }
                }, (err) => {

                });
            },
            handleTapView(e){
                console.log('child');
                console.log(e);
                this.$router.push({path: 'monthlyPackage'})
            }
        },
        created(){
            this.getData();
        }
    }
</script>

<style scoped>
    .detail {
        margin: 0;
        padding: 0;
    }

    .detail header {
        background-color: white;
    }

    .detail .intro {
        background-color: white;
        padding: 60px 10px 0px 10px;
        margin-bottom: 10px;
    }

    .detail .intro .mui-table-view .mui-table-view-cell.mui-media .mui-media-object {
        max-width: 60px;
        height: 80px;
    }

    .detail .intro .mui-table-view .mui-table-view-cell button{
        width: 70px;
    }

    .detail .intro .mui-table-view:before {
        height: 0px;
    }

    .detail .intro .mui-table-view .mui-media-body {
        margin: 10px 0px;
    }

    .detail .intro .mui-table-view .name {
        color: #162636;
        font-size: 18px;
    }

    .detail .intro .mui-table-view .mui-ellipsis {
        margin-bottom: 10px;
    }

    .detail .intro .mui-table-view .desc {
        color: #989A9C;
    }
</style>