import {
    configApi
} from './constant';
import moment from '../utils/moment';
import Promise from '../utils/bluebird.min';

export function wxRequestP(method, url, contentType = 'application/json;charset=utf-8', data = {}) {
  // console.log('@@wxRequestP access_token: ' + accessToken)
  wx.showNavigationBarLoading();
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method,
      data,
      header: {
        'Content-Type': contentType,
      },
      success(res) {
        if (+res.statusCode >= 200 && +res.statusCode < 400) {
          if (+res.data.code == 200) {
            // console.log(url + ' succeed: ' + JSON.stringify(res.data))
            wx.hideNavigationBarLoading()
            return resolve(res.data.data)
          } else {
            wx.hideNavigationBarLoading()
            return reject(res.data.message)
          }
        } else {
          wx.hideNavigationBarLoading()
          console.log(url + " failed: " + JSON.stringify(res.data))
          return reject(res.data)
        }
      },
      fail(error) {
        wx.hideNavigationBarLoading()
        return reject(error)
      }
    })
  })
}

export function wxJsonBackendRequestP(method, endpoint, data = {}) {
  return wxRequestP(method, configApi.baseUrl + endpoint, 'application/json;charset=utf-8', data)
}

export function wxJsonBackendGetRequestP(endpoint, data) {
  return wxJsonBackendRequestP('GET', endpoint, data)
}

export function wxJsonBackendPostRequestP(endpoint, data) {
  return wxJsonBackendRequestP('POST', endpoint, data)
}

export function wxJsonBackendPutRequestP(endpoint, data) {
  return wxJsonBackendRequestP('PUT', endpoint, data)
}

export function wxStaticGetRequestP(url, contentType = 'application/json;charset=utf-8') {
  return wxRequestP('GET', url, contentType)
}



export function jsonPostRequest(url, params) {
  return wxJsonBackendPostRequestP(url, params);
}
export function jsonGetRequest(url, params) {
  return wxJsonBackendGetRequestP(url, params);
}
export function jsonPutRequest(url, params) {
  return wxJsonBackendPutRequestP(url, params);
}