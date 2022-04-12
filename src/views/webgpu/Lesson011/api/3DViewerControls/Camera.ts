/*
 * @Author: TYW
 * @Date: 2022-04-06 19:57:19
 * @LastEditTime: 2022-04-11 23:47:08
 * @LastEditors: TYW
 * @Description:
 */

import { RightNow } from './RightNow/RightNow';
import { mouseListen } from './Mouse/MouseListen';
import { mouseWheelListen } from './Mouse/MouseWheel';
import { mouseEventOffset } from './Mouse/MouseEventOffset';
import { detect } from './HasPassiveEvents/HasPassiveEvents';
import { createViewController } from './3DView/3DView';

export const createCamera = (
  element: any,
  options: {
    distanceLimits?: any;
    zoomMin?: any;
    zoomMax?: any;
    center?: any;
    up?: any;
    eye?: any;
    mode?: any;
    delay?: any;
    rotateSpeed?: any;
    zoomSpeed?: any;
    translateSpeed?: any;
    flipX?: any;
    flipY?: any;
  }
) => {
  element = element || document.body;
  options = options || {};

  const limits = [0.01, Infinity];
  if ('distanceLimits' in options) {
    limits[0] = options.distanceLimits[0];
    limits[1] = options.distanceLimits[1];
  }
  if ('zoomMin' in options) {
    limits[0] = options.zoomMin;
  }
  if ('zoomMax' in options) {
    limits[1] = options.zoomMax;
  }

  const view = createViewController({
    center: options.center || [0, 0, 0],
    up: options.up || [0, 1, 0],
    eye: options.eye || [0, 0, 10],
    mode: options.mode || 'orbit',
    distanceLimits: limits
  });

  const pmatrix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let distance = 0.0;
  let width = element.clientWidth;
  let height = element.clientHeight;

  const camera = {
    view: view,
    element: element,
    delay: options.delay || 16,
    rotateSpeed: options.rotateSpeed || 1,
    zoomSpeed: options.zoomSpeed || 1,
    translateSpeed: options.translateSpeed || 1,
    flipX: !!options.flipX,
    flipY: !!options.flipY,
    modes: view.modes,
    matrix: view.computedMatrix,
    tick: function () {
      const t = RightNow();
      const delay = this.delay;
      view.idle(t - delay);
      view.flush(t - (100 + delay * 2));
      const ctime = t - 2 * delay;
      view.recalcMatrix(ctime);
      let allEqual = true;
      const matrix = view.computedMatrix;
      for (let i = 0; i < 16; ++i) {
        allEqual = allEqual && pmatrix[i] === matrix[i];
        pmatrix[i] = matrix[i];
      }
      const sizeChanged =
        element.clientWidth === width && element.clientHeight === height;
      width = element.clientWidth;
      height = element.clientHeight;
      if (allEqual) {
        return !sizeChanged;
      }
      distance = Math.exp(view.computedRadius[0]);
      return true;
    },
    lookAt: function (center: any, eye: any, up: any) {
      view.lookAt(view.lastT(), center, eye, up);
    },
    rotate: function (pitch: any, yaw: any, roll: any) {
      view.rotate(view.lastT(), pitch, yaw, roll);
    },
    pan: function (dx: any, dy: any, dz: any) {
      console.log('pan先？');
      view.pan(view.lastT(), dx, dy, dz);
      console.log('pan后？');
    },
    translate: function (dx: any, dy: any, dz: any) {
      console.log('平移先？');
      view.translate(view.lastT(), dx, dy, dz);
      console.log('平移后？');
    }
  };

  Object.defineProperties(camera, {
    matrix: {
      get: function () {
        return view.computedMatrix;
      },
      set: function (mat) {
        view.setMatrix(view.lastT(), mat);
        return view.computedMatrix;
      },
      enumerable: true
    },
    mode: {
      get: function () {
        return view.getMode();
      },
      set: function (mode) {
        view.setMode(mode);
        return view.getMode();
      },
      enumerable: true
    },
    center: {
      get: function () {
        return view.computedCenter;
      },
      set: function (ncenter) {
        console.log("赋值了？",ncenter);
        view.lookAt(view.lastT(), ncenter);
        return view.computedCenter;
      },
      enumerable: true
    },
    eye: {
      get: function () {
        return view.computedEye;
      },
      set: function (neye) {
        view.lookAt(view.lastT(), null, neye);
        return view.computedEye;
      },
      enumerable: true
    },
    up: {
      get: function () {
        return view.computedUp;
      },
      set: function (nup) {
        view.lookAt(view.lastT(), null, null, nup);
        return view.computedUp;
      },
      enumerable: true
    },
    distance: {
      get: function () {
        return distance;
      },
      set: function (d) {
        view.setDistance(view.lastT(), d);
        return d;
      },
      enumerable: true
    },
    distanceLimits: {
      get: function () {
        return view.getDistanceLimits(limits);
      },
      set: function (v) {
        view.setDistanceLimits(v);
        return v;
      },
      enumerable: true
    }
  });

  element.addEventListener('contextmenu', function (ev: any) {
    ev.preventDefault();
    return false;
  });

  let lastX = 0,
    lastY = 0,
    lastMods = { shift: false, control: false, alt: false, meta: false };
  mouseListen(element, handleInteraction);

  //enable simple touch interactions
  element.addEventListener(
    'touchstart',
    function (ev: any) {
      const xy = mouseEventOffset(ev.changedTouches[0], element);
      handleInteraction(0, xy[0], xy[1], lastMods);
      handleInteraction(1, xy[0], xy[1], lastMods);

      ev.preventDefault();
    },
    detect() ? { passive: false } : false
  );

  element.addEventListener(
    'touchmove',
    function (ev: any) {
      const xy = mouseEventOffset(ev.changedTouches[0], element);
      handleInteraction(1, xy[0], xy[1], lastMods);

      ev.preventDefault();
    },
    detect() ? { passive: false } : false
  );

  element.addEventListener(
    'touchend',
    function (ev: any) {
      const xy = mouseEventOffset(ev.changedTouches[0], element);
      handleInteraction(0, lastX, lastY, lastMods);

      ev.preventDefault();
    },
    detect() ? { passive: false } : false
  );
  // mouse listen event
  function handleInteraction(buttons: number, x: number, y: number, mods: any) {
    const scale = 1.0 / element.clientHeight;
    const dx = scale * (x - lastX);
    const dy = scale * (y - lastY);

    const flipX = camera.flipX ? 1 : -1;
    const flipY = camera.flipY ? 1 : -1;

    const drot = Math.PI * camera.rotateSpeed;

    const t = RightNow();

    if (buttons & 1) {
      if (mods.shift) {
        view.rotate(t, 0, 0, -dx * drot);
      } else {
        view.rotate(t, flipX * drot * dx, -flipY * drot * dy, 0);
      }
    } else if (buttons & 2) {
      console.log('buttons2 pan?');
      view.pan(
        t,
        -camera.translateSpeed * dx * distance,
        camera.translateSpeed * dy * distance,
        0
      );
      console.log('buttons2 pan 之后?');
    } else if (buttons & 4) {
      console.log('buttons4 pan?');
      const kzoom =
        ((camera.zoomSpeed * dy) / window.innerHeight) *
        (t - view.lastT()) *
        50.0;
      view.pan(t, 0, 0, distance * (Math.exp(kzoom) - 1));
      console.log('buttons4 pan 之后?');
    }

    lastX = x;
    lastY = y;
    lastMods = mods;
  }

  mouseWheelListen(
    element,
    function (dx: number, dy: number, dz: any) {
      const flipX = camera.flipX ? 1 : -1;
      const flipY = camera.flipY ? 1 : -1;
      const t = RightNow();
      if (Math.abs(dx) > Math.abs(dy)) {
        view.rotate(
          t,
          0,
          0,
          (-dx * flipX * Math.PI * camera.rotateSpeed) / window.innerWidth
        );
      } else {
        const kzoom =
          (((camera.zoomSpeed * flipY * dy) / window.innerHeight) *
            (t - view.lastT())) /
          100.0;
        view.pan(t, 0, 0, distance * (Math.exp(kzoom) - 1));
      }
    },
    true
  );

  return camera;
};
