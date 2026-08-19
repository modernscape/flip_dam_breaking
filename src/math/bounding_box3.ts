// src/math/bounding_box3.ts
import { Vector3D } from "./vector3"

export class BoundingBox3D {
  public lowerCorner: Vector3D
  public upperCorner: Vector3D

  constructor(
    lowerCorner: Vector3D = new Vector3D(
      Number.MAX_VALUE,
      Number.MAX_VALUE,
      Number.MAX_VALUE,
    ),
    upperCorner: Vector3D = new Vector3D(
      -Number.MAX_VALUE,
      -Number.MAX_VALUE,
      -Number.MAX_VALUE,
    ),
  ) {
    this.lowerCorner = lowerCorner
    this.upperCorner = upperCorner
  }

  width(): number {
    return this.upperCorner.x - this.lowerCorner.x
  }

  height(): number {
    return this.upperCorner.y - this.lowerCorner.y
  }

  depth(): number {
    return this.upperCorner.z - this.lowerCorner.z
  }

  contains(point: Vector3D): boolean {
    return (
      point.x >= this.lowerCorner.x &&
      point.x <= this.upperCorner.x &&
      point.y >= this.lowerCorner.y &&
      point.y <= this.upperCorner.y &&
      point.z >= this.lowerCorner.z &&
      point.z <= this.upperCorner.z
    )
  }

  merge(pointOrBox: Vector3D | BoundingBox3D): void {
    if (pointOrBox instanceof Vector3D) {
      this.lowerCorner.x = Math.min(this.lowerCorner.x, pointOrBox.x)
      this.lowerCorner.y = Math.min(this.lowerCorner.y, pointOrBox.y)
      this.lowerCorner.z = Math.min(this.lowerCorner.z, pointOrBox.z)
      this.upperCorner.x = Math.max(this.upperCorner.x, pointOrBox.x)
      this.upperCorner.y = Math.max(this.upperCorner.y, pointOrBox.y)
      this.upperCorner.z = Math.max(this.upperCorner.z, pointOrBox.z)
    } else {
      this.lowerCorner.x = Math.min(
        this.lowerCorner.x,
        pointOrBox.lowerCorner.x,
      )
      this.lowerCorner.y = Math.min(
        this.lowerCorner.y,
        pointOrBox.lowerCorner.y,
      )
      this.lowerCorner.z = Math.min(
        this.lowerCorner.z,
        pointOrBox.lowerCorner.z,
      )
      this.upperCorner.x = Math.max(
        this.upperCorner.x,
        pointOrBox.upperCorner.x,
      )
      this.upperCorner.y = Math.max(
        this.upperCorner.y,
        pointOrBox.upperCorner.y,
      )
      this.upperCorner.z = Math.max(
        this.upperCorner.z,
        pointOrBox.upperCorner.z,
      )
    }
  }

  midPoint(): Vector3D {
    return new Vector3D(
      (this.lowerCorner.x + this.upperCorner.x) * 0.5,
      (this.lowerCorner.y + this.upperCorner.y) * 0.5,
      (this.lowerCorner.z + this.upperCorner.z) * 0.5,
    )
  }
}
