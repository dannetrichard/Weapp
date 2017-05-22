var data = {}
var myData = {}
var keys = {}
var block = {}
var common = require('../../common/common.js');

function get_product(that, i) {
    common.login(function(api_token) {
        wx.request({
            url: 'https://43691113.julystu.xyz/product/' + i,
            data: {
                'api_token': api_token
            },
            success: function(res) {
                var i = 0
                for (i in res.data.sku) {
                    data[res.data.sku[i].properties] = res.data.sku[i]
                }
                keys = res.data.sku_props

                res.data.item_imgs = res.data.item_imgs.map(function(item) {
                    return { 'loaded': false, 'url': item }
                })
                var desc = []


                if (res.data.desc != null) {
                    res.data.desc = res.data.desc.map(function(item) {
                        return { 'loaded': false, 'url': item }
                    })
                    desc = res.data.desc.splice(0, 1)
                }

                that.setData({
                    product: res.data,
                    desc: desc
                })
                sku_init(that)
            }
        })
    })
}

function getNum(key) {
    var result = 0,
        i, j, m,
        s = '',
        items, n = [];
    //检查是否已计算过
    if (typeof myData[key] != 'undefined') {
        return myData[key];
    }
    items = key.split(';');
    //已选择数据是最小路径，直接从已端数据获取
    if (items.length === keys.length) {
        return data[key] ? data[key].quantity : 0;
    }
    //拼接子串
    for (i = 0; i < keys.length; i++) {
        for (j = 0; j < keys[i].values.length && items.length > 0; j++) {
            s = keys[i].propId + ':' + keys[i].values[j].valueId
            if (s == items[0]) {
                break;
            }
        }
        if (j < keys[i].values.length && items.length > 0) {
            //找到该项，跳过
            n.push(items.shift());
        } else {
            //分解求值
            for (m = 0; m < keys[i].values.length; m++) {
                s = keys[i].propId + ':' + keys[i].values[m].valueId
                result += getNum(n.concat(s, items).join(";"));
            }
            break;
        }
    }
    //缓存
    myData[key] = result;
    return result;
}

function sku_init(that) {
    var i = 0
    var sku = {
        'is_show': false,
        'key_index': [],
        'key': '',
        'prop_properties_name': '',
        'sku_id': '',
        'name': that.data.product.name,
        'img_url': that.data.product.pic_url,
        'price': that.data.product.price,
        'shop_price': that.data.product.shop_price,
        'quantity': that.data.product.num,
        'num': '1',
        'block': [],
        'sku_props': that.data.product.sku_props,
    }

    //key_index
    i = 0
    for (i in keys) {
        if (keys[i].values.length == 1) {
            sku.key_index[i] = 0
        }
    }
    sku = coregen(sku)
    that.setData({
        sku: sku
    })

}

function combine(n) {
    var i
    var m = []
    for (i in n) {
        if (typeof n[i] != 'undefined') {
            m.push(keys[i].propId + ':' + keys[i].values[n[i]].valueId)
        }

    }
    return m.join(';')
}

function coregen(sku) {
    var i = 0
    var j = 0
    var n = []
    var m = []

    for (i in sku.key_index) {
        n.push(keys[i].propId + ':' + keys[i].values[sku.key_index[i]].valueId)
        m.push(keys[i].values[sku.key_index[i]].name)
        if (keys[i].values[sku.key_index[i]].imgUrl) {
            //img_url
            sku.img_url = keys[i].values[sku.key_index[i]].imgUrl
        }
    }
    if (n.length > 0) {
        sku.key = n.join(';')
            //quantity
        sku.quantity = getNum(sku.key)
            //key        
    }
    //sku_id\price\shop_price
    if (n.length == keys.length) {
        sku.sku_id = data[sku.key].id
        sku.price = data[sku.key].price
        sku.shop_price = data[sku.key].shop_price
        sku.prop_properties_name = m.join(' ')
    } else {
        i = 0
        m = []
        for (i in keys) {
            if (sku.key_index[i] == null) {
                m.push(keys[i].propName)
            }
        }
        sku.prop_properties_name = '请选择 ' + m.join('、')
    }
    sku.block = genBlock(sku)

    return sku
}

function genBlock(sku) {
    var block_result = []
    var i = 0
    var j = 0
    var s = ''
    var n = []
    i = 0


    if (sku.key == '') {
        if (typeof block['total'] != 'undefined') {
            return block['total']
        }
        for (i = 0; i < keys.length; i++) {
            block_result[i] = []
            for (j = 0; j < keys[i].values.length; j++) {
                s = keys[i].propId + ':' + keys[i].values[j].valueId
                if (getNum(s) == 0) {
                    block_result[i][j] = true
                } else {
                    block_result[i][j] = false
                }

            }
        }
        block['total'] = block_result;
        return block_result;
    }

    if (typeof block[sku.key] != 'undefined') {
        return block[sku.key]
    }

    i = 0

    for (i in keys) {
        s = ''
        n = []
        j = 0
        block_result[i] = []
        for (j in keys[i].values) {

            if (typeof sku.key_index[i] != 'undefined') {
                if (sku.key_index[i] == j) {
                    block_result[i][j] = false
                    continue
                }

            }
            n = [].concat(sku.key_index);
            n[i] = j
            s = combine(n)
            if (getNum(s) == 0) {
                block_result[i][j] = true
            } else {
                block_result[i][j] = false
            }

        }
    }

    block[sku.key] = block_result
    return block_result
}
//1、先生成key_index  2、生成key
function genData(that, x, y) {
    var sku = that.data.sku
    sku.key_index[x] = y

    sku = coregen(sku)

    that.setData({
        sku: sku
    })

}

function add(that) {
    var sku = that.data.sku
    if (sku.num < that.data.sku.quantity) {
        sku.num++
            that.setData({
                sku: sku
            })
    }
}

function move(that) {
    var sku = that.data.sku
    if (sku.num > 1) {
        sku.num--
            that.setData({
                sku: sku
            })
    }
}

function update(that, e) {
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
}

module.exports.get_product = get_product
module.exports.genData = genData
module.exports.add = add
module.exports.update = update
module.exports.move = move


/*
Page({
    data: {
        product:{},
        sku:{}
    },
    build:function(e){
        var that=this
        tool.buildData(that,e)
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
        tool.update(that,e)

    },
    onLoad: function() {
        var that = this
        tool.get_product(that,1113)
    }

})
*/
