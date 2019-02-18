import * as THREE from 'three';
import { VertexShader } from './VertexShader';
import { FragmentShader } from './FragmentShader';
console.log(new THREE.Vector3())

class ParticleEngine {

  position: THREE.Vector3 = new THREE.Vector3();
  velocity: THREE.Vector3 = new THREE.Vector3();
  color: THREE.Color = new THREE.Color();
  time: number = 0;
  particles: number = 0;
  max: number = 10000;
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
    this.texture = textureLoader.load('particle.png');

    this.material = new THREE.ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      uniforms: {},
      vertexShader: VertexShader,
      fragmentShader: FragmentShader,
    })

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

}

ParticleEngine.prototype.spawn = function (): void {

  let positionStart = this.geometry.getAttribute('positionStart');
  let startTime = this.geometry.getAttribute('startTime');
  let velocity = this.geometry.getAttribute('velocity');
  let color = this.geometry.getAttribute('color');
  let size = this.geometry.getAttribute('size');
  let life = this.geometry.getAttribute('life');

  let i = this.particles;

  // Position
  positionStart.array[i * 3 + 0] = this.position.x + (Math.random());
  positionStart.array[i * 3 + 1] = this.position.y + (Math.random());
  positionStart.array[i * 3 + 2] = this.position.z + (Math.random());

  // Velocity
  let maxVel = 2;

  let velX = velocity.x + Math.random();
  let velY = velocity.y + Math.random();
  let velZ = velocity.z + Math.random();

  velocity.array[i * 3 + 0] = THREE.Math.clamp((velX - (- maxVel)) / (maxVel - (- maxVel)), 0, 1);;
  velocity.array[i * 3 + 1] = THREE.Math.clamp((velY - (- maxVel)) / (maxVel - (- maxVel)), 0, 1);;
  velocity.array[i * 3 + 2] = THREE.Math.clamp((velZ - (- maxVel)) / (maxVel - (- maxVel)), 0, 1);;

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

  if (this.particles > this.max) this.particles = 0;

}

ParticleEngine.prototype.update = function (time: number): void {

  this.time = time;
  this.material.uniforms.uTime = time;

  let positionStart = this.geometry.getAttribute('positionStart');
  let timeStart = this.geometry.getAttribute('timeStart');
  let velocity = this.geometry.getAttribute('velocity');
  let color = this.geometry.getAttribute('color');
  let size = this.geometry.getAttribute('size');
  let life = this.geometry.getAttribute('life');

  positionStart.needsUpdate = true;
  timeStart.needsUpdate = true;
  velocity.needsUpdate = true;
  color.needsUpdate = true;
  size.needsUpdate = true;
  life.needsUpdate = true;

  this.count = 0;

}

ParticleEngine.prototype = Object.create(THREE.Object3D.prototype);

export default ParticleEngine;