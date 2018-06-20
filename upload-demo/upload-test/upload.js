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
    Vue.component('upload-plugin', {
        template: '<div class="hello">'+
        '    <button @click="limitClick(1)">点击设置上传数量：2</button>'+
        '    <button @click="limitClick(0)">点击取消上传数量</button>'+
        '    <div class="upload">'+
        '      <div class="upload_warp">'+
        '        <div class="upload_warp_left" @click="fileClick">'+
        '          <img src="./img/upload.png">'+
        '        </div>'+
        '        <div class="upload_warp_right" @drop="drop($event)" @dragenter="dragenter($event)" @dragover="dragover($event)">'+
        '          或者将文件拖到此处'+
        '        </div>'+
        '      </div>'+
        '      <div v-for="(index,item) of excludeFiles" v-if="item.name">' +
        '        <span v-if="item.name">{{item.name}}</span>   ' +
        '        <span v-if="item.size">图片必须小于{{allowImgFileSize}}kb</span>、宽高是:' +
        '        {{allowImgWidth}}*{{allowImgHeight}}' +
        '      </div>' +
        '      <div class="upload_warp_text">'+
        '        选中{{imgList.length}}张文件，共{{bytesToSize(this.size)}}'+
        '         <button @click="uploadImgsBtn">上传图片</button>  ' +
        '      </div>'+
        '      <input @change="fileChange($event)" type="file" id="upload_file" multiple style="display: none"/>'+
        '      <div class="upload_warp_img" v-show="imgList.length!=0">'+
        '        <div class="upload_warp_img_div" v-for="(index,item) of imgList">'+
        '          <div class="upload_warp_img_div_top">'+
        '            <div class="upload_warp_img_div_text">'+
        '              {{item.file.name}}'+
        '            </div>'+
        '            <img src="./img/del.png" class="upload_warp_img_div_del" @click="fileDel(index)">'+
        '          </div>'+
        '          <img v-bind:src="item.file.src">'+
        '        </div>'+
        '      </div>'+
        '    </div>'+
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
            //设置
            limitClick: function(state) {
                this.imgList = [];
                if (state)
                    this.limit = 2;
                else
                    this.limit = undefined;
            },
            fileClick: function() {
                document.getElementById('upload_file').click()
            },
            fileChange: function(el) {
                var _self = this;

                _self.excludeFiles = [];

                console.log(JSON.stringify(el.target.files[0].size));
                if (!el.target.files[0].size) return;
                _self.fileList(el.target);
                el.target.value = ''
            },
            fileList: function(fileList) {
                var files = fileList.files;
                for (let i = 0; i < files.length; i++) {
                    //判断是否为文件夹
                    if (files[i].type != '') {
                       this.fileAdd(files[i]);
                    } else {
                        //文件夹处理
                        this.folders(fileList.items[i]);
                    }
                }
            },
            // 检测文件类型、大小是否符合要求
            checkFilesType: function (fileItem) {
                var _self = this;
                var filtCheckResult = {};

                filtCheckResult.name = fileItem.name;

                var fileExt = fileItem.name.substr(fileItem.name.lastIndexOf(".")).toLowerCase();
                /*
                    lastModified:1505093197413
                    lastModifiedDate:Mon Sep 11 2017 09:26:37 GMT+0800 (中国标准时间) {}
                    name:"vue.datepicker.js"
                    size:26890
                    src:"wenjian.png"
                    type :"application/javascript"
                    webkitRelativePath:""
                */

                if(Math.round(fileItem.size/1024*100)/100 > _self.allowImgFileSize) {
                    filtCheckResult.size = fileItem.size;
                }

                if (_self.allImgExt.indexOf(fileExt+"|") == -1) {
                    filtCheckResult.ext ="图片格式不是指定格式" + _self.allImgExt;
                }

                return filtCheckResult;

            },
            //文件夹处理
            folders: function(files) {
                let _this = this;
                //判断是否为原生file
                if (files.kind) {
                    files = files.webkitGetAsEntry();
                }
                files.createReader().readEntries(function (file) {
                    for (let i = 0; i < file.length; i++) {
                        if (file[i].isFile) {
                            _this.foldersAdd(file[i]);
                        } else {
                            _this.folders(file[i]);
                        }
                    }
                })
            },
            foldersAdd: function(entry) {
                let _this = this;
                entry.file(function (file) {
                    _this.fileAdd(file)
                })
            },
            fileAdd: function(file) {
                var _self=this;
                if (_self.limit !== undefined) _self.limit--;
                if (_self.limit !== undefined && _self.limit < 0) return;

                //判断是否为图片文件
                if (file.type.indexOf('image') == -1) {
                    file.src = 'wenjian.png';
                    this.imgList.push({
                        file
                    });
                    //总大小
                    _self.size = _self.size + file.size;
                } else {
                    var reader = new FileReader();
                    var image = new Image();
                    var checkRes = _self.checkFilesType(file);
                    reader.readAsDataURL(file);
                    reader.onload = function () {
                        file.src = this.result;
                        image.onload=function(){
                            var width = image.width;
                            var height = image.height;
                            file.width=width;
                            file.height=height;

                            if((width > _self.allowImgWidth || height > _self.allowImgHeight) && JSON.stringify(checkRes) != "{}") {
                                checkRes.width = width;
                                checkRes.height = height;

                                _self.excludeFiles.push(checkRes);
                            } else {
                                _self.imgList.push({
                                    file
                                });

                                //总大小
                                _self.size = _self.size + file.size;
                            }

                        };
                        image.src= file.src;
                    }
                }
            },
            uploadImgsBtn: function () {
                var _self = this;
                for (var i=0; i<_self.files.length; i++) {
                    console.log(_self.files[i]);
                    _self.uploadFile(_self.files[i]);
                };
            },
            // 点击上传图片
            uploadFile: function (file) {
                var _self = this;
                var xhr = new XMLHttpRequest();
                alert("上传");
                var fd = new FormData();
                fd.append("fileToUpload", file);
                xhr.upload.addEventListener("progress", _self.uploadProgress, false);
                xhr.addEventListener("load", _self.uploadComplete, false);
                xhr.addEventListener("error", _self.uploadFailed, false);
                xhr.addEventListener("abort", _self.uploadCanceled, false);
                xhr.open("POST", "UploadMinimal.aspx");
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
                // alert(evt.target.responseText);
            },
            uploadFailed: function (evt) {
                // alert("上传文件发生了错误尝试");
            },
            uploadCanceled: function (evt) {
                // alert("上传被用户取消或者浏览器断开连接");
            },
            fileDel: function(index) {
                this.size = this.size - this.imgList[index].file.size;//总大小
                this.imgList.splice(index, 1);
                if (this.limit !== undefined) this.limit = this.imgList.length;
            },
            bytesToSize: function(bytes) {
                if (bytes === 0) return '0 B';
                let k = 1000, // or 1024
                    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                    i = Math.floor(Math.log(bytes) / Math.log(k));
                return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
            },
            dragenter: function(el) {
                el.stopPropagation();
                el.preventDefault();
            },
            dragover: function(el) {
                el.stopPropagation();
                el.preventDefault();
            },
            drop: function(el) {
                el.stopPropagation();
                el.preventDefault();
                this.fileList(el.dataTransfer);
            }
        }
    });

}));