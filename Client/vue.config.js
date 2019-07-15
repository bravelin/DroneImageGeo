module.exports = {
    publicPath: './',
    assetsDir: '',
    productionSourceMap: false,
    devServer: {
        port: 9091,
        https: false,
        hotOnly: false,
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: 'http://192.168.2.117:10013/bigdata/',
                changeOrigin: true,
                pathRewrite: {
                    '^/bigdata': ''
                }
            }
        }
    }
}
