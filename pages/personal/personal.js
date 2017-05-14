var common = require('../../common/common.js');
Page({
    data: {
        userInfo:{}
    },
    clear_storage:function(){
    	   wx.clearStorage()
    	   wx.reLaunch({
  		        url: '/pages/index/index'
	       })
    },
    onLoad: function() {
    	var that = this
        common.get_user_info(that)
    }
})
