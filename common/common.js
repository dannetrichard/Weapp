function login(callback) {
    wx.clearStorage()
    wx.getStorage({
        key: 'api_token',
        success:function(res){
            callback(res.data)
            console.log('api_token', 'in storage')
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
                                    callback(res.data)
                                    console.log('login', 'success')
                                    wx.setStorage({
                                        key: "api_token",
                                        data: res.data
                                    })  
                                }else{
                                    wx.showToast({
                                        title: '登录失败',
                                        image: '../../common/info.png'
                                    })                                    
                                }
                            },
                            fail:function(){
                                wx.showToast({
                                    title: '登录失败',
                                    image: '../../common/info.png'
                                })
                            }
                        });
                    }
                },
                fail: function() {
                    console.log('wx.login', 'fail')
                }
            });        
        }
    })
}

function get_user_info(that){
    wx.getUserInfo({
        success: function(res) {
            that.setData({
                userInfo:res.userInfo
            })
        }
    })
}



module.exports.login = login
module.exports.get_user_info = get_user_info







