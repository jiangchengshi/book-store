<template>
    <div ref="reader" class="reader">
        <scroller ref="scroller" :onRefresh="handlePullDown" refreshText="下拉添加书签">
            <!-- 侧滑导航根容器 -->
            <div class="mui-off-canvas-wrap mui-draggable" style="z-index:initial;">
                <div class="mui-inner-wrap" ref="muiInnerWrap">
                    <!-- 侧滑菜单 -->
                    <aside class="mui-off-canvas-left" style="background: #FFFFFF;color: #162636; font-size: 12px;">
                        <div style="padding: 10px 10px;">
                            <div id="segmentedControl" class="mui-segmented-control">
                                <a class="mui-control-item mui-active" href="#menuChapter"><span
                                        class="mui-icon iconfont icon-mulu1"></span></a>
                                <a class="mui-control-item" href="#menuMark"><span
                                        class="mui-icon iconfont icon-bookmark"></span></a>
                                <a class="mui-control-item" href="#menuNote"><span
                                        class="mui-icon iconfont icon-biji"></span></a>
                            </div>
                        </div>
                        <div class="content">
                            <div id="menuChapter" class="mui-control-content mui-active">
                                <ul class="mui-table-view" v-if="menu.chapterArr.length>0">
                                    <li class="mui-table-view-cell" :data-index="index"
                                        v-for="(chapter, index) in menu.chapterArr"
                                        @tap.stop="handleTapMenuChapter">
                                        {{chapter}}
                                    </li>
                                </ul>
                                <ul v-else>没有发现目录哦</ul>
                            </div>
                            <div id="menuMark" class="mui-control-content">
                                <ul class="mui-table-view" v-if="menu.markArr.length>0">
                                    <li class="mui-table-view-cell" :data-index="index"
                                        v-for="(mark, index) in menu.markArr"
                                        @tap.stop="handleTapMenuMark">
                                        {{mark.title}} - {{mark.content}}
                                    </li>
                                </ul>
                                <ul v-else>没有发现书签哦</ul>
                            </div>
                            <div id="menuNote" class="mui-control-content">
                                <ul class="mui-table-view" v-if="menu.noteArr.length>0">
                                    <li class="mui-table-view-cell" v-for="(note, index) in menu.noteArr">
                                        {{note}}
                                    </li>
                                </ul>
                                <ul v-else>没有发现笔记哦</ul>
                            </div>
                        </div>
                    </aside>
                    <!-- 顶部导航 -->
                    <header class="mui-bar mui-bar-nav" v-show="$store.state.showHeader"
                            :style="{color:setting.navColor, 'background-color':setting.navBackgroundColor}">
                        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
                        <a href="#popoverMore" class="mui-icon mui-icon-more mui-pull-right"
                           style="margin-left: 5px;"></a>
                        <a href="javascript:void(0);" class="mui-icon iconfont icon-shuqian mui-pull-right"
                           style="margin-left: 5px;" @tap.stop="handleNavBarMark"></a>
                        <a href="javascript:void(0);" class="mui-icon iconfont icon-xiazai mui-pull-right"
                           style="margin-left: 5px;" @tap.stop="handleNavBarDownload"></a>
                        <a href="javascript:void(0);" class="mui-icon iconfont icon-tubiao mui-pull-right"
                           @tap.stop="handleNavBarReward"></a>
                    </header>
                    <!-- 底部导航 -->
                    <nav class="mui-bar mui-bar-tab" v-show="$store.state.showFooter" ref="tabBar"
                         :style="{color:setting.tabColor, 'background-color':setting.tabBackgroundColor}">
                        <a class="mui-tab-item" @tap.stop="handleTapTabBarML" href="javascript:void(0);">
                            <span class="mui-icon iconfont icon-mulu1"></span>
                            <span class="mui-tab-label">目录</span>
                        </a>
                        <a class="mui-tab-item" @tap.stop="handleTapTabBarJD" href="javascript:void(0);">
                            <span class="mui-icon iconfont icon-diaozhengjindu-copy"></span>
                            <span class="mui-tab-label">进度</span>
                        </a>
                        <a class="mui-tab-item" @tap.stop="handleTapTabBarSZ" href="javascript:void(0);">
                            <span class="mui-icon iconfont icon-icon-yxj-font"></span>
                            <span class="mui-tab-label">设置</span>
                        </a>
                        <a class="mui-tab-item" @tap.stop="handleTapTabBarRY" href="javascript:void(0);">
                            <span class="mui-icon iconfont" :class="[dayNightIcon]"></span>
                            <span class="mui-tab-label">{{dayNight}}</span>
                        </a>
                    </nav>
                    <!-- 正文显示 -->
                    <div class="chapter-content"
                         :style="{height:screen.height+'px', width:screen.width+'px', color:setting.color, 'background-color':setting.backgroundColor}">
                        <div class="chapter-title" :style="{color: setting.color}">
                            {{chapter.title}}
                        </div>
                        <div class="chapter-mark" v-show="markFlag">
                            <i class="mui-icon iconfont icon-bookmark"></i>
                        </div>
                        <div class="chapter-scroll" ref="chapterScroll" @tap="handleTapContent"
                             :style="{height: chapter.scroll.height+'px', width: chapter.scroll.width+'px', opacity: setting.opacity,
                             'font-size':setting.fontSize+'px', 'line-height':setting.lineHeight+'px', 'line-spacing':setting.lineSpacing+'px'}">
                            <transition @enter="handleEnter" @leave="handleLeave" :css="false">
                                <div class="chapter-body" ref="chapterBody" v-show="tranFlag"
                                     :style="{height: chapter.body.height+'px', width: chapter.body.width+'px', 'column-width': chapter.body.width+'px'}">
                                    {{chapter.content}}
                                </div>
                            </transition>
                        </div>
                        <div class="chapter-status" :style="{color: setting.color}">
                            <span class="battery">
                                <i v-if="chapter.battery>80" class="mui-icon iconfont icon-bf-icon-battery"></i>
                                <i v-else-if="chapter.battery>50" class="mui-icon iconfont icon-bf-battery3"></i>
                                <i v-else-if="chapter.battery>20" class="mui-icon iconfont icon-bf-icon-battery4"></i>
                                <i v-else class="mui-icon iconfont icon-bf-icon-battery_charging"></i>
                            </span>
                            <span class="time">{{chapter.time}}</span>
                            <span class="progress">{{chapter.progress}}</span>
                        </div>
                        <!-- 遮罩层 -->
                        <div class="mui-off-canvas-backdrop"></div>
                    </div>
                </div>
            </div>
        </scroller>
        <!-- 顶部弹出菜单：更多 -->
        <div id="popoverMore" class="mui-popover">
            <div class="mui-popover-arrow"></div>
            <ul class="mui-table-view">
                <li class="mui-table-view-cell" @tap.stop="handleTapPopMark">
                    <a href="javascript:void(0);"><span class="mui-icon iconfont icon-tianjiashuqian"></span>
                        添加书签</a>
                </li>
                <li class="mui-table-view-cell" @tap.stop="handleTapPopSearch">
                    <a href="javascript:void(0);"><span class="mui-icon iconfont icon-sousuo-sousuo1"></span>
                        全文搜索</a>
                </li>
                <li class="mui-table-view-cell">
                    <a href="#popoverBook"><span class="mui-icon iconfont icon-iconset0116"></span> 书籍详情</a>
                </li>
                <li class="mui-table-view-cell" @tap.stop="handleTapPopShare">
                    <a href="javascript:void(0);"><span class="mui-icon iconfont icon-fenxiang3"></span>
                        分享本书</a>
                </li>
            </ul>
        </div>
        <!-- 底部弹出： 书本详情&购买 -->
        <div id="popoverBook" class="mui-popover mui-popover-bottom mui-popover-action popover-book">
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
        <!-- 底部弹出菜单：进度 -->
        <div class="mui-popover mui-popover-bottom popover-jd">
            <div class="mui-popover-arrow"></div>
            <div class="chapter">
                <span class="title">{{chapterTitle[chapterTitleKeyArr[chapterCur]]}}</span>
                <span class="process">{{chapter.progress}}</span>
            </div>
            <div class="mui-input-row mui-input-range" style="padding-right:0px;color:#35B4EB;">
                <label style="padding: 15px 10px; width: 20%" @tap.stop="handleTapPopPrevChapter">上一章</label>
                <input type="range" :min="chapterMin" :max="chapterMax" :value="chapterCur"
                       @change="handleChangePopProgress">
                <label style="padding: 15px 10px; width: 20%" @tap.stop="handleTapPopNextChapter">下一章</label>
            </div>
        </div>
        <!-- 底部弹出菜单：设置 -->
        <div class="mui-popover mui-popover-bottom popover-sz">
            <div class="mui-popover-arrow"></div>
            <div class="mui-input-row mui-input-range bright" style="padding-right: 0px;">
                <label>亮度</label>
                <span class="mui-icon iconfont icon-rijian" style="font-size: 16px"></span>
                <input type="range" min="1" max="100" @change="handleChangePopBright">
                <span class="mui-icon iconfont icon-rijian" style="font-size: 26px;"></span>
            </div>
            <div class="mui-input-row mui-input-range font" style="padding-right: 0px;">
                <label>字体</label>
                <span class="simpleTradition btn" data-oper="convert" @tap.stop="handleTapPopFont">{{setting.fontFamily}}</span>
                <span class="minus btn" data-oper="minus" @tap.stop="handleTapPopFont">A-</span>
                <span class="size">{{setting.fontSize}}</span>
                <span class="plus btn" data-oper="plus" @tap.stop="handleTapPopFont">A+</span>
            </div>
            <div class="mui-input-row mui-input-range turn" style="padding-right: 0px;">
                <label>翻页</label>
                <span class="btn" data-effect="1" @tap.stop="handleTapPopTurn">滑动</span>
                <span class="btn" data-effect="2" @tap.stop="handleTapPopTurn">覆盖</span>
            </div>
            <div class="mui-input-row mui-input-range compose" style="padding-right: 0px;">
                <label>排版</label>
                <span class="mui-icon iconfont icon-jianju1 btn" data-height="20"
                      @tap.stop="handleTapPopCompose"></span>
                <span class="mui-icon iconfont icon-jianju2 btn" data-height="30"
                      @tap.stop="handleTapPopCompose"></span>
                <span class="mui-icon iconfont icon-jianju btn" data-height="40"
                      @tap.stop="handleTapPopCompose"></span>
                <span class="mui-icon mui-icon-plusempty btn"></span>
            </div>
            <div class="mui-input-row mui-input-range background" style="padding-right: 0px;">
                <label>背景</label>
                <span class="btn" style="background-color: #F7F7F7" data-bg-color="#F7F7F7" data-color="#1F1F1F"
                      @tap.stop="handleTapPopBackground"></span>
                <span class="btn" style="background-color: #EFDBBC" data-bg-color="#EFDBBC" data-color="#1F1F1F"
                      @tap.stop="handleTapPopBackground"></span>
                <span class="btn" style="background-color: #D6E8C8" data-bg-color="#D6E8C8" data-color="#1F1F1F"
                      @tap.stop="handleTapPopBackground"></span>
                <span class="btn" style="background-color: #FCE2E2" data-bg-color="#FCE2E2" data-color="#162636"
                      @tap.stop="handleTapPopBackground"></span>
                <span class="mui-icon mui-icon-plusempty btn"></span>
            </div>
        </div>
    </div>
