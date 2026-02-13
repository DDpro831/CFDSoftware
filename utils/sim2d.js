/**
 * 二维不可压流简化仿真（投影法，lid-driven cavity）
 * 用于教学与工程预估，不替代高精度 CFD 求解器。
 */

function createGrid(nx, ny, initial = 0) {
  return Array.from({ length: ny }, () => Array(nx).fill(initial));
}

function cloneGrid(g) {
  return g.map((row) => row.slice());
}

function stepCavityFlow(state, params) {
  const { nx, ny, dx, dy, dt, rho, nu, lidU, poissonIter } = params;
  const { u, v, p } = state;

  const un = cloneGrid(u);
  const vn = cloneGrid(v);
  const pn = cloneGrid(p);
  const b = createGrid(nx, ny, 0);

  for (let j = 1; j < ny - 1; j++) {
    for (let i = 1; i < nx - 1; i++) {
      const dudx = (un[j][i + 1] - un[j][i - 1]) / (2 * dx);
      const dvdy = (vn[j + 1][i] - vn[j - 1][i]) / (2 * dy);
      const dudy = (un[j + 1][i] - un[j - 1][i]) / (2 * dy);
      const dvdx = (vn[j][i + 1] - vn[j][i - 1]) / (2 * dx);

      b[j][i] =
        (rho / dt) * (dudx + dvdy) -
        rho * (dudx * dudx + 2 * dudy * dvdx + dvdy * dvdy);
    }
  }

  for (let q = 0; q < poissonIter; q++) {
    const pOld = cloneGrid(pn);
    for (let j = 1; j < ny - 1; j++) {
      for (let i = 1; i < nx - 1; i++) {
        pn[j][i] =
          (((pOld[j][i + 1] + pOld[j][i - 1]) * dy * dy +
            (pOld[j + 1][i] + pOld[j - 1][i]) * dx * dx) /
            (2 * (dx * dx + dy * dy))) -
          (dx * dx * dy * dy * b[j][i]) / (2 * (dx * dx + dy * dy));
      }
    }

    for (let j = 0; j < ny; j++) {
      pn[j][nx - 1] = pn[j][nx - 2];
      pn[j][0] = pn[j][1];
    }
    for (let i = 0; i < nx; i++) {
      pn[0][i] = pn[1][i];
      pn[ny - 1][i] = 0;
    }
  }

  for (let j = 1; j < ny - 1; j++) {
    for (let i = 1; i < nx - 1; i++) {
      u[j][i] =
        un[j][i] -
        un[j][i] * (dt / dx) * (un[j][i] - un[j][i - 1]) -
        vn[j][i] * (dt / dy) * (un[j][i] - un[j - 1][i]) -
        (dt / (2 * rho * dx)) * (pn[j][i + 1] - pn[j][i - 1]) +
        nu *
          (dt *
            ((un[j][i + 1] - 2 * un[j][i] + un[j][i - 1]) / (dx * dx) +
              (un[j + 1][i] - 2 * un[j][i] + un[j - 1][i]) / (dy * dy)));

      v[j][i] =
        vn[j][i] -
        un[j][i] * (dt / dx) * (vn[j][i] - vn[j][i - 1]) -
        vn[j][i] * (dt / dy) * (vn[j][i] - vn[j - 1][i]) -
        (dt / (2 * rho * dy)) * (pn[j + 1][i] - pn[j - 1][i]) +
        nu *
          (dt *
            ((vn[j][i + 1] - 2 * vn[j][i] + vn[j][i - 1]) / (dx * dx) +
              (vn[j + 1][i] - 2 * vn[j][i] + vn[j - 1][i]) / (dy * dy)));
    }
  }

  for (let i = 0; i < nx; i++) {
    u[0][i] = 0;
    u[ny - 1][i] = lidU;
    v[0][i] = 0;
    v[ny - 1][i] = 0;
  }
  for (let j = 0; j < ny; j++) {
    u[j][0] = 0;
    u[j][nx - 1] = 0;
    v[j][0] = 0;
    v[j][nx - 1] = 0;
  }

  return { u, v, p: pn };
}

function runCavitySimulation(options = {}) {
  const nx = options.nx || 31;
  const ny = options.ny || 31;
  const dx = 1 / (nx - 1);
  const dy = 1 / (ny - 1);
  const state = {
    u: createGrid(nx, ny, 0),
    v: createGrid(nx, ny, 0),
    p: createGrid(nx, ny, 0)
  };

  const params = {
    nx,
    ny,
    dx,
    dy,
    dt: options.dt || 0.001,
    rho: options.rho || 1,
    nu: options.nu || 0.1,
    lidU: options.lidU || 1,
    poissonIter: options.poissonIter || 40
  };

  const steps = options.steps || 50;
  let current = state;
  for (let n = 0; n < steps; n++) {
    current = stepCavityFlow(current, params);
  }
  return current;
}

module.exports = {
  runCavitySimulation
};
