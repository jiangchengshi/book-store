<template>
    <div class="mall-classify-detail" style="overflow: scroll;" :style="{height:height+'px'}">
        <div style="font-family: PingFangSC-Light;font-size: 15px;color: #828181;padding: 10px;">
            此分类共收录 <label style="color: #64c4ed;">{{dataList.length}}</label> 本书籍
        </div>
        <c-list-view type="book" :list="dataList"></c-list-view>
    </div>
</template>

<script>
    import CListView from '../../components/ListView.vue';

    export default {
        data () {
            return {
                height: app.config.setting.height.display - app.config.setting.height.header - app.config.setting.height.tabbar,
                dataList: []
            }
        },
        components: {
            CListView
        },
        methods: {
            getData(id){
                app.ajax.get(app.config.api.classify + id, {},
                    (data) => {
                        this.dataList = data.result;
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: this.$route.query.name,
                showBack: true,
                showSearch: true
            });
        },
        mounted(){
            this.getData(this.$route.query.id);
        }
    }
</script>