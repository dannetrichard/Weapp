
var data={}
var myData={}
var keys={}

function get_product(that,i){
    wx.request({
        url: 'https://43691113.julystu.xyz/product/'+i,
        success: function(res) {
            var i
            var total = 0
            for(i=0;i<res.data.sku.length;i++){
                   data[res.data.sku[i].properties] = res.data.sku[i]
                   total = total + res.data.sku[i].quantity
            }
            res.data.num = total

            keys = res.data.sku_props

            that.setData({
               product : res.data 
            })
            console.log('product',that.data.product)
            sku_init(that)
            console.log('sku',that.data.sku)
           // buildData(that,0,2)
            console.log('sku',that.data.sku)
        }
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
            s = keys[i].propId + ':' +keys[i].values[j].valueId 
            if ( s == items[0]) {
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

function sku_init(that){
        var i=0
        var j=0
        var l=[]
        var m=[]
        var n =[]
        var s=''
        var sku = { 
            'is_show'                   :false,
            'key_index'                 : [], 
            'key'                       : '', 
            'prop_properties_name'      : '',
            'sku_id'                    : '', 
            'name'                      : that.data.product.name,            
            'img_url'                   : that.data.product.pic_url,
            'price'                     : that.data.product.price, 
            'shop_price'                : that.data.product.shop_price, 
            'quantity'                  : that.data.product.num,            
            'num'                       : '1', 
            'block'                     : [[],[]],
            'sku_props'                 : that.data.product.sku_props, 
        }

        for(i=0;i<keys.length;i++){
            for(j=0;j<keys[i].values.length;j++){
                s = keys[i].propId + ':' +keys[i].values[j].valueId 
                if(getNum(s) == that.data.product.num){
                    n.push(s)
                    m.push(keys[i].values[j].name)

                    sku.key_index[i] = j 
                    sku.block[i][j] = false
                }else if(getNum(s) == 0){
                    sku.block[i][j] = true
                }else{
                    sku.block[i][j] = false
                }
            }
        }
        sku.key                         =   n.join(';')       
        sku.prop_properties_name        =   m.join(' ')
        sku.quantity                    =   getNum(sku.key)
        if(keys[1].values.length==1&&keys[1].values[0].imgUrl){
            sku.img_url = keys[1].values[0].imgUrl
        }
        if(n.length == keys.length){
            sku.sku_id                      =   data[sku.key].sku_id
            sku.price                       =   data[sku.key].price
            sku.shop_price                  =   data[sku.key].shop_price         
        }
        that.setData({
            sku:sku
        })
}
function buildData(that,x,y){
    var i=0
    var j=0
    var s=''
    var n = []
    var m = []
    var sku = that.data.sku
    sku.key_index[x] = y 

    for(i=0;i<keys.length;i++){
        if(i!=x){
            for(j=0;j<keys[i].values.length;j++){
                n=[]
                if(i<x){
                    n.push(keys[i].propId + ':' +keys[i].values[j].valueId)
                    n.push(keys[x].propId + ':' +keys[x].values[y].valueId)
                }else{
                    n.push(keys[x].propId + ':' +keys[x].values[y].valueId)
                    n.push(keys[i].propId + ':' +keys[i].values[j].valueId)
                }

                s=n.join(';')

                if(getNum(s)>0){
                    sku.block[i][j] = false
                }else{
                    sku.block[i][j] = true
                }     
                
            }
        }

    }

    n=[]
    m=[]
    for(i=0;i<keys.length;i++){
        if(sku.key_index[i]!=null){
            n.push(keys[i].propId + ':' +keys[i].values[sku.key_index[i]].valueId)
            m.push(keys[i].values[sku.key_index[i]].name)
        }
    }
    sku.key = n.join(';')
    sku.prop_properties_name    =   m.join(' ')
    sku.quantity                =   getNum(sku.key)


    if(x==1&&keys[x].values[y].imgUrl){
        sku.img_url = keys[x].values[y].imgUrl
    }

    if(n.length == keys.length){
        sku.sku_id                      =   data[sku.key].sku_id
        sku.price                       =   data[sku.key].price
        sku.shop_price                  =   data[sku.key].shop_price
    }

    that.setData({
       sku:sku
    })

}
function add(that){
    var sku = that.data.sku
    if (sku.num < that.data.sku.quantity) {
        sku.num++
            that.setData({
                sku: sku
            })
    }    
}
function move(that){
    var sku = that.data.sku
    if (sku.num > 1) {
        sku.num--
            that.setData({
                sku: sku
            })
    }   
}
function update(that,e){
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
module.exports.buildData = buildData
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
        tool.buildData(that,e.currentTarget.dataset.x,e.currentTarget.dataset.y)
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