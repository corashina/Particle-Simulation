import * as THREE from 'three';
import ParticleEngine from './ParticleEngine';

var camera: THREE.Camera,
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    particleSystem: any,
    options: any,
    spawnerOptions: any;
var tick: number = 0, clock: THREE.Clock = new THREE.Clock();

init();
animate();

function init(): void {
    camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 100;

    scene = new THREE.Scene();
    particleSystem = new ParticleEngine();
    console.log(particleSystem)

    scene.add(particleSystem);

    options = {
        position: new THREE.Vector3(),
        positionRandomness: .3,
        velocity: new THREE.Vector3(),
        velocityRandomness: .5,
        color: 0xaa88ff,
        colorRandomness: .2,
        lifetime: 2,
        size: 5,
        sizeRandomness: 1
    };

    spawnerOptions = {
        spawnRate: 15000,
        horizontalSpeed: 1.5,
        verticalSpeed: 1.33,
    };

    renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('canvas') });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate(): void {

    requestAnimationFrame(animate);

    // var delta = clock.getDelta();
    // tick += delta;
    // if (tick < 0) tick = 0;
    // if (delta > 0) {
    //     options.position.x = Math.sin(tick * spawnerOptions.horizontalSpeed) * 20;
    //     options.position.y = Math.sin(tick * spawnerOptions.verticalSpeed) * 10;
    //     options.position.z = Math.sin(tick * spawnerOptions.horizontalSpeed + spawnerOptions.verticalSpeed) * 5;
    //     for (var x = 0; x < spawnerOptions.spawnRate * delta; x++) particleSystem.spawnParticle(options);
    // }
    // particleSystem.update(tick);
    render();

}

function render(): void {

    renderer.render(scene, camera);

}