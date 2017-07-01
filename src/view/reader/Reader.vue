<template>
    <div>
        <div class="reader" ref="reader">
            <div class="pull-layer">
                <template v-if="content.mark">
                    <label style="display: block;line-height: 50px;">
                        继续向下拖动删除书签
                    </label>
                    <img src="../../image/markDel.png" style="width: 40px;">
                </template>
                <template v-else>
                    <label style="display: block;line-height: 50px;">
                        继续向下拖动添加书签
                    </label>
                    <img src="../../image/markPull.png" style="width: 40px;">
                </template>
            </div>
            <x-header v-show="$store.state.reader.header" title="" :left-options="{backText:''}"
                      :right-options="{showMore: true}" @on-click-more="show.more=true"
                      :style="{backgroundColor: setting.bgColor.header, color: setting.color.header}">
                <a class="iconfont icon-dashang2" slot="right" @click="show.reward = true"></a>
                <a class="iconfont icon-xiazai" slot="right" @click="show.batchBuy = true"></a>
                <a class="iconfont icon-shuqian_bookmark" slot="right" @click="toggleMark"></a>
            </x-header>
            <div class="chapter" style="padding: 0px 10px;"
                 :style="{height: screenHeight+'px',backgroundColor: setting.bgColor.chapter,color: setting.color.chapter}">
                <div class="title" style="height: 46px; line-height: 46px;"
                     :style="{width: (width-20)+'px', opacity:setting.opacity.title}">
                    {{data.chapter.articlename}}
                    <img v-show="content.mark" src="../../image/mark.png" style="width: 20px;float: right;">
                </div>
                <div class="content" ref="content" @touchstart="touchStart" @touchend="touchEnd" @touchmove="touchMove"
                     :style="{lineHeight: setting.lineHeight+'px',opacity: setting.opacity.content,fontSize: setting.fontSize+'px'}">
                    <transition @before-enter="transBeforeEnter" @enter="transEnter"
                                @leave="transLeave" @after-leave="transAfterLeave" :css="false">
                        <div v-show="content.switch" style="column-gap:20px"
                             :style="{'column-width':width+'px',height: contentHeight+'px'}"
                             v-html="data.chapter.content">
                        </div>
                    </transition>
                </div>
                <div class="status" style="height: 56px;line-height: 56px;"
                     :style="{width: (width-20)+'px', opacity:setting.opacity.status}">
                    <i v-if="status.battery<10" class="iconfont icon-dianliang1"></i>
                    <i v-else-if="status.battery<30" class="iconfont icon-dianliang2"></i>
                    <i v-else-if="status.battery<60" class="iconfont icon-dianliang3"></i>
                    <i v-else-if="status.battery<90" class="iconfont icon-dianliang4"></i>
                    <i v-else class="iconfont icon-dianliang5"></i>
                    <span style="opacity: 0.56;font-family: PingFangSC-Regular;font-size: 14px;color: #1F1F1F;padding-left: 10px;">
                    {{status.time}}
                </span>
                    <span style="float: right;">
                    {{status.progress}} %
                </span>
                </div>
            </div>
            <tabbar v-show="$store.state.reader.tabBar"
                    :style="{backgroundColor: setting.bgColor.tabbar, color: setting.color.tabbar}">
                <tabbar-item @on-item-click="clickTabbar">
                    <span slot="icon"><i class="iconfont icon-mulu1"></i></span>
                    <span slot="label">目录</span>
                </tabbar-item>
                <tabbar-item @on-item-click="clickTabbar">
                    <span slot="icon"><i class="iconfont icon-diaozhengjindu-copy"></i></span>
                    <span slot="label">进度</span>
                </tabbar-item>
                <tabbar-item @on-item-click="clickTabbar">
                    <span slot="icon"><i class="iconfont icon-aa"></i></span>
                    <span slot="label">设置</span>
                </tabbar-item>
                <tabbar-item @on-item-click="clickTabbar">
                    <span slot="icon"><i class="iconfont" :class="[setting.dayNightIcon]"></i></span>
                    <span slot="label">{{setting.dayNight}}</span>
                </tabbar-item>
            </tabbar>
        </div>

        <!-- 目录：侧滑菜单 -->
        <popup v-model="show.catalog" position="left" width="75%" class="popup-catalog">
            <div style="background-color: #FFFFFF;height: 46px; line-height: 46px; padding: 0px 10px;">
                <span>{{data.chapter.articlename}}</span>
                <span class="iconfont icon-paixu" style="float: right;"></span>
            </div>
            <tab v-model="catalog.selected" style="height: 53px;">
                <tab-item @on-item-click="changeTabItem" selected><i class="iconfont icon-mulu1"></i></tab-item>
                <tab-item @on-item-click="changeTabItem"><i class="iconfont icon-bookmark"></i></tab-item>
                <tab-item @on-item-click="changeTabItem"><i class="iconfont icon-biji"></i></tab-item>
            </tab>
            <swiper v-model="catalog.selected" :show-dots="false" :height="contentHeight+'px'">
                <swiper-item>
                    <div v-if="data.chapters && data.chapters.length<=0" style="text-align: center;margin-top: 40px;">
                        <img src="../../image/unMatch.png" width="60px">
                        <div style="font-size: 14px;">对不起，没有获取到书籍目录！</div>
                    </div>
                    <div v-else>
                        <scroller :on-infinite="handleInfinite">
                            <group>
                                <cell v-for="(chapter, index) in data.chapters" :key="index"
                                      @click.native="clickCatalog(chapter)">
                                    <span slot="title" v-if="chapter.isvip==0">{{chapter.chaptername}}</span>
                                    <template v-else>
                                        <span slot="title" style="color: #989A9C;">{{chapter.chaptername}}</span>
                                        <i class="iconfont icon-lock"></i>
                                    </template>
                                </cell>
                            </group>
                        </scroller>
                    </div>
                </swiper-item>
                <swiper-item>
                    <div v-if="data.marks && data.marks.length<=0" style="text-align: center;margin-top: 40px;">
                        <img src="../../image/unMatch.png" width="60px">
                        <div style="font-size: 14px;">对不起，暂无书签记录！</div>
                    </div>
                    <div v-else>
                        <group>
                            <cell v-for="(mark, index) in data.marks" :key="index">
                                <span slot="title">{{mark.name}}</span>
                                <span>{{mark.translateX}}</span>
                                <span slot="title" style="color: #989A9C;">{{mark.time}}</span>
                            </cell>
                        </group>
                    </div>
                </swiper-item>
                <swiper-item>
                    <div v-if="data.notes && data.notes.length<=0" style="text-align: center;margin-top: 40px;">
                        <img src="../../image/unMatch.png" width="60px">
                        <div style="font-size: 14px;">对不起，暂无笔记记录！</div>
                    </div>
                    <div v-else>
                        <group>
                            <cell v-for="(note, index) in data.notes" :key="index">
                                <span slot="title">{{note.name}}</span>
                                <span>{{note.translateX}}</span>
                                <span slot="title" style="color: #989A9C;">{{note.time}}</span>
                            </cell>
                        </group>
                    </div>
                </swiper-item>
            </swiper>
        </popup>

        <!-- 进度：滑块条 -->
        <popup v-model="show.progress" class="popup-progress">
            <group>
                <cell-box :style="{width: (width-30)+'px'}">
                    <div style="position:relative;top: 10px;font-size: 15px;" @click="turnPage('prev')">上一章</div>
                    <range v-if="show.progress" :min="chapterId.min" :max="chapterId.max"
                           minHTML="&nbsp;" maxHTML="&nbsp;"
                           style="width:200px;margin-left: 70px;" @on-change="changeChapter"></range>
                    <div style="position:relative;left: 300px;bottom:10px;font-size: 15px;" @click="turnPage('next')">
                        下一章
                    </div>
                </cell-box>
            </group>
        </popup>
        <!-- 进度：章节信息 -->
        <popup v-model="show.progress" class="popup-progress-tip" is-transparent>
            <div style="width: 95%;background-color:#fff;border-radius:5px;padding-top:10px; text-align: center;">
                <span style="color: #162636;letter-spacing: 0;font-size: 14px;display: block;line-height: 20px;">
                    {{data.chapter.articlename}}
                </span>
                <span style="color: #EE4D22;letter-spacing: 0;font-size: 16px;line-height: 40px;">
                    {{status.progress}} %
                </span>
            </div>
        </popup>

        <!-- 设置：亮度、字体、翻页、排版、背景色 -->
        <popup v-model="show.setting" class="popup-setting">
            <group>
                <cell title="亮度" primary="content">
                    <range v-model="setting.brightness" v-if="show.setting"
                           minHTML="<i style='font-size:16px;' class='iconfont icon-liangdu'></i>"
                           maxHTML="<i style='font-size:24px;' class='iconfont icon-liangdu'></i>"
                           @on-change="changeBrightness"></range>
                </cell>
                <cell title="字体" primary="content" class="font">
                    <i v-if="setting.fontStyle=='F'" class="iconfont icon-fanzhuanjian" data-font-size="F"
                       @click="changeFontSize"
                       style="font-size:18px;padding: 5px 8px;border: solid 1px"></i>
                    <i v-else-if="setting.fontStyle=='J'" class="iconfont icon-jianzhuanfan" data-font-size="J"
                       @click="changeFontSize"
                       style="font-size:18px;padding: 5px 8px;border: solid 1px"></i>
                    <i class="iconfont icon-a1" style="font-size:18px;padding: 5px 35px;border: solid 1px"
                       data-font-size="-" @click="changeFontSize"></i>
                    <span>{{setting.fontSize}}</span>
                    <i class="iconfont icon-a" style="font-size:18px;padding: 5px 35px;border: solid 1px"
                       data-font-size="+" @click="changeFontSize"></i>
                </cell>
                <cell title="翻页" primary="content" class="turn">
                    <i :class="{'setting-active': setting.turnModel==1}" data-turn-model="1"
                       @click="changeTurnModel">滑动</i>
                    <i :class="{'setting-active': setting.turnModel==2}" data-turn-model="2"
                       @click="changeTurnModel">覆盖</i>
                </cell>
                <cell title="排版" primary="content" class="compose">
                    <i :class="{'setting-active': setting.lineHeight==25}" class="iconfont icon-2fuben-copy"
                       data-line-height="25" @click="changeLineHeight"></i>
                    <i :class="{'setting-active': setting.lineHeight==35}" class="iconfont icon-2" data-line-height="35"
                       @click="changeLineHeight"></i>
                    <i :class="{'setting-active': setting.lineHeight==45}" class="iconfont icon-3" data-line-height="45"
                       @click="changeLineHeight"></i>
                    <i :class="{'setting-active': setting.lineHeight==30}" data-line-height="30"
                       style="font-size:16px;padding: 5px 12px;" @click="changeLineHeight">无</i>
                    <i class="iconfont icon-add" data-line-height="0"
                       style="width: initial;height:initial;font-size:16px;padding: 6px 12px;"
                       @click="changeLineHeight"></i>
                </cell>
                <cell title="背景" primary="content" class="background">
                    <i style="background: #FFFFFF;border: 1px solid #35B4EB;" data-bg-color="#FFFFFF"
                       @click="changeBgColor"></i>
                    <i style="background: #EFDBBC;border: 1px solid #D8D8D8;" data-bg-color="#EFDBBC"
                       @click="changeBgColor"></i>
                    <i style="background: #D6E8C8;border: 1px solid #D8D8D8;" data-bg-color="#D6E8C8"
                       @click="changeBgColor"></i>
                    <i style="background: #FCE2E2;border: 1px solid #D8D8D8;" data-bg-color="#FCE2E2"
                       @click="changeBgColor"></i>
                    <i class="iconfont icon-add" data-bg-color="0" @click="changeBgColor"
                       style="width: initial;height:initial;font-size: 16px;padding: 4px 14px;border: solid 1px;"></i>
                </cell>
            </group>
        </popup>

        <!-- 更多：操作菜单 -->
        <actionsheet v-model="show.more" :menus="data.menuMore" class="actionsheet-more"
                     @on-click-menu="clickMore"></actionsheet>

        <!-- 下载：章节购买： -->
        <c-popup-buy type="batch" :show="show.batchBuy" @checkBatchBuyNum="checkBatchBuyNum"
                     @confirmBatchBuy="confirmBatchBuy" @cancel="show.batchBuy=false"></c-popup-buy>
        <!-- 章节购买：批量 -->
        <c-popup-buy type="batchInput" :show="show.batchBuyInput" @inputBatchBuyNum="inputBatchBuyNum"
                     @inputBack="inputBack" @confirmBatchBuy="confirmBatchBuy"
                     @cancel="show.batchBuyInput=false"></c-popup-buy>
        <!-- 目录购买-->
        <c-popup-buy type="catalog" :show="show.catalogBuy" :data="data.catalog"
                     @confirmCatalogBuy="confirmCatalogBuy" @cancel="show.catalogBuy=false"></c-popup-buy>

        <!-- 打赏： -->
        <popup v-model="show.reward" class="popup-reward">
            <group title="选择打赏金额">
                <div style="padding: 20px 0px;font-family: PingFangSC-Light;font-size: 16px;color: #57606A;">
                    <checker v-model="rewardCoin" default-item-class="checker-item"
                             selected-item-class="checker-item-selected">
                        <checker-item value="100">100阅币</checker-item>
                        <checker-item value="500">500阅币</checker-item>
                        <checker-item value="1000">1000阅币</checker-item>
                        <checker-item value="2000">2000阅币</checker-item>
                        <checker-item value="10000">10000阅币</checker-item>
                    </checker>
                </div>
                <x-input title="其他金额" v-model="rewardCoin" placeholder="输入具体金额打赏作者(单位：阅币)"
                         style="font-family: PingFangSC-Regular;font-size: 14px;color: #162636;"></x-input>
            </group>
            <x-button action-type="button"
                      style="background: #35B4EB;border-radius: 5px;color: #FFFFFF;margin-top: 15px;"
                      @click.native="clickReward">
                确定打赏
            </x-button>
        </popup>

        <!-- 分享书籍 -->
        <popup v-model="show.share" class="popup-share" @on-first-show="getShareData">
            <group>
                <cell-box>
                    <div :style="{width:(width-30)+'px'}" style="padding:5px 0px;text-align: center;">
                        <div v-for="(share, index) in data.shares" :key="index"
                             style="display: inline-block;margin: 0px 10px;">
                            <img :src="share.img">
                            <div style="font-family: PingFangSC-Light;font-size: 12px;color: #989A9C;">
                                {{share.name}}
                            </div>
                        </div>
                    </div>
                </cell-box>
            </group>
            <group>
                <x-button action-type="button" style="background: #FFFFFF;"
                          @click.native="show.more=true;show.share=false;">取消
                </x-button>
            </group>
        </popup>
    </div>
