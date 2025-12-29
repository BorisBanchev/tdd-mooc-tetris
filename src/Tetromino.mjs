import { RotatingShape } from "./RotatingShape.mjs";

export class Tetromino {
  constructor(currentIndex, orientations) {
    this.currentIndex = currentIndex;
    this.orientations = orientations;
    Object.freeze(this.orientations);
    Object.freeze(this);
  }
  static fromString(currentOrientation, orientationCount, initialShape) {
    const shape = RotatingShape.fromString(initialShape);
    const orientations = [
      shape,
      shape.rotateRight(),
      shape.rotateRight().rotateRight(),
      shape.rotateRight().rotateRight().rotateRight(),
    ].slice(0, orientationCount);
    return new Tetromino(currentOrientation, orientations);
  }
  toString() {
    return this._shape.toString()
  }
  rotateRight() {
    return new Tetromino(this._shape.rotateRight())
  }
  rotateLeft() {
    return new Tetromino(this._shape.rotateLeft())
  }
}
Tetromino.T_SHAPE = Tetromino.fromString(`
    .T.
    TTT
    ...
    `)

Tetromino.I_SHAPE = Tetromino.fromString(`
  .....
  .....
  IIII.
  .....
  .....
  `)