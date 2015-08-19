// var host = location.host,
//     __baseUrl = 'http://fed.dev.pimg.cn/js';
// if(host.indexOf('beta') != -1 || host.indexOf('v1') != -1){
//     __baseUrl = 'http://fed.beta.pimg.cn/js';
// }
// else if(host == 'admin.hichao.com' || host == 'www.hichao.com' || host == 'shop.hichao.com' || host == 'fed.hichao.com' || host == 'm.hichao.com'){
//     __baseUrl = 'http://fed.pimg.cn/js';
// }

require.config({
    baseUrl: __baseUrl,
    paths: {
        base: '../base/ltz_base',
    },
    shim: {
        highcharts: {
            exports: 'jQuery.fn.highcharts'
        },
        web_carousel: {
            exports: 'jQuery.fn.web_carousel'
        }
    },
    packages: []
});
