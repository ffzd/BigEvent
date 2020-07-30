$(function () {
    // 1.切换功能
    $("#link_reg").on("click", function () {
        $(".login-box").hide()
        $(".reg-box").show()
    })
    $("#link_login").on("click", function () {
        $(".reg-box").hide()
        $(".login-box").show()
    })

    // 2.定义layui表单校验规则
    var form = layui.form;
    // 利用dorm这个对象，创建规则
    form.verify({
        // 属性的值可以是数组，也可以是函数
        pwd: [/^\S{6,12}$/, "密码为6-12位，不能包含空格！"],
        // 确定密码校验规则
        repwd: function (value) {
            if ($("#repassword").val() !== value) {
                return "两次输入密码不一致！"
            }
        }
    })
    // 3.注册功能
    var layer = layui.layer;
    $("#form_reg").on("submit", function (e) {
        // 阻止表单默认提交
        e.preventDefault()
        // console.log($("#form_reg").serialize());
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            // data: $("#form_reg").serialize(),
            data: {
                username: $("#form_reg [name=username]").val(),
                password: $("#form_reg [name=password]").val()
            },
            success: function (res) {
                // 注册失败校验
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                // 触动切换到登录的a连接的点击行为
                $("#link_login").click();
                $("#form_reg")[0].reset()
            }
        })
    })
    // 4.登录
    $("#form_login").on("submit", function (e) {
        // 阻止表单默认提交
        e.preventDefault()

        $.ajax({
            type: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                // 注册失败校验
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                // 保存token
                localStorage.setItem("token", res.token)
                // 页面跳转
                location.href = "/index.html"
            }
        })
        $(this)[0].reset()
    })
})