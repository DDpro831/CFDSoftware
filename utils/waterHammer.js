/**
 * 管道水击仿真（1D MOC 简化）
 */

function runWaterHammerSimulation(options = {}) {
  const {
    length = 1000,
    diameter = 0.5,
    waveSpeed = 1200,
    frictionFactor = 0.02,
    gravity = 9.81,
    segments = 20,
    totalTime = 2,
    initVelocity = 1,
    initHead = 100,
    valveCloseTime = 0.2
  } = options;

  const dx = length / segments;
  const dt = 0.8 * dx / waveSpeed;
  const nSteps = Math.max(2, Math.floor(totalTime / dt));
  const area = Math.PI * diameter * diameter / 4;
  const B = waveSpeed / (gravity * area);
  const R = (frictionFactor * dx) / (2 * gravity * diameter * area * area);

  const H = Array(segments + 1).fill(initHead);
  const Q = Array(segments + 1).fill(initVelocity * area);

  const history = [];
  for (let step = 0; step < nSteps; step++) {
    const t = step * dt;
    const Hn = H.slice();
    const Qn = Q.slice();

    for (let i = 1; i < segments; i++) {
      const Cp = H[i - 1] + B * Q[i - 1] - R * Q[i - 1] * Math.abs(Q[i - 1]);
      const Cm = H[i + 1] - B * Q[i + 1] + R * Q[i + 1] * Math.abs(Q[i + 1]);
      Hn[i] = 0.5 * (Cp + Cm);
      Qn[i] = (Cp - Cm) / (2 * B);
    }

    Hn[0] = initHead;
    Qn[0] = (Hn[0] - (H[1] - B * Q[1] + R * Q[1] * Math.abs(Q[1]))) / B;

    const closeRatio = Math.max(0, 1 - t / valveCloseTime);
    const QValve = Q[segments] * closeRatio;
    const CpValve = H[segments - 1] + B * Q[segments - 1] - R * Q[segments - 1] * Math.abs(Q[segments - 1]);
    Hn[segments] = CpValve - B * QValve;
    Qn[segments] = QValve;

    for (let i = 0; i <= segments; i++) {
      H[i] = Hn[i];
      Q[i] = Qn[i];
    }

    history.push({ t, outletHead: H[segments], outletFlow: Q[segments] });
  }

  const jowskyDeltaH = (waveSpeed * initVelocity) / gravity;
  return {
    dt,
    dx,
    history,
    jowskyDeltaH,
    maxOutletHead: Math.max(...history.map((x) => x.outletHead))
  };
}

module.exports = {
  runWaterHammerSimulation
};
