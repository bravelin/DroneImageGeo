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
                target: 'http://localhost:9012',
                changeOrigin: true
            }
        }
    }
}
