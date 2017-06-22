<template>
    <div class="main">
        <tabbar>
            <tabbar-item @on-item-click="clickTabbar">
                <span slot="icon"><i class="iconfont icon-diaozhengjindu-copy"></i></span>
                <span slot="label">进度</span>
            </tabbar-item>
        </tabbar>
        <popup v-model="show.progress">
            <group style="">
                <cell primary="content">
                    <cell :title="chapterId.cur" primary="content">
                        <range v-model="chapterId.cur" :min="chapterId.min" :max="chapterId.max"
                               :step="chapterId.step"></range>
                    </cell>
                </cell>
            </group>
        </popup>
    </div>
</template>

<script>
    import {
        Tabbar, TabbarItem, Popup, Group, Cell, Range
    } from 'vux';

    export default {
        data () {
            return {
                show: {
                    progress: false
                },
                chapterId: {
                    cur: 1,
                    min: 1,
                    max: 101,
                    step: 1
                }
            }
        },
        components: {
            Tabbar, TabbarItem, Popup, Group, Cell, Range
        },
        methods: {
            clickTabbar(){
                this.show.progress = true;
            }
        }
    }
</script>