"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = __importStar(require("three"));
var ParticleEngine_1 = __importDefault(require("./ParticleEngine"));
var camera, scene, renderer, particleSystem, options, spawnerOptions;
var tick = 0, clock = new THREE.Clock();
init();
animate();
function init() {
    camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 200;
    scene = new THREE.Scene();
    particleSystem = new ParticleEngine_1.default();
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
function animate() {
    requestAnimationFrame(animate);
    var delta = clock.getDelta();
    tick += delta;
    if (tick < 0)
        tick = 0;
    if (delta > 0) {
        options.position.x = Math.sin(tick * spawnerOptions.horizontalSpeed) * 20;
        options.position.y = Math.sin(tick * spawnerOptions.verticalSpeed) * 10;
        options.position.z = Math.sin(tick * spawnerOptions.horizontalSpeed + spawnerOptions.verticalSpeed) * 5;
        for (var x = 0; x < spawnerOptions.spawnRate * delta; x++) {
            particleSystem.spawn(options);
        }
    }
    particleSystem.update(tick);
    render();
}
function render() {
    renderer.render(scene, camera);
}
