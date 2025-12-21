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
    const col = Math.floor(this.width / 2)
    this.falling = {value, row: 0, col};
    this.board[0][col] = value
  }
  tick() {
    if (!this.falling) return;
    const { row, col, value } = this.falling;
    if (row + 1 < this.height && this.board[row + 1][col] === null) {
      this.board[row][col] = null;
      this.board[row + 1][col] = value;
      this.falling.row = row + 1;
    } 
  }
  hasFalling(){
    return !!this.falling
  }
  toString() {
    return this.board.map((row) => row.map((cell) => (cell === null ? "." : cell)).join("")).join("\n") + "\n";
  }
}
