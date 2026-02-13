const assert = require('assert');
const { calcReynolds, calcPrandtl, calcNusselt, calcInternalConvection } = require('../utils/physics');

const re = calcReynolds(998, 1.2, 0.05, 0.001);
assert(Math.abs(re - 59880) < 1e-6, 'Reynolds 计算错误');

const pr = calcPrandtl(4182, 0.001, 0.6);
assert(Math.abs(pr - 6.97) < 0.01, 'Prandtl 计算错误');

const nu = calcNusselt(1e5, 7, true);
const expectedNu = 0.023 * Math.pow(1e5, 0.8) * Math.pow(7, 0.4);
assert(Math.abs(nu - expectedNu) < 1e-9, 'Nu 计算错误');

const all = calcInternalConvection({
  rho: 998,
  velocity: 1.2,
  diameter: 0.05,
  mu: 0.001,
  cp: 4182,
  k: 0.6,
  heating: true
});
assert(all.h > 0, '对流换热系数 h 应为正数');

console.log('physics.test passed');
