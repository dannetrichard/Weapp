function login(cb,clear=false) {
    if(clear){
      wx.clearStorage()  
    }
    wx.getStorage({
        key: 'api_token',
        success:function(res){
            typeof cb == "function" && cb(res.data)
        },
        fail: function(){
            wx.login({
                success: function(res) {
                    if (res.code) {
                        wx.request({
                            url: 'https://43691113.julystu.xyz/login',
                            data: {
                                code: res.code
                            },
                            success: function(res) {
                                if(res.data.length == 32){
                                    typeof cb == "function" && cb(res.data)
                                    wx.setStorage({
                                        key: "api_token",
                                        data: res.data
                                    })  
                                }else{
                                    wx.showToast({
                                        title: '返回的api_token异常',
                                        image: '../../common/info.png'
                                    })                                    
                                }
                            },
                            fail:function(){
                                wx.showToast({
                                    title: '获取api_token失败',
                                    image: '../../common/info.png'
                                })
                            }
                        });
                    }
                },
                fail: function() {
                    wx.showToast({
                        title: '登录微信失败',
                        image: '../../common/info.png'
                    })
                }
            });        
        }
    })
}
module.exports.login = login