</template>

<script>
    let splitTitle = '\r\n\r\n',    // 分割章节目录
        borderWidthArr = [],    // 边界宽度数组
        bookContent = "",   // 书籍内容
        tabBarHeight = 50 + 44;    // 菜单nav高度 + 底部padding
    export default {
        name: 'reader',
        data () {
            return {
                screen: {
                    height: 0,  // 屏幕显示高度
                    width: 0    // 屏幕显示宽度
                },
                chapter: {
                    title: '',
                    content: '',
                    progress: '0 %',
                    battery: 100,
                    time: '',
                    scroll: {
                        height: 0,   // 滚动可显示高度（单屏）
                        width: 0    // 滚动可显示宽度（单屏）
                    },
                    body: {
                        height: 0,   // 正文可显示高度（单屏）
                        width: 0    // 正文可显示宽度（单屏）
                    }
                },
                menu: {
                    chapterArr: [],    // 菜单 章节 数组， [第*章 ******, 第*+1章 ******, ...]
                    markArr: [],    // 菜单 书签 数组
                    noteArr: []    // 菜单 笔记 数组
                },
                pos: {
                    translateX: 0,  // X轴移动距离
                    scrollX: 0   // 已滚动的X距离
                },
                setting: {
                    brightness: 0,   // 亮度
                    fontFamily: '繁',   // 简体/繁体
                    fontSize: 14,   // 字体大小
                    color: '#1F1F1F',  // 字体颜色
                    navColor: ' #162636',   // 字体颜色：顶部nav
                    tabColor: ' #162636',   // 字体颜色：底部tab
                    backgroundColor: '#F7F7F7', // 背景颜色
                    navBackgroundColor: '#FFFFFF',  // 背景颜色：顶部nav
                    tabBackgroundColor: '#FFFFFF',  // 背景颜色：底部tab
                    opacity: 1, // 不透明级别
                    turnEffect: 1,  // 翻页效果：1-滑动；2-覆盖
                    lineHeight: 30, // 行间高
                    lineSpacing: 4  // 行间隔
                },
                chapterTitle: {},    // 章节title对象， {第*章: 第*章 ******}
                chapterTitleKeyArr: [],    // 章节title key数组， 第*章
                chapterCur: 0, // 当前章节： title key数组的下标
                chapterMin: 0, // 最小章节： 默认0
                chapterMax: 0, // 最大章节： title key数组的长度-1
                dayNight: '夜间',
                dayNightIcon: 'icon-yejian1',
                tranFlag: true, // 翻页效果 切换标识
                markFlag: false // 书签标识
            }
        },
        methods: {
            openBook(){
                let _this = this;
                let localFile = _this.$store.state.localPath + _this.$route.query.name;
                if (app.config.isApp) {
                    plus.nativeUI.showWaiting('努力加载中...');
                    plus.io.resolveLocalFileSystemURL(localFile, function (fe) {
                        fe.file(function (file) {
                            let fileReader = new plus.io.FileReader();
                            fileReader.readAsText(file, 'GB18030');
                            fileReader.onloadend = function (e) {
                                bookContent = e.target.result;
                                // 处理书籍内容
                                _this.processBook();
                                // 展示当前章节内容
                                _this.showChapter();
                                // 关闭loading
                                plus.nativeUI.closeWaiting();
                            }
                        }, function (e) {
                            app.mui.toast("read book exception: " + e.message);
                        });
                    }, function (e) {
                        app.mui.toast("open book exception: " + e.message);
                    });
                } else {
                    bookContent = "第46集 - 陆亦可摆脱祁同伟的围追堵截 易学习调任纪委书记监督李达康\r\n\r\n" +
                        "吕梁希望侯亮平将此事汇报给田国富，侯亮平觉得自己还在审查期间，还是由他去汇报更合适。张宝宝从交警队出来。" +
                        "第47集 - 田国富来到吕州找易学习，他们俩来到月牙湖\r\n\r\n" +
                        "与此同时，田国富来到吕州找易学习，他们俩来到月牙湖，湖面碧波荡漾，让人心旷神怡。田国富向易学习传达了。" +
                        "第48集 - 郑乾突然想明白了，吴心怡之所以让他一起陪同来接人\r\n\r\n" +
                        "郑乾，吴心怡和林华华等在外面等候，郑乾突然想明白了，吴心怡之所以让他一起陪同来接人，就是为了让他投案自首。";
                    // 处理书籍内容
                    _this.processBook();
                    // 展示当前章节内容
                    _this.showChapter();
                }
            },
            processBook() {
                let _this = this;
                _this.chapterTitleKeyArr = bookContent.match(/\u7b2c.+[\u7ae0|\u96c6]/g);
                _this.chapterMax = _this.chapterTitleKeyArr.length - 1;
                _this.chapterTitleKeyArr.forEach(function (key, i) {
                    let posStart = bookContent.indexOf(key);
                    let posEnd = bookContent.indexOf(splitTitle, posStart);
                    _this.chapterTitle[key] = bookContent.substring(posStart, posEnd);
                    _this.menu.chapterArr.push(_this.chapterTitle[key]);
                });
            },
            showChapter(direction) {
                if (direction == 'prev') {
                    this.chapterCur--;
                } else if (direction == 'next') {
                    this.chapterCur++;
                }
                let chapterKey = this.chapterTitleKeyArr[this.chapterCur];
                if (!chapterKey) {
                    app.mui.toast('系统发生错误,请退出重新打开. err.key');
                    return;
                }
                let chapterTitle = this.chapterTitle[chapterKey];
                if (!chapterTitle) {
                    app.mui.toast('系统发生错误,请退出重新打开. err.title');
                    return;
                }
                let posStart = bookContent.indexOf(chapterTitle);
                if (posStart == -1) {
                    app.mui.toast('系统发生错误,请退出重新打开. err.pos');
                    return;
                }
                posStart += chapterTitle.length + splitTitle.length;
                let chapterKeyNext = this.chapterTitleKeyArr[this.chapterCur + 1];
                let chapterTitleNext = this.chapterTitle[chapterKeyNext];
                let posEnd = bookContent.indexOf(chapterTitleNext, posStart);
                let chapterContent = posEnd == -1 ? bookContent.substring(posStart) : bookContent.substring(posStart, posEnd);

                // 章节内容
                this.chapter.title = chapterTitle;
                this.chapter.content = chapterContent;
                this.chapter.progress = Number(this.chapterCur / this.chapterMax * 100).toFixed(2) + ' %';

                // 切换章节：等dom渲染后
                app.vue.$nextTick(() => {
                    // 已滚动的距离
                    if (direction == 'prev') {  // 上一章节
                        this.pos.scrollX = this.$refs.chapterBody.scrollWidth - this.screen.width + 40;
                    } else if (direction == 'next') {   // 下一章节
                        this.pos.scrollX = 0;
                    } else if (direction != 'shift') {  // 当前章节：shift=>需要移动，其他则为0，不需移动
                        this.pos.scrollX = 0;
                    }
                    this.pos.translateX = this.pos.scrollX;
                    // 翻页滚动
                    this.processTurn();
                });
            },
            handleTapContent (e){
                let tapX = e.detail.touches[0].pageX;
                // 中间区域：点击显示 navbar
                if (tapX > borderWidthArr[0] && tapX < borderWidthArr[1]) {
                    this.$store.commit('updateNavbarStatus');
                } else {
                    // 翻页：上一页
                    if (tapX <= borderWidthArr[0]) {
                        this.processPage('prev');
                    } else
                    // 翻页：下一页
                    if (tapX >= borderWidthArr[1]) {
                        this.processPage('next');
                    }
                }
            },
            handleSwipeLeft(e){
                this.processPage('next');
            },
            handleSwipeRight(e){
                this.processPage('prev');
            },
            processPage(direction) {
                if (direction == 'prev') {
                    this.pos.translateX = this.pos.scrollX - this.screen.width;
                    if (this.pos.translateX < 0) {
                        if (this.chapterCur <= this.chapterMin) {
                            app.mui.toast('已经到最前面了');
                        } else {
                            this.showChapter(direction);
                        }
                        return;
                    }
                } else if (direction == 'next') {
                    this.pos.translateX = this.pos.scrollX + this.screen.width;
                    if (this.pos.translateX >= this.$refs.chapterBody.scrollWidth) {
                        if (this.chapterCur >= this.chapterMax) {
                            app.mui.toast('已经到最后面了');
                        } else {
                            this.showChapter(direction);
                        }
                        return;
                    }
                }

                // 记录已滚动的距离
                this.pos.scrollX = this.pos.translateX;
                // 翻页滚动
                this.processTurn();
            },
            processTurn(){
                this.tranFlag = false;

                // mark标记
                this.markFlag = this.checkMark();
            },
            handleNavBarMark(){
                app.mui.alert('别点了，还没有书签...');
            },
            handleNavBarDownload(){
                app.mui.alert('别点了，您没有下载权限...');
            },
            handleNavBarReward(){
                app.mui.alert('别点了，你还没有登录呢...');
            },
            handleTapPopMark(e){
                app.mui.alert('添加书签吧', '友情提示');
            },
            handleTapPopSearch(e){
                app.mui.alert('搜索走神了', '友情提示');
            },
            handlePopBuyBook(e){
                app.mui.alert('没钱了，咋买啊', '友情提示');
            },
            handleTapPopShare(e){
                app.mui.alert('您不能分享，登录吧', '友情提示');
            },
            handleTapTabBarML(e){
                app.mui('.mui-off-canvas-wrap').offCanvas('show');
            },
            handleTapTabBarJD(e){
                app.mui('.mui-popover.popover-jd').popover('toggle', this.$refs.tabBar);
            },
            handleTapPopPrevChapter(){
                if (this.chapterCur > this.chapterMin) {
                    this.chapterCur--;
                    this.showChapter();
                }
            },
            handleTapPopNextChapter(){
                if (this.chapterCur < this.chapterMax) {
                    this.chapterCur++;
                    this.showChapter();
                }
            },
            handleChangePopProgress(e){
                this.chapterCur = Number(e.target.value);
                this.showChapter();
            },
            handleTapTabBarSZ(e){
                app.mui('.mui-popover.popover-sz').popover('toggle', this.$refs.tabBar);
            },
            handleTapTabBarRY(e){
                let go2Night = this.dayNight === '夜间' ? true : false;
                this.dayNight = go2Night ? '日间' : '夜间';
                this.dayNightIcon = go2Night ? 'icon-rijian1' : 'icon-yejian1';
                this.setting.color = go2Night ? '#FFFFFF' : '#1F1F1F';
                this.setting.navColor = go2Night ? '#BDBDBD' : '#162636';
                this.setting.tabColor = go2Night ? '#BDBDBD' : '#162636';
                this.setting.backgroundColor = go2Night ? '#222224' : '#F7F7F7';
                this.setting.navBackgroundColor = go2Night ? '#2C3136' : '#FFFFFF';
                this.setting.tabBackgroundColor = go2Night ? '#2D3136' : '#FFFFFF';
                this.setting.opacity = go2Night ? 0.26 : 1;
            },
            handleChangePopBright(e){
                plus.screen.setBrightness(Number(e.target.value / 100).toFixed(1));
            },
            handleTapPopFont(e){
                let oper = e.detail.target.dataset.oper;
                if (oper == 'convert') {
                    this.setting.fontFamily = this.setting.fontFamily == '繁' ? '简' : '繁';
                    app.mui.toast('切换? 稍等');
                } else if (oper == "minus") {
                    this.setting.fontSize--;
                } else if (oper == "plus") {
                    this.setting.fontSize++;
                }
                let eleFontArr = app.mui('.popover-sz .font span.btn');
                this.handleActiveElement(eleFontArr, e.target);
            },
            handleTapPopTurn(e){
                this.setting.turnEffect = Number(e.detail.target.dataset.effect);
                let eleTurnArr = app.mui('.popover-sz .turn span');
                this.handleActiveElement(eleTurnArr, e.target);
            },
            handleTapPopCompose(e){
                let height = Number(e.detail.target.dataset.height);
                this.setting.lineHeight = height;
                let eleComposeArr = app.mui('.popover-sz .compose span');
                this.handleActiveElement(eleComposeArr, e.target);
            },
            handleTapPopBackground(e){
                this.setting.backgroundColor = e.detail.target.dataset.bgColor;
                this.setting.color = e.detail.target.dataset.color;
            },
            handleTapMenuChapter(e){
                this.chapterCur = Number(e.target.dataset.index);
                this.showChapter();
            },
            handleTapMenuMark(e){
                let mark = this.menu.markArr[Number(e.target.dataset.index)];
                this.chapterCur = Number(mark.chapterCur);
                this.pos.scrollX = Number(mark.scrollX);
                this.showChapter('shift');
            },
            handleActiveElement(eleArr, target){
                for (let i = 0; i < eleArr.length; i++) {
                    eleArr[i].style.backgroundColor = '#FFFFFF';
                }
                target.style.backgroundColor = '#D8D8D8';
            },
            handlePullDown(){
                // 检查 书签 是否已存在
                let exists = this.checkMark();
                if (!exists) {
                    // 添加 书签
                    this.menu.markArr.push({
                        chapterCur: this.chapterCur,
                        scrollX: this.pos.scrollX,
                        title: this.chapter.title,
                        content: this.chapter.content.substring(0, 50)
                    });
                    this.markFlag = true;
                    // 存储
                    app.util.localStorage('mark', this.menu.markArr);
                    app.mui.toast('已添加书签');
                }

                // 结束下拉
                this.$refs.scroller.finishPullToRefresh();
            },
            handleEnter (el, done) {
                if (this.setting.turnEffect == 1) {
                    Velocity(el, {translateX: '-' + this.pos.translateX + 'px'}, {
                        easing: "ease-in-out",
                        duration: 800,
                        complete: done
                    });
                }
                if (this.setting.turnEffect == 2) {
                    Velocity(el, {opacity: 1, translateX: '-' + this.pos.translateX + 'px'}, {
                        easing: "ease-in-out",
                        duration: 1,
                        complete: done
                    });
                }
            },
            handleLeave (el, done) {
                if (this.setting.turnEffect == 1) {
                    this.tranFlag = true;
                    done();
                } else if (this.setting.turnEffect == 2) {
                    Velocity(el, {opacity: 0}, {
                        easing: "ease-in-out",
                        duration: 1,
                        complete: () => {
                            this.tranFlag = true;
                            done();
                        }
                    });
                }
            },
            handleLongTap(e){
                console.log(e);
                console.log(plus.android.runtimeMainActivity().getContentResolver());
            },
            initLocalAssign(){
                // 1. 亮度
                let brightness = app.util.localStorage('brightness');
                if (brightness) {
                    this.setting.brightness = brightness;
                }
                // 2. 翻页
                let turnEffect = app.util.localStorage('turnEffect');
                if (turnEffect) {
                    this.setting.turnEffect = turnEffect;
                }
                app.mui('.popover-sz .turn span[data-effect="' + this.setting.turnEffect + '"]')[0].style.backgroundColor = '#D8D8D8';
                // 3. 排版
                let lineHeight = app.util.localStorage('lineHeight');
                if (lineHeight) {
                    this.setting.lineHeight = lineHeight;
                }
                app.mui('.popover-sz .compose span[data-height="' + this.setting.lineHeight + '"]')[0].style.backgroundColor = '#D8D8D8';
                // 4. 背景
                let backgroundColor = app.util.localStorage('backgroundColor');
                if (backgroundColor) {
                    this.setting.backgroundColor = backgroundColor;
                }
                // 5. 书签
                let mark = app.util.localStorage('mark');
                if (mark && mark.length > 0) {
                    this.menu.markArr = JSON.parse(mark);
                }
                // 6. 笔记
                let note = app.util.localStorage('note');
                if (note && note.length > 0) {
                    this.menu.noteArr = JSON.parse(note);
                }
            },
            initEventListener(){
                // 监听侧滑菜单：禁用手势侧滑
                this.$refs.muiInnerWrap.addEventListener('drag', function (e) {
                    e.stopPropagation();
                });

                // 监听：手势滑动
                this.$refs.chapterScroll.addEventListener('swipeleft', this.handleSwipeLeft);
                this.$refs.chapterScroll.addEventListener('swiperight', this.handleSwipeRight);

                // 监听：长按 选中文字
                this.$refs.chapterBody.addEventListener('longtap', this.handleLongTap);
            },
            initScreenAssign(){
                // 全屏显示
                if (app.config.isApp) {
                    plus.navigator.setFullscreen(true);
                }

                // 屏幕高度&宽度
                this.screen.height = app.config.device.screenHeight;   // 全屏高度
                this.screen.width = app.config.device.screenWidth; // 全屏宽度

                // 书籍滚动 高度/宽度
                this.chapter.scroll.height = this.screen.height - tabBarHeight; // 减掉 底部tab菜单高度
                this.chapter.scroll.width = this.screen.width;
                // 书籍正文 高度/宽度
                this.chapter.body.height = this.chapter.scroll.height;
                this.chapter.body.width = this.screen.width - 40;

                // 边界点击区域
                borderWidthArr = [this.screen.width * 0.2, this.screen.width * 0.8];
            },
            showTimeNow() {
                this.chapter.time = app.util.dateFormat(new Date(), 'hh:mm');
            },
            checkMark(){
                if (this.menu.markArr.length > 0) {
                    for (let mark of this.menu.markArr) {
                        if (mark.chapterCur == this.chapterCur && mark.scrollX == this.pos.scrollX) {
                            return true;
                        }
                    }
                }
                return false;
            }
        },
        created() {
            // 初始化
            this.initScreenAssign();

            // 当前系统时间
            this.showTimeNow();
            setInterval(this.showTimeNow, 60000);
        },
        mounted() {
            // 打开书籍
            this.openBook();

            // 监听事件
            this.initEventListener();

            // 初始化参数赋值
            this.initLocalAssign();

            // 电量
            if (app.config.isApp) {
                app.util.battery(this.chapter);
            }
        }
    }
