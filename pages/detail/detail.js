var tool = require('../../template/sku/sku.js');
var common = require('../../common/common.js');



Page({
    data: {
        product: {},
        sku: {},
        windowHeight: 0,
        desc: []
    },
    onShareAppMessage: function() {
        return {
            title: '商品详情',
            path: '/pages/detail/detail?id=' + this.product.id,
            success: function(res) {},
            fail: function(res) {}
        }
    },
    itemPreview: function(e) {
        var imgs = this.data.product.item_imgs
        var temp = imgs[e.target.dataset.id]
        for (var i = e.target.dataset.id; i > 0; i--) {
            imgs[i] = imgs[i - 1]
        }
        imgs[0] = temp

        wx.previewImage({
            urls: imgs.map(function(item) {
                return item.url
            })
        })
    },
    img_url_preview: function() {
        wx.previewImage({
            urls: [this.data.sku.img_url]
        })
    },
    item_load: function(e) {
        var that = this
        var product = that.data.product
        product.item_imgs[e.currentTarget.dataset.id].loaded = true

        that.setData({
            product: product
        })
        wx.hideLoading()

    },
    desc_load: function(e) {
        var that = this
        var desc = that.data.desc
        desc[e.currentTarget.dataset.id].loaded = true

        that.setData({
            desc: desc
        })
    },
    lower: function() {
        if (this.data.product.desc.length > 0) {
            this.setData({
                desc: this.data.desc.concat(this.data.product.desc.splice(0, 1))
            })
        }

    },
    favor: function() {
        var that = this
        var product = that.data.product
        product.favor = !product.favor
        common.login(function(api_token) {
            wx.request({
                url: 'https://43691113.julystu.xyz/favor_toggle',
                data: {
                    'api_token': api_token,
                    id: that.data.product.id
                },
                success: function(){
                    that.setData({
                        product: product
                    })
                }
            })
        })
    },
    refresh: function() {
        var that = this
        common.login(function(api_token) {
            wx.request({
                url: 'https://43691113.julystu.xyz/product/refresh/' + that.data.product.id,
                data: {
                    'api_token': api_token
                },
                success: function(res) {
                    wx.showToast({
                        title: '更新完成'
                    })
                }
            })
        })
    },
    good: function() {
        var that = this
        common.login(function(api_token) {
            wx.request({
                url: 'https://43691113.julystu.xyz/product/good/' + that.data.product.id,
                data: {
                    'api_token': api_token
                },
                success: function(res) {
                    wx.showToast({
                        title: res.data
                    })
                    wx.clearStorage()
                    wx.reLaunch({
                        url: '/pages/index/index'
                    })
                }
            })
        })
    },
    bad: function() {
        var that = this
        common.login(function(api_token) {
            wx.request({
                url: 'https://43691113.julystu.xyz/product/bad/' + that.data.product.id,
                data: {
                    'api_token': api_token
                },
                success: function(res) {
                    wx.showToast({
                        title: res.data
                    })
                    wx.clearStorage()
                    wx.reLaunch({
                        url: '/pages/index/index'
                    })
                }
            })
        })
    },
    build: function(e) {
        var that = this
        tool.genData(that, e.currentTarget.dataset.x, e.currentTarget.dataset.y)
    },
    add: function() {
        var that = this
        tool.add(that)
    },
    move: function() {
        var that = this
        tool.move(that)

    },
    update: function(e) {
        var that = this
        tool.update(that, e)

    },
    sku_show: function() {
        var that = this
        var sku = that.data.sku
        sku.is_show = true
        that.setData({
            sku: sku
        })
    },
    sku_hidden: function() {
        var that = this
        var sku = that.data.sku
        sku.is_show = false
        that.setData({
            sku: sku
        })
    },
    to_buy: function() {
        var url = '/pages/order_conform/order_conform?' +
            'product_id=' + this.data.product.id +
            '&cid=' + this.data.product.cid +
            '&name=' + this.data.product.name +
            '&sku_id=' + this.data.sku.sku_id +
            '&img_url=' + this.data.sku.img_url +
            '&price=' + this.data.sku.price +
            '&num=' + this.data.sku.num +
            '&quantity=' + this.data.sku.quantity +
            '&sku_properties_name=' + this.data.sku.prop_properties_name

        wx.navigateTo({
            url: url
        })
    },
    onLoad: function(e) {
        var that = this
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    windowHeight: res.windowHeight
                })
            }
        })
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        tool.get_product(that, e.id)

    },
    onHide: function() {
        var that = this
        var sku = that.data.sku
        sku.is_show = false
        that.setData({
            sku: sku
        })

    }

})
