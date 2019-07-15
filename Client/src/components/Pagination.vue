<!--分页组件-->
<template>
    <div class="pagination-wrap">
        <a class="prev" :class="{ disable: !hasPrev }" @click="doPrev"><i class='iconfont'>&#xe624;</i></a>
        <a v-for="(item,index) in posArr" :key="index" :class="{ curr: item==curr }" @click="doClickItem(item)">{{ item }}</a>
        <a class="next" :class="{ disable: !hasNext }" @click="doNext"><i class='iconfont'>&#xe623;</i></a>
    </div>
</template>
<script>
    export default {
        name: 'Pagination',
        props: {
            total: { // 总页数
                type: Number,
                required: true
            },
            curr: { // 当前页码
                type: Number,
                required: true
            }
        },
        computed: {
             hasPrev () {
                return this.curr != 1
            },
            hasNext () {
                const that = this
                return that.curr != that.total
            },
            posArr () {
                const that = this
                const list = []
                let i = 0
                const total = that.total
                if (total <= 7) {
                    for (i = 1; i <= total; i++) {
                        list.push(i)
                    }
                } else {
                    list[0] = 1
                    list[6] = total
                    let left = that.curr - 1
                    let right = that.curr + 1
                    if (left < 3) {
                        for (i = 1; i <= 4; i++) {
                            list[i] = i + 1
                        }
                        list[5] = '...'
                    } else if (total - right < 3) {
                        for (i = 5; i >= 2; i--) {
                            list[i] = list[i + 1] - 1
                        }
                        list[1] = '...'
                    } else {
                        list[1] = '...'
                        list[2] = left
                        list[3] = that.curr
                        list[4] = right
                        list[5] = '...'
                    }
                }
                return list
            }
        },
        methods: {
            doPrev () {
                const that = this
                if (that.hasPrev) {
                    that.$emit('switch', that.curr - 1)
                }
            },
            doNext () {
                const that = this
                if (that.hasNext) {
                    that.$emit('switch', that.curr + 1)
                }
            },
            doClickItem (page) {
                if (page != '...') {
                    this.$emit('switch', page)
                }
            }
        }
    }
</script>
