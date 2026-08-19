export class Vector3D {
  public x: number
  public y: number
  public z: number

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x
    this.y = y
    this.z = z
  }

  set(x: number, y: number, z: number): this {
    this.x = x
    this.y = y
    this.z = z
    return this
  }

  add(v: Vector3D): Vector3D {
    return new Vector3D(this.x + v.x, this.y + v.y, this.z + v.z)
  }

  sub(v: Vector3D): Vector3D {
    return new Vector3D(this.x - v.x, this.y - v.y, this.z - v.z)
  }

  mul(s: number): Vector3D {
    return new Vector3D(this.x * s, this.y * s, this.z * s)
  }

  div(s: number): Vector3D {
    return new Vector3D(this.x / s, this.y / s, this.z / s)
  }

  dot(v: Vector3D): number {
    return this.x * v.x + this.y * v.y + this.z * v.z
  }

  length(): number {
    return Math.sqrt(this.dot(this))
  }

  normalized(): Vector3D {
    const len = this.length()
    if (len > 0) {
      return this.div(len)
    }
    return new Vector3D(0, 0, 0)
  }
}
