<template>
    <div class="list">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">{{title}}</h1>
        </header>
        <ListViewMonthly :url="url" :param="param" @tapView="handleTapView"></ListViewMonthly>
    </div>
</template>

<script>
    import ListViewMonthly from '../../components/ListViewMonthly.vue';

    export default {
        data () {
            return {
                title: '包月',
                url: app.config.api.monthly,
                param: {}
            }
        },
        components: {
            ListViewMonthly
        },
        methods: {
            handleTapView(id){
                this.$router.push({path: 'monthlyDetail', query: {id: id}});
            }
        }
    }
</script>

<style scoped>
    .list {
        margin: 0;
        padding: 0;
    }

    header {
        background-color: white;
    }
</style>