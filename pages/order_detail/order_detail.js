var common = require('../../common/common.js');
Page({
	data:{
        order:{},
        addr:{},
        tid:'',
        created:''
	},
    onLoad: function(e) {
        var that = this
        that.setData({
            order:{
                'product_id': e.product_id,
                'cid': e.cid,
                'img_url': e.img_url,
                'name': e.name,
                'price': e.price,
                'sku_id': e.sku_id,
                'sku_properties_name': e.sku_properties_name,
                'num': e.num,
                'quantity': e.quantity,
                'adjust_fee':e.adjust_fee,
                'discount_fee':e.discount_fee,
                'post_fee':e.post_fee,
                'total_fee': e.total_fee
            },
            addr:{
                'userName':e.userName,
                'telNumber':e.telNumber,
                'street':e.street
            },
            tid:e.tid,
            created:e.created
        })

    }
})








