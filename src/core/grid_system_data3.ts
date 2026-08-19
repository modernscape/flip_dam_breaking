// src/core/grid_system_data3.ts
import { Vector3D } from "../math/vector3"
import { Size3, Array3 } from "../utils/array3"

export class GridSystemData3 {
  private _resolution: Size3
  private _gridSpacing: Vector3D
  private _origin: Vector3D

  // MACグリッド（フェイス中央速度場）
  // u: 境界を含めて x方向が +1 (resolution.x + 1, resolution.y, resolution.z)
  // v: 境界を含めて y方向が +1 (resolution.x, resolution.y + 1, resolution.z)
  // w: 境界を含めて z方向が +1 (resolution.x, resolution.y, resolution.z + 1)
  private _u: Array3<number>
  private _v: Array3<number>
  private _w: Array3<number>

  // 圧力場
  private _pressure: Array3<number>

  constructor(
    resolution: Size3 = new Size3(1, 1, 1),
    gridSpacing: Vector3D = new Vector3D(1, 1, 1),
    origin: Vector3D = new Vector3D(0, 0, 0),
  ) {
    this._resolution = resolution
    this._gridSpacing = gridSpacing
    this._origin = origin

    this._u = new Array3<number>(
      new Size3(resolution.x + 1, resolution.y, resolution.z),
      0,
    )
    this._v = new Array3<number>(
      new Size3(resolution.x, resolution.y + 1, resolution.z),
      0,
    )
    this._w = new Array3<number>(
      new Size3(resolution.x, resolution.y, resolution.z + 1),
      0,
    )
    this._pressure = new Array3<number>(resolution, 0)
  }

  resize(resolution: Size3, gridSpacing: Vector3D, origin: Vector3D): void {
    this._resolution = resolution
    this._gridSpacing = gridSpacing
    this._origin = origin

    this._u.resize(new Size3(resolution.x + 1, resolution.y, resolution.z), 0)
    this._v.resize(new Size3(resolution.x, resolution.y + 1, resolution.z), 0)
    this._w.resize(new Size3(resolution.x, resolution.y, resolution.z + 1), 0)
    this._pressure.resize(resolution, 0)
  }

  resolution(): Size3 {
    return this._resolution
  }

  gridSpacing(): Vector3D {
    return this._gridSpacing
  }

  origin(): Vector3D {
    return this._origin
  }

  uVelocity(): Array3<number> {
    return this._u
  }

  vVelocity(): Array3<number> {
    return this._v
  }

  wVelocity(): Array3<number> {
    return this._w
  }

  pressure(): Array3<number> {
    return this._pressure
  }
}
