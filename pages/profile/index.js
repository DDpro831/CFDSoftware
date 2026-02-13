Page({
  data: {
    isLoggedIn: false,
    user: null
  },

  onLoad() {
    const savedUser = wx.getStorageSync('wechatUser');
    if (savedUser) {
      this.setData({
        isLoggedIn: true,
        user: savedUser
      });
    }
  },

  registerByWechat() {
    this.authByWechat('注册成功');
  },

  loginByWechat() {
    this.authByWechat('登录成功');
  },

  getWechatProfile(successCb, failCb) {
    if (wx.getUserProfile) {
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: successCb,
        fail: failCb
      });
      return;
    }

    wx.getUserInfo({
      success: successCb,
      fail: failCb
    });
  },

  authByWechat(successText) {
    wx.login({
      success: () => {
        this.getWechatProfile(
          (res) => {
            const user = {
              nickName: res.userInfo.nickName,
              avatarUrl: res.userInfo.avatarUrl
            };
            this.setData({ isLoggedIn: true, user });
            wx.setStorageSync('wechatUser', user);
            wx.showToast({ title: successText, icon: 'success' });
          },
          () => {
            wx.showToast({ title: '你已取消微信授权', icon: 'none' });
          }
        );
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
    wx.removeStorageSync('wechatUser');
    wx.showToast({ title: '已退出登录', icon: 'none' });
  }
});
