<template>
    <div class="reader">
        <x-header v-show="$store.state.reader.header" title="" :left-options="{backText:''}"
                  :right-options="{showMore: true}"
                  :style="{backgroundColor: backgroundColor.header, color: color.header}">
            <a class="iconfont icon-dashang2" slot="right"></a>
            <a class="iconfont icon-xiazai" slot="right"></a>
            <a class="iconfont icon-shuqian_bookmark" slot="right"></a>
        </x-header>
        <div class="main" :style="{height: height+'px', backgroundColor: backgroundColor.main, color: color.main}"
             style="padding: 0px 10px;">
            <div class="title" style="height: 46px; line-height: 46px;" :style="{opacity:opacity.title}">
                第1章 蛇精病是啥病？
            </div>
            <div class="content"
                 :style="{height: contentHeight+'px', lineHeight: setting.lineHeight+'px',opacity:opacity.content}"
                 @click="handleClickContent">
                “原来刚才是一场梦，我说这么逼真。”石凡这才明白过来刚才是在做梦，他迅速回想了一下，今天是姚珠的生日，她特意举办了场生日Party，邀请了不少同学、好友，被邀请的人中就有石凡。
                舞会中途，姚珠邀请自己进她的房间参观，结果石凡便看到了正在换衣服的姚珠，那女人一声非礼，结果招来了所有同学，纷纷指责嘲笑石凡。
                被人指责嘲笑不是最重要的，最重要的众所周知，石大少是天痿、不能人事，这才是最要命的，待众人到齐，姚珠直接一句，“你还敢来偷看老娘，我就是同意，你能跟我上床吗？”
                一句，就一句话便把石大少整没电了。
                先被人指责非礼，后被人嘲笑鄙夷，还有众多人围观，石凡急怒攻心之下彻
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
                <span>《梦回唐朝》</span>
                <span class="iconfont icon-paixu" style="float: right;"></span>
            </div>
            <tab>
                <tab-item @on-item-click="changeTabItem" selected><i class="iconfont icon-mulu1"></i></tab-item>
                <tab-item @on-item-click="changeTabItem"><i class="iconfont icon-bookmark"></i></tab-item>
                <tab-item @on-item-click="changeTabItem"><i class="iconfont icon-biji"></i></tab-item>
            </tab>
            <div v-show="catalogItem==0">
                <group>
                    <cell v-for="chapter in data.chapters" :key="chapter.chapterid">
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
                    <range v-model="chapter.cur" minHTML="上一章" maxHTML="下一章" @on-change="changeChapter"></range>
                </cell>
            </group>
        </popup>
        <popup v-model="popup.progress" class="popup-progress-tip" is-transparent>
            <div style="width: 95%;background-color:#fff;border-radius:5px;padding-top:10px; text-align: center;">
                <span style="color: #162636;letter-spacing: 0;font-size: 14px;display: block;line-height: 20px;">
                    第三十章  我改变主意了
                </span>
                <span style="color: #EE4D22;letter-spacing: 0;font-size: 16px;line-height: 40px;">
                    38.45%
                </span>
            </div>
        </popup>

        <popup v-model="popup.setting" class="popup-setting">
            <group>
                <cell title="亮度" primary="content">
                    <range v-model="chapter.cur" minHTML="<i style='font-size:16px;' class='iconfont icon-liangdu'></i>"
                           maxHTML="<i style='font-size:24px;' class='iconfont icon-liangdu'></i>"
                           @on-change="changeChapter"></range>
                </cell>
                <cell title="字体" primary="content" class="font">
                    <i v-if="fontStyle" class="iconfont icon-fanzhuanjian"
                       style="font-size:18px;padding: 5px;border: solid 1px"></i>
                    <i v-else class="iconfont icon-jianzhuanfan"
                       style="font-size:18px;padding: 5px;border: solid 1px"></i>
                    <i class="iconfont icon-a1" style="font-size:18px;padding: 5px 35px;border: solid 1px"></i>
                    <span>54</span>
                    <i class="iconfont icon-a" style="font-size:18px;padding: 5px 35px;border: solid 1px"></i>

                </cell>
                <cell title="翻页" primary="content" class="turn">
                    <span>滑动</span>
                    <span>覆盖</span>
                </cell>
                <cell title="排版" primary="content" class="compose">
                    <i class="iconfont icon-2fuben-copy" style="font-size:18px;padding: 5px 12px;border: solid 1px"></i>
                    <i class="iconfont icon-2" style="font-size:18px;padding: 5px 12px;border: solid 1px"></i>
                    <i class="iconfont icon-3" style="font-size:18px;padding: 5px 12px;border: solid 1px"></i>
                    <i style="font-size:16px;font-style:initial;padding: 5px 8px;border: solid 1px">无</i>
                    <i class="iconfont icon-add" style="font-size:18px;padding: 5px 8px;border: solid 1px"></i>
                </cell>
                <cell title="背景" primary="content" class="background">
                    <span style="background: #FFFFFF;border: 1px solid #35B4EB;"></span>
                    <span style="background: #EFDBBC;border: 1px solid #D8D8D8;"></span>
                    <span style="background: #D6E8C8;border: 1px solid #D8D8D8;"></span>
                    <span style="background: #FCE2E2;border: 1px solid #D8D8D8;"></span>
                    <span class="iconfont icon-add" style="border: solid 1px;text-align: center;"></span>
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
                bookId: this.$route.query.id,
                width: app.config.setting.width.screen,
                height: app.config.setting.height.screen,
                contentHeight: app.config.setting.height.main,
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
                    lineHeight: 30
                },
                catalogItem: 0,
                fontStyle: true,
                dayNight: '夜间',
                dayNightIcon: 'icon-yejian',
                data: {
                    chapters: []
                },
                chapter: {
                    cur: 1,
                    min: 1,
                    max: 1
                }
            }
        },
        components: {
            XHeader, Tabbar, TabbarItem, Popup, Tab, TabItem, Group, Cell, Range, Popover
        },
        methods: {
            getChapterData(page){
                app.ajax.get(app.config.api.reader.chapter + this.bookId + '/' + page, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data && data.length > 1) {
                            this.data.chapters = data;
                        }
                    }
                }, (err) => {
                });
            },
            handleClickContent(e){
                if (e.x >= this.width * 0.3 && e.x <= this.width * 0.7) {
                    this.$store.commit('updateReaderBar');
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
                    this.switchRiYe();
                }
            },
            changeTabItem(index){
                this.catalogItem = index;
            },
            changeChapter(){
                console.log(this.chapter.cur);
            },
            switchRiYe(){
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
        created(){
            // 全屏显示
            if (app.config.isApp) {

            }
            // 隐藏阅读器底部&顶部导航菜单
            this.$store.commit('updateReaderBar', {header: false, tabBar: false});

            this.getChapterData(1);
        }
    }
</script>

<style>
    .reader {
        font-family: PingFangSC-Regular;
    }

    .reader .vux-header {
        width: 360px;
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
    }

    .reader .main .content {
        letter-spacing: 4px;
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

    .reader .popup-setting .compose i {
        border-radius: 5px;
        margin: 0px 5px;
    }

    .reader .popup-setting .turn .vux-cell-primary span {
        display: inline-flex;
        border-radius: 5px;
        border: solid 1px;
        padding: 5px 45px;
        margin: 0px 6px;
    }

    .reader .popup-setting .background .vux-cell-primary span {
        display: inline-grid;
        border-radius: 4px;
        width: 42px;
        height: 28px;
        margin: 0px 3px;
    }
</style>