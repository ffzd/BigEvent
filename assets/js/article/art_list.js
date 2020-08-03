$(function () {
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    initTable()

    // 获取文章列表数据
    function initTable() {
        $.ajax({
            type: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status != 0) {
                    return layui.layer.msg(res.message)
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })

    }
    initCate()
    // 获取文章分类数据
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status != 0) {
                    return layui.layer.msg("获取分类数据失败！")
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过layui重新渲染表单区域的结构
                layui.form.render()
            }
        })
    }
    // 为筛选表单绑定提交事件
    $("#form-search").on("submit", function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象q中对应的属性赋值
        console.log(cate_id)
        console.log(state)
        q.cate_id = cate_id
        q.state = state
        initTable()
    })
    // 日期格式化
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = Zero(dt.getMonth() + 1)
        var d = Zero(dt.getDate())
        var hh = Zero(dt.getHours())
        var mm = Zero(dt.getMinutes())
        var ss = Zero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    function Zero(t) {
        return t < 10 ? '0' + t : t
    }

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        layui.laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ["count", "limit", "prev", "page", "next", "skip"],
            limits: [2, 3, 5, 10],// 每页展示多少条

            // 发生分页切换时，就触发jump回调
            // 触发jump回调的方式有两种：
            // 1.点击页码时，会触发jump回调函数
            // 2.只要调用layui.laypage.render（），就会触发jump回调
            jump: function (obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                console.log(first)
                console.log(obj.curr)
                console.log(obj)
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 删除事件
    $("tbody").on("click", ".btn-delete", function () {
        var len = $(".btn-delete").length
        // 获取文章的id
        var id = $(this).attr('data-id')
        // 询问用户弹出框
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status != 0) {
                        return layui.layer.msg(res.message)
                    }
                    layui.layer.msg(res.message)
                    len == 1 && q.pagenum > 1 && q.pagenum--
                    // if (len == 1) {
                    //     q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1
                    // }
                    initTable()
                }
            })
            layer.close(index);
        });
    })

    $("tbody").on("click", ".btn-edit", function () {
        var id = $(this).attr('data-id')
        location.href = '/article/art_edit.html?Id=' + id
    })
})