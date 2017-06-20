<template>
    <div class="mall-book-detail">
        <div class="detail" style="margin-top: 20px;height: 140px;background-color: #FFFFFF;">
            <div style="padding: 10px 0px 10px 140px;">
                <div class="title" style="font-family: PingFangSC-Medium;font-size: 16px;color: #162636;">
                    {{detail.articlename}}
                </div>
                <div class="score">
                    <rater v-model="score" slot="value" disabled :font-size="20"></rater>
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
            <x-button @click.native="handlePreview()"
                      style="width: 40%;border-radius: 5px; background: #35B4EB;color: #FFFFFF;margin-right: 20px;">
                免费试读
            </x-button>
            <x-button @click.native="handleBuy" plain
                      style="width: 40%;border-radius: 5px;color: #989A9C;">
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
            <a  @click="handleReward">
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
        <swiper loop v-if="publicList.length>0" @on-index-change="changePublic">
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
        <popup v-model="show.buy" class="popup-buy">
            <cell title="章节购买"
                  style="font-family: PingFangSC-Regular;font-size: 20px;color: #162636;border-bottom: solid 1px #EDEDED;"></cell>
            <div style="padding: 10px 0px 20px 10px;">
                <span style="display: block;font-family: PingFangSC-Regular;font-size: 15px;color: #162636;padding-bottom: 10px;">
                    您将从第 <label>10</label> 章开始购买
                </span>
                <label class="buyNum" @click="choiceBuyNum" :class="{'c-active': buyNum==10}"
                       data-buy-num="10">后10章</label>
                <label class="buyNum" @click="choiceBuyNum" :class="{'c-active': buyNum==50}"
                       data-buy-num="50">后50章</label>
                <label class="buyNum" @click="choiceBuyNum" :class="{'c-active': buyNum==100}"
                       data-buy-num="100">后100章</label>
                <label class="buyNum" @click="choiceBuyNum" data-buy-num="0">更多章节</label>
            </div>
            <group>
                <cell title="当前余额">{{$store.state.user.egold}} 阅币</cell>
                <cell title="应付总额">
                    <label style="color: #EE4D22;">123阅币</label>
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
                      style="background: #35B4EB;border-radius: 2px;margin-top: 10px;" @click.native="confirmBuy">
                确定购买
            </x-button>
        </popup>
        <!-- 章节购买：批量 -->
        <popup v-model="show.buyBatch" class="popup-buyBatch">
            <cell title="批量购买"
                  style="font-family: PingFangSC-Regular;font-size: 20px;color: #162636;border-bottom: solid 1px #EDEDED;">
                <i class="iconfont icon-iconjiantou-copy" slot="icon" @click="show.buy=true;show.buyBatch=false;">&nbsp;&nbsp;</i>
            </cell>
            <div class="buyNum" style="padding: 10px 0px 40px 10px;">
                <span style="display: block;font-family: PingFangSC-Regular;font-size: 15px;color: #162636;padding-bottom: 10px;">
                    购买章节数：
                </span>
                <x-input title="" v-model="buyNum" placeholder="输入想要购买的章节数"></x-input>
                <span style="display: block;font-family: PingFangSC-Regular;font-size: 15px;color: #162636;float: right;padding-right: 15px;">
                    剩余：<label>485</label> 章
                </span>
            </div>
            <group>
                <cell title="当前余额">{{$store.state.user.egold}} 阅币</cell>
                <cell title="应付总额">
                    <label style="color: #EE4D22;">123阅币</label>
                </cell>
            </group>
            <div style="padding: 20px 0px 10px;">
                <div style="opacity: 0.35;font-family: PingFangSC-Light;font-size: 10px;color: #162636;padding: 5px;">
                    1、其中免费的10章，不会重复扣费
                </div>
            </div>
            <x-button type="primary" action-type="button"
                      style="background: #35B4EB;border-radius: 2px;margin-top: 10px;" @click.native="confirmBuy">
                确定购买
            </x-button>
        </popup>

        <!-- 评论 -->
        <c-dialog type="review" :show="show.review" :data="detail" @publish="publishReview"
                  @cancel="show.review=false"></c-dialog>
    </div>
</template>

