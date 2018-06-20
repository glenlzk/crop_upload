window.onload = function () {
  'use strict';
  var screenWidth = 200;  //$(window).width()
  var screenHeight = 200; //  $(window).height()
  var containerWidth=300; // $(".img-container").width()
  var containerHeight=300;  //$(".img-container").height()
  var Cropper = window.Cropper;
  var console = window.console || { log: function () {} };
  var container = document.querySelector('.img-container');
  var image = container.getElementsByTagName('img').item(0);
  var actions = document.getElementById('actions');
  var isUndefined = function (obj) {
    return typeof obj === 'undefined';
  };
    //alert(containerHeight+'---'+containerWidth);
  $("#containerDiv").hide();
  var options = {
		minContainerHeight :  containerHeight,//容器的最小高度
		minContainerWidth : containerWidth,//容器的最小宽度
        minCanvasWidth : 100, //裁剪框 canvas 的最小宽度（image wrapper）。
        minCanvasHeight : 60, //裁剪框 canvas 的最小高度（image wrapper）。
       /* width: 300,
        height: 300,*/
        aspectRatio: 1/1,//裁剪框比例 1：1
        viewMode : 1,//显示模式
        guides :true,//裁剪框虚线 默认true有
        dragMode : "crop",//拖动模式 move crop none
        autoCropArea:0.8,
        build: function (e) { //加载开始
        	//可以放你的过渡 效果
        },
        built: function (e) { //加载完成
        	$("#containerDiv").show();
        },
        zoom: function (e) {
          console.log(e.type, e.detail.ratio);
        },
        background : true,// 容器是否显示网格背景
		movable : true,//是否能移动图片
		cropBoxMovable :true,//是否允许拖动裁剪框
		cropBoxResizable :true,//是否允许拖动 改变裁剪框大小
        autoCrop:true,//是否默认出现裁剪框
      };
  var cropper = new Cropper(image, options);

  // Methods
  actions.onclick = function (event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var result;
    var input;
    var data;
    var input_id=cropper.cutInputId;
    if (!cropper) {
      return;
    }
    while (target !== this) {
      if (target.getAttribute('data-method')) {
        break;
      }
      target = target.parentNode;
    }
    if (target === this || target.disabled || target.className.indexOf('disabled') > -1) {
      return;
    }
    data = {
      method: target.getAttribute('data-method'),
    };

    if (data.method) {
      var data_config='';
      if($("#"+input_id).attr("data-config") !==undefined){
         data_config=JSON.parse($("#"+input_id).attr("data-config"));
      }
      result = cropper[data.method](data_config);
      switch (data.method) {
        case 'scaleX':
        case 'scaleY':
          break;
        case 'getCroppedCanvas':
          if (result) {
          var  fileImg = result.toDataURL('image/jpg');
          $("#"+input_id+"_img").attr("src",fileImg).show();
          $("#"+input_id+"_input").val("重新选择");
           if($("#"+input_id).attr('data-submit')!==undefined){ //判断是否裁剪后直接异步上传  data-submit这个属性传过来的是一个函数名
             var meth=$("#"+input_id).attr('data-submit');
             //eval(meth+"(input_id+'_img'"+")");//利用eval()把变量转换成函数
             eval(meth);
           }
          }
          break;
        case 'destroy':
        	$("#inputImage").val("");
        	$("#containerDiv").hide();
        	$("#imgEdit").hide();
          break;
      }
      if (typeof result === 'object' && result !== cropper && input) {
        try {
          input.value = JSON.stringify(result);
        } catch (e) {
          console.log(e.message);
        }
      }
    }
  };

  var inputImage=$(".file_cutimg_class");
  var URL = window.URL || window.webkitURL;
  var blobURL;
  if (URL) {
    $.each(inputImage,function(){
      this.onchange=function(){
        var files = this.files;
        var input_id=this.id;//在 input type='file' 框上加一个id，一个class/ 这个id与其他附加信息都要与这个id有关系用来区别。
        var file;
        if (cropper && files && files.length) {
          file = files[0];
          if (/^image\/\w+/.test(file.type)) {
            blobURL = URL.createObjectURL(file);
            cropper.reset(input_id).replace(blobURL); //cropper.reset(input_id) 在reset()方法中传入id，zdw后来加入的2017-06-22 11:35
          } else {
            window.alert('Please choose an image file.');
          }
        }
        $("#"+input_id+"_img").find("img").hide();
      }
    });
  } else {
    inputImage.disabled = true;
    inputImage.parentNode.className += ' disabled';
  }
};
