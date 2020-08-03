$(function () {
    initCate()
    // 文章分类选项的封装函数
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status != 0) {
                    return layui.layer.msg(res.message)
                }
                var htmlStr = template("tpl-table", res)
                $('[name=cate_id]').html(htmlStr)

                layui.form.render()
            }
        })
    }
    // 显示富文本编辑器
    initEditor()
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 4.选择封面按钮点击事件
    $("#cover-btn").on("click", function () {
        $("#coverFile").click()
    })
    // 将选择的图片设置到裁剪区域
    $("#coverFile").on("change", function (e) {
        var file = e.target.files
        if (file.length < 1) {
            return layui.layer.msg("请选择图片！")
        }
        var newImgURL = URL.createObjectURL(file[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 确定发布状态
    var state = '已发布';
    $("#btn-save").click(function () {
        state = '草稿'
    })
    // 添加文章
    $("#form-add").on("submit", function (e) {
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
                publishArticle(fd)

                // window.parent.document.getElementById('art-pub').className = ""
                // window.parent.document.getElementById('art-list').className = "layui-this"
            })
    })
    // 发起ajax请求实现发布文章功能
    function publishArticle(fd) {
        $.ajax({
            type: 'post',
            url: '/my/article/add',
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
})