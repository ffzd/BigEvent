// 设置路径
var baseURL = "http://ajax.frontend.itheima.net"
// 拦截/过滤 每一次ajax请求，配置每次请求需要的参数
$.ajaxPrefilter(function (options) {
    options.url = baseURL + options.url
    console.log(options.url)
})