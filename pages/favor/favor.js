var common = require('../../common/common.js');

var get_list = function(that) {
    common.login(function(api_token) {
        wx.request({
            url: 'https://43691113.julystu.xyz/favor_product',
            data: {
                'api_token': api_token
            },
            success: function(res) {
                res.data.map(function(item) {
                    item.loaded = false
                })

                that.setData({
                    products: res.data
                })
            }
        })
    })

}


Page({
    data: {
        products: [],
        scrollTop: 0,
        windowHeight: 0,
    },
    onLoad: function() {
        var that = this
        get_list(that)
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    windowHeight: res.windowHeight
                })
            }
        })
        common.login('', true)
    },

    upper: function() {

    },
    detail: function(e) {
        var url = "/pages/detail/detail?id=" + e.currentTarget.dataset.id
        wx.navigateTo({
            url: url
        })
    },
    upper: function() {

    },
    lower: function() {

    },
    scroll: function(e) {

    },
    pic_load: function(e) {
        var that = this
        var products = that.data.products
        products[e.currentTarget.dataset.index].loaded = true
        that.setData({
            products: products
        })
    }

})
