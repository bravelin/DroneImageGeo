import ns from '@/store/constants/ns'
import dataManage from '@/store/dataManage/index'
import search from '@/store/search/index'
import gardenInfo from '@/store/gardenInfo/index'

export default {
    [ns.DATA_MANAGE]: dataManage,
    [ns.SEARCH]: search,
    [ns.GARDEN_INFO]: gardenInfo
}
