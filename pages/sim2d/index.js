const { runCavitySimulation } = require('../../utils/sim2d');

function round4(x) {
  return Number(x.toFixed(4));
}

Page({
  data: {
    form: {
      nx: 31,
      steps: 80,
      dt: 0.001,
      nu: 0.1,
      lidU: 1
    },
    sim2d: null
  },

  onInput(e) {
    const key = e.currentTarget.dataset.key;
    const value = e.detail.value;
    this.setData({
      [`form.${key}`]: value
    });
  },

  runSimulation() {
    const nx = Math.max(11, Number(this.data.form.nx) || 31);
    const result = runCavitySimulation({
      nx,
      ny: nx,
      steps: Math.max(10, Number(this.data.form.steps) || 80),
      dt: Number(this.data.form.dt) || 0.001,
      nu: Number(this.data.form.nu) || 0.1,
      lidU: Number(this.data.form.lidU) || 1
    });

    const cx = Math.floor(nx / 2);
    const cy = Math.floor(nx / 2);
    const speed = this.computeSpeed(result.u, result.v);

    this.setData({
      sim2d: {
        centerU: round4(result.u[cy][cx]),
        centerV: round4(result.v[cy][cx]),
        maxSpeed: round4(speed.max)
      }
    });

    this.drawField(speed.field, speed.max);
  },

  computeSpeed(u, v) {
    const field = [];
    let max = 1e-9;
    for (let j = 0; j < u.length; j += 1) {
      const row = [];
      for (let i = 0; i < u[j].length; i += 1) {
        const s = Math.sqrt(u[j][i] * u[j][i] + v[j][i] * v[j][i]);
        row.push(s);
        if (s > max) {
          max = s;
        }
      }
      field.push(row);
    }
    return { field, max };
  },

  drawField(field, maxSpeed) {
    const size = 300;
    const n = field.length;
    const cell = size / n;
    const ctx = wx.createCanvasContext('flowCanvas', this);

    ctx.setFillStyle('#0d1117');
    ctx.fillRect(0, 0, size, size);

    for (let j = 0; j < n; j += 1) {
      for (let i = 0; i < n; i += 1) {
        const ratio = Math.min(1, field[j][i] / maxSpeed);
        const hue = 220 - Math.round(180 * ratio);
        const lightness = 30 + Math.round(35 * ratio);
        ctx.setFillStyle(`hsl(${hue}, 90%, ${lightness}%)`);
        ctx.fillRect(i * cell, j * cell, cell + 0.6, cell + 0.6);
      }
    }

    ctx.draw();
  },

  onReady() {
    this.runSimulation();
  }
});
