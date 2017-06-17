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
                app.ajax.get(app.config.api.classify + id, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data && data.length > 0) {
                            this.dataList = data;
                        }
                    }
                }, (err) => {
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