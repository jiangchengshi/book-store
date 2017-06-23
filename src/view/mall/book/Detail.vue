<template>
    <div class="mall-book-detail" style="height: inherit;">
        <div class="detail" style="margin-top: 20px;height: 140px;background-color: #FFFFFF;">
            <div style="padding: 10px 0px 10px 140px;">
                <div class="title" style="font-family: PingFangSC-Medium;font-size: 16px;color: #162636;">
                    {{detail.articlename}}
                </div>
                <div class="score">
                    <rater v-model="detail.score" slot="value" disabled :font-size="20"></rater>
                    <label style="font-family: PingFangSC-Medium;font-size: 14px;color: #989A9C;line-height: 24px;">{{detail.score}}</label>
                    <label style="font-family: PingFangSC-Regular;font-size: 12px;color: #989A9C;line-height: 24px;">（{{detail.pinfen}}人评分）</label>
                </div>
                <div class="intro"
                     style="opacity: 0.26;font-family: PingFangSC-Regular;font-size: 12px;color: #162636;padding: 8px 0px;">
                    <span>作者：{{detail.author}}</span>
                    <span>分类：{{detail.category}}</span>
                    <span>
                    价格：<label style="color: #EE4D22;">{{detail.price}}阅币</label>/千字 | {{detail.size}}万字
                </span>
                    <span>来源：{{detail.source}}</span>
                </div>
            </div>
            <img :src="detail.cover" style="width: 110px; height: 140px;
                 position:relative;top: -160px;left: 15px;border-radius: 5px;box-shadow: 0 3px 3px #c7c7c7;">
        </div>
        <div style="position:relative; padding-bottom: 10px;text-align: center;background: #FFFFFF;">
            <x-button @click.native="handlePreview"
                      style="font-family: PingFangSC-Medium;font-size: 16px;width: 42%;border-radius: 5px; background: #35B4EB;color: #FFFFFF;margin-right: 20px;line-height: 40px;">
                免费试读
            </x-button>
            <x-button @click.native="handleBatchBuy" plain
                      style="font-family: PingFangSC-Regular;font-size: 16px;width: 42%;border-radius: 5px;color: #989A9C;">
                购买
            </x-button>
        </div>
        <div style="position:relative; display: flex;justify-content: space-around;background: #FFFFFF;
            padding: 8px 0px;margin-top: 2px; margin-bottom: 10px;">
            <a @click="handleTicket">
                <span style="font-size:12px;color: #B4EEB4;">月票</span>
                <div class="label">{{detail.vipvote}}</div>
            </a>
            <a @click="handleFlower">
                <span style="font-size:12px;color: #FF4500;">鲜花</span>
                <div class="label">{{detail.flower}}</div>
            </a>
            <a @click="handleReward">
                <span style="font-size:12px;color: #5CA8E9;">打赏</span>
                <div class="label">{{detail.sale}}</div>
            </a>
        </div>
        <group>
            <cell-box>
                {{detail.intro}}
            </cell-box>
            <cell title="查看目录" :value="'共 '+detail.chapters+' 章'" is-link
                  :link="'/mall/book/catalog?id='+detail.articleid"></cell>
            <cell v-if="detail.keywords && detail.keywords.length>0">
                <label slot="inline-desc" v-for="(key, index) in detail.keywords" :key="index"
                       style="color: #162636; opacity: 0.26; display: inline-block; padding: 5px 8px;border: 1px solid #C3C7CB; border-radius: 5px;">
                    {{key}}
                </label>
            </cell>
        </group>
        <group style="margin-top: 10px;">
            <cell :title="'评论(' + detail.pinfen + ')'" value="全部评论" is-link></cell>
            <c-list-view type="review" :list="reviewList"></c-list-view>
            <cell style="text-align: center;">
                <a slot="inline-desc" style="color: #35B4EB;" @click="handleReview">立即评论</a>
            </cell>
        </group>

        <div style="background: #FFFFFF;color: #162636;padding: 10px 0px 10px 10px;margin-top: 10px;border-bottom: solid 1px #D9D9D9;">
            大家都在看
        </div>
        <swiper loop v-if="publicList.length>0" @on-index-change="changeRecommend">
            <swiper-item v-for="n in 3" :key="n">
                <div v-for="(pub, index) in publicList" :key="index"
                     style="margin: 20px 0px 10px 10px;display: inline-table;">
                    <img :src="pub.image" style="width: 80px;height: 110px;" @click="handlePublic(pub.id)">
                    <div style="font-size:12px;text-overflow: ellipsis;white-space: nowrap;width: 80px;overflow: hidden;">
                        {{pub.name}}
                    </div>
                </div>
            </swiper-item>
        </swiper>
        <div v-else style="padding: 10px;opacity: 0.26;color: #162636;">暂时还没有推荐</div>

        <div style="font-family: PingFangSC-Regular;font-size: 12px;color: #35B4EB;padding: 20px 0px;text-align: center;"
             @click="handleFeedback">
            意见反馈
        </div>

        <!-- 章节购买： -->
        <popup v-model="show.batchBuy" class="popup-batch-buy" @on-first-show="getBatchBuyData">
            <div style="font-family: PingFangSC-Regular;font-size: 20px;color: #162636;border-bottom: solid 1px #EDEDED;padding: 8px 0px;text-align: center;">
                章节购买
            </div>
            <div style="font-family: PingFangSC-Regular;font-size: 15px;color: #162636;padding-left: 15px;">您将从第
                <label style="font-family: PingFangSC-Regular;font-size: 15px;color: #EE4D22;line-height: 40px;">{{batchBuy.input.freecount+1}}</label>
                章开始购买
            </div>
            <group>
                <div style="padding-top: 10px;font-family: PingFangSC-Light;font-size: 16px;color: #57606A;">
                    <checker v-model="batchBuy.num" default-item-class="checker-item"
                             selected-item-class="checker-item-selected" @on-change="changeBatchBuyNum">
                        <checker-item value="10">后10章</checker-item>
                        <checker-item value="50">后50章</checker-item>
                        <checker-item value="100">后100章</checker-item>
                        <checker-item value="0">更多章节</checker-item>
                    </checker>
                </div>
            </group>
            <group>
                <cell title="当前余额">{{$store.state.user.egold}} 阅币</cell>
                <cell title="应付总额">
                    <label style="color: #EE4D22;">{{batchBuy.price}} 阅币</label>
                </cell>
            </group>
            <div style="padding: 20px 0px 10px;">
                <div style="opacity: 0.35;font-family: PingFangSC-Light;font-size: 10px;color: #162636;padding: 5px;">
                    1、批量购买章节是付费章节,如期间有免费章节和购买章节,下载时将一并下载
                </div>
                <div style="opacity: 0.35;font-family: PingFangSC-Light;font-size: 10px;color: #162636;padding: 5px;">
                    2、免费章节及已购买章节不会重复扣费,请放心购买。
                </div>
            </div>
            <x-button type="primary" action-type="button"
                      style="background: #35B4EB;border-radius: 2px;margin-top: 10px;" @click.native="confirmBatchBuy">
                确定购买
            </x-button>
        </popup>
        <!-- 章节购买：批量 -->
        <popup v-model="show.batchBuyInput" class="popup-batch-buy-input">
            <div style="font-family: PingFangSC-Regular;font-size: 20px;color: #162636;border-bottom: solid 1px #EDEDED;padding: 8px 0px;text-align: center;">
                <i style="float: left;padding-left: 10px;" class="iconfont icon-iconjiantou-copy"
                   @click="show.batchBuy=true;show.batchBuyInput=false;"></i>
                批量购买
            </div>
            <div class="buyNum" style="padding: 10px 0px 40px 10px;">
                <span style="display: block;font-family: PingFangSC-Regular;font-size: 15px;color: #162636;padding-bottom: 10px;">
                    购买章节数：
                </span>
                <x-input v-model="batchBuy.num" placeholder="输入想要购买的章节数" @on-change="inputBatchBuyNum"></x-input>
                <span style="display: block;font-family: PingFangSC-Regular;font-size: 15px;color: #162636;float: right;padding-right: 15px;">
                    剩余：<label>{{batchBuy.input.vipcount}}</label> 章
                </span>
            </div>
            <group>
                <cell title="当前余额">{{$store.state.user.egold}} 阅币</cell>
                <cell title="应付总额">
                    <label style="color: #EE4D22;">{{batchBuy.price}} 阅币</label>
                </cell>
            </group>
            <div style="padding: 20px 0px 10px;">
                <div style="opacity: 0.35;font-family: PingFangSC-Light;font-size: 10px;color: #162636;padding: 5px;">
                    1、其中免费的10章，不会重复扣费
                </div>
            </div>
            <x-button type="primary" action-type="button"
                      style="background: #35B4EB;border-radius: 2px;margin-top: 10px;" @click.native="confirmBatchBuy">
                确定购买
            </x-button>
        </popup>

        <!-- 评论 -->
        <c-dialog type="review" :show="show.review" :data="detail" @publish="publishReview"
                  @cancel="show.review=false"></c-dialog>
    </div>
