import { RotatingShape } from "./RotatingShape.mjs";

export class Tetromino {
  constructor(rotatingShape) {
    this._shape = rotatingShape
    Object.freeze(this)
  }
  static fromString(s) {
    return new Tetromino(RotatingShape.fromString(s))
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