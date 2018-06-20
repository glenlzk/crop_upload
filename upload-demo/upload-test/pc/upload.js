/**
 * Created by Glen Lin on 2018/5/14 0014.
 */

(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['vue'], factory);
    } else if (typeof exports === 'object') {
        factory(require('vue'));
    } else {
        factory(Vue);
    }
}(function(Vue) {

    /*
        '<input @change="fileChange($event)" type="file" id="upload_file" multiple style="display: none"/>'+
    */
    Vue.component('upload-plugin', {
        template: '<div class="upload-wrapper">'+
        '    <button @click="fileClick"">上传</button>'+
        '    <input @change="fileChange($event)" type="file" id="upload_file" multiple style="display: none"/>'+
        '  </div>',

        props: {

        },
        data: function () {
            return {
                imgList: [],
                size: 0,
                allImgExt: ".jpg|.jpeg|.gif|.bmp|.png|",
                allowImgFileSize: 70,
                allowImgWidth: 500,
                allowImgHeight: 500,
                excludeFiles:[],
                files: {}
            }
        },
        created: function() {
        },
        computed: {
        },
        watch: {
        },
        methods: {
            fileClick: function() {
                document.getElementById('upload_file').click()
            },
            fileChange: function(el) {
                var _self = this;

                _self.excludeFiles = [];

                if (!el.target.files[0].size) return;
                this.fileAdd(el.target.files[0]);
                el.target.value = ''
            },

            fileAdd: function(file) {
                var _self=this;


                var fileExt = file.name.substr(file.name.lastIndexOf(".")).toLowerCase();
                /*
                    lastModified:1505093197413
                    lastModifiedDate:Mon Sep 11 2017 09:26:37 GMT+0800 (中国标准时间) {}
                    name:"vue.datepicker.js"
                    size:26890
                    src:"wenjian.png"
                    type :"application/javascript"
                    webkitRelativePath:""
                */

                if (_self.allImgExt.indexOf(fileExt+"|") == -1) {
                    console.log("图片格式不是指定格式" + _self.allImgExt);
                    return;
                }

                if(Math.round(file.size/1024*100)/100 > _self.allowImgFileSize) {
                    console.log("图片格式不能大于" + _self.allImgExt);
                    return;
                }

                // 检测浏览器是否支持FileReader
                if(typeof (FileReader) != 'undefined') {
                    var reader = new FileReader();
                    var image = new Image();
                    reader.readAsDataURL(file);
                    reader.onload = function () {
                        file.src = this.result;
                        image.onload=function(){
                            var width = image.width;
                            var height = image.height;
                            file.width=width;
                            file.height=height;

                            if((width > _self.allowImgWidth || height > _self.allowImgHeight)) {
                                console.log("图片宽高必须是: 500*500");
                                return;
                            }

                            _self.uploadFile(file);

                        };
                        image.src= file.src;
                    }
                } else {
                    console.log("请使用高版本的浏览器!");
                }


            },

            // 点击上传图片
            uploadFile: function (file) {
                console.log(file);

                var _self = this;
                var xhr = new XMLHttpRequest();
                var fd = new FormData();
                fd.append("Filedata", file);
                xhr.upload.addEventListener("progress", _self.uploadProgress, false);
                xhr.addEventListener("load", _self.uploadComplete, false);
                xhr.addEventListener("error", _self.uploadFailed, false);
                xhr.addEventListener("abort", _self.uploadCanceled, false);
                xhr.open("POST", "/yzlpms/img/j/uploadHotelLogo?hotelId=2");
                xhr.send(fd);

            },
            uploadProgress: function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                    // document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
                    console.log(evt, evt.loaded, evt.total);
                }
                else {
                    //  document.getElementById('progressNumber').innerHTML = '无法计算';
                }
            },
            uploadComplete: function (evt) {
                /* 当服务器响应后，这个事件就会被触发 */
                alert(evt.target.responseText);
            },
            uploadFailed: function (evt) {
                alert("上传文件发生了错误尝试");
            },
            uploadCanceled: function (evt) {
                alert("上传被用户取消或者浏览器断开连接");
            },
            fileDel: function(index) {
                this.size = this.size - this.imgList[index].file.size;//总大小
                this.imgList.splice(index, 1);
                if (this.limit !== undefined) this.limit = this.imgList.length;
            },
            bytesToSize: function(bytes) {
                if (bytes === 0) return '0 B';
                var k = 1000, // or 1024
                    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                    i = Math.floor(Math.log(bytes) / Math.log(k));
                return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
            },
        }
    });

}));