<!--年份下拉选择-->
<template>
    <div class="year-selector" :class="{ active: activeStatus }">
        <div @click="doShow($event)">2015年<i></i></div>
        <ul>
            <li>2019年</li>
            <li>2018年</li>
            <li>2017年</li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: 'YearSelector',
        data () {
            return {
                activeStatus: false
            }
        },
        created () {
            document.body.addEventListener('click', this.doHide)
        },
        methods: {
            doShow (e) {
                e && e.stopPropagation()
                this.activeStatus = true
            },
            doHide () {
                this.activeStatus = false
            }
        },
        beforeDestroy () {
            document.body.removeEventListener('click', this.doHide)
        }
    }
</script>
