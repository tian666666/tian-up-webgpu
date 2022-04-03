import { VTN } from './gl';

/*
 * @Author: TYW
 * @Date: 2022-03-07 19:30:31
 * @LastEditTime: 2022-03-08 19:44:15
 * @LastEditors: TYW
 * @Description:
 */
export class Modal {
  public mesh: VTN;
  constructor(meshData: VTN) {
    // TODO :: create this.transform in fuure lesson
    this.mesh = meshData;
  }
  // things to do before its time to render
  preRender() {
    // TODO :: Update transform Matrix in future lesson
  }
}
