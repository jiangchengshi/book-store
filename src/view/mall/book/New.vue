<template>
    <div class="new">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">{{title}}</h1>
            <a class="mui-pull-right"><i class="mui-icon iconfont icon-sousuo-sousuo1"></i></a>
        </header>
        <ListViewBook :url="url" :param="param" @tapView="handleTapView"></ListViewBook>
    </div>
</template>

<script>
    import ListViewBook from '../../components/ListViewBook.vue';

    export default {
        data () {
            return {
                title: '新书',
                url: app.config.api.book.new + 1,
                param: {}
            }
        },
        components: {
            ListViewBook
        },
        methods:{
            handleTapView(e){
                console.log('child');
                console.log(e);
            }
        }
    }
</script>

<style scoped>
    .new {
        margin: 0;
        padding: 0;
    }

    header {
        background-color: white;
    }
</style>