export class RotatingShape {
  constructor(grid) {
    this.grid = grid
  }
  static fromString(s) {
    const lines = s.split('\n').map(l => l.trim()).filter(l => l.length)
    const grid = lines.map(line => line.split(''))
    return new RotatingShape(grid)
  }
  toString() {
    return this.grid.map(row => row.join('')).join('\n') + '\n'
  }
}