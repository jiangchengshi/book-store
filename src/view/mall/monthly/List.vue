<template>
    <div class="mall-monthly-list">
        <c-list-view type="monthly" link="detail" :list="dataList"></c-list-view>
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
        created(){
            this.$store.commit('updateHeader', {
                title: '包月',
                showBack: true,
                showSearch: true
            });
        },
        mounted(){
            app.ajax.get(app.config.api.monthly.monthly, {},
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
    }
</script>