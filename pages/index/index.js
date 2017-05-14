var app = getApp()
 var common = require('../../common/common.js');
// common.login()
var get_products = function(that) {
    if (that.data.next_page_url !== '') {
        wx.request({
            url: that.data.next_page_url,
            success: function(res) {
                var products = res.data.data.map(function (item,index) {
                        return Object.assign(item,{'loaded':false});
                }); 

                that.setData({
                    products: that.data.products.concat(products),
                    next_page_url: res.data.next_page_url,
                })
            }
        })
    } else {
        console.log('no more');
    }
}


Page({
    data: {
        products: [],
        flag:0,
        next_page_url: 'https://43691113.julystu.xyz/product',
        api_token:''
    },
    bindD: function (e) {
        var that = this  
        var id = e.currentTarget.dataset.hi;
        wx.previewImage({
          current: that.data.products[id].item_imgs[0], // 当前显示图片的http链接
          urls: that.data.products[id].item_imgs // 需要预览的图片http链接列表
        })
    },
    bindP: function (e) {
        var that = this  
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/test/test?id=' + that.data.products[id].id
        })
    },
    onShareAppMessage: function () {
        return {
          title: 'JULY女装',
          path: '/pages/index/index',
          success: function(res) {
            // 分享成功
          },
          fail: function(res) {
            // 分享失败
          }
        }
    },
    img_load: function(e){
        var that = this
        that.setData({
            flag:that.data.flag + 1
        }) 
    },  
    onLoad: function() {
        var that = this
        get_products(that);
    
        common.login(function(){console.log('login')})
    },
    onReady: function() {
        var that = this
    },
    onReachBottom:function () {
        var that = this
        get_products(that)  
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh()
        var that = this
        that.setData({
            products: [],
            next_page_url: 'https://43691113.julystu.xyz/product'
        })
        get_products(that);
    }
})
