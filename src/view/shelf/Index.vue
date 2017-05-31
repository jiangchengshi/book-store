<template>
    <div class="shelf-index">
        <ul class="books" v-for="book in books">
            <li class="book" v-for="b in book" @click="handleClickBook(b.id)">
                <img v-if="b.id!=-1" :src="b.image">
                <div v-else>
                    <i class="iconfont icon-add"></i>
                    <span>去书城看看</span>
                </div>
                <span class="name" v-html="b.name"></span>
                <span class="author" v-html="b.author"></span>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                books: [],
            }
        },
        methods: {
            initLocalBook(){
                // 获取可展示的书籍： 仅展示8本 + 去书城
                let bookArr = [];
                let storage = app.util.localStorage('book');
                if (storage) {
                    bookArr = JSON.parse(storage);
                }

                bookArr = [{
                    id: 1,
                    name: '盗墓笔记',
                    author: '南派三叔',
                    image: '',
                    chapter: {
                        12: {
                            name: '',
                            content: ''
                        }
                    }
                }];

                if (bookArr.length <= 0) {
                    this.$vux.toast.show({
                        text: '还没有添加过书籍哦!',
                        isShowMask: true
                    });
                    return;
                } else if (bookArr.length >= 8) {
                    bookArr.length = 8;
                }

                // mall-link
                bookArr.push({
                    id: -1,
                    name: '&nbsp;',
                    author: '&nbsp;',
                    image: ''
                });

                // 书籍分3层
                let _books = [];
                bookArr.forEach((book, i) => {
                    if (i > 0 && i % 3 == 0) { // 3, 6
                        this.books.push(_books);
                        _books = [];
                    }
                    _books.push(book);
                    if (i == bookArr.length - 1) {
                        this.books.push(_books);
                    }
                });
            },
            handleClickBook(id){
                if (id == -1) {
                    this.$router.push({path: '/mall'});
                } else {
                    this.$router.push({path: '/reader', query: {id: id}});
                }
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '书架',
                showClean: true
            });
        },
        mounted(){
            this.initLocalBook();
        }
    }
</script>

<style>
    .shelf-index {
        height: inherit;
        width: 100%;
        position: relative;
        background-color: #F8F8F8;
    }

    .shelf-index ul {
        list-style: none;
        padding: 15px 0px;
        margin: 0px auto;
    }

    .shelf-index .books .book {
        display: inline-block;
        margin: 0px 5px 0px 20px;
    }

    .shelf-index .books .book img {
        width: 90px;
        height: 110px;
    }

    .shelf-index .books .book span {
        display: block;
        line-height: 16px;
    }

    .shelf-index .books .book .name {
        font-size: 14px;
    }

    .shelf-index .books .book .author {
        font-size: 12px;
        color: #989A9C;
    }

    .shelf-index .books:last-child .book:last-child div {
        width: 90px;
        height: 110px;
        border: dashed 1px #35B4EB;
        text-align: center;
        display: table-cell;
        vertical-align: middle;
    }

    .shelf-index .books:last-child .book:last-child div .iconfont {
        font-size: 35px;
        color: #35B4EB;
    }

    .shelf-index .books:last-child .book:last-child div span {
        font-size: 12px;
        color: #35B4EB;
    }
</style>