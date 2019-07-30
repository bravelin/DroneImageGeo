/** ajax 基于axios */
import axios from 'axios'
import { cookie } from './util'
import store from '../store/index'
import conf from './config'
let csrfToken = ''

axios.defaults.baseURL = conf.storeBaseUrl || conf.baseUrl
// 请求发送之前的拦截器
axios.interceptors.request.use(config => {
    if (!csrfSafeMethod(config.method)) {
        if (!csrfToken) {
            csrfToken = cookie('csrfToken')
        }
        config.headers['x-csrf-token'] = csrfToken
    }
    config.headers['Authorization'] = `Bearer ${store.state.global.userToken}`
    config.headers['uid'] = store.state.global.userId
    return config
}, error => {
    return Promise.reject(error)
})

// 请求响应拦截器
axios.interceptors.response.use(res => {
    const resData = res.data
    // console.log('ajax res', resData)
    if (resData.code === 401) { // 跳转至登录
        // store.state.global.currRouter.instance.push({ name: 'login' })
        console.log('to login page...')
        return Promise.reject(res)
    } else {
        return Promise.resolve(res)
    }
}, error => {
    return Promise.reject(error)
})

function csrfSafeMethod (method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/i.test(method))
}

export default function (options) {
    return new Promise((resolve, reject) => {
        axios.request(options).then(res => {
            resolve(res.data)
        }, error => {
            reject(error)
        })
    })
}
