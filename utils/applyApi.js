import {
    configApi
} from './constant';
import moment from './moment';

const verify = require('./verify.js');
var canLoad = true;
var errorCallBack = function(error) {
    switch (error.data.code) {
        case 403:
            console.log('被禁止的请求');
            break;
        case 401:
            console.log('未授权');
            break;
        default:
            console.log(error.data.message);
            break;
    }
};
var resolve = function(response, success, error) {
    if (response.data.code == 200) {
        success(response.data);
    } else {
        console.log('api error',response);
        // console.log(response);
        if (error) {
            error(response);
        } else{
            errorCallBack(response);
        }

    }
}
var reject = function(response, error) {
    console.error("API Error");
    if (error) {
        error(response);
    }
}

function get(url, params, success, error) {
    wx.request({
        url: `${configApi.baseUrl}/${url}`,
        data: Object.assign({}, params),
        method: 'get',
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function(response) {
            resolve(response, success, error)
        },
        fail: function(response) {
            reject(response, error);
        }
    })
}

function post(url, params, success, error) {
    wx.request({
        url: `${configApi.baseUrl}/${url}`,
        data: Object.assign({}, params),
        method: 'post',
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function(response) {
            resolve(response, success, error)
        },
        fail: function(response) {
            reject(response, error);
        }
    })
}

function postByToken(url, params, success, error) {
    wx.getStorage({
        key: 'honey-token',
        success: function(res) {
            wx.request({
                url: `${configApi.baseUrl}/${url}`,
                data: Object.assign({}, params),
                method: 'post',
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Auth-Token': res.data
                },
                success: function(response) {
                    // console.log('response', response);
                    resolve(response, success, error)
                },
                fail: function(response) {
                    reject(response, error);
                }
            })
        },
        fail:function(res){
            wx.request({
                url: `${configApi.baseUrl}/${url}`,
                data: Object.assign({}, params),
                method: 'post',
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Auth-Token': 'Bearer youke'
                },
                success: function(response) {
                    // console.log('response', response);
                    resolve(response, success, error)
                },
                fail: function(response) {
                    reject(response, error);
                }
            })
        }
    })
}

function postJsonToken(url, params, success, error) {
    wx.getStorage({
        key: 'honey-token',
        success: function(res) {
            wx.request({
                url: `${configApi.baseUrl}/${url}`,
                data: JSON.stringify(params),
                method: 'POST',
                header: {
                    'Content-Type': 'application/json',
                    'X-Auth-Token': token.token
                },
                success: function(response) {
                    resolve(response, success, error)
                },
                fail: function(response) {
                    reject(response, error);
                }
            })
        }
    })
}

function postJson(url, params, success, error) {
    wx.request({
        url: `${configApi.baseUrl}/${url}`,
        data: JSON.stringify(params),
        method: 'post',
        header: {
            'Content-Type': 'application/json'
        },
        success: function(response) {
            resolve(response, success, error)
        },
        fail: function(response) {
            reject(response, error);
        }
    })

}
var splitPage = function() {
    var pageIndex = 1,
        isLoadAll = false,
        total = 0,
        dataList = [];

    var getData = function(url, callback, isFirst, params, data) {
        if (isFirst) {
            pageIndex = 1;
            isLoadAll = false;
            dataList = [];
        }
        var parameters = {
            "page": pageIndex,
            "size": 10
        };
        if (params) {
            var createParams = function(thisObj) {
                // console.log('thisObj',thisObj);
                parameters[thisObj.name] = thisObj.value;
            };
            params.forEach(createParams);
        }
        parameters.page = pageIndex;
        canLoad = false;
        // console.log('parameters',parameters);
        // console.log('dataList-=======',dataList);
        postByToken(url, parameters, function(res) {
            var pages;
            if (res.data.pageBean) {
                dataList = dataList.concat(res.data.pageBean.list);
                pages = res.data.pageBean.pages;
            } else {
                dataList = dataList.concat(res.data.list);
                pages = res.data.pages;
            }
            if (pageIndex < pages) {
                pageIndex++;
                isLoadAll = false;
            } else {
                isLoadAll = true;
            }
            var data = res.data;
            callback(dataList, isLoadAll, data);

            canLoad = true;
            wx.hideLoading();
        }, function(res) {
            canLoad = true;
            wx.hideLoading();
            console.log('请求失败' + res);
        })

    };
    return {
        getData: getData
    };
};
var loadMore = function(that, cb) {
    if (!that.data.isLoadAll && canLoad) {
        wx.showLoading({
            title: '加载中',
        })
        if (cb) {
            cb();
        }
    }
}
var formatTime = function(date, type) {

    if(!date){
        date=new Date();
    }
    console.log('formatTime', date, type);
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    var formatNumber = n => {
        n = n.toString()
        return n[1] ? n : '0' + n
    }
    if (type == 'date') {
        return [year, month, day].map(formatNumber).join('-');
    } else if (type == 'time') {
        return [hour, minute, second].map(formatNumber).join(':')
    } else {
        return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    }
}
var getDate = function(input) {
    return input.slice(0, 10);
}
var getTime = function(input) {
    return input.slice(12, input.length - 1);
}
//计算天数差的函数，通用
var dateDiff = function(sDate1, sDate2) { //sDate1和sDate2是2006-12-18格式
    var aDate, oDate1, oDate2, iDays;
    if(!sDate2){
        sDate2=formatTime(null,'date')
    }
    console.log('sDate2',sDate2);
    aDate = sDate1.split("-")
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) //转换为12-18-2006格式
    aDate = sDate2.split("-")
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数
    return iDays
}
var momentDiff = function (sDate) {
    let a = moment(), b = moment(sDate);
    return b.diff(a, 'days');
}
module.exports = {
    get,
    post,
    postJson,
    postByToken,
    postJsonToken,
    splitPage,
    loadMore,
    formatTime,
    getDate,
    getTime,
    dateDiff,
    momentDiff
}