<script>
    import {Group, Cell, CellBox, XInput, XButton, Rater, Popup, Swiper, SwiperItem} from 'vux';
    import CListView from '../../components/ListView.vue';
    import CDialog from '../../components/Dialog.vue';

    export default {
        data () {
            return {
                score: 2,
                detail: {},
                reviewList: [],
                publicList: [],
                buyNum: 0,
                show: {
                    buy: false,
                    buyBatch: false,
                    review: false
                }
            }
        },
        components: {
            Group, Cell, CellBox, XInput, XButton, Rater, Popup, Swiper, SwiperItem, CListView, CDialog
        },
        methods: {
            initData(){
                this.getBookData();
                this.getReviewData(1);
                this.getRecommendData(1);
            },
            getBookData(){
                app.ajax.get(app.config.api.book.detail + this.$route.query.id, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            this.detail = data;
                            this.$store.commit('updateHeader', {
                                title: data.articlename,
                                showBack: true,
                                showShare: true
                            });
                        }
                    }
                }, (err) => {
                });
            },
            getReviewData(page){
                app.ajax.get(app.config.api.book.review + this.$route.query.id + '/' + page, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            this.reviewList = data;
                        }
                    }
                }, (err) => {
                });
            },
            getRecommendData(page){ // 推荐数据
                app.ajax.get(app.config.api.recommend + page, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data && data.length > 0) {
                            data.pop();
                            this.publicList = data;
                        }
                    }
                }, (err) => {
                });
            },
            handlePreview(){
                this.addShelf(() => {
                    this.$router.push({path: '/reader', query: {id: this.$route.query.id}});
                });
            },
            handleBuy(){
                if (this.$store.state.user.uid <= 0) {
                    this.$router.push({path: '/entry/login'});
                    return;
                }
                this.show.buy = true;
            },
            handleTicket(){ // 月票
                if(this.$store.state.user.uid<=0){
                    this.$router.push({path: '/entry/login'});
                    return;
                }
                this.$router.push({path: '/mall/book/ticket', query: {id: this.$route.query.id, name: this.detail.articlename}});
            },
            handleFlower(){ // 鲜花
                if(this.$store.state.user.uid<=0){
                    this.$router.push({path: '/entry/login'});
                    return;
                }
                this.$router.push({path: '/mall/book/flower', query: {id: this.$route.query.id, name: this.detail.articlename}});
            },
            handleReward(){ // 打赏
                if(this.$store.state.user.uid<=0){
                    this.$router.push({path: '/entry/login'});
                    return;
                }
                this.$router.push({path: '/mall/book/reward', query: {id: this.$route.query.id, name: this.detail.articlename}});
            },
            handleReview(){
                if (this.$store.state.user.uid <= 0) {
                    this.$router.push({path: '/entry/login'});
                    return;
                }
                this.show.review = true
            },
            handlePublic(id){
                this.$router.push({path: '/mall/book/detail', query: {id: id}});
            },
            handleFeedback(){

            },
            addShelf(func){
                // 1. 本地=> 更新websql： 书架
//                app.webSql.query(app.config.webSql.shelf, {
//                    articleid: this.$route.query.id
//                }, {}, (rows) => {
//                    if (!rows || rows.length <= 0) {  // 不存在这本书
//                        // 是否已超过8本
//                        app.webSql.query(app.config.webSql.shelf, {}, {time: 'ASC'}, (rows) => {
//                            if (rows && rows.length >= 8) {
//                                // 删除 时间最小的一本
//                                app.webSql.delete(app.config.webSql.shelf, {articleid: rows.item(0).articleid});
//                            }
//                            app.webSql.insert(app.config.webSql.shelf, ['articleid', 'articlename', 'author', 'cover', 'time'], [this.detail.articleid, this.detail.articlename, this.detail.author, this.detail.cover, new Date()]);
//                            if(typeof func=="function"){
//                                func();
//                            }
//                        });
//                    }
//                });

                // 2. 请求服务=> 添加书架书籍
                app.ajax.post(app.config.api.shelf.add, {
                    uid: this.$store.state.user.uid,
                    articleid: this.$route.query.id
                }, (resp) => {
                    if (resp.status == 200) {
                        app.log.info('shelf add book[' + this.$route.query.id + '] => ' + resp.data.result.result);
                        func();
                    }
                }, (err) => {
                });
            },
            choiceBuyNum(e){
                this.buyNum = Number(e.target.dataset.buyNum);

                // 批量输入章节
                if (e.target.dataset.buyNum == 0) {
                    this.show.buyBatch = true;
                    this.show.buy = false;
                }
            },
            confirmBuy(){
                this.$vux.toast({
                    text: '购买成功',
                    type: 'info'
                });
            },
            changePublic(index){
                this.getRecommendData(++index);
            },
            publishReview(review){
                app.ajax.post(app.config.api.review.add, {
                    uid: this.$store.state.user.uid,
                    articleid: this.$route.query.id,
                    score: review.score,
                    content: review.content
                }, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            if (data.result == 1) {
                                this.show.review = false;
                                this.$vux.toast.show({
                                    text: '发表成功',
                                    type: 'info'
                                });
                            } else if (data.result == 2) {
                                this.$vux.toast.show({
                                    text: '用户不存在',
                                    type: 'warn'
                                });
                            } else if (data.result == 3) {
                                this.$vux.toast.show({
                                    text: '书籍不存在',
                                    type: 'warn'
                                });
                            }
                        }
                    }
                }, (err) => {
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

    .mall-book-detail .popup-buy .buyNum {
        display: inline-block;
        width: 140px;
        padding: 5px;
        margin: 8px 10px;
        border: solid 1px #C1CDD6;
        border-radius: 8px;
        font-size: 16px;
        text-align: center;
    }

    .mall-book-detail .popup-buy .c-active {
        background: #35B4EB;
        border-radius: 8px;
    }

    .mall-book-detail .popup-buyBatch .weui-input {
        border: 1px solid #C1CDD6;
        border-radius: 8px;
        height: 40px;
    }

    .mall-book-detail .popup-buyBatch .buyNum .weui-cell:before {
        border: initial;
    }
</style>