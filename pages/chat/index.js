Page({
  data: {
    draft: '',
    messages: [
      { role: 'assistant', text: '你好，我是 CFD 助手。你可以问我网格、边界条件和收敛性问题。' }
    ]
  },

  onInput(e) {
    this.setData({ draft: e.detail.value });
  },

  send() {
    const text = (this.data.draft || '').trim();
    if (!text) return;
    const userMsg = { role: 'user', text };
    const reply = {
      role: 'assistant',
      text: '已收到：' + text + '。当前为演示聊天界面，可在后续接入真实 AI 服务。'
    };
    this.setData({
      draft: '',
      messages: this.data.messages.concat(userMsg, reply)
    });
  }
});
