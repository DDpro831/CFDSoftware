Page({
  data: {
    isLoggedIn: false,
    user: null
  },

  registerByWechat() {
    this.authByWechat('注册成功');
  },

  loginByWechat() {
    this.authByWechat('登录成功');
  },

  authByWechat(successText) {
    wx.login({
      success: () => {
        wx.getUserProfile({
          desc: '用于完善用户资料',
          success: (res) => {
            this.setData({
              isLoggedIn: true,
              user: {
                nickName: res.userInfo.nickName,
                avatarUrl: res.userInfo.avatarUrl
              }
            });
            wx.showToast({ title: successText, icon: 'success' });
          },
          fail: () => {
            wx.showToast({ title: '你已取消微信授权', icon: 'none' });
          }
        });
      },
      fail: () => {
        wx.showToast({ title: '微信登录初始化失败', icon: 'none' });
      }
    });
  },

  logout() {
    this.setData({
      isLoggedIn: false,
      user: null
    });
    wx.showToast({ title: '已退出登录', icon: 'none' });
  }
});
