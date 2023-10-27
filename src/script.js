import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader, GLTFParser } from 'three/examples/jsm/loaders/GLTFLoader'

// const audio = new Audio('path-to-your-audio-file.mp3');



/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
gltfLoader.setDRACOLoader(dracoLoader);
const textureLoader = new THREE.TextureLoader();
const audioLoader = new THREE.AudioLoader();
const listener = new THREE.AudioListener();


/**
 * Audio
 */

const audio = new THREE.PositionalAudio(listener);

audioLoader.load('/audio/let-the-mystery-unfold.mp3', (buffer) => {
    audio.setBuffer(buffer);
    audio.setRefDistance(20); // Adjust this value as needed
    scene.add(audio);
});

// Play the audio when button is clicked

const btn = document.getElementById("btn");

let isAudioPlaying = false;

// Function to update the button text
function updateButtonText() {
    btn.innerHTML = isAudioPlaying ? "pause" : "play";
}

// Function to play the audio
updateButtonText();

btn.addEventListener('click', () => {
    if (isAudioPlaying) {
        audio.pause();
        isAudioPlaying = false;
    } else {
        audio.play();
        isAudioPlaying = true;
    }

    // Update the button text after the audio state changes
    updateButtonText();
});

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
 * Materials
 */

// const colorTexture = textureLoader.load('/textures/p-color.png');
// const normalTexture = textureLoader.load('/textures/p-normal.png');
// const roughnessTexture = textureLoader.load('/textures/p-roughness.png');

/**
 * Materials
 */


// const material = new THREE.MeshStandardMaterial({
//     map: colorTexture,
//     normalMap: normalTexture, // Apply the normal texture
//     roughnessMap: roughnessTexture, // Apply the roughness texture
//     roughness: 0.5, // Adjust the roughness value as needed
// });

/**
 * Models
 */

gltfLoader.load(
    '/models/pumpkin.gltf', (gltf) => {

        scene.add(gltf.scene);
        gltf.scene.children[0].visible = false; // Hide the mesh at index 1
        gltf.scene.children[1].visible = false; // Hide the mesh at index 1
        gltf.scene.children[2].visible = false; // Hide the mesh at index 2
        gltf.scene.children[3].visible = false; // Hide the mesh at index 3

        const pumpkin = gltf.scene.children[4];
        const pumpkinMaterial = gltf.scene.children[4].material;

        console.log(pumpkinMaterial)

        pumpkin.position.set(1.5, 0, 0.2);

        // console.log(gltf.scene)

        }
    )


/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);
const spotLight = new THREE.SpotLight(0xffffff, 5); // Couleur blanche (0xffffff)
spotLight.position.set(6, -0.15, 0.5); // Position de la lumière
spotLight.distance = 15; // Distance d'éclairage
spotLight.angle = Math.PI / 4; // Angle du cône de lumière (en radians)
spotLight.penumbra = 0.2; // Penumbra (zone de transition douce du cône)
spotLight.decay = 3; // Atténuation de la lumière
scene.add(spotLight)

gui.add(spotLight.position, 'x').name('spotLight Z').min(- 1).max(15).step(0.01);
gui.add(spotLight.position, 'y').name('spotLight Y').min(- 5).max(10).step(0.01);
gui.add(spotLight.position, 'z').name('spotLight X').min(- 5).max(10).step(0.01);



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
camera.add(listener);

gui.add(camera.position, 'x').name('camera Z').min(- 0.5).max(4).step(0.001);
gui.add(camera.position, 'y').name('camera Y').min(- 0.5).max(2).step(0.001);
gui.add(camera.position, 'z').name('camera X').min(- 2).max(2).step(0.001);

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