<template>
    <div class="reader" @touchstart="touchStart" @touchend="touchEnd" @touchmove="touchMove">
        <x-header v-show="$store.state.reader.header" title="" :left-options="{backText:''}"
                  :right-options="{showMore: true}" @on-click-more="display.more=true"
                  :style="{backgroundColor: setting.backgroundColor.header, color: setting.color.header}">
            <a class="iconfont icon-dashang2" slot="right" @click="display.reward = true"></a>
            <a class="iconfont icon-xiazai" slot="right" @click="display.download = true"></a>
            <!--<a class="iconfont icon-shuqian_bookmark" slot="right"></a>-->
        </x-header>
        <div class="main"
             :style="{height: height.screen+'px',backgroundColor: setting.backgroundColor.main,color: setting.color.main}"
             style="padding: 0px 10px;">
            <div class="title" style="height: 46px; line-height: 46px;" :style="{opacity:setting.opacity.title}">
                {{data.chapter.articlename}}
            </div>
            <div class="content" ref="content"
                 :style="{lineHeight: setting.lineHeight+'px',opacity: setting.opacity.content,fontSize: setting.fontSize+'px'}"
                 @click="clickContent">
                <transition @before-enter="transBeforeEnter" @enter="transEnter"
                            @leave="transLeave" @after-leave="transAfterLeave" :css="false">
                    <div v-show="content.switch"
                         :style="{'column-width':width.content+'px',height: height.content+'px'}">
                        {{data.chapter.content}}
                    </div>
                </transition>
            </div>
            <div class="status" style="height: 56px;line-height: 56px;"
                 :style="{width: (width.content-20)+'px', opacity:setting.opacity.status}">
                <i v-if="status.battery<10" class="iconfont icon-dianliang1"></i>
                <i v-else-if="status.battery<30" class="iconfont icon-dianliang2"></i>
                <i v-else-if="status.battery<60" class="iconfont icon-dianliang3"></i>
                <i v-else-if="status.battery<90" class="iconfont icon-dianliang4"></i>
                <i v-else class="iconfont icon-dianliang5"></i>
                <span style="opacity: 0.56;font-family: PingFangSC-Regular;font-size: 14px;color: #1F1F1F;padding-left: 10px;">
                    {{status.time}}
                </span>
                <span style="float: right;">
                    {{chapterId.progress}} %
                </span>
            </div>
        </div>
        <tabbar v-show="$store.state.reader.tabBar"
                :style="{backgroundColor: setting.backgroundColor.tabbar, color: setting.color.tabbar}">
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

        <!-- 目录：侧滑菜单 -->
        <popup v-model="display.catalog" position="left" width="75%" class="popup-catalog">
            <div style="background-color: #FFFFFF;height: 46px; line-height: 46px; padding: 0px 10px;">
                <span>{{data.chapter.articlename}}</span>
                <span class="iconfont icon-paixu" style="float: right;"></span>
            </div>
            <tab>
                <tab-item @on-item-click="changeTabItem" selected><i class="iconfont icon-mulu1"></i></tab-item>
                <tab-item @on-item-click="changeTabItem"><i class="iconfont icon-bookmark"></i></tab-item>
                <tab-item @on-item-click="changeTabItem"><i class="iconfont icon-biji"></i></tab-item>
            </tab>
            <div v-show="catalogItem==0">
                <group>
                    <cell v-for="(chapter, index) in data.chapters" :key="index">
                        <span slot="title" v-if="chapter.isvip==0">{{chapter.chaptername}}</span>
                        <template v-else>
                            <span slot="title" style="color: #989A9C;">{{chapter.chaptername}}</span>
                            <i class="iconfont icon-lock"></i>
                        </template>
                    </cell>
                </group>
            </div>
            <div v-show="catalogItem==1">Container1</div>
            <div v-show="catalogItem==2">Container2</div>
        </popup>

        <!-- 进度：滑块条 -->
        <popup v-model="display.progress" class="popup-progress">
            <group>
                <cell primary="content">
                    <range :min="chapterId.min" :max="chapterId.max" minHTML="上一章" maxHTML="下一章"
                           @on-change="changeChapter"></range>
                </cell>
            </group>
        </popup>
        <!-- 进度：章节信息 -->
        <popup v-model="display.progress" class="popup-progress-tip" is-transparent>
            <div style="width: 95%;background-color:#fff;border-radius:5px;padding-top:10px; text-align: center;">
                <span style="color: #162636;letter-spacing: 0;font-size: 14px;display: block;line-height: 20px;">
                    {{data.chapter.articlename}}
                </span>
                <span style="color: #EE4D22;letter-spacing: 0;font-size: 16px;line-height: 40px;">
                    {{data.chapter.progress}} %
                </span>
            </div>
        </popup>

        <!-- 设置：亮度、字体、翻页、排版、背景色 -->
        <popup v-model="display.setting" class="popup-setting">
            <group>
                <cell title="亮度" primary="content">
                    <range v-model="setting.brightness"
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
                    <i style="background: #FFFFFF;border: 1px solid #35B4EB;" data-background-color="#FFFFFF"
                       @click="changeBackgroundColor"></i>
                    <i style="background: #EFDBBC;border: 1px solid #D8D8D8;" data-background-color="#EFDBBC"
                       @click="changeBackgroundColor"></i>
                    <i style="background: #D6E8C8;border: 1px solid #D8D8D8;" data-background-color="#D6E8C8"
                       @click="changeBackgroundColor"></i>
                    <i style="background: #FCE2E2;border: 1px solid #D8D8D8;" data-background-color="#FCE2E2"
                       @click="changeBackgroundColor"></i>
                    <i class="iconfont icon-add" data-background-color="0" @click="changeBackgroundColor"
                       style="width: initial;height:initial;font-size: 16px;padding: 4px 14px;border: solid 1px;"></i>
                </cell>
            </group>
        </popup>

        <!-- 更多：操作菜单 -->
        <actionsheet v-model="display.more" :menus="data.menuMore" class="actionsheet-more"
                     @on-click-menu="clickMore"></actionsheet>

        <!-- 下载：书籍购买下载 -->
        <popup v-model="display.download" class="popup-download">
            <img :src="data.book.cover"
                 style="width: 110px; height: 140px; position:absolute;bottom: 140px;left: 10px;border-radius: 5px;box-shadow: 0 3px 3px #c7c7c7;">
            <div style="padding:20px 0px 20px 140px; height: 80px; border-bottom: dotted 1px #BDBDBD">
                <span class="title" style="font-family: PingFangSC-Medium;font-size: 19px;color: #162636;">
                {{data.book.articlename}}
                </span>
                <span style="font-family: PingFangSC-Regular;font-size: 15px;color: #989A9C;">{{data.book.author}}张三丰</span>
                <span style="font-family: PingFangSC-Regular;font-size: 14px;color: #162636;">
                    价格：{{data.book.price}}
                </span>
            </div>
            <div style="padding: 10px 0px 10px 10px;">
                <span style="color: #989A9C;">
                    共计支付：<label style="color: #EE4D22;">{{data.book.price}}</label>
                </span>
                <span style="color: #989A9C;">
                    账户余额：<label style="color:  #162636;">{{data.book.price}}</label>
                </span>
            </div>
            <x-button type="primary" action-type="button" style="background: #35B4EB;border-radius: 7px;"
                      @click.native="clickBuy">购买并下载
            </x-button>
        </popup>

        <!-- 打赏： -->
        <popup v-model="display.reward" class="popup-reward">
            <div style="padding: 10px 0px 20px 10px;">
                <span style="display: block;font-family: PingFangSC-Regular;font-size: 14px;color: #162636;padding-bottom: 10px;">选择打赏金额</span>
                <label class="coin">100阅币</label>
                <label class="coin">500阅币</label>
                <label class="coin">1000阅币</label>
                <label class="coin">2000阅币</label>
                <label class="coin">10000阅币</label>
            </div>
            <group>
                <x-input title="其他金额" placeholder="输入具体金额打赏作者(单位：阅币)" v-model="data.reward.coin"></x-input>
            </group>
            <x-button type="primary" action-type="button"
                      style="background: #35B4EB;border-radius: 7px;margin-top: 10px;"
                      @click.native="clickReward">确定打赏
            </x-button>
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
        Group,
        Cell,
        XInput,
        Range,
        Actionsheet,
        XButton,
        dateFormat
    } from 'vux';

    export default {
        name: 'reader',
        data () {
            return {
                width: {
                    screen: app.config.setting.width.screen,
                    content: app.config.setting.width.content
                },
                height: {
                    screen: app.config.setting.height.screen,
                    content: app.config.setting.height.content
                },
                display: {
                    more: false,
                    catalog: false,
                    progress: false,
                    setting: false,
                    download: false,
                    reward: false
                },
                setting: {
                    brightness: 0,
                    fontStyle: 'F',
                    fontSize: 16,
                    turnModel: 1,
                    lineHeight: 30,
                    dayNight: '夜间',
                    dayNightIcon: 'icon-yejian',
                    backgroundColor: {
                        header: '#FFFFFF',
                        main: '#F7F7F7',
                        tabbar: '#FFFFFF'
                    },
                    color: {
                        header: '#162636',
                        main: '#1F1F1F',
                        tabbar: '#162636'
                    },
                    opacity: {
                        content: 1,
                        title: 0.56,
                        status: 0.56
                    },
                },
                catalogItem: 0,
                data: {
                    book: {},
                    chapter: {},
                    chapters: [],
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
                    reward: {
                        coin: 0
                    }
                },
                chapterId: {
                    cur: -1,
                    min: -1,
                    max: -1,
                    progress: 0
                },
                content: {
                    switch: true,
                    translateX: 0,
                    touchX: {
                        start: 0,
                        end: 0
                    }
                },
                status: {
                    battery: 0,
                    time: ''
                }
            }
        },
        components: {
            XHeader, Tabbar, TabbarItem, Popup, Tab, TabItem, Group, Cell, XInput, Range, Actionsheet, XButton
        },
        methods: {
            getChapterCatalogData(page){
                app.ajax.get(app.config.api.reader.chapters + this.$route.query.id + '/' + page, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            this.chapterId.min = data.min_chapterid;
                            this.chapterId.max = data.max_chapterid;
                            this.data.chapters = data.result;
                        }
                    }
                }, (err) => {
                });
            },
            getChapterData(){
                if (this.chapterId.cur < 0) {
                    return;
                }
                app.ajax.get(app.config.api.reader.chapter + this.chapterId.cur, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            this.data.chapter = data;
                            this.data.chapter.progress = ((this.chapterId.cur / this.chapterId.max).toFixed(2)) * 100;
                        }
                    }
                }, (err) => {
                });
            },
            getBookData(id){
                app.ajax.get(app.config.api.book.detail + id, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            this.data.book = data;
                        }
                    }
                }, (err) => {
                });
            },
            clickContent(e){
                if (e.x >= this.width.screen * 0.3 && e.x <= this.width.screen * 0.7) {
                    this.$store.commit('updateReaderBar');
                } else {
                    if (e.x < this.width.screen * 0.3) {  // 上一页
                        this.turnPage('prev');
                    } else if (e.x > this.width.screen * 0.7) { // 下一页
                        this.turnPage('next');
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
                        this.content.translateX -= this.width.content;
                    }
                } else if (direction == 'next') {
                    if (this.$refs.content.scrollWidth <= this.width.screen) {
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
                        this.content.translateX += this.width.content;
                    }
                }
                this.content.switch = false;
            },
            clickMore(key){
                switch (key) {
                    case 'mark':
                        break;
                    case 'search':
                        break;
                    case 'detail':
                        this.$router.push({path: '/mall/book/detail', query: {id: this.$route.query.id}});
                        break;
                    case 'share':
                        break;
                }
            },
            clickBuy(){
                this.$vux.toast.show({
                    text: '购买成功',
                    type: 'info'
                })
            },
            clickReward(){
                this.$vux.toast.show({
                    text: '打赏成功',
                    type: 'info'
                })
            },
            clickTabbar(index){
                if (index == 0) {
                    this.display.catalog = true;
                } else if (index == 1) {
                    this.display.progress = true;
                } else if (index == 2) {
                    this.display.setting = true;
                } else if (index == 3) {
                    let dayModel = this.setting.dayNight === '夜间' ? true : false;
                    this.setting.dayNight = dayModel ? '日间' : '夜间';
                    this.setting.dayNightIcon = dayModel ? 'icon-rijianmoshi' : 'icon-yejian';
                    this.setting.backgroundColor = {
                        header: dayModel ? '#2C3136' : '#FFFFFF',
                        main: dayModel ? '#222224' : '#F7F7F7',
                        tabbar: dayModel ? '#2D3136' : '#FFFFFF'
                    };
                    this.setting.color = {
                        header: dayModel ? '#BDBDBD' : '#162636',
                        main: dayModel ? '#FFFFFF' : '#1F1F1F',
                        tabbar: dayModel ? '#BDBDBD' : '#162636'
                    };
                    this.setting.opacity = {
                        content: dayModel ? 0.26 : 1,
                        title: dayModel ? 0.26 : 0.56,
                        status: dayModel ? 0.26 : 0.56
                    }
                }
            },
            changeTabItem(index){
                this.catalogItem = index;
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
                    plus.screen.setBrightness(this.setting.brightness);
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
            },
            changeTurnModel(e){
                this.setting.turnModel = Number(e.target.dataset.turnModel);
            },
            changeLineHeight(e){
                if (e.target.dataset.lineHeight == 0) {
                    console.log('more');
                } else {
                    this.setting.lineHeight = Number(e.target.dataset.lineHeight);
                }
            },
            changeBackgroundColor(e){
                if (e.target.dataset.backgroundColor == 0) {
                    console.log('more');
                } else {
                    this.setting.backgroundColor = {
                        header: '#FFFFFF',
                        main: e.target.dataset.backgroundColor,
                        tabbar: '#FFFFFF'
                    };
                    this.setting.color = {
                        header: '#1F1F1F',
                        main: '#1F1F1F',
                        tabbar: '#1F1F1F'
                    };
                    this.setting.opacity = {
                        content: 1,
                        title: 0.56,
                        status: 0.56
                    }
                }
            },
            showBattery(){
                if (app.config.setting.isApp) {
                    if (app.config.setting.isAndroid) {
                        var main = plus.android.runtimeMainActivity();
                        var Intent = plus.android.importClass('android.content.Intent');
                        var recevier = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
                            onReceive: function (context, intent) {
                                var action = intent.getAction();
                                if (action == Intent.ACTION_BATTERY_CHANGED) {
                                    this.status.battery = intent.getIntExtra("level", 0); //电量
                                }
                            }
                        });
                        var IntentFilter = plus.android.importClass('android.content.IntentFilter');
                        var filter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
                        main.registerReceiver(recevier, filter);
                    } else if (app.config.setting.isIOS) {
                        var UIDevice = plus.ios.import("UIDevice");
                        var dev = UIDevice.currentDevice();
                        if (!dev.isBatteryMonitoringEnabled()) {
                            dev.setBatteryMonitoringEnabled(true);
                        }
                        this.status.battery = dev.batteryLevel();
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
                this.content.touchX.start = e.touches[0].screenX;
            },
            touchMove(e){
                e.preventDefault(); //阻止触摸事件的默认行为，即阻止滚屏
            },
            touchEnd(e){
                this.content.touchX.end = e.changedTouches[0].screenX;
                let diff = Math.abs(this.content.touchX.start - this.content.touchX.end);
                if (diff > 5) {
                    if (this.content.touchX.start > this.content.touchX.end) {    // 左滑：下一页
                        this.turnPage('next');
                    } else if (this.content.touchX.start < this.content.touchX.end) {  // 右滑：上一页
                        this.turnPage('prev');
                    }
                }
            }
        },
        created(){
            // 全屏显示
            if (app.config.setting.isApp) {
                plus.navigator.setFullscreen(true);
            }
            // 隐藏阅读器底部&顶部导航菜单
            this.$store.commit('updateReaderBar', {header: false, tabBar: false});
        },
        mounted(){
            // 章节目录
            this.getChapterCatalogData(1);

            // 章节信息
//            this.getChapterData();    // range组件初始化change会加载数据

            // 书籍详情
            this.getBookData(this.$route.query.id);

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
    }

    .reader .vux-header {
        width: 100%;
        position: absolute;
        background: #FFFFFF;
        z-index: 500;
    }

    .reader .vux-header a {
        font-size: 22px;
    }

    .reader .vux-header .vux-header-right {
        right: 10px;
    }

    .reader .vux-header .vux-header-right .vux-header-more {
        float: right;
    }

    .reader .main .title, .reader .main .status {
        letter-spacing: 0;
        font-size: 13px;
        position: fixed;
    }

    .reader .main .title {
        top: 0px;
    }

    .reader .main .status {
        bottom: 0px;
    }

    .reader .main .content {
        padding-top: 46px;
        text-indent: 2em;
        letter-spacing: 1px;
    }

    .reader .popup-catalog .weui-cell .vux-label {
        font-size: 14px;
    }

    .reader .popup-catalog .iconfont {
        font-size: 16px;
    }

    .reader .popup-progress .weui-cell {
        height: 36px;
    }

    .reader .popup-progress .weui-cell .range-bar {
        max-width: 235px;
    }

    .reader .popup-progress .range-min {
        width: 36px;
        left: -48px;
    }

    .reader .popup-progress .range-max {
        width: 36px;
        right: -45px;
    }

    .reader .popup-progress-tip {
        bottom: 56px;
        width: 60%;
        margin: auto;
        left: 0;
        right: 0;
    }

    .reader .popup-setting .font i {
        border-radius: 5px;
        margin: 0px 5px;
    }

    .reader .popup-setting .turn i {
        display: inline-flex;
        border-radius: 5px;
        border: solid 1px;
        padding: 5px 45px;
        margin: 0px 6px;
    }

    .reader .popup-setting .compose i {
        font-size: 18px;
        padding: 5px 10px;
        border: solid 1px;
        border-radius: 5px;
        margin: 0px 5px;
        vertical-align: middle;
    }

    .reader .popup-setting .background i {
        display: inline-flex;
        border-radius: 4px;
        width: 44px;
        height: 30px;
        margin: 0px 2px;
        vertical-align: middle;
    }

    .reader .popup-setting i:active {
        background: #D8D8D8;
        box-shadow: 3px 3px 3px #c7c7c7;
    }

    .setting-active {
        background-color: #D8D8D8;
    }

    .reader .actionsheet-more .weui-actionsheet__cell {
        font-size: 16px;
    }

    .reader .actionsheet-more .iconfont {
        font-size: 16px;
    }

    .reader .popup-download, .reader .popup-reward {
        background-color: #FFFFFF;
    }

    .reader .popup-download span {
        display: block;
        line-height: 30px;
    }

    .reader .popup-reward div .coin {
        display: inline-block;
        padding: 5px 20px;
        border: solid 1px #57606A;
        border-radius: 8px;
        margin: 8px 10px 8px 0px;
        font-size: 16px;
    }

    .reader .popup-reward .vux-x-input {
        font-size: 14px;
    }

    .reader .status i {
        font-size: 18px;
        opacity: 0.56;
        border-radius: 2px;
    }
</style>