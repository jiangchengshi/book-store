<template>
    <div class="mall-book-new" style="height: inherit;">
        <scroller :on-infinite="handleInfinite" style="top: 46px;" :height="height+''">
            <c-list-view type="book" :list="dataList"></c-list-view>
        </scroller>
    </div>
</template>

<script>
    import CListView from '../../components/ListView.vue';

    export default {
        data () {
            return {
                height: app.config.setting.height.display - app.config.setting.height.header - app.config.setting.height.tabbar,
                page: 1,
                dataList: []
            }
        },
        components: {
            CListView
        },
        methods: {
            getData(callback){
                app.ajax.get(app.config.api.book.new + this.page, {},
                    (data) => {
                        if (data.result && data.result.length > 0) {
                            this.dataList = this.dataList.concat(data.result);

                            if (typeof callback == "function") {
                                callback();
                            }
                        } else {
                            if (typeof callback == "function") {
                                this.page--;

                                callback(true);
                            }
                        }
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            handleInfinite(done){
                if (this.page >= 10) {
                    done(true);
                    return;
                }
                setTimeout(() => {
                    this.page++;

                    this.getData(done);
                }, 1500);
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '新书',
                showBack: true,
                showSearch: true
            });
        },
        mounted(){
            this.getData();
        }
    }
</script>