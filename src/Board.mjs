export class Board {
  width;
  height;

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.board = Array.from({ length: height }, () => Array.from({ length: width }, () => null));
    this.falling = null
  }

  drop(value) {
    if (this.falling) throw new Error("already falling")
    if (this.isTetromino(value)){
      this.dropTetromino(value)
    } else {
      this.dropBlock(value)
    }
  }
  isTetromino(value) {
    return value && typeof value.currentIndex === "number" &&
      Array.isArray(value.orientations) && value.orientations[value.currentIndex] &&
      Array.isArray(value.orientations[value.currentIndex].grid)
  }
  dropTetromino(tetromino){
    const shape = tetromino.orientations[tetromino.currentIndex];
    const { height: shapeHeight, width: shapeWidth } = this.getShapeDimensions(shape);
    const col = Math.floor((this.width - shapeWidth) / 2);
    const row = 0;
    this.falling = { value: tetromino, row, col, shape };
    this.placeShape(shape, row, col);
  }
  dropBlock(value) {
    const col = Math.floor(this.width / 2);
    this.falling = { value, row: 0, col };
    this.board[0][col] = value;
  }
  getShapeDimensions(shape) {
    const grid = shape.grid;
    return { height: grid.length, width: grid[0].length };
  }
  tick() {
    if (!this.falling) return;
    const { row, col, value } = this.falling;
    if (row + 1 < this.height && this.board[row + 1][col] === null) {
      this.board[row][col] = null;
      this.board[row + 1][col] = value;
      this.falling.row = row + 1;
    } else {
      this.falling = null
    }
  }
  hasFalling(){
    return !!this.falling
  }
  toString() {
    return this.board.map((row) => row.map((cell) => (cell === null ? "." : cell)).join("")).join("\n") + "\n";
  }
}
