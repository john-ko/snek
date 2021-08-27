import { DIRECTION, Point } from './game-board'

export default class Snek {
  snek: Point[]
  direction: DIRECTION
  constructor(direction: DIRECTION) {
    // initialize snek with a few points
    this.snek = [
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 1, col: 3}
    ]

    this.direction = direction
  }

  hasPoint(row: number, col: number): boolean {
    for (let snekPoint of this.snek) {
      if (snekPoint.col === col && snekPoint.row === row) {
        return true
      }
    }

    return false
  }

  getNextDirection (currentDirection: DIRECTION) {
    let nextPosition: Point

    if (this.direction !== currentDirection) {
      this.direction = currentDirection
    }

    const snekPoints: Point = this.snek[this.snek.length - 1]
    const row = snekPoints.row
    const col = snekPoints.col

    if (this.direction === DIRECTION.UP) {
      nextPosition = { row: row - 1, col }
    } else if (this.direction === DIRECTION.DOWN) {
      nextPosition = { row: row + 1, col }
    } else if (this.direction === DIRECTION.LEFT) {
      nextPosition = { row, col: col - 1 }
    } else {
      nextPosition = { row, col: col + 1 }
    }

    return nextPosition
  }

  advanceOneFrame (point: Point, snekAte: boolean) {
    if (snekAte) {
      return this.snek.push(point)
    }

    const points = [...this.snek.slice(1, this.snek.length), point]

    this.snek = points
  }

  hasSnekAteItself (nextPosition: Point) {
    const col = nextPosition.col
    const row = nextPosition.row

    for (let [index, snekPoint] of this.snek.entries()) {
      if (snekPoint.col === col && snekPoint.row === row && index !== 0) {
        return true
      }
    }

    return false
  }


}