/*
 * @Author: TYW
 * @Date: 2022-04-05 20:05:49
 * @LastEditTime: 2022-04-07 22:31:13
 * @LastEditors: TYW
 * @Description:
 */
import {
  mouseButtons,
  mouseElement,
  mouseRelativeX,
  mouseRelativeY
} from './MouseEvent';
export const mouseListen = (element: any, callback: any) => {
  if (!callback) {
    callback = element;
    element = window;
  }

  let buttonState = 0;
  let x = 0;
  let y = 0;
  const mods = {
    shift: false,
    alt: false,
    control: false,
    meta: false
  };
  let attached = false;

  function updateMods(ev: {
    altKey?: boolean;
    shiftKey?: boolean;
    ctrlKey?: boolean;
    metaKey?: boolean;
  }) {
    let changed = false;
    if ('altKey' in ev) {
      changed = changed || ev.altKey !== mods.alt;
      mods.alt = !!ev.altKey;
    }
    if ('shiftKey' in ev) {
      changed = changed || ev.shiftKey !== mods.shift;
      mods.shift = !!ev.shiftKey;
    }
    if ('ctrlKey' in ev) {
      changed = changed || ev.ctrlKey !== mods.control;
      mods.control = !!ev.ctrlKey;
    }
    if ('metaKey' in ev) {
      changed = changed || ev.metaKey !== mods.meta;
      mods.meta = !!ev.metaKey;
    }
    return changed;
  }

  function handleEvent(
    nextButtons: number,
    ev: {
      buttons?: any;
      offsetX?: any;
      clientX?: any;
      target?: any;
      srcElement?: any;
      offsetY?: any;
      clientY?: any;
      altKey?: boolean;
      shiftKey?: boolean;
      ctrlKey?: boolean;
      metaKey?: boolean;
    }
  ) {
    const nextX = mouseRelativeX(ev);
    const nextY = mouseRelativeY(ev);
    if ('buttons' in ev) {
      nextButtons = ev.buttons | 0;
    }
    if (
      nextButtons !== buttonState ||
      nextX !== x ||
      nextY !== y ||
      updateMods(ev)
    ) {
      buttonState = nextButtons | 0;
      x = nextX || 0;
      y = nextY || 0;
      callback && callback(buttonState, x, y, mods);
    }
  }

  function clearState(ev: {
    buttons?: any;
    offsetX?: any;
    clientX?: any;
    target?: any;
    srcElement?: any;
    offsetY?: any;
    clientY?: any;
    altKey?: boolean | undefined;
    shiftKey?: boolean | undefined;
    ctrlKey?: boolean | undefined;
    metaKey?: boolean | undefined;
  }) {
    handleEvent(0, ev);
  }

  function handleBlur() {
    if (
      buttonState ||
      x ||
      y ||
      mods.shift ||
      mods.alt ||
      mods.meta ||
      mods.control
    ) {
      x = y = 0;
      buttonState = 0;
      mods.shift = mods.alt = mods.control = mods.meta = false;
      callback && callback(0, 0, 0, mods);
    }
  }

  function handleMods(ev: {
    altKey?: boolean | undefined;
    shiftKey?: boolean | undefined;
    ctrlKey?: boolean | undefined;
    metaKey?: boolean | undefined;
  }) {
    if (updateMods(ev)) {
      callback && callback(buttonState, x, y, mods);
    }
  }

  function handleMouseMove(ev: {
    buttons: any;
    which?: any;
    button?: any;
    offsetX?: any;
    clientX?: any;
    target?: any;
    srcElement?: any;
    offsetY?: any;
    clientY?: any;
    altKey?: boolean | undefined;
    shiftKey?: boolean | undefined;
    ctrlKey?: boolean | undefined;
    metaKey?: boolean | undefined;
  }) {
    if (mouseButtons(ev) === 0) {
      handleEvent(0, ev);
    } else {
      handleEvent(buttonState, ev);
    }
  }

  function handleMouseDown(ev: {
    buttons: any;
    which?: any;
    button?: any;
    offsetX?: any;
    clientX?: any;
    target?: any;
    srcElement?: any;
    offsetY?: any;
    clientY?: any;
    altKey?: boolean | undefined;
    shiftKey?: boolean | undefined;
    ctrlKey?: boolean | undefined;
    metaKey?: boolean | undefined;
  }) {
    handleEvent(buttonState | mouseButtons(ev), ev);
  }

  function handleMouseUp(ev: {
    buttons: any;
    which?: any;
    button?: any;
    offsetX?: any;
    clientX?: any;
    target?: any;
    srcElement?: any;
    offsetY?: any;
    clientY?: any;
    altKey?: boolean | undefined;
    shiftKey?: boolean | undefined;
    ctrlKey?: boolean | undefined;
    metaKey?: boolean | undefined;
  }) {
    handleEvent(buttonState & ~mouseButtons(ev), ev);
  }

  function attachListeners() {
    if (attached) {
      return;
    }
    attached = true;

    element.addEventListener('mousemove', handleMouseMove);

    element.addEventListener('mousedown', handleMouseDown);

    element.addEventListener('mouseup', handleMouseUp);

    element.addEventListener('mouseleave', clearState);
    element.addEventListener('mouseenter', clearState);
    element.addEventListener('mouseout', clearState);
    element.addEventListener('mouseover', clearState);

    element.addEventListener('blur', handleBlur);

    element.addEventListener('keyup', handleMods);
    element.addEventListener('keydown', handleMods);
    element.addEventListener('keypress', handleMods);

    if (element !== window) {
      window.addEventListener('blur', handleBlur);

      window.addEventListener('keyup', handleMods);
      window.addEventListener('keydown', handleMods);
      window.addEventListener('keypress', handleMods);
    }
  }

  function detachListeners() {
    if (!attached) {
      return;
    }
    attached = false;

    element.removeEventListener('mousemove', handleMouseMove);

    element.removeEventListener('mousedown', handleMouseDown);

    element.removeEventListener('mouseup', handleMouseUp);

    element.removeEventListener('mouseleave', clearState);
    element.removeEventListener('mouseenter', clearState);
    element.removeEventListener('mouseout', clearState);
    element.removeEventListener('mouseover', clearState);

    element.removeEventListener('blur', handleBlur);

    element.removeEventListener('keyup', handleMods);
    element.removeEventListener('keydown', handleMods);
    element.removeEventListener('keypress', handleMods);

    if (element !== window) {
      window.removeEventListener('blur', handleBlur);

      window.removeEventListener('keyup', handleMods);
      window.removeEventListener('keydown', handleMods);
      window.removeEventListener('keypress', handleMods);
    }
  }

  // Attach listeners
  attachListeners();

  const result = {
    element: element
  };

  Object.defineProperties(result, {
    enabled: {
      get: function () {
        return attached;
      },
      set: function (f) {
        if (f) {
          attachListeners();
        } else {
          detachListeners();
        }
      },
      enumerable: true
    },
    buttons: {
      get: function () {
        return buttonState;
      },
      enumerable: true
    },
    x: {
      get: function () {
        return x;
      },
      enumerable: true
    },
    y: {
      get: function () {
        return y;
      },
      enumerable: true
    },
    mods: {
      get: function () {
        return mods;
      },
      enumerable: true
    }
  });

  return result;
};