</template>

<script>
    import {
        XHeader,
        Tabbar,
        TabbarItem,
        Popup,
        Tab,
        TabItem,
        Swiper,
        SwiperItem,
        Group,
        Cell,
        CellBox,
        XInput,
        Range,
        Actionsheet,
        XButton,
        Checker,
        CheckerItem,
        dateFormat,
        base64
    } from 'vux';
    import CPopupBuy from '../components/PopupBuy.vue';

    export default {
        name: 'reader',
        data () {
            return {
                width: app.config.setting.width.screen,
                screenHeight: app.config.setting.height.screen,
                contentHeight: app.config.setting.height.screen - app.config.setting.height.header - app.config.setting.height.tabbar,
                show: {
                    more: false,
                    catalog: false,
                    progress: false,
                    setting: false,
                    batchBuy: false,
                    batchBuyInput: false,
                    catalogBuy: false,
                    reward: false,
                    share: false
                },
                setting: {
                    brightness: 0,
                    fontStyle: 'F',
                    fontSize: 16,
                    turnModel: 1,
                    lineHeight: 30,
                    dayNight: '夜间',
                    dayNightIcon: 'icon-yejian',
                    bgColor: {
                        header: '#FFFFFF',
                        chapter: '#F7F7F7',
                        tabbar: '#FFFFFF'
                    },
                    color: {
                        header: '#162636',
                        chapter: '#1F1F1F',
                        tabbar: '#162636'
                    },
                    opacity: {
                        content: 1,
                        title: 0.56,
                        status: 0.56
                    },
                },
                data: {
                    book: {},
                    chapter: {},
                    chapters: [],
                    catalog: {},
                    marks: [],
                    notes: [],
                    menuMore: [{
                        label: "<i class='iconfont icon-bookmark-add'></i> &nbsp;添加书签",
                        value: 'mark'
                    }, {
                        label: "<i class='iconfont icon-sousuo3'></i> &nbsp;全文搜索",
                        value: 'search'
                    }, {
                        label: "<i class='iconfont icon-xiaoyimiji'></i> &nbsp;书籍详情",
                        value: 'detail'
                    }, {
                        label: "<i class='iconfont icon-fenxiang1'></i> &nbsp;分享本书",
                        value: 'share'
                    }],
                    shares: []
                },
                chapterId: {
                    cur: -1,
                    min: -1,
                    max: -1
                },
                content: {
                    switch: true,
                    translateX: 0,
                    mark: false,
                    touch: {
                        direction: 'none',
                        start: {
                            x: 0,
                            y: 0
                        },
                        end: {
                            x: 0,
                            y: 0
                        },
                        diff: {
                            x: 0,
                            y: 0
                        }
                    }
                },
                status: {
                    battery: 0,
                    time: '',
                    progress: 0
                },
                rewardCoin: 0,
                catalog: {
                    selected: 0,
                    page: 1
                }
            }
        },
        components: {
            XHeader,
            Tabbar,
            TabbarItem,
            Popup,
            Tab,
            TabItem,
            Swiper,
            SwiperItem,
            Group,
            Cell,
            CellBox,
            XInput,
            Range,
            Actionsheet,
            XButton,
            Checker,
            CheckerItem,
            CPopupBuy
        },
        methods: {
            getCatalogData(callback){
                app.ajax.get(app.config.api.chapter.catalog + this.$route.query.id + '/' + this.catalog.page, {},
                    (data) => {
                        if (data.result.result && data.result.result.length > 0) {
                            this.data.chapters = this.data.chapters.concat(data.result.result);

                            if (typeof callback == "function") {
                                if (this.show.catalogBuy) {
                                    callback();
                                } else {
                                    callback(true);
                                }
                            }
                        } else {
                            if (typeof callback == "function") {
                                this.catalog.page--;
                                callback(true);
                            }
                        }

                        this.chapterId.min = data.result.min_chapterid;
                        this.chapterId.max = data.result.max_chapterid;

                        if (!callback) {
                            // 书籍详情的目录 跳转
                            if (this.$route.query.chapterId) {
                                this.chapterId.cur = this.$route.query.chapterId;
                            } else {
                                // 加载当前章节以及位置
                                let chapter = app.util.localStorage('book_' + this.$route.query.id);
                                if (chapter) {
                                    let chapterJson = JSON.parse(chapter);
                                    this.chapterId.cur = Number(chapterJson.chapterId);
                                    this.content.translateX = chapterJson.translateX;
                                } else {
                                    this.chapterId.cur = this.chapterId.min;
                                }
                            }
                        }

                        // 获取章节信息
                        this.getChapterData();

                        // 书签状态
                        this.getMarkStatus();
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            getMarkData(){
                app.webSql.query(app.config.webSql.mark, {}, {}, (rows) => {
                    if (rows && rows.length > 0) {
                        this.data.marks = rows;
                    }
                });
            },
            getNoteData(){
                app.webSql.query(app.config.webSql.note, {}, {}, (rows) => {
                    if (rows && rows.length > 0) {
                        this.data.notes = rows;
                    }
                });
            },
            getShareData(){
                app.ajax.get(app.config.api.share, {},
                    (data) => {
                        this.data.shares = data.result;
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            getChapterData(){
                if (this.chapterId.cur < 0) {
                    return;
                }

                // 书籍章节进度
                this.status.progress = ((this.chapterId.cur / this.chapterId.max).toFixed(2)) * 100;
                app.util.localStorage("book_" + this.$route.query.id, {
                    chapterId: this.chapterId.cur,
                    translateX: this.content.translateX
                });

                // 1. 查找本地是否已缓存
                app.webSql.query(app.config.webSql.chapter, {
                    chapterid: this.chapterId.cur
                }, {}, (rows) => {
                    if (rows && rows.length > 0) {
                        let item = rows.item(0);
                        this.data.chapter = {
                            articlename: item.articlename,
                            content: item.content
                        };

                        // 若存在translateX，则 移动
                        if (this.content.translateX > 0) {
                            this.content.switch = false;
                        }
                    } else {
                        // 2. 请求服务器
                        app.ajax.get(app.config.api.chapter.info + this.chapterId.cur, {},
                            (data) => {
                                // 换行
                                data.result.content = '<p>' + data.result.content.replace(/\r\n\r\n/g, '</p><br/><p>') + '</p>';
                                this.data.chapter = data.result;

                                // 若存在translateX，则 移动
                                if (this.content.translateX > 0) {
                                    this.content.switch = false;
                                }

                                // 章节信息：插入websql
                                app.webSql.insert(app.config.webSql.chapter,
                                    {
                                        articlename: data.result.articlename,
                                        chapterid: this.chapterId.cur,
                                        content: data.result.content
                                    }
                                )
                            }, (err) => {
                                this.$vux.toast.show({
                                    text: '系统异常，请稍后重试...',
                                    type: 'warn'
                                });
                                app.log.error(err);
                            });
                    }
                });
            },
            getBookData(){
                app.ajax.get(app.config.api.book.detail + this.$route.query.id, {},
                    (data) => {
                        this.data.book = data.result;
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            clickContent(e){
                if (e.y > app.config.setting.height.header
                    && e.y < (app.config.setting.height.screen - app.config.setting.height.tabbar)) {
                    if (e.x >= this.width * 0.3 && e.x <= this.width * 0.7) {
                        this.$store.commit('updateReaderBar');
                    } else {
                        if (e.x < this.width * 0.3) {  // 上一页
                            this.turnPage('prev');
                        } else if (e.x > this.width * 0.7) { // 下一页
                            this.turnPage('next');
                        }
                    }
                }
            },
            turnPage(direction){
                if (direction == 'prev') {
                    if (this.content.translateX <= 0) {
                        if (this.chapterId.cur <= this.chapterId.min) {
                            this.$vux.toast.show({
                                text: '已经到最前面了',
                                type: 'text'
                            });
                            return;
                        } else {
                            this.chapterId.cur--;
                            this.getChapterData();
                        }
                    } else {
                        this.content.translateX -= this.width;
                    }
                } else if (direction == 'next') {
                    if (this.$refs.content.scrollWidth <= this.width) {
                        if (this.chapterId.cur >= this.chapterId.max) {
                            this.$vux.toast.show({
                                text: '已经到最后了',
                                type: 'text'
                            });
                            return;
                        } else {
                            this.chapterId.cur++;
                            this.content.translateX = 0;
                            this.getChapterData();
                        }
                    } else {
                        this.content.translateX += this.width;
                    }
                }

                // 书签标记
                this.getMarkStatus();

                this.content.switch = false;
            },
            clickMore(key){
                switch (key) {
                    case 'mark':
                        this.toggleMark();
                        break;
                    case 'search':
                        this.$router.push({path: '/search'});
                        break;
                    case 'detail':
                        this.$router.push({path: '/mall/book/detail', query: {id: this.$route.query.id}});
                        break;
                    case 'share':
                        this.show.share = true;
                        this.show.more = false;
                        break;
                }
            },
            checkBatchBuyNum(num){
                this.buyNum = num;
                if (this.buyNum === '0') {
                    this.show.batchBuyInput = true;
                    this.show.batchBuy = false;
                }
            },
            inputBatchBuyNum(num){
                this.buyNum = num;
                if (this.buyNum.startsWith('0')) {
                    this.buyNum = this.buyNum.substring(1);
                }
            },
            inputBack(){
                this.show.batchBuy = true;
                this.show.batchBuyInput = false;
            },
            confirmBatchBuy(){
                app.ajax.post(app.config.api.chapter.batch.buy, {
                    uid: this.$store.state.user.uid,
                    articleid: this.$route.query.id,
                    buynum: this.buyNum
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
            choiceReward(e){
                this.rewardCoin = Number(e.target.dataset.rewardCoin);
            },
            clickReward(){
                let _this = this;

                app.ajax.post(app.config.api.book.reward.add, {
                    uid: this.$store.state.user.uid,
                    price: this.rewardCoin,
                    articleid: this.$route.query.id
                }, (data) => {
                    this.show.reward = false;

                    if (data.result.result == 1) { // 1:成功
                        this.$vux.toast.show({
                            text: '打赏成功'
                        });
                        this.getData();
                    } else if (data.result.result == 2) {   // 2:余额不足
                        this.$vux.alert.show({
                            title: '系統提示',
                            content: '用户余额不足',
                            buttonText: '去充值',
                            onHide(){
                                _this.$router.push({path: '/recharge'});
                            }
                        });
                    } else if (data.result.result == 3) {   // 3:书籍不存在
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
            clickTabbar(index){
                if (index == 0) {
                    this.show.catalog = true;
                } else if (index == 1) {
                    this.show.progress = true;
                } else if (index == 2) {
                    this.show.setting = true;
                } else if (index == 3) {
                    let dayModel = this.setting.dayNight === '夜间' ? true : false;
                    this.setting.dayNight = dayModel ? '日间' : '夜间';
                    this.setting.dayNightIcon = dayModel ? 'icon-rijianmoshi' : 'icon-yejian';
                    this.setting.bgColor = {
                        header: dayModel ? '#2C3136' : '#FFFFFF',
                        chapter: dayModel ? '#222224' : '#F7F7F7',
                        tabbar: dayModel ? '#2D3136' : '#FFFFFF'
                    };
                    this.setting.color = {
                        header: dayModel ? '#BDBDBD' : '#162636',
                        chapter: dayModel ? '#FFFFFF' : '#1F1F1F',
                        tabbar: dayModel ? '#BDBDBD' : '#162636'
                    };
                    this.setting.opacity = {
                        content: dayModel ? 0.26 : 1,
                        title: dayModel ? 0.26 : 0.56,
                        status: dayModel ? 0.26 : 0.56
                    };
                    // 更新websql：背景颜色
                    app.webSql.update(app.config.webSql.setting, {value: base64.encode(JSON.stringify(this.setting.bgColor))}, {key: 'bgColor'});
                    // 更新websql：字体颜色
                    app.webSql.update(app.config.webSql.setting, {value: base64.encode(JSON.stringify(this.setting.color))}, {key: 'color'});
                    // 更新websql：透明度
                    app.webSql.update(app.config.webSql.setting, {value: base64.encode(JSON.stringify(this.setting.opacity))}, {key: 'opacity'});
                    // 更新websql：日间夜间
                    app.webSql.update(app.config.webSql.setting, {value: this.setting.dayNight}, {key: 'dayNight'});
                    app.webSql.update(app.config.webSql.setting, {value: this.setting.dayNightIcon}, {key: 'dayNightIcon'});
                }
            },
            changeTabItem(index){
                if (index == 0) {
                    // 目录信息初始化已获取
                } else if (index == 1) {
                    this.getMarkData();
                } else if (index == 2) {
                    this.getNoteData();
                }
            },
            handleInfinite(done){
                if (this.catalog.page >= 10) {
                    done(true);
                    return;
                }
                setTimeout(() => {
                    this.catalog.page++;

                    this.getCatalogData(done);
                }, 1500);
            },
            clickCatalog(catalog){
                if (catalog.isvip == 1 && catalog.is_buy == 0) {
                    this.data.catalog = catalog;
                    this.show.catalogBuy = true;
                } else {
                    this.chapterId.cur = catalog.chapterid;
                    this.show.catalog = false;
                    this.getChapterData();
                }
            },
            confirmCatalogBuy(autoBuy){
                app.ajax.post(app.config.api.chapter.buy, {
                    uid: this.$store.state.user.uid,
                    chapterid: this.catalog.chapterid,
                    autobuy: autoBuy
                }, (data) => {
                    this.show.catalogBuy = false;

                    if (data.result.result == 1) { // 1：成功
                        // 是否自动购买
                        app.util.localStorage("autoBuy", autoBuy);

                        this.showChapter(this.catalog.chapterid);
                    } else if (data.result.result == 2) {   // 2:用户不存在
                        this.$vux.toast.show({
                            text: '用户不存在',
                            type: 'warn'
                        });
                    } else if (data.result.result == 3) {   //  3:章节不存在
                        this.$vux.toast.show({
                            text: '章节不存在',
                            type: 'warn'
                        });
                    } else if (data.result.result == 4) {   //  4:不是付费章节
                        this.$vux.toast.show({
                            text: '不是付费章节',
                            type: 'warn'
                        });
                    } else if (data.result.result == 5) {   //  5:用户余额不足
                        this.$vux.alert.show({
                            title: '系統提示',
                            content: '用户余额不足',
                            buttonText: '去充值',
                            onHide(){
                                _this.$router.push({path: '/recharge'});
                            }
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
            changeChapter(value){
                if (value <= 0) {
                    return;
                }
                if (value < this.chapterId.min) {
                    this.$vux.toast.show({
                        text: '没有前面章节了',
                        type: 'text'
                    });
                    return;
                }
                if (value > this.chapterId.max) {
                    this.$vux.toast.show({
                        text: '没有后面章节了',
                        type: 'text'
                    });
                    return;
                }
                this.chapterId.cur = value;
                this.getChapterData();
            },
            changeBrightness(){
                if (app.config.setting.isApp) {
                    try {
                        plus.screen.setBrightness(this.setting.brightness / 100);
                    } catch (err) {
                        this.$vux.toast.show({
                            text: err,
                            type: 'warn'
                        })
                    }

                    // 更新websql：亮度
                    app.webSql.update(app.config.webSql.setting, {value: this.setting.brightness}, {key: 'brightness'});
                } else {
                    this.$vux.toast.show({
                        text: '请使用移动端设备',
                        type: 'warn'
                    })
                }
            },
            changeFontSize(e){
                if (e.target.dataset.fontSize == 'F') {
                    this.setting.fontStyle = 'J';
                    console.log('fan ti');
                } else if (e.target.dataset.fontSize == 'J') {
                    this.setting.fontStyle = 'F';
                    console.log('jian ti');
                } else if (e.target.dataset.fontSize == '+') {
                    this.setting.fontSize++;
                } else if (e.target.dataset.fontSize == '-') {
                    this.setting.fontSize--;
                }

                // 更新websql：字体
                app.webSql.update(app.config.webSql.setting, {value: this.setting.fontSize}, {key: 'fontSize'});
                // 更新websql：简繁
                app.webSql.update(app.config.webSql.setting, {value: this.setting.fontStyle}, {key: 'fontStyle'});
            },
            changeTurnModel(e){
                this.setting.turnModel = Number(e.target.dataset.turnModel);
                // 更新websql：翻页
                app.webSql.update(app.config.webSql.setting, {value: this.setting.turnModel}, {key: 'turnModel'});
            },
            changeLineHeight(e){
                if (e.target.dataset.lineHeight == 0) {
                    console.log('more');
                } else {
                    this.setting.lineHeight = Number(e.target.dataset.lineHeight);
                    // 更新websql：行距
                    app.webSql.update(app.config.webSql.setting, {value: this.setting.lineHeight}, {key: 'lineHeight'});
                }
            },
            changeBgColor(e){
                if (e.target.dataset.bgColor == 0) {
                    console.log('more');
                } else {
                    this.setting.bgColor = {
                        header: '#FFFFFF',
                        chapter: e.target.dataset.bgColor,
                        tabbar: '#FFFFFF'
                    };
                    this.setting.color = {
                        header: '#1F1F1F',
                        chapter: '#1F1F1F',
                        tabbar: '#1F1F1F'
                    };
                    this.setting.opacity = {
                        content: 1,
                        title: 0.56,
                        status: 0.56
                    };

                    // 更新websql：背景颜色
                    app.webSql.update(app.config.webSql.setting, {value: base64.encode(JSON.stringify(this.setting.bgColor))}, {key: 'bgColor'});
                    // 更新websql：字体颜色
                    app.webSql.update(app.config.webSql.setting, {value: base64.encode(JSON.stringify(this.setting.color))}, {key: 'color'});
                    // 更新websql：透明度
                    app.webSql.update(app.config.webSql.setting, {value: base64.encode(JSON.stringify(this.setting.opacity))}, {key: 'opacity'});
                }
            },
            showBattery(){
                if (app.config.setting.isApp) {
                    const _this = this;
                    if (app.config.setting.platform == 'Android') {
                        var main = plus.android.runtimeMainActivity();
                        var Intent = plus.android.importClass('android.content.Intent');
                        var recevier = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
                            onReceive: function (context, intent) {
                                var action = intent.getAction();
                                if (action == Intent.ACTION_BATTERY_CHANGED) {
                                    _this.status.battery = intent.getIntExtra("level", 0); //电量
                                }
                            }
                        });
                        var IntentFilter = plus.android.importClass('android.content.IntentFilter');
                        var filter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
                        main.registerReceiver(recevier, filter);
                    } else if (app.config.setting.platform == 'IOS') {
                        var UIDevice = plus.ios.import("UIDevice");
                        var dev = UIDevice.currentDevice();
                        if (!dev.isBatteryMonitoringEnabled()) {
                            dev.setBatteryMonitoringEnabled(true);
                        }
                        _this.status.battery = dev.batteryLevel();
                    }
                }
            },
            showTime(){
                this.status.time = dateFormat(new Date(), 'HH:mm')
            },
            transBeforeEnter(el){
                el.style.opacity = 1;
            },
            transEnter(el, done){
                if (this.setting.turnModel == 1) {  // 滑动
                    el.style.transition = "all 1s ease";
                } else if (this.setting.turnModel == 2) {    // 覆盖
                    el.style.transition = "all 0s ease";
                }
                done();
            },
            transLeave(el, done){
                el.style.opacity = 0;
                el.style.transform = "translateX(-" + this.content.translateX + "px)";
                done();
            },
            transAfterLeave(el){
                this.content.switch = true;
            },
            touchStart(e){
                e.preventDefault();

                this.content.touch.direction = "none";
                this.content.touch.diff.x = 0;
                this.content.touch.diff.y = 0;

                this.content.touch.start.x = e.touches[0].screenX;
                this.content.touch.start.y = e.touches[0].screenY;
            },
            touchMove(e){
                this.content.touch.end.x = e.touches[0].screenX;
                this.content.touch.end.y = e.touches[0].screenY;
                this.content.touch.diff.x = this.content.touch.start.x - this.content.touch.end.x;
                this.content.touch.diff.y = this.content.touch.start.y - this.content.touch.end.y;

                if (Math.abs(this.content.touch.diff.x) > 10 || Math.abs(this.content.touch.diff.y) > 10) {
                    e.preventDefault();

                    // 滑动方向：x
                    if (Math.abs(this.content.touch.diff.x) >= Math.abs(this.content.touch.diff.y)) {
                        if (this.content.touch.diff.x > 0) {    // 左滑
                            this.content.touch.direction = 'x-left';
                        } else if (this.content.touch.diff.x < 0) {  // 右滑
                            this.content.touch.direction = 'x-right';
                        }
                    }
                    // 滑动方向：y
                    else {
                        if (this.content.touch.diff.y < 0) {  // 下拉
                            this.content.touch.direction = 'y-down';
                            this.$refs.reader.style.transform = "translate3d(0px, 140px, 0px)";
                        } else if (this.content.touch.diff.y > 0) {    // 上滑
                            this.content.touch.direction = 'y-up';
                        }
                    }
                } else {
                    this.content.touch.direction = 'none';
                }
            },
            touchEnd(e){
                if (this.content.touch.direction == 'x-left') { // 左滑：下一页
                    this.turnPage('next');
                } else if (this.content.touch.direction == 'x-right') {  // 右滑：上一页
                    this.turnPage('prev');
                } else if (this.content.touch.direction == 'y-down') {  // 下拉：添加书签
                    setTimeout(() => {
                        this.toggleMark();
                    }, 500);
                } else if (this.content.touch.direction == 'none') {
                    this.clickContent({x: e.changedTouches[0].screenX, y: e.changedTouches[0].screenY});
                }
            },
            toggleMark(){
                if (this.content.mark) {
                    app.webSql.delete(app.config.webSql.mark, {
                        chapterid: this.chapterId.cur,
                        translateX: this.content.translateX
                    }, () => {
                        this.content.mark = false;
                        this.$refs.reader.style.transform = "translate3d(0px, 0px, 0px)";
                        this.$vux.toast.show({
                            text: '书签：删除成功',
                            type: 'text'
                        });
                    });
                } else {
                    app.webSql.insert(app.config.webSql.mark, {
                        chapterid: this.chapterId.cur,
                        translateX: this.content.translateX,
                        name: this.data.chapter.articlename,
                        content: '',
                        time: new Date()
                    }, () => {
                        this.content.mark = true;
                        this.$refs.reader.style.transform = "translate3d(0px, 0px, 0px)";
                        this.$vux.toast.show({
                            text: '书签：添加成功',
                            type: 'text'
                        });
                    });
                }
            },
            getMarkStatus(){
                app.webSql.query(app.config.webSql.mark, {
                    chapterid: this.chapterId.cur,
                    translateX: this.content.translateX
                }, {}, (rows) => {
                    if (rows && rows.length > 0) {
                        this.content.mark = true;
                    } else {
                        this.content.mark = false;
                    }
                });
            },
            initSettingDB(){
                app.webSql.insert(app.config.webSql.setting, {
                    key: 'brightness',
                    value: this.setting.brightness,
                    type: 'integer'
                });
                app.webSql.insert(app.config.webSql.setting, {
                    key: 'fontSize',
                    value: this.setting.fontSize,
                    type: 'integer'
                });
                app.webSql.insert(app.config.webSql.setting, {
                    key: 'fontStyle',
                    value: this.setting.fontStyle,
                    type: 'string'
                });
                app.webSql.insert(app.config.webSql.setting, {
                    key: 'turnModel',
                    value: this.setting.turnModel,
                    type: 'integer'
                });
                app.webSql.insert(app.config.webSql.setting, {
                    key: 'lineHeight',
                    value: this.setting.lineHeight,
                    type: 'integer'
                });
                app.webSql.insert(app.config.webSql.setting, {
                    key: 'dayNight',
                    value: this.setting.dayNight,
                    type: 'string'
                });
                app.webSql.insert(app.config.webSql.setting, {
                    key: 'dayNightIcon',
                    value: this.setting.dayNightIcon,
                    type: 'string'
                });
                app.webSql.insert(app.config.webSql.setting, {
                    key: 'bgColor',
                    value: base64.encode(JSON.stringify(this.setting.bgColor)),
                    type: 'json'
                });
                app.webSql.insert(app.config.webSql.setting, {
                    key: 'color',
                    value: base64.encode(JSON.stringify(this.setting.color)),
                    type: 'json'
                });
                app.webSql.insert(app.config.webSql.setting, {
                    key: 'opacity',
                    value: base64.encode(JSON.stringify(this.setting.opacity)),
                    type: 'json'
                });
            }
        },
        created(){
            // 全屏显示
            if (app.config.setting.isApp) {
                plus.navigator.setFullscreen(true);
            }
            // 隐藏阅读器底部&顶部导航菜单
            this.$store.commit('updateReaderBar', {header: false, tabBar: false});

            // 加载websql 设置信息
            app.webSql.query(app.config.webSql.setting, {}, {}, (rows) => {
                if (rows && rows.length > 0) {
                    Object.keys(rows).forEach((i) => {
                        if (rows[i].type == "integer") {
                            this.setting[rows[i].key] = Number(rows[i].value);
                        } else if (rows[i].type == "json") {
                            this.setting[rows[i].key] = JSON.parse(base64.decode(rows[i].value));
                        } else {
                            this.setting[rows[i].key] = rows[i].value;
                        }
                    })
                } else {
                    // 初始化
                    this.initSettingDB();
                }
            });
        },
        mounted(){
            // 目录 => 章节信息
            this.getCatalogData();

            // 书籍详情
            this.getBookData();

            // 电量
            this.showBattery();

            // 时间
            this.showTime();
            setInterval(this.showTime, 60000);
        }
    }
</script>

<style>
    @import '../../css/reset.css';

    .reader {
        font-family: PingFangSC-Regular;
        transition: all .5s ease;
    }

    .reader .pull-layer {
        width: 100%;
        height: 140px;
        margin-top: -140px;
        text-align: center;
        font-size: 14px;
        color: #AAA;
        background: #D9DCE0;
    }

    .reader .vux-header {
        width: 100%;
        position: absolute;
        background: #FFFFFF;
        z-index: 500;
    }

    .reader .vux-header a {
        font-size: 22px;
        margin-right: 8px;
    }

    .reader .vux-header .vux-header-right {
        right: 10px;
    }

    .reader .vux-header .vux-header-right .vux-header-more {
        float: right;
    }

    .reader .chapter .title, .reader .chapter .status {
        letter-spacing: 0;
        font-size: 13px;
        position: fixed;
    }

    .reader .chapter .content {
        padding-top: 46px;
        letter-spacing: 1px;
    }

    .reader .chapter .content p {
        text-indent: 2em;
    }

    .reader ~ .popup-catalog .weui-cell .vux-label {
        font-size: 15px;
    }

    .reader ~ .popup-catalog .iconfont {
        font-size: 22px;
    }

    .reader ~ .popup-progress .weui-cell {
        height: 36px;
    }

    .reader ~ .popup-progress .weui-cell .range-bar {
        max-width: 235px;
    }

    .reader ~ .popup-progress .range-min {
        width: 36px;
        left: -48px;
    }

    .reader ~ .popup-progress .range-max {
        width: 36px;
        right: -45px;
    }

    .reader ~ .popup-progress .vux-cell-box.weui-cell > div:first-child {
        width: inherit;
    }

    .reader ~ .popup-progress-tip {
        bottom: 56px;
        width: 60%;
        margin: auto;
        left: 0;
        right: 0;
    }

    .reader ~ .popup-setting .font i {
        border-radius: 5px;
        margin: 0px 5px;
    }

    .reader ~ .popup-setting .turn i {
        display: inline-flex;
        border-radius: 5px;
        border: solid 1px;
        padding: 5px 45px;
        margin: 0px 6px;
    }

    .reader ~ .popup-setting .compose i {
        font-size: 18px;
        padding: 5px 10px;
        border: solid 1px;
        border-radius: 5px;
        margin: 0px 5px;
        vertical-align: middle;
    }

    .reader ~ .popup-setting .background i {
        display: inline-flex;
        border-radius: 4px;
        width: 44px;
        height: 30px;
        margin: 0px 2px;
        vertical-align: middle;
    }

    .reader ~ .popup-setting i:active {
        background: #D8D8D8;
        box-shadow: 3px 3px 3px #c7c7c7;
    }

    .reader ~ .actionsheet-more .weui-actionsheet__cell, .reader ~ .actionsheet-more .iconfont {
        font-size: 15px;
    }

    .reader ~ .popup-buy .batch, .reader ~ .popup-buy .batch-input, .reader ~ .popup-reward {
        background: #FFFFFF;
    }

    .reader ~ .popup-reward .checker-item {
        background: #FFFFFF;
        border: 1px solid #57606A;
        border-radius: 8px;
        width: 100px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        margin-left: 15px;
        margin-bottom: 10px;
    }

    .reader ~ .popup-reward .checker-item-selected {
        background: #35B4EB;
        border-radius: 8px;
    }

    .reader ~ .status i {
        font-size: 18px;
        opacity: 0.56;
        border-radius: 2px;
    }

    .reader ~ .popup-setting .setting-active {
        background-color: #D8D8D8;
    }

    .reader ~ .popup-reward div .c-active {
        background: #35B4EB;
        border-radius: 8px;
    }
</style>