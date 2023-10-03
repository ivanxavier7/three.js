import './style.css'
import * as THREE from 'three'
import { MeshBasicMaterial } from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

mesh.position.x = 0.7
mesh.position.y = - 0.6
mesh.position.z = 1

// Reduz a distancia do objeto ao vetor para uma unidade
mesh.position.normalize()

// position é um objeto Vector3 e apresenta varias propriedades do vector
console.log(mesh.position.length())

// Alterar vários eixos em simultâneo
mesh.position.set(0.7, -0.6, -0.5)

// Escala
mesh.scale.x = 1.5
mesh.scale.y = 0.5
mesh.scale.z = 0.5
mesh.scale.set(0.75, 1.25, 0.25)

// Diz qual é a ordem com que o objeto faz rotação
mesh.rotation.reorder('YXZ')
// Rotação
mesh.rotation.x = Math.PI * 0.2
mesh.rotation.y = Math.PI * 0.25
mesh.rotation.z = Math.PI * 2 // rotação total



// Criar eixos de ajuda, o parametro é o comprimento dos eixos em unidades
const axesHelper = new THREE.AxesHelper(3)
scene.add(axesHelper)

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 3
scene.add(camera)

// Distância entre dois objetos
console.log(mesh.position.distanceTo(camera.position))
console.log(mesh.position.distanceTo(new THREE.Vector3(0, 1, 2)))

// Olhar para um objeto
camera.lookAt(mesh.position)

// Criar um grupo que partilham as mesmas propriedades
const group = new THREE.Group()
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 0x00ff00})
)

group.add(cube1)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 0x00ffff})
)

cube2.position.x = - 2
group.add(cube2)

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 0x0000ff})
)

cube3.position.x = 2
group.add(cube3)

// mudar propriedades do grupo
group.position.y = 1
group.scale.y = 0.75
group.rotation.y = Math.PI * 0.75

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)