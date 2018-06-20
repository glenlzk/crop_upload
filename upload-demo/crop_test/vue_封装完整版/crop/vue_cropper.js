/**
 * Created by Glen Lin on 2018/6/14 0014.
 */

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

        :on-confirm="selectStartDateFun"

        this.$els.popup
    */
    Vue.component('crop-plugin', {
        template: '<div class="crop-container">'+
                    '   <div class="" style="width:260px;height:260px;">'+
                    '      <img :src="imgSrc" alt="Picture" v-el:origimg>'+
                    '    </div>'+
                    '    <div class="" v-bind:style="previewContainer" style="overflow:hidden;background:#ccc;">'+
                    '      <div class="preview" v-el:previewcontainer>'+
                    '        <img :src="imgSrc" v-el:previewimg>'+
                    '      </div>'+
                    '    </div>'+
                    '</div>',

        props: {
            imgSrc: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: 'image/jpeg'   // image/png
            },
            cropImg: Function,
            cropContainer: {
                twoWay: true
            },
            previewContainer: {
                twoWay: true
            },
        },
        data: function () {
            return {
                cropper: null,
                cropData: {
                    fillColor: '#fff',
                    width: 260,
                    height: 260,
                }
            }
        },
        created: function() {

        },
        ready: function () {
            var _self = this;

           // _self.initCropper();

        },
        computed: {
        },
        watch: {
            imgSrc: function (val) {
                var _self = this;

                if(!val) return;

                _self.initCropper();
            }
        },
        methods: {
            initCropper: function () {
                var _self = this;

                _self.$nextTick(function () {

                    if(_self.cropper) {
                        _self.destroy()
                    }

                    _self.cropper = new Cropper(_self.$els.origimg, {
                        scalable: false,
                        movable: false,
                        zoomable: false,
                        /*  // 源码对应位置:
                            initContainer:
                            var container = element.parentNode;			3657 origimg.parentNode
                            element = this.element;					3324 origimg
                            tagName = element.tagName.toLowerCase();
                        */
                        minContainerWidth: _self.cropContainer || 200,
                        minContainerHeight: _self.cropContainer || 200,
                        rotatable: false,
                        aspectRatio: 1,
                        viewMode: 1,
                        ready: function () {
                            var clone = this.cloneNode();

                            clone.className = ''
                            clone.style.cssText = (
                                'display: block;' +
                                'width: 100%;' +
                                'min-width: 0;' +
                                'min-height: 0;' +
                                'max-width: none;' +
                                'max-height: none;'
                            );

                            _self.$els.previewimg.src = _self.$els.origimg.src;
                        },

                        crop: function (e) {
                            var data = e.detail;

                            var cropper = _self.cropper;
                            var imageData = cropper.getImageData();
                            var previewAspectRatio = data.width / data.height;

                            var previewImage = _self.$els.previewimg;

                            var previewWidth = _self.$els.previewcontainer.offsetWidth;
                            var previewHeight = previewWidth / previewAspectRatio;
                            var imageScaledRatio = data.width / previewWidth;

                            _self.$els.previewcontainer.style.height = previewHeight + 'px';

                            previewImage.style.width = imageData.naturalWidth / imageScaledRatio + 'px';
                            previewImage.style.height = imageData.naturalHeight / imageScaledRatio + 'px';
                            previewImage.style.marginLeft = -data.x / imageScaledRatio + 'px';
                            previewImage.style.marginTop = -data.y / imageScaledRatio + 'px';
                        }
                    });
                });
            },
            destroy: function () {
                var _self = this;

                if (_self.cropper) {
                    _self.cropper.destroy();
                    _self.cropper = null;
                }
            },
        },
        events: {
            cropperFun: function () {
                var _self = this;

                var base64 = _self.cropper && _self.cropper.getCroppedCanvas(_self.cropData).toDataURL(_self.type) || '';

                _self.cropImg&&_self.cropImg(base64);
            },
        }
    });

}));