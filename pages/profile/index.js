Page({
  data: {
    phone: '',
    password: '',
    isLoggedIn: false,
    user: null
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  register() {
    if (!this.data.phone || !this.data.password) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    wx.showToast({ title: '注册成功', icon: 'success' });
  },

  login() {
    if (!this.data.phone || !this.data.password) {
      wx.showToast({ title: '请填写账号密码', icon: 'none' });
      return;
    }

    this.setData({
      isLoggedIn: true,
      user: { phone: this.data.phone },
      password: ''
    });
    wx.showToast({ title: '登录成功', icon: 'success' });
  },

  logout() {
    this.setData({
      isLoggedIn: false,
      user: null
    });
  }
});
