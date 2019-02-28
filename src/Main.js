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
var camera, scene, renderer, particleSystem, options, tick = 0, clock = new THREE.Clock();
init();
animate();
function init() {
    camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 200;
    scene = new THREE.Scene();
    particleSystem = new ParticleEngine_1.default();
    scene.add(particleSystem);
    renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('canvas') });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
    requestAnimationFrame(animate);
    var delta = clock.getDelta();
    tick += delta;
    for (var i = 0; i < 1000 * delta; i++)
        particleSystem.spawn(options);
    particleSystem.update(tick);
    render();
}
function render() {
    renderer.render(scene, camera);
}
