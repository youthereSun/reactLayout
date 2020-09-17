const {createProxyMiddleware} = require("http-proxy-middleware");
/*开发环境跨域处理*/
module.exports = function(app){
    app.use(
        createProxyMiddleware("/api",{
            target: 'http://192.168.0.160:8030', //  目标地址 测试服
            changeOrigin:true,
            pathRewrite:{
                "^/api":""
            }
        })
    )
}
