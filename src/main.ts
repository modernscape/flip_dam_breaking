// src/main.ts
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js" // 追加
import { Size3 } from "./utils/array3"
import { Vector3D } from "./math/vector3"
import { FlipSolver3 } from "./solver/flip_solver3"

// 1. シーン・カメラ・レンダラーの初期化
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x111111)

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// OrbitControls の初期化
const controls = new OrbitControls(camera, renderer.domElement)

// ライトの追加
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
directionalLight.position.set(10, 20, 10)
scene.add(directionalLight)

// 2. シミュレーション空間とソルバーの設定 (ダムブレイク)
const resolution = new Size3(20, 20, 20)
const gridSpacing = new Vector3D(0.2, 0.2, 0.2)
const origin = new Vector3D(-2, 0, -2)

const solver = new FlipSolver3(resolution, gridSpacing, origin)

// 初期水塊の配置（左側に偏ったブロック状の粒子群）
solver.addDamBreakParticles(
  new Vector3D(-1.8, 0.1, -1.8),
  new Vector3D(-0.5, 3.0, 0.5),
  0.15, // 粒子間隔
)

// 3. Three.js によるパーティクル（水滴）の描画オブジェクト作成
const particleCount = solver.particleSystemData().numberOfParticles()
const geometry = new THREE.BufferGeometry()
const positionsArray = new Float32Array(particleCount * 3)
geometry.setAttribute("position", new THREE.BufferAttribute(positionsArray, 3))

const material = new THREE.PointsMaterial({
  color: 0x3399ff,
  size: 0.12,
  transparent: true,
  opacity: 0.8,
})

const particlePoints = new THREE.Points(geometry, material)
scene.add(particlePoints)

// --- 立方体の中心を計算して画面中央＆回転の中心にする ---
const boxWidth = resolution.x * gridSpacing.x
const boxHeight = resolution.y * gridSpacing.y
const boxDepth = resolution.z * gridSpacing.z

const boxCenter = new THREE.Vector3(
  origin.x + boxWidth / 2,
  origin.y + boxHeight / 2,
  origin.z + boxDepth / 2,
)
controls.target.copy(boxCenter)
camera.position.set(boxCenter.x, boxCenter.y + 2, boxCenter.z + 10)
controls.update()

const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)
const boxEdges = new THREE.EdgesGeometry(boxGeometry)
const boxLine = new THREE.LineSegments(
  boxEdges,
  new THREE.LineBasicMaterial({ color: 0x444444 }),
)
boxLine.position.set(
  origin.x + boxWidth / 2,
  origin.y + boxHeight / 2,
  origin.z + boxDepth / 2,
)
scene.add(boxLine)

// 4. メインアニメーションループ
const timeStep = 0.016 // 固定タイムステップ (~60fps)

function animate() {
  requestAnimationFrame(animate)

  // シミュレーションを1ステップ進める
  solver.update(timeStep)

  // 粒子位置をThree.jsのバッファに同期
  const simPositions = solver.particleSystemData().positions()
  const posAttr = particlePoints.geometry.attributes
    .position as THREE.BufferAttribute

  for (let i = 0; i < particleCount; ++i) {
    posAttr.setXYZ(i, simPositions[i].x, simPositions[i].y, simPositions[i].z)
  }
  posAttr.needsUpdate = true

  // レンダリング
  renderer.render(scene, camera)
}

animate()

// ウィンドウリサイズ対応
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
