import * as THREE from 'three';
import { VertexShader } from './VertexShader';
import { FragmentShader } from './FragmentShader';

class ParticleEngine {

    position: THREE.Vector3 = new THREE.Vector3();
    velocity: THREE.Vector3 = new THREE.Vector3();
    color: THREE.Color = new THREE.Color();

    time: number = 0;
    PARTICLE_COUNT: number = 1000000;
    PARTICLE_CURSOR: number = 0;
    count: number = 0;

    texture: THREE.Texture;
    material: THREE.ShaderMaterial;
    geometry: THREE.BufferGeometry;

    add: any;
    spawn: any;
    update: any;

    constructor() {
        THREE.Object3D.apply(this);

        const textureLoader: THREE.TextureLoader = new THREE.TextureLoader();
        let particleNoiseTex = textureLoader.load('perlin-512.png');
        let particleSpriteTex = textureLoader.load('particle2.png');

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
            vertexShader: VertexShader,
            fragmentShader: FragmentShader,
            blending: THREE.AdditiveBlending
        })

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

}
ParticleEngine.prototype = Object.create(THREE.Object3D.prototype);
ParticleEngine.prototype.constructor = ParticleEngine;

ParticleEngine.prototype.spawn = function (options): void {

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

    velX = THREE.Math.clamp((velX - (- maxVel)) / (maxVel - (- maxVel)), 0, 1);
    velY = THREE.Math.clamp((velY - (- maxVel)) / (maxVel - (- maxVel)), 0, 1);
    velZ = THREE.Math.clamp((velZ - (- maxVel)) / (maxVel - (- maxVel)), 0, 1);

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

    if (this.PARTICLE_CURSOR >= this.PARTICLE_COUNT) this.PARTICLE_CURSOR = 0;

}

ParticleEngine.prototype.update = function (time: number): void {

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

}



export default ParticleEngine;