import {
    configApi
} from './constant.js';
const apiRequest = require('./applyApi.js');

function uploadFile(that, imgName,count) {
    var chooseWxImage = function(type) {
        var uploadFileEach=function(filePath){
            var fileName = Math.random().toString(36).substr(2);
            wx.uploadFile({
                url: configApi.IMAGE_UPLOAD.uploadUrl,
                filePath: filePath,
                name: 'file',
                formData: {
                    'token': configApi.IMAGE_UPLOAD.token,
                    key: fileName
                },
                success: function(res) {
                    that.data.uploadImgArr=that.data.uploadImgArr||[];
                    var dataString = res.data;
                    var dataObject = JSON.parse(dataString);
                    var imageUrl = configApi.IMAGE_UPLOAD.baselink + dataObject.key;
                    console.log('imageUrl', res);
                    that.data.uploadImgArr.push(imageUrl);
                    that.data.uploadImgLength=that.data.uploadImgArr.length;
                    that.setData({
                        [imgName]: imageUrl,
                        uploadImgArr:that.data.uploadImgArr,
                        uploadImgLength:that.data.uploadImgLength
                    });
                    // wx.showToast({
                    //     title: '上传成功',
                    //     icon: 'success',
                    //     duration: 2000
                    // })
                },
                fail: (res) => {
                    that.setData({
                        showTips: true,
                        tipsInfo: '上传失败'
                    });
                    setTimeout(() => {
                        that.setData({
                            showTips: false,
                        });
                    }, 2000);
                    return;
                },
                complete: function() {

                }
            })
        }
        wx.chooseImage({
            count: (count||1)-that.data.uploadImgLength,
            sizeType: ['original', 'compressed'],
            sourceType: [type],
            success: function(res) {
                var tempFilePaths = res.tempFilePaths;
                for(var i in tempFilePaths){
                    uploadFileEach(tempFilePaths[i]);
                }

            }
        })
    }
    wx.showActionSheet({
        itemList: ['使用相机拍照', '从相册中选择'],
        itemColor: "#007aff",
        success: function(res) {
            if (!res.cancel) {
                if (res.tapIndex == 0) {
                    chooseWxImage('camera')
                } else if (res.tapIndex == 1) {
                    chooseWxImage('album')
                }
            }
        }
    })
}


module.exports = {
    uploadFile: uploadFile
}
