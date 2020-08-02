$(function () {
    var form = layui.form
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不出现空格'],
        //新密码不能与旧密码相同
        samePwd: function (value) {
            if (value == $('[name=oldPwd]').val()) {
                return '新密码不能与原密码相同！'
            }
        },
        //确认密码
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次输入密码不一致！'
            }
        }
    })

    // 3.修改密码
    $(".layui-form").on("submit", function (e) {
        e.preventDefault()
        // 发送ajax
        $.ajax({
            type: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                } else {

                    layui.layer.msg("恭喜您，密码修改成功！即将跳回首页")
                    setTimeout(function () {
                        window.parent.location.href = '/login.html'
                    }, 2000)

                }
                // 重置表单 不能用$(this)
                $(".layui-form")[0].reset()

            }
        })
    })
})