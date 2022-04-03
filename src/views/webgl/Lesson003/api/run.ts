/*
 * @Author: TYW
 * @Date: 2022-03-08 19:22:52
 * @LastEditTime: 2022-03-08 19:51:45
 * @LastEditors: TYW
 * @Description:
 */
import { RenderCallBack, GLInstance, IGLExtend } from './gl';
import { Modal } from './Modal';
import { RenderLoop } from './RenderLoop';
import { ShadersCode } from './ShadersCode';
import { ShaderUtil, TestShader } from './ShaderUtil';

export class runUtil {
  private gPointSize: number = 0;
  private gPSizeStep: number = 3;
  private gAngle: number = 0;
  private gAngleStep: number = (Math.PI / 180.0) * 90; //90 degrees in Radians

  private uPointSizeLoc: WebGLUniformLocation | null = null;
  private gVertCnt: number = 0;
  private uAngle: WebGLUniformLocation | null = null;

  private gRLoop: RenderLoop | null = null;
  private gShader: TestShader | null = null;
  private gModal: Modal | null = null;

  private onRender: RenderCallBack;

  constructor() {
    this.onRender = function (gl: IGLExtend, dt: number = 1): void {
      gl.fClear();
      // crazy chaining plus something most people dont do, setting and getting a value in a single stroke,
      // but I think its fun even if people find it unreadable.
      this.gShader
        ?.activate()
        .set(
          Math.sin((this.gPointSize += this.gPSizeStep * dt)) * 10.0 + 30.0, //Setting Point Size
          (this.gAngle += this.gAngleStep * dt) //Setting Angle
        )
        .renderModal(this.gModal as Modal);
    };
  }
  public run(domID: string) {
    // get our extended gl context object
    const gl = GLInstance(domID)?.fSetSize().fClear() as IGLExtend;

    // shader steps
    this.gShader = new TestShader(gl);

    // set up data buffers
    const mesh = gl.fCreateMeshVAO(
      'dots',
      null,
      [0, 0, 0, 0.1, 0.1, 0, 0.1, -0.1, 0, -0.1, -0.1, 0, -0.1, 0.1, 0]
    );
    //most often the draw mode will be triangles, but in this instance we need points
    mesh.drawMode = gl.POINTS;

    // there is many instances when we want a single mesh object shared between many
    // modals for example trees. One mesh with many transforms technically.
    this.gModal = new Modal(mesh);

    // set up for drawing
    this.gRLoop = new RenderLoop(this.onRender.bind(this), 1, gl).start();
  }
}
