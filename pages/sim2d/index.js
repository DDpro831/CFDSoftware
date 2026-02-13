const { runCavitySimulation } = require('../../utils/sim2d');

function round4(x) {
  return Number(x.toFixed(4));
}

function toHex(v) {
  const n = Math.max(0, Math.min(255, Math.round(v)));
  return n.toString(16).padStart(2, '0');
}

function ratioToColor(ratio) {
  const r = 140 + 95 * ratio;
  const g = 215 - 55 * ratio;
  const b = 255 - 140 * ratio;
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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
    sim2d: null,
    canvasPx: 300
  },

  onInput(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({
      [`form.${key}`]: e.detail.value
    });
  },

  normalizeParams() {
    const rawNx = Number(this.data.form.nx) || 31;
    const nx = Math.min(81, Math.max(11, rawNx));
    const steps = Math.min(300, Math.max(10, Number(this.data.form.steps) || 80));
    const dt = Number(this.data.form.dt) || 0.001;
    const nu = Number(this.data.form.nu) || 0.1;
    const lidU = Number(this.data.form.lidU) || 1;

    if (dt <= 0 || nu <= 0 || lidU <= 0) {
      wx.showToast({ title: 'dt、ν、U 需大于 0', icon: 'none' });
      return null;
    }

    if (nx !== rawNx) {
      wx.showToast({ title: '网格已自动限制在 11~81', icon: 'none' });
    }

    return { nx, steps, dt, nu, lidU };
  },

  runSimulation() {
    const params = this.normalizeParams();
    if (!params) return;

    const result = runCavitySimulation({
      nx: params.nx,
      ny: params.nx,
      steps: params.steps,
      dt: params.dt,
      nu: params.nu,
      lidU: params.lidU
    });

    const cx = Math.floor(params.nx / 2);
    const cy = Math.floor(params.nx / 2);
    const speed = this.computeSpeed(result.u, result.v);

    this.setData({
      sim2d: {
        centerU: round4(result.u[cy][cx]),
        centerV: round4(result.v[cy][cx]),
        maxSpeed: round4(speed.max),
        grid: `${params.nx} × ${params.nx}`
      },
      form: {
        ...this.data.form,
        nx: params.nx,
        steps: params.steps
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
        if (s > max) max = s;
      }
      field.push(row);
    }
    return { field, max };
  },

  drawField(field, maxSpeed) {
    const size = this.data.canvasPx;
    const n = field.length;
    const cell = size / n;
    const ctx = wx.createCanvasContext('flowCanvas', this);

    ctx.setFillStyle('#eef5ff');
    ctx.fillRect(0, 0, size, size);

    for (let j = 0; j < n; j += 1) {
      for (let i = 0; i < n; i += 1) {
        const ratio = Math.min(1, field[j][i] / maxSpeed);
        ctx.setFillStyle(ratioToColor(ratio));
        ctx.fillRect(i * cell, j * cell, cell + 1, cell + 1);
      }
    }

    ctx.setStrokeStyle('#d3e2fa');
    ctx.strokeRect(0, 0, size, size);
    ctx.draw();
  },

  onReady() {
    const { windowWidth } = wx.getSystemInfoSync();
    const canvasPx = Math.min(360, Math.floor(windowWidth - 32));
    this.setData({ canvasPx }, () => this.runSimulation());
  }
});
