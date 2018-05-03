// const ENV = 'DEV';
const ENV='PROD';
const DEV_API_URL = 'http://47.97.126.79:8800/api';
// const DEV_API_URL = 'http://192.168.1.150:11902/api';
const PROD_API_URL = 'https://service.weapp.wohoney.com/api';

export const configApi = {
    ENV: ENV,
    baseUrl: ENV == 'PROD' ? PROD_API_URL : DEV_API_URL,
    IMAGE_UPLOAD: {
        uploadUrl:ENV=='PROD'?'https://upload.qiniup.com':'http://up-z0.qiniu.com',
        baselink:ENV=='PROD'?'https://images.wohoney.com/':'http://oan6vegks.bkt.clouddn.com/',
        token: 'RCYJEHvGdufWjrrbpq3rcMuCDM7vpPyBgxLFuSJv:lydtCA81nhkLgRq6QyfIRHvxAlc=:eyJzY29wZSI6ImRyYXd5b3UiLCJkZWFkbGluZSI6MzMzNzM0NDM1MX0='
    }
}
