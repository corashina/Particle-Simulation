import * as THREE from 'three';
import ParticleEngine from './ParticleEngine';

var camera: THREE.Camera,
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    particleSystem: any,
    options: any,
    tick: number = 0,
    clock: THREE.Clock = new THREE.Clock();

init();
animate();

function init(): void {
    camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 200;

    scene = new THREE.Scene();
    particleSystem = new ParticleEngine();

    scene.add(particleSystem);

    options = {
        position: new THREE.Vector3(),
        positionRandomness: .3,
        velocityRandomness: .5,
        colorRandomness: .2,
        lifetime: 1,
        size: 5,
        sizeRandomness: 1
    };

    renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('canvas') });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate(): void {

    requestAnimationFrame(animate);

    var delta = clock.getDelta();

    tick += delta;

    options.position.x = Math.sin(tick * 1.5) * 20;
    options.position.y = Math.cos(tick * 1.5) * 20;

    for (var i = 0; i < 10000 * delta; i++) particleSystem.spawn(options);

    particleSystem.update(tick);
    render();

}

function render(): void {

    renderer.render(scene, camera);

}