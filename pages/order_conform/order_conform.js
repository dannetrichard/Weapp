var common = require('../../common/common.js');
var get_addr = function get_addr(that) {
    common.login(function(api_token) {
            wx.request({
                url: 'https://43691113.julystu.xyz/addr/find',
                data: {
                    'api_token': api_token
                },
                success: function(res) {
                    if (res.data != null) {
                        that.setData({
                            addr: res.data
                        })
                    }
                    console.log('find addr', res.data)
                }
            })
    })
}

var set_addr = function set_addr(that) {
    common.login(function(api_token) {
        wx.chooseAddress({
            success: function(res) {
                that.setData({
                    addr: res
                })
                wx.request({
                    url: 'https://43691113.julystu.xyz/addr/create',
                    data: {
                        'api_token': api_token,
                        'userName': res.userName,
                        'postalCode': res.postalCode,
                        'provinceName': res.provinceName,
                        'cityName': res.cityName,
                        'countyName': res.countyName,
                        'detailInfo': res.detailInfo,
                        'nationalCode': res.nationalCode,
                        'telNumber': res.telNumber
                    },
                    success: function(res) {
                        console.log(res.data)
                    }
                })
            }
        })
    })
}

var order_submit = function(that){
    if(that.data.addr.userName){
        common.login(function(api_token) {
                wx.request({
                    url: 'https://43691113.julystu.xyz/trade/create',
                    data: {
                        'api_token': api_token,
                        'userInfo': that.data.userInfo,
                        'order':that.data.order,
                        'addr':that.data.addr
                    },
                    success: function(res) {
                        console.log(res.data)

                        console.log('req',new Date().getSeconds())
                        wx.requestPayment({
                           'timeStamp': res.data.timeStamp,
                           'nonceStr': res.data.nonceStr,
                           'package': res.data.package,
                           'signType': res.data.signType,
                           'paySign': res.data.paySign,
                           'success':function(res){
                                console.log('pay',new Date().getSeconds())
                                console.log(res)
                           },
                           'fail':function(){



                                var url = '/pages/order_detail/order_detail?' +
                                        'tid=' + res.data.tid +
                                        '&created=' + res.data.created +
                                        '&userName=' + that.data.addr.userName +
                                        '&telNumber=' + that.data.addr.telNumber +
                                        '&street=' + that.data.addr.provinceName + that.data.addr.cityName + that.data.addr.detailInfo +
                                        '&product_id=' + that.data.order.product_id +
                                        '&cid='+ that.data.order.cid +
                                        '&img_url='+ that.data.order.img_url +
                                        '&name='+ that.data.order.name +
                                        '&price='+ that.data.order.price +
                                        '&sku_id='+ that.data.order.sku_id +
                                        '&sku_properties_name='+ that.data.order.sku_properties_name +
                                        '&num='+ that.data.order.num +
                                        '&quantity='+ that.data.order.quantity +
                                        '&adjust_fee='+ that.data.order.adjust_fee +
                                        '&discount_fee='+ that.data.order.discount_fee +
                                        '&post_fee='+ that.data.order.post_fee +
                                        '&total_fee='+ that.data.order.total_fee
                                        
                                wx.redirectTo({
                                    url:  url
                                })
                           }
                        })





                    }
                })        
        })          
    }else{
        wx.showToast({
            title: '请添加收货地址',
            image: '../../common/info.png'
        })
    }
}


Page({
    data: {
        order: {},
        addr: {},
        userInfo:{}
    },
    addr: function() {
        var that = this
        set_addr(that)
    },
    add: function() {
        var that = this
        var order = this.data.order

        if (order.num < this.data.order.quantity) {
            order.num++
                order.total_fee = (order.price * order.num).toFixed(2)
            that.setData({
                order: order
            })
        }
    },
    move: function() {
        var that = this
        var order = this.data.order

        if (order.num > 1) {
            order.num--
                order.total_fee = (order.price * order.num).toFixed(2)

            that.setData({
                order: order
            })
        }
    },
    update: function(e) {
        var that = this
        var order = this.data.order

        if (Number(e.detail.value) > Number(this.data.order.quantity)) {
            console.log('value', e.detail.value)
            console.log('quantity', this.data.order.quantity)
            order.num = this.data.order.quantity
        } else if (e.detail.value > 0) {
            order.num = e.detail.value
        } else {
            order.num = 1
        }
        order.total_fee = (order.price * order.num).toFixed(2)

        that.setData({
            order: order
        })

    },
    order_submit: function() {
        var that = this
        order_submit(that)
    },
    onLoad: function(e) {
        var that = this
        common.get_user_info(that)
        get_addr(that)
        that.setData({
            order: {
                'product_id': e.product_id,
                'cid': e.cid,
                'img_url': e.img_url,
                'name': e.name,
                'price': e.price,
                'sku_id': e.sku_id,
                'sku_properties_name': e.sku_properties_name,
                'num': e.num,
                'quantity': e.quantity,
                'adjust_fee':0,
                'discount_fee':0,
                'post_fee':0,
                'total_fee': (e.price * e.num).toFixed(2)
            },
        })
    }
})
