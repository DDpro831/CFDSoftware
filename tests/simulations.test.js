const assert = require('assert');
const { runCavitySimulation } = require('../utils/sim2d');
const { runWaterHammerSimulation } = require('../utils/waterHammer');

const cavity = runCavitySimulation({ nx: 21, ny: 21, steps: 20, dt: 0.001, nu: 0.1, lidU: 1 });
assert(cavity.u.length === 21 && cavity.u[0].length === 21, '2D 网格尺寸错误');

for (let j = 0; j < 21; j++) {
  assert(cavity.u[j][0] === 0 && cavity.u[j][20] === 0, '左右壁面速度边界错误');
}
for (let i = 1; i < 20; i++) {
  assert(cavity.u[20][i] === 1, '上边界驱动速度错误');
}
assert(cavity.u[20][0] === 0 && cavity.u[20][20] === 0, '角点边界处理错误');

const hammer = runWaterHammerSimulation({
  length: 1000,
  diameter: 0.5,
  waveSpeed: 1200,
  initVelocity: 1,
  totalTime: 1,
  valveCloseTime: 0.1
});

const expectedJ = 1200 / 9.81;
assert(Math.abs(hammer.jowskyDeltaH - expectedJ) < 1e-9, 'Joukowsky 水头升高计算错误');
assert(hammer.maxOutletHead >= 100, '水击后末端水头应不小于初始水头（本工况）');

console.log('simulations.test passed');
