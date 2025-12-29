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
    return this.orientations[this.currentIndex].toString();
  }
  rotateRight() {
    const next = (this.currentIndex + 1) % this.orientations.length;
    return new Tetromino(next, this.orientations);
  }
  rotateLeft() {
    const len = this.orientations.length;
    const prev = (this.currentIndex - 1 + len) % len;
    return new Tetromino(prev, this.orientations);
  }
}
Tetromino.T_SHAPE = Tetromino.fromString(0, 4, `
    .T.
    TTT
    ...
    `)

Tetromino.I_SHAPE = Tetromino.fromString(0, 2, `
  .....
  .....
  IIII.
  .....
  .....
  `)
Tetromino.O_SHAPE = Tetromino.fromString(0, 1, `
  .OO
  .OO
  ...
  `)
Tetromino.L_SHAPE = Tetromino.fromString(0, 4, `
  ..L
  LLL
  ...
  `)
Tetromino.J_SHAPE = Tetromino.fromString(0, 4, `
  J..
  JJJ
  ...
  `)