var common = require('../../common/common.js');

 
var select = function select(that,n){

    common.login(function(api_token){
        wx.request({
            url: 'https://43691113.julystu.xyz/trade/find', 
            data: {
              'api_token': api_token,
              'status':that.data.select[n].status
            },
            success: function(res) {
                console.log(res.data)
                if(res.data=='Unauthorized.'){
                    wx.showToast({
                        title: '请登录',
                        image: '../../common/info.png'
                    })
                }else{
                     that.setData({
                        orders: res.data,
                        n:n

                    })                
                }
     
            }
        }) 
    })

}


Page({
	data:{
        orders:[],
        date:new Date().toLocaleDateString(),
        n:1,
        select:[{'title':'全部','status':'ALL'},{'title':'待付款','status':'WAIT_BUYER_PAY'},{'title':'待发货','status':'WAIT_SELLER_SEND_GOODS'},{'title':'待收货','status':'WAIT_BUYER_CONFIRM_GOODS'},]
	},
	tab_select:function(e){
		var that = this
        select(that,e.currentTarget.dataset.n)
	 
	},
    onLoad: function(e) {

		var that = this
        select(that,e.n)


    }
})








