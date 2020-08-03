// 文章修改思路
// 1.点击编辑按钮，实现文章跳转，跳转到修改文章页面，携带id;
// 2.创建修改文章页面，和添加页面类似; （修改部分文件的链接地址: art_eidt.js）
// 3.把插件对应的js代码，添加进去；
// 4.根据id获取文章的详细信息;
// 5.根据文章信息渲染页面;
// 6.把文章Id隐藏渲染;
// 7.修改文章

$(function () {
    // console.log(this)
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 显示富文本编辑器
    initEditor()
    // 4.根据id获取文章的详细信息;
    var Id = location.search.split("=")[1]
    $.ajax({
        type: 'get',
        url: '/my/article/' + Id,
        success: function (res) {
            console.log(res)
            // 文章标题
            $('[name=title]').val(res.data.title)
            // 文章分类
            initCate(res.data.cate_id)
            // 文章内容
            setTimeout(function () {
                tinyMCE.activeEditor.setContent(res.data.content);
            }, 1000);
            // 文章图片
            //   前后端分离开发，所以图片的路径要添加上基础路径
            $("#image").attr("src", baseURL + res.data.cover_img)
            // 文章id
            $("[name=Id]").val(res.data.Id);
        }
    })


    // 确定发布状态
    var state = '已发布';
    $("#btn-save").click(function () {
        state = '草稿'
    })
    // 修改文章提交事件
    $("#form-edit").on("submit", function (e) {
        e.preventDefault()
        var fd = new FormData(this)
        fd.append("state", state)
        // 将封面裁剪过后的图片,输出为一个二进制文件对象（类比昨天输出为base64位格式图片）
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {      // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                console.log(...fd)
                // ajax一定要放到回调函数里面
                // 因为生成文件是耗时操作，异步，所以必须保证发送ajax的时候图片已经生成，所以必须写到回调函数中
                editArticle(fd)

                // window.parent.document.getElementById('art-pub').className = ""
                // window.parent.document.getElementById('art-list').className = "layui-this"
            })
    })
    // 发起ajax请求实现修改文章功能
    function editArticle(fd) {
        $.ajax({
            type: 'post',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status != 0) {
                    return layui.layer.msg('发布文章失败！')
                }
                layui.layer.msg('发布文章成功！')
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
                // 由于bug问题，文章列表未被选中，需要通过js把a标签点击触发
                window.parent.document.querySelector("#art-list a").click()
            }

        })
    }

    // 文章分类选项的封装函数
    function initCate(cate_id) {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {

                if (res.status != 0) {
                    return layui.layer.msg(res.message)
                }
                res.cate_id = cate_id
                var htmlStr = template("tpl-table", res)
                $('[name=cate_id]').html(htmlStr)

                layui.form.render()
            }
        })
    }
})