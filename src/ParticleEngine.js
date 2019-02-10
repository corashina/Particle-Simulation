"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var VertexShader_1 = require("./VertexShader");
var FragmentShader_1 = require("./FragmentShader");
var THREE = __importStar(require("three"));
var ParticleEngine = /** @class */ (function () {
    function ParticleEngine() {
        this.position = new THREE.Color();
        this.velocity = new THREE.Vector3();
        this.color = new THREE.Vector3();
        this.time = 0;
        this.particles = 0;
        this.max = 10000;
        this.count = 0;
        THREE.Object3D.apply(this);
        var textureLoader = new THREE.TextureLoader();
        this.texture = textureLoader.load('particle.png');
        this.material = new THREE.ShaderMaterial({
            depthTest: false,
            depthWrite: false,
            uniforms: {},
            vertexShader: VertexShader_1.VertexShader,
            fragmentShader: FragmentShader_1.FragmentShader,
        });
        this.geometry = new THREE.BufferGeometry();
        this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.particles * 3), 3));
        this.geometry.addAttribute('positionStart', new THREE.BufferAttribute(new Float32Array(this.particles * 3), 3));
        this.geometry.addAttribute('startTime', new THREE.BufferAttribute(new Float32Array(this.particles), 1));
        this.geometry.addAttribute('velocity', new THREE.BufferAttribute(new Float32Array(this.particles * 3), 3));
        this.geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(this.particles * 3), 3));
        this.geometry.addAttribute('size', new THREE.BufferAttribute(new Float32Array(this.particles), 1));
        this.geometry.addAttribute('life', new THREE.BufferAttribute(new Float32Array(this.particles), 1));
        this.add(new THREE.Points(this.geometry, this.material));
    }
    return ParticleEngine;
}());
ParticleEngine.prototype.spawn = function () {
    var positionStart = this.geometry.getAttribute('positionStart');
    var startTime = this.geometry.getAttribute('startTime');
    var velocity = this.geometry.getAttribute('velocity');
    var color = this.geometry.getAttribute('color');
    var size = this.geometry.getAttribute('size');
    var life = this.geometry.getAttribute('life');
    var i = this.particles;
    // Position
    positionStart.array[i * 3 + 0] = this.position.x + (Math.random());
    positionStart.array[i * 3 + 1] = this.position.y + (Math.random());
    positionStart.array[i * 3 + 2] = this.position.z + (Math.random());
    // Velocity
    var maxVel = 2;
    var velX = velocity.x + Math.random();
    var velY = velocity.y + Math.random();
    var velZ = velocity.z + Math.random();
    velocity.array[i * 3 + 0] = THREE.Math.clamp((velX - (-maxVel)) / (maxVel - (-maxVel)), 0, 1);
    ;
    velocity.array[i * 3 + 1] = THREE.Math.clamp((velY - (-maxVel)) / (maxVel - (-maxVel)), 0, 1);
    ;
    velocity.array[i * 3 + 2] = THREE.Math.clamp((velZ - (-maxVel)) / (maxVel - (-maxVel)), 0, 1);
    ;
    // Color
    color.r = THREE.Math.clamp(color.r + Math.random(), 0, 1);
    color.g = THREE.Math.clamp(color.g + Math.random(), 0, 1);
    color.b = THREE.Math.clamp(color.b + Math.random(), 0, 1);
    color.array[i * 3 + 0] = color.r;
    color.array[i * 3 + 1] = color.g;
    color.array[i * 3 + 2] = color.b;
    // Size
    size.array[i] = size + Math.random();
    life.array[i] = life;
    startTime.array[i] = this.time + Math.random() * 2e-2;
    this.count++;
    this.particles++;
    if (this.particles > this.max)
        this.particles = 0;
};
ParticleEngine.prototype.update = function (time) {
    this.time = time;
    this.material.uniforms.uTime = time;
    var positionStart = this.geometry.getAttribute('positionStart');
    var timeStart = this.geometry.getAttribute('timeStart');
    var velocity = this.geometry.getAttribute('velocity');
    var color = this.geometry.getAttribute('color');
    var size = this.geometry.getAttribute('size');
    var life = this.geometry.getAttribute('life');
    positionStart.needsUpdate = true;
    timeStart.needsUpdate = true;
    velocity.needsUpdate = true;
    color.needsUpdate = true;
    size.needsUpdate = true;
    life.needsUpdate = true;
    this.count = 0;
};
ParticleEngine.prototype = Object.create(THREE.Object3D.prototype);
