
/*
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;
*/
/* Code above isn't mandatory in threejs */

varying vec2 vUv;
uniform float uTime;

void main() {	
 
  vec4 localPosition = vec4(position, 1.0);
  vec4 worldPosition = modelMatrix * localPosition;
  vec4 modelViewPosition = viewMatrix * worldPosition;
  vec4 modelViewProjectionPosition = projectionMatrix * modelViewPosition;


  
  //vUv = uv;
 // localPosition.z = position.z + sin(position.y + uTime * 0.001) - 0.5;
 // localPosition.y = position.y + cos(position.z + uTime * 0.001) - 0.5;
 // localPosition.x = position.x + cos(position.x + uTime * 0.001);
 // vUv.y = cos(uTime);
  //gl_Position = projectionMatrix * modelViewMatrix * localPosition;
  //gl_Position = modelViewProjectionPosition; 
   //gl_Position = projectionMatrix * modelViewMatrix * localPosition;
   gl_Position =   localPosition;
}