</template>

<script>
    import {Group, Cell, CellBox, Checker, CheckerItem, XInput, XButton, Rater, Popup, Swiper, SwiperItem} from 'vux';
    import CListView from '../../components/ListView.vue';
    import CDialog from '../../components/Dialog.vue';

    export default {
        data () {
            return {
                detail: {},
                reviewList: [],
                publicList: [],
                batchBuy: {
                    num: 0,
                    price: 0,
                    select: {
                        option: [],
                        egold: 0,
                        saleprice: 0
                    },
                    input: {
                        egold: 0,
                        saleprice: 0,
                        freecount: 0,
                        vipcount: 0,
                    }
                },
                show: {
                    batchBuy: false,
                    batchBuyInput: false,
                    review: false
                },
                page: {
                    review: 1,
                    recommend: 1
                }
            }
        },
        components: {
            Group,
            Cell,
            CellBox,
            Checker,
            CheckerItem,
            XInput,
            XButton,
            Rater,
            Popup,
            Swiper,
            SwiperItem,
            CListView,
            CDialog
        },
        methods: {
            initData(){
                this.getBookData();
                this.getReviewData();
                this.getRecommendData();
            },
            getBookData(){
                app.ajax.get(app.config.api.book.detail + this.$route.query.id, {},
                    (data) => {
                        this.detail = data.result;
                        this.$store.commit('updateHeader', {
                            title: data.result.articlename,
                            showBack: true,
                            showShare: true
                        });
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            getReviewData(page){
                app.ajax.get(app.config.api.book.review + this.$route.query.id + '/' + this.page.review, {},
                    (data) => {
                        this.reviewList = data.result;
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            getRecommendData(page){ // 推荐数据
                app.ajax.get(app.config.api.recommend + this.page.recommend, {},
                    (data) => {
                        if (data.result.length > 0) {
                            data.result.pop();
                            this.publicList = data.result;
                        }
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            getBatchBuyData(){
                app.ajax.get(app.config.api.buy.chapters.option + this.$route.query.id + "/" + this.$store.state.user.uid, {},
                    (data) => {
                        Object.assign(this.batchBuy.select, data.result);
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
                app.ajax.get(app.config.api.buy.chapters.price + this.$store.state.user.uid + "/" + this.$route.query.id, {},
                    (data) => {
                        Object.assign(this.batchBuy.input, data.result);
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            handlePreview(){
                this.addShelf(() => {
                    this.$router.push({path: '/reader', query: {id: this.$route.query.id}});
                });
            },
            handleBatchBuy(){
                this.show.batchBuy = true;
            },
            handleTicket(){ // 月票
                this.$router.push({
                    path: '/mall/book/ticket',
                    query: {id: this.$route.query.id, name: this.detail.articlename}
                });
            },
            handleFlower(){ // 鲜花
                this.$router.push({
                    path: '/mall/book/flower',
                    query: {id: this.$route.query.id, name: this.detail.articlename}
                });
            },
            handleReward(){ // 打赏
                this.$router.push({
                    path: '/mall/book/reward',
                    query: {id: this.$route.query.id, name: this.detail.articlename}
                });
            },
            handleReview(){
                this.show.review = true
            },
            handlePublic(id){
                this.$router.push({path: '/mall/book/detail', query: {id: id}});
            },
            handleFeedback(){
                this.$router.push({path: '/feedback'});
            },
            changeBatchBuyNum(){
                if (this.batchBuy.num === '0') {
                    this.show.batchBuyInput = true;
                    this.show.batchBuy = false;
                }
                this.batchBuy.price = this.batchBuy.select.saleprice * this.batchBuy.num;
            },
            inputBatchBuyNum(){
                if (this.batchBuy.num.startsWith('0')) {
                    this.batchBuy.num = this.batchBuy.num.substring(1);
                }
                this.batchBuy.price = this.batchBuy.input.saleprice * this.batchBuy.num;
            },
            addShelf(callback){
                // 1. 本地=> 更新websql： 书架
                app.webSql.query(app.config.webSql.shelf, {
                    articleid: this.$route.query.id
                }, {}, (rows) => {
                    if (!rows || rows.length <= 0) {  // 不存在这本书
                        // 是否已超过8本
                        app.webSql.query(app.config.webSql.shelf, {}, {time: 'ASC'}, (rows) => {
                            if (rows && rows.length >= 8) {
                                // 删除 时间最小的一本
                                app.webSql.delete(app.config.webSql.shelf, {articleid: rows.item(0).articleid});
                            }
                            app.webSql.insert(
                                app.config.webSql.shelf,
                                ['articleid', 'articlename', 'author', 'cover', 'time'],
                                [this.detail.articleid, this.detail.articlename, this.detail.author, this.detail.cover, new Date()]
                            );
                            if (typeof callback == "function") {
                                callback();
                            }
                        });
                    }
                });

                // 2. 请求服务=> 添加书架书籍
                if (app.service.hasNetwork()) {
                    app.ajax.post(app.config.api.shelf.add, {
                        uid: this.$store.state.user.uid,
                        articleid: this.$route.query.id
                    }, (data) => {
                        app.log.info('shelf add book[' + this.$route.query.id + '] => ' + data.result);
                        if (typeof callback == "function") callback();
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
                }
            },
            confirmBatchBuy(){
                app.ajax.post(app.config.api.buy.chapters.batch, {
                    uid: this.$store.state.user.uid,
                    articleid: this.$route.query.id,
                    buynum: this.batchBuy.num
                }, (data) => {
                    if (data.result.result == 1) {  // 1:成功
                        this.$vux.toast.show({
                            text: '购买成功',
                            type: 'info'
                        });
                    } else if (data.result.result == 2) { // 2:用户不存在
                        this.$vux.toast.show({
                            type: 'warn',
                            text: '用户不存在'
                        });
                    } else if (data.result.result == 3) {   // 3：书籍不存在
                        this.$vux.toast.show({
                            type: 'warn',
                            text: '书籍不存在'
                        });
                    }
                }, (err) => {
                    this.$vux.toast.show({
                        text: '系统异常，请稍后重试...',
                        type: 'warn'
                    });
                    app.log.error(err);
                });
            },
            changeRecommend(index){
                this.getRecommendData(++index);
            },
            publishReview(review){
                app.ajax.post(app.config.api.review.add, {
                    uid: this.$store.state.user.uid,
                    articleid: this.$route.query.id,
                    score: review.score,
                    content: review.content
                }, (data) => {
                    if (data.result.result == 1) {
                        this.show.review = false;
                        this.$vux.toast.show({
                            text: '发表成功',
                            type: 'info'
                        });
                    } else if (data.result.result == 2) {
                        this.$vux.toast.show({
                            text: '用户不存在',
                            type: 'warn'
                        });
                    } else if (data.result.result == 3) {
                        this.$vux.toast.show({
                            text: '书籍不存在',
                            type: 'warn'
                        });
                    }
                }, (err) => {
                    this.$vux.toast.show({
                        text: '系统异常，请稍后重试...',
                        type: 'warn'
                    });
                    app.log.error(err);
                });
            },
        },
        watch: {
            '$route': 'initData'
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '加载中',
                showBack: true,
                showShare: true
            });
        },
        mounted(){
            this.initData();
        }
    }
</script>
<style>
    .mall-book-detail .detail span {
        display: block;
    }

    .mall-book-detail .vux-cell-box > div {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #989A9C;
        height: 70px;
        line-height: 25px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .mall-book-detail .xs-container, .mall-book-detail .vux-popup-dialog, .mall-book-detail .vux-slider {
        background: #FFFFFF;
    }

    .mall-book-detail .popup-batch-buy .weui-cells:before {
        border: initial;
    }

    .mall-book-detail .popup-batch-buy .checker-item {
        background: #FFFFFF;
        border: 1px solid #C1CDD6;
        border-radius: 8px;
        width: 160px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        margin-left: 15px;
        margin-bottom: 10px;
    }

    .mall-book-detail .popup-batch-buy .checker-item-selected {
        background: #35B4EB;
        border-radius: 8px;
    }

    .mall-book-detail .popup-batch-buy-input .weui-input {
        border: 1px solid #C1CDD6;
        border-radius: 8px;
        height: 40px;
    }

    .mall-book-detail .popup-batch-buy-input .buyNum .weui-cell:before {
        border: initial;
    }
</style>