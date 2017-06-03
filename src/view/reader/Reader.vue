<template>
    <div class="reader">
        <x-header v-show="$store.state.reader.header" title="" :left-options="{backText:''}"
                  :right-options="{showMore: true}"
                  :style="{backgroundColor: backgroundColor.header, color: color.header}">
            <a class="iconfont icon-dashang2" slot="right"></a>
            <a class="iconfont icon-xiazai" slot="right"></a>
            <a class="iconfont icon-shuqian_bookmark" slot="right"></a>
        </x-header>
        <div class="main" :style="{height: height+'px',backgroundColor: backgroundColor.main,color: color.main}"
             style="padding: 0px 10px;">
            <div class="title" style="height: 46px; line-height: 46px;" :style="{opacity:opacity.title}">
                {{data.chapter.articlename}}
            </div>
            <div class="content" ref="content"
                 :style="{height: contentHeight+'px',lineHeight: setting.lineHeight+'px',opacity: opacity.content,fontSize: setting.fontSize+'px'}"
                 @click="handleClickContent">
                <transition @before-enter="transBeforeEnter"
                            @enter="transEnter"
                            @leave="transLeave"
                            @after-leave="transAfterLeave"
                            :css="false">
                    <div v-show="content.flag" :style="{'column-width':contentWidth+'px',height: contentHeight+'px'}">
                        {{data.chapter.content}}
                    </div>
                </transition>
            </div>
            <div class="status" style="height: 56px;line-height: 56px;" :style="{opacity:opacity.status}">
                16:02
            </div>
        </div>
        <tabbar v-show="$store.state.reader.tabBar"
                :style="{backgroundColor: backgroundColor.tabbar, color: color.tabbar}">
            <tabbar-item @on-item-click="handleClickTabbar">
                <span slot="icon"><i class="iconfont icon-mulu1"></i></span>
                <span slot="label">目录</span>
            </tabbar-item>
            <tabbar-item @on-item-click="handleClickTabbar">
                <span slot="icon"><i class="iconfont icon-diaozhengjindu-copy"></i></span>
                <span slot="label">进度</span>
            </tabbar-item>
            <tabbar-item @on-item-click="handleClickTabbar">
                <span slot="icon"><i class="iconfont icon-aa"></i></span>
                <span slot="label">设置</span>
            </tabbar-item>
            <tabbar-item @on-item-click="handleClickTabbar">
                <span slot="icon"><i class="iconfont" :class="[dayNightIcon]"></i></span>
                <span slot="label">{{dayNight}}</span>
            </tabbar-item>
        </tabbar>

        <popup v-model="popup.catalog" position="left" width="75%" class="popup-catalog">
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

        <popup v-model="popup.progress" class="popup-progress">
            <group>
                <cell primary="content">
                    <range :min="1" :max="8000" minHTML="上一章" maxHTML="下一章" @on-change="changeChapter"></range>
                </cell>
            </group>
        </popup>
        <popup v-model="popup.progress" class="popup-progress-tip" is-transparent>
            <div style="width: 95%;background-color:#fff;border-radius:5px;padding-top:10px; text-align: center;">
                <span style="color: #162636;letter-spacing: 0;font-size: 14px;display: block;line-height: 20px;">
                    {{data.chapter.articlename}}
                </span>
                <span style="color: #EE4D22;letter-spacing: 0;font-size: 16px;line-height: 40px;">
                    38.45%
                </span>
            </div>
        </popup>

        <popup v-model="popup.setting" class="popup-setting">
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
    </div>
</template>

