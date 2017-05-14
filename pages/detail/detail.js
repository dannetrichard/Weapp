var get_product = function(that, id) {
    wx.request({
        url: 'https://43691113.julystu.xyz/product/' + id,
        success: function(res) {



            var sku = res.data.sku
            sku.map(function(item) {
                var t1 = item.properties.split(';')
                var t2 = t1[0].split(':')
                var t3 = t1[1].split(':')
                item.properties = [t2[1], t3[1]]
                return item
            })
            console.log(sku)

            //---------------------------is_active------------------------------
            var is_active = [
                [],
                []
            ]
            var prop_id = [100, 100]
            var sku_id = ''
            var quantity = res.data.num
            var sku_props = res.data.sku_props
            var price = res.data.price
            var shop_price = res.data.shop_price
            var img_url = res.data.pic_url
            var prop_str = ['', '']
            sku_props[0].values.map(function(item, index) {
                var count = 0
                sku.forEach(function(val, key, array) {
                    if (val.properties[0] == item.valueId) {
                        count = count + val.quantity
                    }
                })
                if (count > 0) { is_active[0][index] = true } else { is_active[0][index] = false }
                if (count > 0 && sku_props[0].values.length == 1) {
                    prop_id[0] = 0
                    prop_str[0] = item.name
                    quantity = count

                }
            })
            sku_props[1].values.map(function(item, index) {
                var count = 0
                sku.forEach(function(val, key, array) {
                    if (val.properties[1] == item.valueId) {
                        count = count + val.quantity
                    }
                })
                if (count > 0) { is_active[1][index] = true } else { is_active[1][index] = false }
                if (count > 0 && sku_props[1].values.length == 1) {
                    prop_id[1] = 0
                    prop_str[1] = item.name
                    quantity = count
                    if (item.imgUrl != null) { img_url = item.imgUrl }
                }
            })
            if (sku.length == 1) {
                sku_id = sku[0].sku_id
                quantity = sku[0].quantity
                price = sku[0].price
                shop_price = sku[0].shop_price
            }

            //---------------------------prop_id------------------------------

            that.setData({
                product: res.data,
                sku: { 'is_show': false, 'is_active': is_active, 'sku_id': sku_id, 'prop_id': prop_id, num: '1', 'price': price, 'shop_price': shop_price, 'img_url': img_url, 'quantity': quantity, 'prop_str': prop_str }
            })

            console.log('sku', that.data.sku)

        }
    });
}

