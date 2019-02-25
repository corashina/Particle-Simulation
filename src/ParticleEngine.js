"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = __importStar(require("three"));
var VertexShader_1 = require("./VertexShader");
var FragmentShader_1 = require("./FragmentShader");
var ParticleEngine = /** @class */ (function () {
    function ParticleEngine() {
        this.position = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        this.color = new THREE.Color();
        this.limit = 1000000;
        this.particles = 0;
        this.count = 0;
        this.time = 0;
        this.constructor();
    }
    return ParticleEngine;
}());
ParticleEngine.prototype = Object.create(THREE.Object3D.prototype);
ParticleEngine.prototype.constructor = function () {
    THREE.Object3D.apply(this);
    var textureLoader = new THREE.TextureLoader();
    var particleSpriteTex = textureLoader.load('particle2.png');
    this.material = new THREE.ShaderMaterial({
        uniforms: {
            'uTime': {
                value: 0.0
            },
            'uScale': {
                value: 1.0
            },
            'tSprite': {
                value: particleSpriteTex
            }
        }
    });
    this.material.depthWrite = false;
    this.material.vertexShader = VertexShader_1.VertexShader;
    this.material.fragmentShader = FragmentShader_1.FragmentShader;
    this.material.blending = THREE.NoBlending;
    this.geometry = new THREE.BufferGeometry();
    this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.limit * 3), 3));
    this.geometry.addAttribute('positionStart', new THREE.BufferAttribute(new Float32Array(this.limit * 3), 3));
    this.geometry.addAttribute('startTime', new THREE.BufferAttribute(new Float32Array(this.limit), 1));
    this.geometry.addAttribute('velocity', new THREE.BufferAttribute(new Float32Array(this.limit * 3), 3));
    this.geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(this.limit * 3), 3));
    this.geometry.addAttribute('size', new THREE.BufferAttribute(new Float32Array(this.limit), 1));
    this.geometry.addAttribute('life', new THREE.BufferAttribute(new Float32Array(this.limit), 1));
    this.add(new THREE.Points(this.geometry, this.material));
};
ParticleEngine.prototype.spawn = function (options) {
    var positionStartAttribute = this.geometry.getAttribute('positionStart');
    var startTimeAttribute = this.geometry.getAttribute('startTime');
    var velocityAttribute = this.geometry.getAttribute('velocity');
    var colorAttribute = this.geometry.getAttribute('color');
    var sizeAttribute = this.geometry.getAttribute('size');
    var lifeAttribute = this.geometry.getAttribute('life');
    options = options || {};
    this.position = options.position !== undefined ? this.position.copy(options.position) : this.position.set(0, 0, 0);
    this.velocity = new THREE.Vector3();
    this.color = this.color.set(0xff0000);
    var positionRandomness = options.positionRandomness || 0;
    var velocityRandomness = options.velocityRandomness || 0;
    var colorRandomness = options.colorRandomness || 1;
    var life = options.life || 5;
    var size = options.size || 10;
    var sizeRandomness = options.sizeRandomness || 0;
    var i = this.particles;
    // Position
    positionStartAttribute.array[i * 3 + 0] = this.position.x + (Math.random() * positionRandomness);
    positionStartAttribute.array[i * 3 + 1] = this.position.y + (Math.random() * positionRandomness);
    positionStartAttribute.array[i * 3 + 2] = this.position.z + (Math.random() * positionRandomness);
    // Velocity
    var maxVel = 2;
    var velX = this.velocity.x + Math.random() * velocityRandomness;
    var velY = this.velocity.y + Math.random() * velocityRandomness;
    var velZ = this.velocity.z + Math.random() * velocityRandomness;
    velX = THREE.Math.clamp((velX - (-maxVel)) / (maxVel - (-maxVel)), 0, 1);
    velY = THREE.Math.clamp((velY - (-maxVel)) / (maxVel - (-maxVel)), 0, 1);
    velZ = THREE.Math.clamp((velZ - (-maxVel)) / (maxVel - (-maxVel)), 0, 1);
    velocityAttribute.array[i * 3 + 0] = velX;
    velocityAttribute.array[i * 3 + 1] = velY;
    velocityAttribute.array[i * 3 + 2] = velZ;
    // Color
    this.color.r = THREE.Math.clamp(this.color.r + Math.random() * colorRandomness, 0, 1);
    this.color.g = THREE.Math.clamp(this.color.g + Math.random() * colorRandomness, 0, 1);
    this.color.b = THREE.Math.clamp(this.color.b + Math.random() * colorRandomness, 0, 1);
    colorAttribute.array[i * 3 + 0] = this.color.r;
    colorAttribute.array[i * 3 + 1] = this.color.g;
    colorAttribute.array[i * 3 + 2] = this.color.b;
    // turbulence, size, life and starttime
    sizeAttribute.array[i] = size + Math.random() * sizeRandomness;
    lifeAttribute.array[i] = life;
    startTimeAttribute.array[i] = this.time + Math.random() * 2e-2;
    // Count
    this.particles++;
    this.count++;
    if (this.particles >= this.limit)
        this.particles = 0;
};
ParticleEngine.prototype.update = function (time) {
    this.time = time;
    this.material.uniforms.uTime.value = time;
    this.geometry.getAttribute('positionStart').needsUpdate = true;
    this.geometry.getAttribute('startTime').needsUpdate = true;
    this.geometry.getAttribute('velocity').needsUpdate = true;
    this.geometry.getAttribute('color').needsUpdate = true;
    this.geometry.getAttribute('size').needsUpdate = true;
    this.geometry.getAttribute('life').needsUpdate = true;
    this.count = 0;
};
exports.default = ParticleEngine;