</script>

<style>
    .reader {
        font-family: PingFangSC-Regular;
    }

    a {
        color: #42b983;
    }

    .mui-bar-tab ~ .chapter-content {
        padding-bottom: 50px;
    }

    .mui-bar-nav ~ .chapter-content {
        padding-top: 44px;
    }

    .chapter-title {
        opacity: 0.56;
        font-size: 10px;
        letter-spacing: 0;
        line-height: 44px;
        position: absolute;
        top: 0px;
        width: 100%;
        padding: 0px 20px;
    }

    .chapter-mark {
        position: absolute;
        top: 0px;
        right: 35px;
        color: #fb9c15;
    }

    .chapter-mark .iconfont {
        font-size: 35px;
    }

    .chapter-scroll {
        overflow: hidden;
        padding-left: 20px;
    }

    .chapter-scroll .chapter-body {
        text-indent: 30px;
        letter-spacing: 2px;
        -webkit-column-gap: 40px;
        column-gap: 40px;
    }

    .chapter-status {
        opacity: 0.56;
        font-size: 10px;
        letter-spacing: 0;
        position: absolute;
        bottom: 0px;
        line-height: 44px;
        width: 100%;
        padding: 0px 20px;
    }

    .chapter-status .battery {
        margin-left: 10px;
    }

    .chapter-status .time {
    }

    .chapter-status .progress {
        float: right;
        margin-right: 10px;
    }

    .mui-popover.popover-jd {
        font-size: 12px;
    }

    .mui-popover.popover-jd .chapter {
        text-align: center;
        margin-bottom: 10px;
    }

    .mui-popover.popover-jd .chapter span {
        display: block;
        margin: 10px 0px;
    }

    .mui-popover.popover-jd .chapter .title {
        color: #162636;
        padding: 0px 10px;
    }

    .mui-popover.popover-jd .chapter .process {
        color: #EE4D22;
        font-size: 16px;
    }

    .mui-popover.popover-jd input[type=range] {
        width: 58%;
        float: initial;
    }

    .mui-popover.popover-jd input ~ label {
        float: right;
        width: 27%;
    }

    .mui-popover.popover-sz label {
        padding: 15px 10px;
        width: 20%
    }

    .mui-popover.popover-sz span {
        vertical-align: middle;
        line-height: 35px;
    }

    .mui-popover.popover-sz .btn {
        border: 1px solid #D8D8D8;
        border-radius: 4px;
        background-color: #FFFFFF;
    }

    .mui-popover.popover-sz .bright input[type=range] {
        width: 58%;
        float: initial;
    }

    .mui-popover.popover-sz .font .simpleTradition {
        padding: 6px 10px;
    }

    .mui-popover.popover-sz .font .minus, .plus {
        padding: 6px 20px;
    }

    .mui-popover.popover-sz .font .size {
        padding: 0px 5px;
    }

    .mui-popover.popover-sz .turn span {
        padding: 6px 30px;
        margin-right: 10px;
    }

    .mui-popover.popover-sz .compose span {
        margin-top: 5px;
        margin-right: 5px;
        padding: 0px 12px;
        text-align: center;
    }

    .mui-popover.popover-sz .background span {
        width: 34px;
        height: 32px;
        float: left;
        margin-top: 6px;
        margin-right: 10px;
        text-align: center;
    }

    .mui-popover#popoverMore {
        position: fixed;
        top: 16px;
        right: 6px;
        width: 120px;
        font-size: 15px;
    }

    .mui-popover#popoverMore .mui-popover-arrow {
        left: auto;
        right: 6px;
    }

    .mui-popover#popoverBook {
        background: #FFFFFF;
    }

    .mui-popover#popoverBook img {
        position: absolute;
        bottom: 160px;
        width: 110px;
        height: 140px;
        margin-left: 15px;
        border-radius: 5px;
    }

    .mui-popover#popoverBook .book-intro {
        line-height: 60px;
        border-bottom: dotted 1px;
        padding: 10px 0px 10px 140px;
    }

    .mui-popover#popoverBook .book-intro span {
        display: block;
        line-height: 36px;
    }

    .mui-popover#popoverBook .book-buy {
        padding: 10px 20px;
    }

    .mui-popover#popoverBook .book-buy span {
        display: block;
        line-height: 36px;
    }

    .mui-popover#popoverBook .book-buy span label {
        padding-left: 10px;
    }

    .mui-popover#popoverBook button {
        width: 95%;
        margin: 10px;
    }
</style>
