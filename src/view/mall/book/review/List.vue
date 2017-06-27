<template>
    <div class="mall-book-review-list">
        <scroller :on-infinite="handleInfinite" :height="height+''" style="top: 46px;">
            <c-list-view type="review" :list="dataList"></c-list-view>
        </scroller>
    </div>
</template>

<script>
    import CListView from '../../../components/ListView.vue';

    export default {
        data () {
            return {
                height: app.config.setting.height.display - app.config.setting.height.header,
                page: 1,
                dataList: []
            }
        },
        components: {
            CListView
        },
        methods: {
            getData(callback){
                app.ajax.get(app.config.api.book.review.list + this.$route.query.id + '/' + this.page, {},
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
                title: '全部评论',
                showBack: true,
                showReview: true
            });
        },
        mounted(){
            this.getData();
        }
    }
</script>