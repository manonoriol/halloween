import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader, GLTFParser } from 'three/examples/jsm/loaders/GLTFLoader'


/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Base
 */

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Models
 */


gltfLoader.load(
    '/models/pumpkin.gltf', (gltf) => {

        scene.add(gltf.scene);

        gltf.scene.children[1].visible = false; // Hide the mesh at index 1
        gltf.scene.children[2].visible = false; // Hide the mesh at index 2
        gltf.scene.children[3].visible = false; // Hide the mesh at index 3

        const pumpkin = gltf.scene.children[4];

        pumpkin.position.set(1.5, 0, 0.2);

        console.log(gltf.scene)

        }
    )


/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);
const spotLight = new THREE.SpotLight(0xffffff, 5); // Couleur blanche (0xffffff)
spotLight.position.set(6, 3, 0.2); // Position de la lumière
spotLight.distance = 10; // Distance d'éclairage
spotLight.angle = Math.PI / 4; // Angle du cône de lumière (en radians)
spotLight.penumbra = 0.2; // Penumbra (zone de transition douce du cône)
spotLight.decay = 2; // Atténuation de la lumière
scene.add(spotLight)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2.8, 0.7, 0)
scene.add(camera)
gui.add(camera.position, 'x').name('Z').min(- 0.5).max(4).step(0.001);
gui.add(camera.position, 'y').name('Y').min(- 0.5).max(2).step(0.001);
gui.add(camera.position, 'z').name('X').min(- 2).max(2).step(0.001);


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()