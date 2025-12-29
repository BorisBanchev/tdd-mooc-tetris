import { RotatingShape } from "./RotatingShape.mjs";

export class Tetromino {
  constructor(rotatingShape) {
    this._shape = rotatingShape
    Object.freeze(this)
  }
  static fromString(s) {
    return new Tetromino(RotatingShape.fromString(s))
  }
}