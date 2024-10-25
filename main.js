import * as THREE from 'three';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();
/* GLSL : Shader here */
const res = await fetch('shaders/basics.frag');
const fragShader = await res.text();

const resVrt = await fetch('shaders/basics.vert');
const vertShader = await resVrt.text();

const res1 = await fetch('shaders/planeShader/basics.frag');
const fragShader1 = await res1.text();

const resVrt1 = await fetch('shaders/planeShader/basics.vert');
const vertShader1 = await resVrt1.text();

/* Loader texture */
const loader = new THREE.TextureLoader();
const bmxTexture = loader.load('assets/map4.jpg');
const paintingTexture = loader.load('assets/blue-map.png');
const paintingTexture1 = loader.load('assets/red-map.png');
const paintingTexture2 = loader.load('assets/yellow-map.png');

const video = document.getElementById( 'video' );
const videoTexture = new THREE.VideoTexture(video);
//bmxTexture.wrapS = THREE.RepeatWrapping;
//bmxTexture.wrapT = THREE.RepeatWrapping;
//const bmxTexture = await loader.loadAsync('assets/img1.jpeg');

//console.log(bmxTexture)

const geometry = new THREE.BoxGeometry( 5, 5, 5 ); 
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const material1 = new THREE.ShaderMaterial({
    transparent : true,
    fragmentShader : fragShader,
    vertexShader : vertShader,
    uniforms: {
		diffuse: new THREE.Uniform(bmxTexture),
    uTime: new THREE.Uniform(0)
	},
  // transparent: true
})
const cube = new THREE.Mesh( geometry, material );
//scene.add( cube );
//console.log(geometry)
camera.position.z = 5;



const sizes = {
    width: window.innerWidth,
    height: (window.innerHeight / 100) * 70,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)
})

const geoPlane = new THREE.PlaneGeometry( 4,4, 12, 12 );
const matPlane = new THREE.ShaderMaterial({
  transparent : true,
  fragmentShader : fragShader1,
  vertexShader : vertShader1,
  uniforms: {
  diffuse: new THREE.Uniform(bmxTexture),
  diffuse2: new THREE.Uniform(paintingTexture1),
  diffuse3: new THREE.Uniform(paintingTexture2),
  bgColor:  new THREE.Uniform(paintingTexture),
  uTime: new THREE.Uniform(0)
  },
  side: THREE.DoubleSide
  // transparent: true
})
const plane = new THREE.Mesh( geoPlane, matPlane );
//scene.add( plane );


const geometrySpe = new THREE.SphereGeometry( 15, 32, 16 ); 
const materialSpe = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
const sphere = new THREE.Mesh( geometrySpe, matPlane ); scene.add( sphere );






//renderer.render( scene, camera ); 
let x = 0
function animate() {
  controls.update();
//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.01;
   // material.uniforms.uTime.value = performance.now();
    matPlane.uniforms.uTime.value = performance.now();
  //  console.log( material.uniforms.uTime.value )
	renderer.render( scene, camera ); 
}
renderer.setAnimationLoop( animate );
/*
window.addEventListener("click", (event) => {
  console.log(event)
});*/