<script>
    import {XHeader, Tabbar, TabbarItem, Popup, Tab, TabItem, Group, Cell, Range, Popover} from 'vux';

    export default {
        name: 'reader',
        data () {
            return {
                width: app.config.setting.width.screen,
                height: app.config.setting.height.screen,
                contentHeight: app.config.setting.height.content,
                contentWidth: app.config.setting.width.content,
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
                popup: {
                    catalog: false,
                    progress: false,
                    setting: false
                },
                setting: {
                    chapterId: 1,
                    brightness: 0,
                    fontStyle: 'F',
                    fontSize: 16,
                    turnModel: 1,
                    lineHeight: 30
                },
                catalogItem: 0,
                dayNight: '夜间',
                dayNightIcon: 'icon-yejian',
                data: {
                    chapter: {},
                    chapters: []
                },
                chapterId: {
                    cur: 1,
                    min: 1,
                    max: 1,
                    progress: 0
                },
                content: {
                    flag: true,
                    translateX: 0
                }
            }
        },
        components: {
            XHeader, Tabbar, TabbarItem, Popup, Tab, TabItem, Group, Cell, Range, Popover
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
                app.ajax.get(app.config.api.reader.chapter + this.chapterId.cur, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            this.data.chapter = data;
                        }
                    }
                }, (err) => {
                });
            },
            handleClickContent(e){
                if (e.x >= this.width * 0.3 && e.x <= this.width * 0.7) {
                    this.$store.commit('updateReaderBar');
                } else {
                    if (e.x < this.width * 0.3) {  // 上一页
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
                            this.content.translateX -= this.contentWidth;
                        }
                    } else if (e.x > this.width * 0.7) { // 下一页
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
                            this.content.translateX += this.contentWidth;
                        }
                    }
                    this.content.flag = false;
                }
            },
            handleClickTabbar(index){
                if (index == 0) {
                    this.popup.catalog = true;
                } else if (index == 1) {
                    this.popup.progress = true;
                } else if (index == 2) {
                    this.popup.setting = true;
                } else if (index == 3) {
                    let dayModel = this.dayNight === '夜间' ? true : false;
                    this.dayNight = dayModel ? '日间' : '夜间';
                    this.dayNightIcon = dayModel ? 'icon-rijianmoshi' : 'icon-yejian';
                    this.backgroundColor = {
                        header: dayModel ? '#2C3136' : '#FFFFFF',
                        main: dayModel ? '#222224' : '#F7F7F7',
                        tabbar: dayModel ? '#2D3136' : '#FFFFFF'
                    };
                    this.color = {
                        header: dayModel ? '#BDBDBD' : '#162636',
                        main: dayModel ? '#FFFFFF' : '#1F1F1F',
                        tabbar: dayModel ? '#BDBDBD' : '#162636'
                    };
                    this.opacity = {
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
                console.log(value);
                if (value < this.chapterId.min) {
                    this.$vux.toast.show({
                        text: '没有前面章节了',
                        type: 'text'
                    });
                    this.setting.chapterId = this.chapterId.min;
                    return;
                }
                if (value > this.chapterId.max) {
                    this.$vux.toast.show({
                        text: '没有后面章节了',
                        type: 'text'
                    });
                    this.setting.chapterId = this.chapterId.max;
                    return;
                }
                this.chapterId.cur = this.setting.chapterId;
                this.getChapterData();
            },
            changeBrightness(){
                if (app.config.isApp) {
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
                    this.backgroundColor.main = e.target.dataset.backgroundColor;
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
                                    var level = intent.getIntExtra("level", 0); //电量
                                    var voltage = intent.getIntExtra("voltage", 0); //电池电压
                                    var temperature = intent.getIntExtra("temperature", 0); //电池温度
                                    //如需获取别的，在这里继续写，此代码只提供获取电量
                                    console.log(level)
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
                        var level = dev.batteryLevel();
                    }
                }
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
                this.content.flag = true;
            }
        },
        created(){
            // 全屏显示
            if (app.config.isApp) {
                plus.navigator.setFullscreen(true);
            }
            // 隐藏阅读器底部&顶部导航菜单
            this.$store.commit('updateReaderBar', {header: false, tabBar: false});


            // 初始化 界面 参数数据
            this.setting.chapterId = 6438;
        },
        mounted(){
            this.getChapterCatalogData(1);
//            this.getChapterData();    // range组件初始化change会加载数据
            this.showBattery();
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
</style>