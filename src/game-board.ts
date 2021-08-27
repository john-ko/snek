import Snek from './snek'

const MIN_GAMEBOARD_SIZE = 15
const MS_TIMEOUT = 400

export interface Point {
  row: number
  col: number
}

export const enum DIRECTION {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  DOWN = 'DOWN',
  UP = 'UP'
}

const OPPOSITE: { [key: string]: DIRECTION } = {
  'up': DIRECTION.DOWN,
  'down': DIRECTION.UP,
  'left': DIRECTION.RIGHT,
  'right': DIRECTION.LEFT
}

const EZ_DIRECTION: { [key: string]: DIRECTION } = {
  'up': DIRECTION.UP,
  'down': DIRECTION.DOWN,
  'left': DIRECTION.LEFT,
  'right': DIRECTION.RIGHT
}

export default class GameBoard {
  row: number
  col: number
  gameOver: boolean
  snek: Snek
  food: Point
  direction: DIRECTION
  hasSnekAte: boolean

  constructor(row?: number, col?: number) {
    this.row = GameBoard.validateSize(row)
    this.col = GameBoard.validateSize(col)
    this.gameOver = false
    this.direction = DIRECTION.RIGHT
    this.snek = new Snek(this.direction)
    this.food = this.generateFood()
    this.hasSnekAte = false
  }

  public static validateSize (num?: number): number {
    if (!num) {
      return MIN_GAMEBOARD_SIZE
    }

    if (num < 6) {
      return MIN_GAMEBOARD_SIZE
    }

    return num
  }

  async start () {
    while(!this.gameOver) {
      console.clear()
      this.print()
      await this.wait()
      this.gameLoop()
    }

    process.stdin.pause();
  }

  gameLoop () {
    if (this.hasSnekAte) {
      console.log('this.hasSnekAte',this.hasSnekAte)
      this.food = this.generateFood()
      this.hasSnekAte = false
    }

    const point = this.snek.getNextDirection(this.direction)
    const snekAteItself = this.snek.hasSnekAteItself(point)
    const snekOutOfBounds = this.isOutOfBounds(point)

    if (snekAteItself || snekOutOfBounds) {
      let message = 'Game ober, snek ded'

      if (snekOutOfBounds) {
        message += ' it ran away'
      }

      console.log(message)
      this.gameOver = true
      return
    }

    if (point.col === this.food.col && point.row === this.food.row) {
      this.hasSnekAte = true
    }

    this.snek.advanceOneFrame(point, this.hasSnekAte)
  }

  isOutOfBounds (point: Point) {
    if (point.col < 0 || point.row < 0) {
      return true
    }

    if (point.col > (this.col - 1) || point.row > (this.row - 1)) {
      return true
    }

    return false
  }

  generateFood (): Point {
    let row = 0
    let col = 0
    do {
      row = this.getRandomInt(this.row)
      col = this.getRandomInt(this.col)
    } while (this.snek.hasPoint(row, col))

    return { row, col }
  }

  print () {
    for (let row = 0; row < this.row; row++) {
      for (let col = 0; col < this.col; col++) {
        let square = '.'

        if (this.food.col === col && this.food.row === row) {
          square = 'o'
        }

        if (this.snek.hasPoint(row, col)) {
          square = '■'
        }

        process.stdout.write(square)
      }
      process.stdout.write('\n')
    }
  }

  wait () {
    return new Promise(resolve => setTimeout(resolve, MS_TIMEOUT))
  }

  getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }

  updateDirection(key: any) {
    const name = key.name
    // safegaurd 1: you cannot go back
    if (EZ_DIRECTION[name] && OPPOSITE[name] !== this.direction) {
      this.direction = EZ_DIRECTION[name]
    }
  }
}
