// src/core/particle_system_data3.ts
import { Vector3D } from "../math/vector3"

export class ParticleSystemData3 {
  private _positions: Vector3D[]
  private _velocities: Vector3D[]
  private _forces: Vector3D[]

  constructor(numberOfParticles: number = 0) {
    this._positions = new Array<Vector3D>(numberOfParticles)
    this._velocities = new Array<Vector3D>(numberOfParticles)
    this._forces = new Array<Vector3D>(numberOfParticles)

    for (let i = 0; i < numberOfParticles; ++i) {
      this._positions[i] = new Vector3D()
      this._velocities[i] = new Vector3D()
      this._forces[i] = new Vector3D()
    }
  }

  numberOfParticles(): number {
    return this._positions.length
  }

  resize(numberOfParticles: number): void {
    const oldNum = this.numberOfParticles()
    this._positions.length = numberOfParticles
    this._velocities.length = numberOfParticles
    this._forces.length = numberOfParticles

    for (let i = oldNum; i < numberOfParticles; ++i) {
      this._positions[i] = new Vector3D()
      this._velocities[i] = new Vector3D()
      this._forces[i] = new Vector3D()
    }
  }

  positions(): Vector3D[] {
    return this._positions
  }

  velocities(): Vector3D[] {
    return this._velocities
  }

  forces(): Vector3D[] {
    return this._forces
  }

  addParticle(
    position: Vector3D,
    velocity: Vector3D = new Vector3D(),
    force: Vector3D = new Vector3D(),
  ): void {
    this._positions.push(new Vector3D(position.x, position.y, position.z))
    this._velocities.push(new Vector3D(velocity.x, velocity.y, velocity.z))
    this._forces.push(new Vector3D(force.x, force.y, force.z))
  }
}
