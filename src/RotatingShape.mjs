export class RotatingShape {
  constructor(grid) {
    this.grid = grid.map(row => Array.from(row))
    this.grid.forEach(row => Object.freeze(row))
    Object.freeze(this.grid)
    Object.freeze(this)
  }
  static fromString(s) {
    const lines = s.split('\n').map(l => l.trim()).filter(l => l.length)
    const grid = lines.map(line => line.split(''))
    return new RotatingShape(grid)
  }
  toString() {
    return this.grid.map(row => row.join('')).join('\n') + '\n'
  }
  rotateRight() {
    const n = this.grid.length
    const m = this.grid[0].length
    const rotated = Array.from({ length: m}, (_, r) => Array.from({ length: n}, (_, c) => this.grid[n - 1 - c][r]))
    return new RotatingShape(rotated)
  }
  rotateLeft() {
    const n = this.grid.length
    const m = this.grid[0].length
    const rotated = Array.from({ length: m}, (_, r) => Array.from({ length: n}, (_, c) => this.grid[c][m - 1 - r]))
    return new RotatingShape(rotated)
  }
}