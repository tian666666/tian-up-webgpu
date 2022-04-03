/*
 * @Author: TYW
 * @Date: 2022-02-24 14:10:30
 * @LastEditTime: 2022-03-07 18:16:44
 * @LastEditors: TYW
 * @Description:
 */
/*
NOTES:
Tutorial on how to control FPS :: http://codetheory.in/controlling-the-frame-rate-with-requestanimationframe/

EXAMPLE:
rloop = new RenderLoop(function(dt){
  console.log(rloop.fps + " " + dt);
}, 10).start();

*/

import { RenderCallBack, IGLExtend } from "./gl";


export class RenderLoop {
  // the time in Miliseconds of the last frame.
  private msLastFrame: number = 1;
  private msFpsLimit: number = 0;

  // What function to call for each frame
  private callBack: RenderCallBack;
  // control the On/Off state of the render loop
  private isActive: boolean = false;
  // Save the value of how fast the loop is going
  private FPS: number = 0;
  private run = function () {
    console.log('run');
  };
  constructor(callback: RenderCallBack, fps: number = 0,gl:IGLExtend) {
    this.msLastFrame = 0;
    this.callBack = callback;
    this.isActive = false;
    this.FPS = fps;
    const oThis = this;
    // build a run method that limits the framerate
    if (!this.FPS && this.FPS > 0) {
      // calc how many milliseconds per frame in one second of time
      this.msFpsLimit = 1000 / this.FPS;
      this.run = function () {
        // calculate Deltatime between frames and the FPS currently.
        const msCurrent: number = performance.now();
        const msDelta: number = msCurrent - oThis.msLastFrame;
        // what fraction of a single second is the delta time
        const deltaTime: number = msDelta / 1000.0;

        // Now execute frame since the time has elapsed.
        if (msDelta >= oThis.msFpsLimit) {
          oThis.FPS = Math.floor(1 / deltaTime);
          oThis.msLastFrame = msCurrent;
          oThis.callBack(gl,deltaTime);
        }
        if (oThis.isActive) {
          window.requestAnimationFrame(oThis.run);
        }
      };
    } else {
      // else build a run method thats optimised as much as possible.
      this.run = function () {
        // Calculate Deltatime between frames and the FPS currently.
        // gives you the whole number of how many milliseconds since the dawn of time
        const msCurrent: number = performance.now();
        // ms between frames, Then / by 1 second to get the fraction of a second.
        const deltaTime: number = (msCurrent - oThis.msLastFrame) / 1000.0;
        // now execute frame since the time has elapsed
        // time it took to generate one frame, divide 1 by that to get how many frames in one second
        oThis.FPS = Math.floor(1 / deltaTime);
        oThis.msLastFrame = msCurrent;
        oThis.callBack(gl,deltaTime);
        if (oThis.isActive) {
          window.requestAnimationFrame(oThis.run);
        }
      };
    }
  }
  start(): RenderLoop {
    this.isActive = true;
    this.msLastFrame = performance.now();
    window.requestAnimationFrame(this.run);
    return this;
  }
  stop() {
    this.isActive = false;
  }
}
