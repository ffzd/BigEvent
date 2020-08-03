$(function () {
    initArtCateList()

    // 2.为添加类别按钮绑定点击事件
    var index = null
    $('#btnAddCate').on('click', function () {
        index = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $("#dialog-add").html()
        })
    })
    // 3.文章分类添加数据发送

    $("body").on("submit", "#form-add", function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layui.layer.msg("新增文章分类失败！")
                }
                initArtCateList()
                layui.layer.msg("新增文章分类成功！")
                layui.layer.close(index)
            }
        })
    })
    // 4.为编辑类别按钮绑定点击事件
    var index1 = null
    $('tbody').on('click', '.btn-edit', function () {
        index1 = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $("#dialog-edit").html()
        })
        var id = $(this).attr('data-id')
        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                console.log(res)
                layui.form.val('form-edit', res.data)
            }
        })
    })
    // 5.通过代理形式，更新文章分类的数据
    $("body").on("submit", "#form-edit", function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    return layui.layer.msg("编辑文章分类失败！")
                }
                initArtCateList()
                layui.layer.msg("编辑文章分类成功！")
                layui.layer.close(index1)

            }
        })
    })
    // 6.通过代理事件,为删除按钮绑定事件
    $('body').on("click", '.btn-delete', function () {
        var id = $(this).attr('data-id')
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status != 0) {
                        return layui.layer.msg(res.message)
                    }
                    initArtCateList()
                    layui.layer.msg(res.message)

                }
            })
            layer.close(index);
        });
    })
    // 1.获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res)
                var htmlStr = template('tpl-table', res)
                $("tbody").html(htmlStr)
            }
        })
    }
})