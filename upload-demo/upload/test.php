<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>多图片裁剪上传例子</title>
</head>
<body>



<input  id="inputImage_class1_input" type="button" onclick="document.getElementById('inputImage_class1').click()" value="选择照片"><!-- 可以增加自己的样式 -->
<input  id="inputImage_class1"  data-config='{"width":320,"height":180}' class="file_cutimg_class"   type="file" accept="" style="display: none;"/>
<br/>
<img  id="inputImage_class1_img" />
<button onclick="submitForm('inputImage_class1_img')">上传</button>
<br />
<br />

<input  id="inputImage_class2_input" type="button" onclick="document.getElementById('inputImage_class2').click()" value="选择照片"><!-- 可以增加自己的样式 -->
<input  id="inputImage_class2" class="file_cutimg_class"   type="file" accept="" style="display: none;"/>
<br/>
<img  id="inputImage_class2_img" />
<button onclick="submitForm('inputImage_class2_img')">上传</button>
<br />
<br />
裁剪后直接ajax上传:<input  id="inputImage_class3_input" type="button" onclick="document.getElementById('inputImage_class3').click()" value="选择照片"><!-- 可以增加自己的样式 -->
<input  id="inputImage_class3" class="file_cutimg_class"  data-submit="submitForm('inputImage_class3_img')"  type="file" accept="" style="display: none;"/>
<br/>
<img  id="inputImage_class3_img" />
<br />
<br />
<input  id="inputImage_class4_input" type="button" onclick="document.getElementById('inputImage_class4').click()" value="选择照片"><!-- 可以增加自己的样式 -->
<input  id="inputImage_class4" class="file_cutimg_class"   type="file" accept="" style="display: none;"/>
<br/>
<img  id="inputImage_class4_img" />
<button  >上传</button>
<br />



<script>
    function submitForm(id){
        var formData = new FormData();
        formData.append("imgBase64",$("#"+id).attr("src"));//
        $.ajax({
            url: "upload.php",
            type: 'POST',
            data: formData,
            timeout : 10000, //超时时间设置，单位毫秒
            async: true,
            cache: false,
            contentType: false,
            processData: false,
            success: function (result) {
                if(result.res){
                    alert(result.msg+'  图片路径:'+result.data.imgurl);
                }else{
                    alert(result.msg);
                }
            }
        });
    }
</script>
<?php include "cut.html"; ?>
</body>
</html>