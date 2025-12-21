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
    for (let r = 0; r < this.height - 1; r++) 
      for (let c = 0; c < this.width; c++ ) 
        if (this.board[r][c] !== null && this.board[r + 1][c] === null) {
          this.board[r + 1][c] = this.board[r][c]
          this.board[r][c] = null
          return
        }
  }

  toString() {
    return this.board.map((row) => row.map((cell) => (cell === null ? "." : cell)).join("")).join("\n") + "\n";
  }
}
