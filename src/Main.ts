import * as THREE from 'three';
import ParticleEngine from './ParticleEngine';

var camera: THREE.PerspectiveCamera,
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    particleSystem: any,
    options: any,
    tick: number = 0,
    clock: THREE.Clock = new THREE.Clock();

init();
animate();

function init(): void {

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 100;
    scene = new THREE.Scene();

    particleSystem = new ParticleEngine();
    scene.add(particleSystem);

    renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('canvas') });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    window.addEventListener('resize', onWindowResize, false);

}

function animate(): void {

    requestAnimationFrame(animate);

    var delta = clock.getDelta();

    tick += delta;

    for (var i = 0; i < 1000 * delta; i++) particleSystem.spawn(options);

    particleSystem.update(tick);
    render();

}

function render(): void {

    renderer.render(scene, camera);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}