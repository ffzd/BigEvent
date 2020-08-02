$(function () {
    // 1.获取用户信息
    getUserInfo()
    var layer = layui.layer
    // 点击按钮，实现退出功能
    $('#btnLogout').on('click', function () {
        layer.confirm('确认要退出吗？', { icon: 3, title: '提示' }, function (index) {
            //删除本地token
            localStorage.removeItem("token")
            // 页面跳转
            location.href = '/login.html'
            layer.close(index);
        });
    })
})
// 获取用户信息封装函数
function getUserInfo() {
    $.ajax({
        type: 'get',
        url: '/my/userinfo',
        // jQuery ajax中专门用于设置请求头信息的属性
        // headers: {
        //     Authorization: localStorage.getItem("token") || ""
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            renderAvatar(res.data)
        }
    })
}
// 渲染文本头像和图片头像
function renderAvatar(user) {
    // 1.获取用户名称
    var name = user.nickname || user.username
    // console.log($('#welcome'))
    // 2.设置欢迎的文本
    // 注意：id标签只能渲染一次
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3.按需渲染用户头像
    if (user.user_pic != null) {
        $('.layui-nav-img').show().attr("src", user.user_pic)
        $('.text-avator').hide()
    } else {
        $('.layui-nav-img').hide()
        $('.text-avator').show().html(name[0].toUpperCase())

    }
}

