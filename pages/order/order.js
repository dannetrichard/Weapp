var common = require('../../common/common.js');
var tab = require('../../template/tab/tab.js');



var select = function(that, n = 0) {

    common.login(function(api_token) {
        wx.request({
            url: 'https://43691113.julystu.xyz/trade/find',
            data: {
                'api_token': api_token,
                'status': that.data.selects[n].status
            },
            success: function(res) {
                console.log(res.data)
                if (res.data == 'Unauthorized.') {
                    wx.showToast({
                        title: '请登录',
                        image: '../../common/info.png'
                    })
                } else {
                    wx.hideLoading()
                    that.setData({
                        trades: res.data,
                        n: n

                    })
                }

            }
        })
    })

}

function genOffsetLeft(that) {

    let scroll_width = 375
    let slider_width = 50
    let l = 4

    let offsetLeft = []
    let n = scroll_width / l

    offsetLeft.push(n / 2 - slider_width / 2)
    offsetLeft.push(n + n / 2 - slider_width / 2)
    offsetLeft.push(n + n + n / 2 - slider_width / 2)
    offsetLeft.push(n + n + n + n / 2 - slider_width / 2)
    console.log(offsetLeft)
    that.setData({
        offsetLeft: offsetLeft
    });
}

Page({
    data: {
        trades: [],
        date: new Date().toLocaleDateString(),
        n: 0,
        selects: [{ 'title': '全 部', 'status': 'ALL' }, {
            'title': '待付款',
            'status': 'WAIT_BUYER_PAY'
        }, {
            'title': '待发货',
            'status': 'WAIT_SELLER_SEND_GOODS'
        }, {
            'title': '待收货',
            'status': 'WAIT_BUYER_CONFIRM_GOODS'
        }, ],
        offsetLeft: [],
        windowHeight: 0,
        // tab切换 
        currentTab: 0,
        scrollLeft: 500,
        status: {
            'TRADE_NO_CREATE_PAY': '交易未创建',
            'WAIT_BUYER_PAY': '待付款',
            'WAIT_SELLER_SEND_GOODS': '待发货',
            'WAIT_BUYER_CONFIRM_GOODS': '待确认',
            'TRADE_FINISHED': '交易成功',
            'TRADE_CLOSED': '交易关闭',
            'TRADE_CLOSED_BY_TAOBAO': '交易关闭'
        }
    },
    goto_detail: function(e) {
        var url = "/pages/order_detail/order_detail?tid=" + e.currentTarget.dataset.tid + '&oid=' + e.currentTarget.dataset.oid
        wx.navigateTo({
            url: url
        })
    },
    tab_select: function(e) {
        var that = this
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        select(that, e.currentTarget.dataset.n)
        console.log(e)
        this.setData({
            n: e.currentTarget.dataset.n,
        });


    },
    onLoad: function(e) {

        var that = this
        genOffsetLeft(that)
        select(that, e.n)
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    windowHeight: res.windowHeight
                });
            }
        });

    },
    bindChange: function(e) {
        var that = this;
        select(that, e.detail.current)
        that.setData({
            n: e.detail.current,
            scrollLeft: Math.ceil(that.data.offsetLeft[e.detail.current])
        });
    },
    // 点击tab切换 
    swichNav: function(e) {
        var that = this;
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
    },
    pay_now: function(e) {
        common.login(function(api_token) {
            wx.request({
                url: 'https://43691113.julystu.xyz/trade/pay_now',
                data: {
                    'api_token': api_token,
                    'tid': e.currentTarget.dataset.tid
                },
                success: function(res) {
                    wx.requestPayment({
                        'timeStamp': res.data.timeStamp,
                        'nonceStr': res.data.nonceStr,
                        'package': res.data.package,
                        'signType': res.data.signType,
                        'paySign': res.data.paySign,
                        'success': function(res) {},
                        'fail': function() {

                            //这里要关闭订单
                            wx.request({
                                url: 'https://43691113.julystu.xyz/trade/close',
                                data: {
                                    'api_token': api_token,
                                    'tid': res.data.tid
                                },
                                success: function(res) {}
                            })
                        }
                    })
                }
            })
        })
    },
    cancel_order: function(e) {

    },
    remind_seller_send_goods: function(e) {
        wx.showToast({
            title: '提醒发货成功',
            duration: 500
        })
    },
    shipping_detail: function(e) {},
    rate_now: function(e) {},
    delete_order: function(e) {}
})
