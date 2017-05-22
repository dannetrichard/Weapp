var common = require('../../common/common.js');




var get_order_detail = function(that, tid, oid) {
    common.login(function(api_token) {
        wx.request({
            url: 'https://43691113.julystu.xyz/trade/findById',
            data: {
                'api_token': api_token,
                'tid': tid,
                'oid': oid
            },
            success: function(res) {
                that.setData({
                    trade: res.data
                })
            }
        })
    })
}

Page({
    data: {
        trade: {},
        addr: {}
    },
    onLoad: function(e) {
        var that = this
        get_order_detail(that, e.tid, e.oid)
    }
})