Page({
    data: {
        product: {},
        desc_flag: 0,
        main_flag: 0,
        is_show: true,
        sku: {},
        cart_or_buy: 0
    },
    main_load: function() {
        var that = this
        that.setData({
            main_flag: that.data.main_flag + 1
        })
    },
    desc_load: function() {
        var that = this
        that.setData({
            desc_flag: that.data.desc_flag + 1
        })
    },
    is_show: function() {
        var that = this
        that.setData({
            is_show: !that.data.is_show
        })
    },
    sku_toggle: function(e) {
        var that = this
        var sku = that.data.sku
        console.log('e.target.dataset.id', e.target.dataset.id)
        sku.is_show = !sku.is_show
        that.setData({
            sku: sku,
            cart_or_buy: e.target.dataset.id
        })
    },
    sure: function(e) {
        console.log('sure')
        console.log(this.data.sku)
        console.log('this.data.cart_or_buy', this.data.cart_or_buy)
        console.log('e.target.dataset.id', e.target.dataset.id)
        var action = Number(this.data.cart_or_buy) + Number(e.target.dataset.id)


        if (this.data.sku.prop_id[0] == 100 && this.data.sku.prop_id[1] == 100) {
            wx.showToast({
                title: '请选择' + this.data.product.sku_props[0].propName + '、' + this.data.product.sku_props[1].propName,
                image: '../../common/info.png'
            })
        } else if (this.data.sku.prop_id[0] == 100) {
            wx.showToast({
                title: '请选择' + this.data.product.sku_props[0].propName,
                image: '../../common/info.png'
            })
        } else if (this.data.sku.prop_id[1] == 100) {
            wx.showToast({
                title: '请选择' + this.data.product.sku_props[1].propName,
                image: '../../common/info.png'
            })
        } else {
            if (action == 1) {
                wx.showToast({
                    title: 'cart'
                })
            } else {
                var url = '/pages/order_conform/order_conform?' +
                    'product_id=' + this.data.product.product_id +
                    '&cid=' + this.data.product.cid +
                    '&name=' + this.data.product.name +
                    '&sku_id=' + this.data.sku.sku_id +
                    '&img_url=' + this.data.sku.img_url +
                    '&price=' + this.data.sku.price +
                    '&num=' + this.data.sku.num +
                    '&quantity=' + this.data.sku.quantity +
                    '&sku_properties_name=' + this.data.sku.prop_str[1] + ' ' + this.data.sku.prop_str[0]

                wx.navigateTo({
                    url: url
                })
            }
        }

    },
    sku_pic: function() {
        wx.previewImage({
            urls: [this.data.sku.img_url]
        })
    },
    sku_select: function(e) {

        var that = this
        var sku = that.data.sku
        var product = that.data.product
        var oid = e.target.dataset.oid
        var id = e.target.dataset.id
        sku.prop_id[oid] = id
        sku.prop_str[oid] = product.sku_props[oid].values[id].name


        if (oid == 1) {
            sku.img_url = product.sku_props[oid].values[id].imgUrl == null ? product.pic_url : product.sku_props[oid].values[id].imgUrl
        }

        product.sku_props[1 - oid].values.map(function(item, index) {
            product.sku.forEach(function(val, key, array) {
                if (val.properties[1 - oid] == item.valueId && val.properties[oid] == product.sku_props[oid].values[id].valueId) {
                    if (val.quantity > 0) { sku.is_active[1 - oid][index] = true } else { sku.is_active[1 - oid][index] = false }
                }
            })
        })

        if (sku.prop_id[1 - oid] == 100) {
            var count = 0
            product.sku.forEach(function(val, key, array) {
                if (val.properties[oid] == product.sku_props[oid].values[id].valueId) {
                    count = count + val.quantity
                }
            })
            sku.quantity = count
        } else {


            product.sku.forEach(function(val, key, array) {
                if (val.properties[0] == product.sku_props[0].values[sku.prop_id[0]].valueId && val.properties[1] == product.sku_props[1].values[sku.prop_id[1]].valueId) {
                    sku.sku_id = val.sku_id
                    sku.quantity = val.quantity
                    sku.price = val.price
                    sku.shop_price = val.shop_price
                }
            })



        }




        that.setData({
            sku: sku
        })



    },
    add: function() {
        var that = this
        var sku = that.data.sku

        if (sku.num < that.data.sku.quantity) {
            sku.num++
                that.setData({
                    sku: sku
                })
        }
    },
    move: function() {
        var that = this
        var sku = that.data.sku
        if (sku.num > 1) {
            sku.num--
                that.setData({
                    sku: sku
                })
        }

    },
    update: function(e) {
        var that = this
        var sku = that.data.sku

        if (e.detail.value > that.data.sku.quantity) {
            sku.num = that.data.sku.quantity
        } else if (e.detail.value > 0) {
            sku.num = e.detail.value
        } else {
            sku.num = 1
        }

        that.setData({
            sku: sku
        })

    },
    onShareAppMessage: function() {
        return {
            title: '商品详情',
            path: '/pages/detail/detail?id=' + this.product.id,
            success: function(res) {},
            fail: function(res) {}
        }
    },
    bindPI: function(e) {
        console.log(e.target.dataset.id)
        var imgs = this.data.product.item_imgs
        var temp = imgs[e.target.dataset.id]
        for (var i = e.target.dataset.id; i > 0; i--) {
            imgs[i] = imgs[i - 1]
        }
        imgs[0] = temp
        console.log(imgs)
        wx.previewImage({
            urls: imgs
        })
    },
    onLoad: function(e) {
        console.log(e.id)
        var that = this
        get_product(that, e.id)
    },
    onHide:function(){
        var that = this
        var sku = that.data.sku
        sku.is_show = !sku.is_show
        that.setData({
            sku: sku
        })      
    }

})
