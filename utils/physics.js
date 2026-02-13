/**
 * 物性与无量纲数计算
 */

function calcReynolds(rho, velocity, diameter, mu) {
  if (mu <= 0 || diameter <= 0) throw new Error('mu 和 diameter 必须为正数');
  return (rho * velocity * diameter) / mu;
}

function calcPrandtl(cp, mu, k) {
  if (k <= 0) throw new Error('导热系数 k 必须为正数');
  return (cp * mu) / k;
}

function calcNusselt(re, pr, heating = true) {
  if (re < 0 || pr <= 0) throw new Error('Re/Pr 输入无效');

  // 圆管层流 fully developed
  if (re < 2300) {
    return heating ? 3.66 : 4.36;
  }

  // 湍流：Dittus-Boelter 经验关联式
  const n = heating ? 0.4 : 0.3;
  return 0.023 * Math.pow(re, 0.8) * Math.pow(pr, n);
}

function calcInternalConvection({ rho, velocity, diameter, mu, cp, k, heating = true }) {
  const re = calcReynolds(rho, velocity, diameter, mu);
  const pr = calcPrandtl(cp, mu, k);
  const nu = calcNusselt(re, pr, heating);
  const h = (nu * k) / diameter;
  return { re, pr, nu, h };
}

module.exports = {
  calcReynolds,
  calcPrandtl,
  calcNusselt,
  calcInternalConvection
};
