// 设置路径
var baseURL = "http://ajax.frontend.itheima.net"
// 1.拦截/过滤 每一次ajax请求，配置每次请求需要的参数
$.ajaxPrefilter(function (options) {
    options.url = baseURL + options.url
    // console.log(options.url)
    // 2.判断,请求路径是否包含/my/
    if (options.url.indexOf('/my/') != -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
    }
    options.complete = function (res) {
        var data = res.responseJSON
        // console.log(res)
        // message里面的信息和res.responseJSON.message中必需一模一样
        if (data.status == 1 && data.message == '身份认证失败！') {
            localStorage.removeItem("token")
            location.href = "/login.html"
        }
    }
})