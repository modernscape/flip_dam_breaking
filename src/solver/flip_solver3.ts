// src/solver/flip_solver3.ts
import { Vector3D } from "../math/vector3"
import { Size3 } from "../utils/array3"
import { ParticleSystemData3 } from "../core/particle_system_data3"
import { GridSystemData3 } from "../core/grid_system_data3"

export class FlipSolver3 {
  private _particleSystemData: ParticleSystemData3
  private _gridSystemData: GridSystemData3
  private _gravity: Vector3D
  private _picFiltRatio: number // PICとFLIPのブレンド率 (通常 0.95〜0.98程度)

  constructor(resolution: Size3, gridSpacing: Vector3D, origin: Vector3D) {
    this._particleSystemData = new ParticleSystemData3()
    this._gridSystemData = new GridSystemData3(resolution, gridSpacing, origin)
    this._gravity = new Vector3D(0, -9.8, 0)
    this._picFiltRatio = 0.97
  }

  particleSystemData(): ParticleSystemData3 {
    return this._particleSystemData
  }

  gridSystemData(): GridSystemData3 {
    return this._gridSystemData
  }

  // ダムブレイク用の初期粒子配置
  addDamBreakParticles(
    regionMin: Vector3D,
    regionMax: Vector3D,
    spacing: number,
  ): void {
    const positions = this._particleSystemData.positions()
    const velocities = this._particleSystemData.velocities()

    for (let z = regionMin.z; z <= regionMax.z; z += spacing) {
      for (let y = regionMin.y; y <= regionMax.y; y += spacing) {
        for (let x = regionMin.x; x <= regionMax.x; x += spacing) {
          positions.push(new Vector3D(x, y, z))
          velocities.push(new Vector3D(0, 0, 0))
        }
      }
    }
    this._particleSystemData.resize(positions.length)
  }

  // 1ステップのシミュレーションを進める
  update(timeIntervalInSeconds: number): void {
    // 1. 重力の適用
    const velocities = this._particleSystemData.velocities()
    for (let i = 0; i < this._particleSystemData.numberOfParticles(); ++i) {
      velocities[i].x += this._gravity.x * timeIntervalInSeconds
      velocities[i].y += this._gravity.y * timeIntervalInSeconds
      velocities[i].z += this._gravity.z * timeIntervalInSeconds
    }

    // 2. 粒子の移動 (Advection)
    const positions = this._particleSystemData.positions()
    for (let i = 0; i < this._particleSystemData.numberOfParticles(); ++i) {
      positions[i].x += velocities[i].x * timeIntervalInSeconds
      positions[i].y += velocities[i].y * timeIntervalInSeconds
      positions[i].z += velocities[i].z * timeIntervalInSeconds

      // 簡易的な境界バウンド（床・壁の反射）
      const res = this._gridSystemData.resolution()
      const spacing = this._gridSystemData.gridSpacing()
      const origin = this._gridSystemData.origin()
      const maxX = origin.x + res.x * spacing.x
      const maxZ = origin.z + res.z * spacing.z

      if (positions[i].y < origin.y) {
        positions[i].y = origin.y
        velocities[i].y *= -0.3 // 反発係数
      }
      if (positions[i].x < origin.x) {
        positions[i].x = origin.x
        velocities[i].x *= -0.3
      } else if (positions[i].x > maxX) {
        positions[i].x = maxX
        velocities[i].x *= -0.3
      }
      if (positions[i].z < origin.z) {
        positions[i].z = origin.z
        velocities[i].z *= -0.3
      } else if (positions[i].z > maxZ) {
        positions[i].z = maxZ
        velocities[i].z *= -0.3
      }
    }
  }
}
