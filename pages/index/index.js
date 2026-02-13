const { runCavitySimulation } = require('../../utils/sim2d');
const { runWaterHammerSimulation } = require('../../utils/waterHammer');
const { calcInternalConvection } = require('../../utils/physics');

function round4(x) {
  return Number(x.toFixed(4));
}

Page({
  data: {
    sim2d: null,
    hammer: null,
    props: null
  },

  run2D() {
    const result = runCavitySimulation({
      nx: 31,
      ny: 31,
      steps: 80,
      dt: 0.001,
      nu: 0.1,
      lidU: 1
    });

    const cx = Math.floor(31 / 2);
    const cy = Math.floor(31 / 2);
    this.setData({
      sim2d: {
        centerU: round4(result.u[cy][cx]),
        centerV: round4(result.v[cy][cx])
      }
    });
  },

  runHammer() {
    const result = runWaterHammerSimulation({
      length: 1000,
      diameter: 0.5,
      initVelocity: 1,
      waveSpeed: 1200,
      totalTime: 2,
      valveCloseTime: 0.15
    });

    this.setData({
      hammer: {
        jowskyDeltaH: round4(result.jowskyDeltaH),
        maxOutletHead: round4(result.maxOutletHead)
      }
    });
  },

  runProps() {
    const result = calcInternalConvection({
      rho: 998,
      velocity: 1.2,
      diameter: 0.05,
      mu: 0.001,
      cp: 4182,
      k: 0.6,
      heating: true
    });

    this.setData({
      props: {
        re: round4(result.re),
        pr: round4(result.pr),
        nu: round4(result.nu),
        h: round4(result.h)
      }
    });
  }
});
