/**
 * Created by Glen Lin on 2018/6/4 0004.
 */

(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['vue'], factory);
    } else if (typeof exports === 'object') {
        factory(require('vue'));
    } else {
        factory(Vue);
    }
}(function (Vue) {

    /*<div class=\"cropper-mode\">\
                            <div class=\"cropper-body\">\
                                <div class=\"img-container\" style=\"height: 100%\">\
                                    <img id=\"image\" v-bind:src=\"imgUrl\" v-el:imageobj>\
                                </div>\
                            </div>\
                            <div class=\"cropper-footer\">\
                                <button @click=\"show = false\">关闭</button>\
                            </div>\
                        </div>\*/

    Vue.component('vue-cropper', {
        template: " <div class=\"cropper-mask\" v-show=\"show\">\
                        <div class=\"cropper-title\">\
                            <div class=\"l-title\">Photo-editor</div>\
                            <div class=\"r-operate\" >\
                                <span class=\"item download\" title=\"Download\" @click=\"downloadImage(imgUrl)\" v-if=\"imgUrl\">下载</span>\
                                <span class=\"item formate\" title=\"750*400\" @click=\"setAspectRatioFun('750*400')\" >750*400</span>\
                                <span class=\"item closewin\" title=\"close\" @click=\"closeEditWin\" >关闭</span>\
                                <span class=\"item clear\" title=\"clear\" @click=\"clearCropErea\" >清除crop</span>\
                                <span class=\"item upload\" title=\"uploadImg\" @click=\"uploadImg\" >上传</span>\
                            </div>\
                        </div>\
                        <div class=\"img-container\" style=\"height: 100%\" @dblclick=\"dblclick\">\
                            <img id=\"image\" v-bind:src=\"imgUrl\" v-el:imageobj>\
                        </div>\
                        <div class=\"cropper-toolbar\" v-if=\"cropper\">\
                            <span class=\"cropfont crop-jiantouarrow480\" data-action=\"move\" \
                                title=\"move (M)\" @click=\"click('move')\"\
                            ></span>\
                            <span  class=\"cropfont crop-tupiancaijian\" data-action=\"crop\" \
                                title=\"Crop (C)\" @click=\"click('crop')\"\
                            ></span>\
                            <span class=\"cropfont crop-fangda\" data-action=\"zoom-in\" \
                                title=\"Zoom In (I)\" @click=\"click('zoom-in')\"\
                            ></span>\
                            <span class=\"cropfont crop-suoxiao\" data-action=\"zoom-out\" \
                                title=\"Zoom Out (O)\" @click=\"click('zoom-out')\"\
                            ></span>\
                            <span class=\"cropfont crop-xuanzhuan1\" data-action=\"rotate-left\" \
                                title=\"Rotate Left (L)\" @click=\"click('rotate-left')\"\
                            ></span>\
                            <span class=\"cropfont crop-xuanzhuan\" data-action=\"rotate-right\" \
                                title=\"Rotate Right (R)\" @click=\"click('rotate-right')\"\
                            ></span>\
                            <span class=\"cropfont crop-jiantouarrow484\" data-action=\"flip-horizontal\" \
                                title=\"Flip Horizontal (H)\" @click=\"click('flip-horizontal')\"\
                            ></span>\
                            <span class=\"cropfont crop-jiantouarrow499\" data-action=\"flip-vertical\" \
                                title=\"Flip Vertical (V)\" @click=\"click('flip-vertical')\"\
                            ></span>\
                            <span class=\"cropfont crop-huifu\" data-action=\"recovery\" \
                                title=\"recovery\" @click=\"click('recovery')\"\
                            ></span>\
                        </div>\
                </div>",
        props: {
            imgUrl: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: 'image/jpeg'   // image/png
            },
            show: {
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return {
                previewUrl: '',
                cropper: null,
                data: null,
                canvasData: null,
                cropBoxData: null,
                cropping: false,
                cropData: {
                    fillColor: '#fff',
                    width: 160,
                    height: 90,
                }
            };
        },
        computed: {
            value: function () {

            },
        },
        watch: {
            show: function (val) {
                var _self = this;
                if (val) {
                    _self.$nextTick(function () {
                        _self.initCropper();
                    });
                } else {
                    _self.destroy();
                }
            },
        },
        ready: function () {
            var _self = this;


        },
        methods: {
            // 初始化
            initCropper: function () {
                var _self = this;

                _self.cropper = new Cropper(_self.$els.imageobj, {
                    /*aspectRatio: 1,
                    viewMode: 3,*/
                    aspectRatio: 16 / 9,
                    viewMode: 1,
                    autoCrop: false,
                    dragMode: 'move',
                    background: false,
                    ready: function () {
                        _self.cropper.zoomTo(1);
                    },
                    crop: function (detail) {
                        _self.cropping = true;
                    },
                });
            },
            reset: function () {
                var _self = this;
                if (_self.cropper) {
                    _self.cropper.reset();
                }
            },
            // 销毁
            destroy: function () {
                var _self = this;
                if (_self.cropper) {
                    _self.cropper.destroy();
                    _self.cropper = null;

                    _self.cropping = false;
                }
            },
            // 裁剪
            crop: function () {
                var _self = this;

                if (_self.cropping) {
                    _self.data = _self.cropper.getData();
                    _self.canvasData = _self.cropper.getCanvasData();
                    _self.cropBoxData = _self.cropper.getCropBoxData();
                    _self.cropping = false;

                    _self.previewUrl = _self.imgUrl;

                    /*
                        _self.type === 'image/jpeg' ? {} :{
                            fillColor: '#fff',
                            width: 160,
                            height: 90,
                        }
                    */
                    _self.imgUrl = _self.cropper.getCroppedCanvas(_self.cropData).toDataURL(_self.type)

                    // 加载完成，再重新初始化
                    var img = new Image();
                    img.src = _self.imgUrl;

                    img.onload = function () {
                        /*_self.destroy();
                        _self.initCropper();*/
                        _self.cropper.replace(_self.imgUrl);
                    }
                }
            },
            // 上传图片
            uploadImg: function () {
                var _self = this;

                /*_self.cropper.getCroppedCanvas(_self.cropData).toBlob(function (blob) {
                    var formData = new FormData();

                    formData.append('croppedImage', blob);

                    // Use `jQuery.ajax` method
                    $.ajax('/path/to/upload', {
                        method: "POST",
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function () {
                            console.log('Upload success');
                        },
                        error: function () {
                            console.log('Upload error');
                        }
                    });
                });*/


                _self.cropper.getCroppedCanvas(_self.cropData).toBlob(function (blob) {
                    var formData = new FormData();

                    formData.append('croppedImage', blob);
                    // 上传进度提示
                    $.ajax('https://jsonplaceholder.typicode.com/posts', {
                        method: 'POST',
                        data: formData,
                        processData: false,
                        contentType: false,
                        xhr: function () {
                            var xhr = new XMLHttpRequest();
                            xhr.upload.onprogress = function (e) {
                                var percent = '0';
                                var percentage = '0%';

                                if (e.lengthComputable) {
                                    percent = Math.round((e.loaded / e.total) * 100);
                                    percentage = percent + '%';
                                    console.log(percentage);
                                    // $progressBar.width(percentage).attr('aria-valuenow', percent).text(percentage);
                                }
                            };
                            return xhr;
                        },
                        success: function () {
                            console.log('success');
                        },
                        error: function () {
                            console.log('error');
                        },

                        complete: function () {
                           // $progress.hide();
                        },
                    });
                });

            },
            dblclick: function (e) {
                var _self = this;

                // if (e.target.className.indexOf('cropper-face') >= 0) {
                e.preventDefault();
                e.stopPropagation();
                _self.crop();
                // }
            },
            setAspectRatioFun: function (strNum) {
                var _self = this;
                var _arr = strNum.split('*');
                var _aspectRatio = _arr[0] / _arr[1];
                var data = _self.cropper.getData();


                if (data.height == 0 || data.width == 0) return;

                _self.cropper.setAspectRatio(_aspectRatio);

                _self.cropData = {
                    fillColor: '#fff',
                    width: Number(_arr[0]),
                    height: Number(_arr[1]),
                }

                _self.crop();

            },
            clearCropErea: function () {
                var _self = this;

                _self.cropper.clear();
            },
            closeEditWin: function () {
                var _self = this;

                _self.show = false;
                _self.destroy();
            },
            // 不支持ie
            downloadImage: function (src) {
                var $a = document.createElement('a');
                $a.setAttribute("href", src);
                $a.setAttribute("download", "");

                var evObj = document.createEvent('MouseEvents');
                evObj.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null);
                $a.dispatchEvent(evObj);
            },
            click(action) {
                var _self = this;

                switch (action) {
                    case 'move':
                        _self.cropper.zoomTo(1);
                        break;
                    case 'crop':
                        _self.cropper.setDragMode(action);
                        break;

                    case 'zoom-in':
                        _self.cropper.zoom(0.1);
                        break;

                    case 'zoom-out':
                        _self.cropper.zoom(-0.1);
                        break;

                    case 'rotate-left':
                        _self.cropper.rotate(-90);
                        break;

                    case 'rotate-right':
                        _self.cropper.rotate(90);
                        break;

                    case 'flip-horizontal':
                        _self.cropper.scaleX(-_self.cropper.getData().scaleX || -1);
                        break;

                    case 'flip-vertical':
                        _self.cropper.scaleY(-_self.cropper.getData().scaleY || -1);
                        break;
                    case 'recovery':
                        _self.destroy();
                        _self.initCropper();
                        break;

                    default:
                }
            },
        }
    });

}));