var app = getApp()
var common = require('../../common/common.js');
var products = []
var next_page_url = 'https://43691113.julystu.xyz/product'
var load_once = 2

var get_list = function(cb) {
    if (next_page_url) {
        wx.request({
            url: next_page_url,
            success: function(res) {
                res.data.data.map(function(item) {
                    item.loaded = false
                })
                products = products.concat(res.data.data)
                next_page_url = res.data.next_page_url
                typeof cb == "function" && cb(products)
            }
        })
    }
}


Page({
    data: {
        products: [],
        scrollTop: 0,
        windowHeight: 0,
    },
    onLoad: function() {
        var that = this
        products = []
        next_page_url = 'https://43691113.julystu.xyz/product'
        load_once = 2
        get_list(function(products) {
            that.setData({
                products: products.splice(0, 10)
            })
        })
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
        var that = this
        products = []
        next_page_url = 'https://43691113.julystu.xyz/product'
        load_once = 2
        get_list(function(products) {
            that.setData({
                products: products.splice(0, 10)
            })
        })

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
        this.setData({
            products: this.data.products.concat(products.splice(0, load_once))
        })
        products.length < 10 && get_list('')
    },
    scroll: function(e) {
        console.log(e)
    },
    pic_load: function(e) {
        var that = this
        var products = that.data.products
        products[e.currentTarget.dataset.index].loaded = true
        that.setData({
            products: products
        })
    },
    // onReachBottom: function() {
    //     this.setData({
    //         products: this.data.products.concat(products.splice(0, load_once))
    //     })
    // },
    // onPullDownRefresh: function() {
    //     wx.stopPullDownRefresh()
    //     var that = this
    //     products = []
    //     next_page_url = 'https://43691113.julystu.xyz/product'
    //     get_list(function(products) {
    //         that.setData({
    //             products: products.splice(0, load_once)
    //         })
    //     })
    // },
    // onShareAppMessage: function() {
    //     return {
    //         title: 'JULY女装',
    //         path: '/pages/index/index',
    //         success: function(res) {},
    //         fail: function(res) {}
    //     }
    // }

})
