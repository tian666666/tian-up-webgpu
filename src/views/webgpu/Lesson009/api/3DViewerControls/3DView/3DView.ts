/*
 * @Author: TYW
 * @Date: 2022-04-05 10:15:34
 * @LastEditTime: 2022-04-11 23:41:03
 * @LastEditors: TYW
 * @Description:
 */
import { createTurntableController } from './api/TurnTableController';
import {
  createOrbitController,
  OrbitCameraController
} from './api/OrbitController';
import {
  createMatrixCameraController,
  MatrixCameraController
} from './api/MatrixCameraController';

export class ViewController {
  public _controllerNames;
  public _controllerList: any;
  public _mode: string;
  public _active;
  public modes;
  public computedMatrix;
  public computedEye;
  public computedUp;
  public computedCenter;
  public computedRadius;
  private isPan = false;
  constructor(controllers: any, mode: string) {
    this._controllerNames = Object.keys(controllers);
    this._controllerList = this._controllerNames.map(n => {
      return controllers[n];
    });
    this._mode = mode;

    this._active = controllers[mode];
    if (!this._active) {
      this._mode = 'turntable';
      this._active = controllers.turntable;
    }
    this.modes = this._controllerNames;
    this.computedMatrix = this._active.computedMatrix;
    this.computedEye = this._active.computedEye;
    this.computedUp = this._active.computedUp;
    this.computedCenter = this._active.computedCenter;
    this.computedRadius = this._active.computedRadius;
  }

  flush(a0: any) {
    const cc = this._controllerList;
    for (let i = 0; i < cc.length; ++i) {
      cc[i].flush(a0);
    }
  }

  idle(a0: any) {
    const cc = this._controllerList;
    for (let i = 0; i < cc.length; ++i) {
      cc[i].idle(a0);
    }
  }

  lookAt(a0: any, a1: any, a2?: any, a3?: any) {
    const cc = this._controllerList;
    for (let i = 0; i < cc.length; ++i) {
      cc[i].lookAt(a0, a1, a2, a3);
    }
  }

  rotate(a0: any, a1: any, a2: any, a3: any) {
    const cc = this._controllerList;
    for (let i = 0; i < cc.length; ++i) {
      cc[i].rotate(a0, a1, a2, a3);
    }
  }

  pan(a0: any, a1: any, a2: any, a3: any) {
    console.log('拖拽pan');
    const cc = this._controllerList;
    for (let i = 0; i < cc.length; ++i) {
      cc[i].pan(a0, a1, a2, a3);
    }
    console.log('拖拽pan结束');
  }

  translate(a0: any, a1: any, a2: any, a3: any) {
    console.log('执行translate');
    const cc = this._controllerList;
    for (let i = 0; i < cc.length; ++i) {
      cc[i].translate(a0, a1, a2, a3);
    }
    console.log('执行translate结束');
  }

  setMatrix(a0: any, a1: any) {
    const cc = this._controllerList;
    for (let i = 0; i < cc.length; ++i) {
      cc[i].setMatrix(a0, a1);
    }
  }

  setDistanceLimits(a0: any, a1?: any) {
    const cc = this._controllerList;
    for (let i = 0; i < cc.length; ++i) {
      cc[i].setDistanceLimits(a0, a1);
    }
  }

  setDistance(a0: any, a1: any) {
    const cc = this._controllerList;
    for (let i = 0; i < cc.length; ++i) {
      cc[i].setDistance(a0, a1);
    }
  }

  recalcMatrix(t: any) {
    return this._active.recalcMatrix(t);
  }

  getDistance(t: any) {
    return this._active.getDistance(t);
  }
  getDistanceLimits(out: any) {
    return this._active.getDistanceLimits(out);
  }
  lastT() {
    return this._active.lastT();
  }

  setMode(mode: string) {
    if (mode === this._mode) {
      return;
    }

    const idx = this._controllerNames.indexOf(mode);
    if (idx < 0) {
      return;
    }

    const prev = this._active;
    const next = this._controllerList[idx];
    const lastT = Math.max(prev.lastT(), next.lastT());

    prev.recalcMatrix(lastT);
    next.setMatrix(lastT, prev.computedMatrix);

    this._active = next;
    this._mode = mode;
    console.log("执行了？");
    // update matrix properties
    this.computedMatrix = this._active.computedMatrix;
    this.computedEye = this._active.computedEye;
    this.computedUp = this._active.computedUp;
    this.computedCenter = this._active.computedCenter;
    this.computedRadius = this._active.computedRadius;
  }

  getMode() {
    return this._mode;
  }
}

export const createViewController = (options: {
  eye?: any;
  center?: any;
  up?: any;
  distanceLimits?: any;
  mode?: any;
}) => {
  options = options || {};

  const eye = options.eye || [0, 0, 1];
  const center = options.center || [0, 0, 0];
  const up = options.up || [0, 1, 0];
  const limits = options.distanceLimits || [0, Infinity];
  const mode = options.mode || 'turntable';

  const turntable = createTurntableController();
  const orbit = createOrbitController();
  const matrix = createMatrixCameraController();

  turntable.setDistanceLimits(limits[0], limits[1]);
  turntable.lookAt(0, eye, center, up);
  orbit.setDistanceLimits(limits[0], limits[1]);
  orbit.lookAt(0, eye, center, up);
  matrix.setDistanceLimits(limits[0], limits[1]);
  matrix.lookAt(0, eye, center, up);

  return new ViewController(
    {
      turntable: turntable,
      orbit: orbit,
      matrix: matrix
    },
    mode
  );
};
