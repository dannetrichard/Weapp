var tool = require('../../template/sku.js');


Page({
    data: {
        product: {},
        sku: {},
        item_flag: 0,
        desc_flag: 0,
        loading_flag: true
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
            urls: imgs
        })
    },
    img_url_preview: function() {
        wx.previewImage({
            urls: [this.data.sku.img_url]
        })
    },
    item_load: function() {
        var that = this
        that.setData({
            item_flag: that.data.item_flag + 1
        })
        if (that.data.item_flag == 1 && that.data.desc_flag > 0) {
            wx.hideLoading()
        }
    },
    desc_load: function() {
        var that = this
        that.setData({
            desc_flag: that.data.desc_flag + 1
        })
        if (that.data.item_flag > 0 && that.data.desc_flag == 1) {
            wx.hideLoading()
        }
    },
    build: function(e) {
        var that = this
        tool.buildData(that, e.currentTarget.dataset.x, e.currentTarget.dataset.y)
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
            'product_id=' + this.data.product.product_id +
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
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        tool.get_product(that, e.id)
    }

})
