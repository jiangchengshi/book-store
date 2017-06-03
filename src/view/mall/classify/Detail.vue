<template>
    <div class="mall-classify-detail">
        <div style="font-family: PingFangSC-Light;font-size: 15px;color: #828181;padding: 10px;">
            此分类共收录 {{dataList.length}} 本书籍
        </div>
        <c-list-view type="book" :list="dataList"></c-list-view>
    </div>
</template>

<script>
    import CListView from '../../components/ListView.vue';

    export default {
        data () {
            return {
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