import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader, GLTFParser } from 'three/examples/jsm/loaders/GLTFLoader'

/**
 * LOADERS
 */
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
gltfLoader.setDRACOLoader(dracoLoader);
const textureLoader = new THREE.TextureLoader();
const audioLoader = new THREE.AudioLoader();
const listener = new THREE.AudioListener();

/**
 * AUDIO
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
 * BASE
 */

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// // Create an AxesHelper
// const axesHelper = new THREE.AxesHelper(5); // Adjust the size as needed

// // Add the axesHelper to your scene
// scene.add(axesHelper);

/**
 * MODELS
 */

gltfLoader.load(
    '/models/pumpkin.gltf', (gltf) => {

        scene.add(gltf.scene);
        // gltf.scene.rotation.y = - (Math.PI * 0.5);
        gltf.scene.children[0].visible = false; // Hide the mesh at index 1
        gltf.scene.children[1].visible = false; // Hide the mesh at index 1
        gltf.scene.children[2].visible = false; // Hide the mesh at index 2
        gltf.scene.children[3].visible = false; // Hide the mesh at index 3
        // gltf.scene.scale(0.5, 0.5, 0.5);

        const pumpkin = gltf.scene.children[4];
        pumpkin.receiveShadow = true;
        pumpkin.castShadow = true;
        pumpkin.position.set(0, - 0.3, 0.15);
        // pumpkin.rotation.y = - (Math.PI * 0.5);
        // pumpkin.rotation.z = - 0.2
        console.log(pumpkin.position)
        console.log(gltf.scene)

        }
    )

/**
 * PARTICLES
 */

const particleTexture = textureLoader.load('/textures/trace_06.png');

const particleMaterial = new THREE.PointsMaterial({
    color: 0xaa4203,
    size: 0.05, // Adjust the size as needed
    alphaMap: particleTexture, // You can use a texture for a more realistic appearance
    blending: THREE.AdditiveBlending, // Additive blending works well for particles
    transparent: true,
    depthWrite: false,
    sizeAttenuation: true
});

const particleGeometry = new THREE.BufferGeometry();
const count = 2000;
const positions = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particles = new THREE.Points(particleGeometry, particleMaterial);

scene.add(particles);

/**
 * LIGHTS
 */
// const ambientLight = new THREE.AmbientLight(0xffca7b, 0.3);
// scene.add(ambientLight);
const spotLight = new THREE.SpotLight(0xffffff, 4); // Couleur blanche (0xffffff)
spotLight.position.set(6, -0.15, 0.5); // Position de la lumière
spotLight.distance = 15; // Distance d'éclairage
spotLight.angle = Math.PI / 4; // Angle du cône de lumière (en radians)
spotLight.penumbra = 0.2; // Penumbra (zone de transition douce du cône)
spotLight.decay = 3; // Atténuation de la lumière
spotLight.normalBias = 0.05;
scene.add(spotLight)

const fireLight = new THREE.PointLight(0xe47025, 2, 100);
fireLight.position.set(0, 0.34, 0.15);
scene.add(fireLight);

// Set the initial light intensity for your fireLight
let baseIntensity = 1;

// Function to update the fireLight intensity with flickering effect
function updateLightIntensity() {
  // Add random fluctuations to the intensity
  const randomFactor = 0.2; // Adjust this value for the desired flicker intensity
  const randomIntensity = baseIntensity + (Math.random() * randomFactor - randomFactor / 2);
  fireLight.intensity = randomIntensity;

  // Schedule the next intensity update
  const flickerDelay = Math.random() * 500; // Adjust this value for the desired flicker frequency
  setTimeout(updateLightIntensity, flickerDelay);
};

// Start the flickering effect for your fireLight
updateLightIntensity();


// gui.add(spotLight.position, 'x').name('spotLight Z').min(- 1).max(15).step(0.01);
// gui.add(spotLight.position, 'y').name('spotLight Y').min(- 5).max(10).step(0.01);
// gui.add(spotLight.position, 'z').name('spotLight X').min(- 5).max(10).step(0.01);

// gui.add(fireLight.position, 'x').name('FLight Z').min(- 3).max(4).step(0.001);
// gui.add(fireLight.position, 'y').name('FLight Y').min(- 5).max(4).step(0.001);
// gui.add(fireLight.position, 'z').name('FLight X').min(- 5).max(4).step(0.001);


/**
 * SIZES
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
 * CAMERA
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1.6, 0.4, 0)
scene.add(camera)
camera.add(listener);

// gui.add(camera.position, 'x').name('camera X').min(- 0.5).max(4).step(0.001);
// gui.add(camera.position, 'y').name('camera Y').min(- 0.5).max(2).step(0.001);
// gui.add(camera.position, 'z').name('camera Z').min(- 2).max(10).step(0.001);

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * RENDERER
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * ANIMATE
 */

const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update particles position
    particles.position.y = elapsedTime * 0.03;
    
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();