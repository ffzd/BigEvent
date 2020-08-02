$(function () {
    // 定义校验规则
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称应该输入1-6位之间！"
            }
        }
    })
    initUserinfo()

    function initUserinfo() {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                console.log(res)
                form.val('formUserInfo', res.data)
            }
        })
    }

    $("#BtnReset").on("reset", function (e) {
        e.preventDefault()
        initUserinfo()
    })
    // 提交用户修改
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        //ajax请求
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('用户信息修改失败!')
                } else {
                    layer.msg('恭喜您.信息更新成功')
                    window.parent.getUserInfo()
                }
            }
        })
    })
})







