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
      const shape = value.orientations[value.currentIndex]
      const grid = shape.grid
      const shapeHeight = grid.length
      const shapeWidth = grid[0].length
      const col = Math.floor((this.width - shapeWidth) / 2)
      const row = 0
      this.falling = { value, row, col, shape}
      for (let r = 0; r < shapeHeight; r++) {
        for (let c = 0; c < shapeWidth; c++) {
          const character = grid[r][c];
          const boardRow = row + r;
          const boardColumn = col + c;
          if (ch !== "." && boardRow >= 0 && boardRow < this.height && boardColumn >= 0 && boardColumn < this.width) {
            this.board[boardRow][boardColumn] = character;
          }
        }
      }
    } else {
      const col = Math.floor(this.width / 2)
      this.falling = {value, row: 0, col};
      this.board[0][col] = value
    }
  }
  isTetromino(value) {
    return value && typeof value.currentIndex === "number" &&
      Array.isArray(value.orientations) && value.orientations[value.currentIndex] &&
      Array.isArray(value.orientations[value.currentIndex].grid)
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
