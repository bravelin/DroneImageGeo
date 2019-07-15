/** ajax 基于axios */
import axios from 'axios'
import { cookie } from '@/lib/util'
import store from '@/store/index'
let csrfToken = ''

// 请求发送之前的拦截器
axios.interceptors.request.use(config => {
    if (!csrfSafeMethod(config.method)) {
        if (!csrfToken) {
            csrfToken = cookie('csrfToken')
        }
        config.headers['x-csrf-token'] = csrfToken
    }
    config.headers['Authorization'] = `Bearer ${store.state.userToken}`
    config.headers['uid'] = store.state.userId
    return config
}, error => {
    return Promise.reject(error)
})

// 请求响应拦截器
axios.interceptors.response.use(res => {
    const resData = res.data
    // console.log('ajax res', resData)
    if (resData.code === 401) { // 跳转至登录
        store.state.currRouter.instance.push({ name: 'login' })
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
