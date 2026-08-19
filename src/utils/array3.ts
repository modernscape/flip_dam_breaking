// src/utils/array3.ts

export class Size3 {
  public x: number
  public y: number
  public z: number

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x
    this.y = y
    this.z = z
  }
}

export class Array3<T> {
  private _data: T[]
  private _size: Size3

  constructor(size: Size3 = new Size3(), initVal: T = null as unknown as T) {
    this._size = size
    const totalSize = size.x * size.y * size.z
    this._data = new Array<T>(totalSize).fill(initVal)
  }

  resize(size: Size3, initVal: T = null as unknown as T): void {
    this._size = size
    const totalSize = size.x * size.y * size.z
    this._data = new Array<T>(totalSize).fill(initVal)
  }

  width(): number {
    return this._size.x
  }

  height(): number {
    return this._size.y
  }

  depth(): number {
    return this._size.z
  }

  size(): Size3 {
    return this._size
  }

  index(i: number, j: number, k: number): number {
    return i + this._size.x * (j + this._size.y * k)
  }

  at(i: number, j: number, k: number): T {
    return this._data[this.index(i, j, k)]
  }

  set(i: number, j: number, k: number, val: T): void {
    this._data[this.index(i, j, k)] = val
  }

  forEachIndex(callback: (i: number, j: number, k: number) => void): void {
    for (let k = 0; k < this._size.z; ++k) {
      for (let j = 0; j < this._size.y; ++j) {
        for (let i = 0; i < this._size.x; ++i) {
          callback(i, j, k)
        }
      }
    }
  }
}
