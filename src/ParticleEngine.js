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
        this.time = 0;
        this.PARTICLE_COUNT = 1000000;
        this.PARTICLE_CURSOR = 0;
        this.count = 0;
        THREE.Object3D.apply(this);
        var textureLoader = new THREE.TextureLoader();
        var particleNoiseTex = textureLoader.load('perlin-512.png');
        var particleSpriteTex = textureLoader.load('particle2.png');
        this.material = new THREE.ShaderMaterial({
            depthWrite: false,
            uniforms: {
                'uTime': {
                    value: 0.0
                },
                'uScale': {
                    value: 1.0
                },
                'tNoise': {
                    value: particleNoiseTex
                },
                'tSprite': {
                    value: particleSpriteTex
                }
            },
            vertexShader: VertexShader_1.VertexShader,
            fragmentShader: FragmentShader_1.FragmentShader,
            blending: THREE.AdditiveBlending
        });
        this.geometry = new THREE.BufferGeometry();
        this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.PARTICLE_COUNT * 3), 3));
        this.geometry.addAttribute('positionStart', new THREE.BufferAttribute(new Float32Array(this.PARTICLE_COUNT * 3), 3));
        this.geometry.addAttribute('startTime', new THREE.BufferAttribute(new Float32Array(this.PARTICLE_COUNT), 1));
        this.geometry.addAttribute('velocity', new THREE.BufferAttribute(new Float32Array(this.PARTICLE_COUNT * 3), 3));
        this.geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(this.PARTICLE_COUNT * 3), 3));
        this.geometry.addAttribute('size', new THREE.BufferAttribute(new Float32Array(this.PARTICLE_COUNT), 1));
        this.geometry.addAttribute('lifeTime', new THREE.BufferAttribute(new Float32Array(this.PARTICLE_COUNT), 1));
        this.add(new THREE.Points(this.geometry, this.material));
    }
    return ParticleEngine;
}());
ParticleEngine.prototype = Object.create(THREE.Object3D.prototype);
ParticleEngine.prototype.constructor = ParticleEngine;
ParticleEngine.prototype.spawn = function (options) {
    var positionStartAttribute = this.geometry.getAttribute('positionStart');
    var startTimeAttribute = this.geometry.getAttribute('startTime');
    var velocityAttribute = this.geometry.getAttribute('velocity');
    var colorAttribute = this.geometry.getAttribute('color');
    var sizeAttribute = this.geometry.getAttribute('size');
    var lifeTimeAttribute = this.geometry.getAttribute('lifeTime');
    options = options || {};
    // setup reasonable default values for all arguments
    this.position = options.position !== undefined ? this.position.copy(options.position) : this.position.set(0, 0, 0);
    this.velocity = options.velocity !== undefined ? this.velocity.copy(options.velocity) : this.velocity.set(0, 0, 0);
    this.color = options.color !== undefined ? this.color.set(options.color) : this.color.set(0xffffff);
    var positionRandomness = options.positionRandomness || 0;
    var velocityRandomness = options.velocityRandomness || 0;
    var colorRandomness = options.colorRandomness || 1;
    var lifetime = options.lifetime || 5;
    var size = options.size || 10;
    var sizeRandomness = options.sizeRandomness || 0;
    var i = this.PARTICLE_CURSOR;
    // position
    positionStartAttribute.array[i * 3 + 0] = this.position.x + (Math.random() * positionRandomness);
    positionStartAttribute.array[i * 3 + 1] = this.position.y + (Math.random() * positionRandomness);
    positionStartAttribute.array[i * 3 + 2] = this.position.z + (Math.random() * positionRandomness);
    // velocity
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
    // color
    this.color.r = THREE.Math.clamp(this.color.r + Math.random() * colorRandomness, 0, 1);
    this.color.g = THREE.Math.clamp(this.color.g + Math.random() * colorRandomness, 0, 1);
    this.color.b = THREE.Math.clamp(this.color.b + Math.random() * colorRandomness, 0, 1);
    colorAttribute.array[i * 3 + 0] = this.color.r;
    colorAttribute.array[i * 3 + 1] = this.color.g;
    colorAttribute.array[i * 3 + 2] = this.color.b;
    // turbulence, size, lifetime and starttime
    sizeAttribute.array[i] = size + Math.random() * sizeRandomness;
    lifeTimeAttribute.array[i] = lifetime;
    startTimeAttribute.array[i] = this.time + Math.random() * 2e-2;
    // counter and cursor
    this.count++;
    this.PARTICLE_CURSOR++;
    if (this.PARTICLE_CURSOR >= this.PARTICLE_COUNT)
        this.PARTICLE_CURSOR = 0;
};
ParticleEngine.prototype.update = function (time) {
    this.time = time;
    this.material.uniforms.uTime.value = time;
    var positionStartAttribute = this.geometry.getAttribute('positionStart');
    var startTimeAttribute = this.geometry.getAttribute('startTime');
    var velocityAttribute = this.geometry.getAttribute('velocity');
    var colorAttribute = this.geometry.getAttribute('color');
    var sizeAttribute = this.geometry.getAttribute('size');
    var lifeTimeAttribute = this.geometry.getAttribute('lifeTime');
    positionStartAttribute.needsUpdate = true;
    startTimeAttribute.needsUpdate = true;
    velocityAttribute.needsUpdate = true;
    colorAttribute.needsUpdate = true;
    sizeAttribute.needsUpdate = true;
    lifeTimeAttribute.needsUpdate = true;
    this.count = 0;
};
exports.default = ParticleEngine;
