'use strict';

require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var _mm = require('util/mm.js');
var _payment = require('service/payment-service.js');
var templateIndex = require('./index.string');

// page 逻辑部分
var page = {
    data: {
        orderNumber: _mm.getUrlParam('orderNumber')
    },
    init: function () {
        this.onLoad();
    },
    onLoad: function () {
        // 加载detail数据
        this.loadPaymentInfo();
    },
    // 加载订单列表
    loadPaymentInfo: function () {
        var _this = this,
            paymentHtml = '',
            $pageWrap = $('.page-wrap');
        $pageWrap.html('<div class="loading"></div>');
        _payment.getPaymentInfo(this.data.orderNumber, function (res) {
            // 改成我自己的收款码
            console.log(res.qrUrl);
            res.qrUrl = 'https://raw.githubusercontent.com/rockdunteng/imageBed/master/Project/others/20190929035442.png'
            // 渲染html
            paymentHtml = _mm.renderHtml(templateIndex, res);
            $pageWrap.html(paymentHtml);
            _this.listenOrderStatus();
        }, function (errMsg) {
            $pageWrap.html('<p class="err-tip">' + errMsg + '</p>');
        });
    },
    // 监听订单状态
    listenOrderStatus: function () {
        // 这里做了个假的支付成功跳转
        var _this = this;
        this.paymentTimer = window.setTimeout(function () {
            window.location.href
                = './result.html?type=payment&orderNumber=' + _this.data.orderNumber;
        }, 15e3);
    }
    //真正的支付成功监听和跳转👇
    // listenOrderStatus: function () {
    //     var _this = this;
    //     this.paymentTimer = window.setInterval(function () {
    //         _payment.getPaymentStatus(_this.data.orderNumber, function (res) {
    //             if (res == true) {
    //                 window.location.href
    //                     = './result.html?type=payment&orderNumber=' + _this.data.orderNumber;
    //             }
    //         });
    //     }, 5e3);
    // }
};
$(function () {
    page.init();
});