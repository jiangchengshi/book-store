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
            <a>
                <span style="font-size:12px;color: #B4EEB4;">月票</span>
                <div class="label">{{detail.vipvote}}</div>
            </a>
            <a>
                <span style="font-size:12px;color: #FF4500;">鲜花</span>
                <div class="label">{{detail.flower}}</div>
            </a>
            <a>
                <span style="font-size:12px;color: #5CA8E9;">打赏</span>
                <div class="label">{{detail.sale}}</div>
            </a>
        </div>
        <group>
            <cell-box>
                {{detail.intro}}
            </cell-box>
            <cell title="查看目录" :value="'共 '+detail.chapters+' 章'" is-link :link="'/mall/book/catalog?id='+detail.articleid"></cell>
            <cell v-if="detail.keywords && detail.keywords.length>0">
                <label slot="inline-desc" v-for="(key, index) in detail.keywords" :key="index"
                       style="color: #162636; opacity: 0.26; display: inline-block; padding: 5px 8px;border: 1px solid #C3C7CB; border-radius: 5px;">
                    {{key}}
                </label>
            </cell>
        </group>
        <group>
            <cell :title="'评论(' + detail.pinfen + ')'" value="全部评论" is-link></cell>
            <c-list-view type="review" :list="review"></c-list-view>
            <cell style="text-align: center;">
                <a slot="inline-desc">立即评论</a>
            </cell>
        </group>
    </div>
</template>

<script>
    import {Group, Cell, CellBox, XButton, Rater} from 'vux';
    import CListView from '../../components/ListView.vue';

    export default {
        data () {
            return {
                score: 2,
                detail: {},
                review: []
            }
        },
        components: {
            Group, Cell, CellBox, XButton, Rater, CListView
        },
        methods: {
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
                            this.review = data;
                        }
                    }
                }, (err) => {
                });
            },
            handlePreview(){
                // 更新websql： 书架
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
                            app.webSql.insert(app.config.webSql.shelf, ['articleid', 'articlename', 'author', 'cover', 'time'], [this.detail.articleid, this.detail.articlename, this.detail.author, this.detail.cover, new Date()]);
                        });
                    }
                });
                this.$router.push({path: '/reader', query: {id: this.$route.query.id}});
            },
            handleBuy(){

            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '加载中',
                showBack: true,
                showShare: true
            });
        },
        mounted(){
            this.getBookData();
            this.getReviewData(1);
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
</style>