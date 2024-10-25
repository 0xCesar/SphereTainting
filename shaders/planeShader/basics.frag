varying vec2 vUv;
uniform sampler2D diffuse;
uniform sampler2D diffuse2;
uniform sampler2D diffuse3;
uniform sampler2D diffusebg;
uniform float uTime; 



vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+10.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
  { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
// Permutations
  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
  }









void main() {
    vec2 newUV = vUv;
  //  newUV.x = abs(cos(uTime * 0.001) * 0.5);
    

    vec2 yellowUV = vUv * 0.5 + 0.5;
//   yellowUV.y = abs(sin(uTime * 0.001)* 0.5);

    vec2 blueUv = vUv;
//   blueUv.y = abs(sin(uTime * 0.001)* 0.5);

    // Mapping
    vec4 bgColor = texture(diffusebg, vUv);
    vec4 colors = texture(diffuse, blueUv);
    vec4 colors1 = texture(diffuse2, newUV);
    vec4 colors2 = texture(diffuse3, yellowUV);
    //Lumi
    float luminance = dot(colors, vec4(0.21,0.71,0.07,0.0));
    

    // Traitement de bleu : 
    vec4 refColorBlue = vec4(0.12, 0.36, 0.72, 1.0);
    float colourWeight = 1.0 - distance(colors, refColorBlue);
    colourWeight = smoothstep(0.45, 1.0, colourWeight);
    colors = mix(vec4(luminance), colors, colourWeight);

    // Traitement de rouge : 
    vec4 refColorRed1 = vec4(0.6078, 0.03, 0.06, 1.0);
    float colourWeight1 = 1.0 - distance(colors1, refColorRed1);
    colourWeight1 = smoothstep(0.45, 1.0, colourWeight1);
    colors1 = mix(vec4(luminance), colors1, colourWeight1);


    // Traitement de jaune : 
    vec4 refColorYellow = vec4(0.7647, 0.411, 0., 1.0);
     float colourWeight2 = 1.0 - distance(colors2, refColorYellow);
    colourWeight2 = smoothstep(0.45, 1.0, colourWeight2);
    colors2 = mix(vec4(luminance), colors2, colourWeight2);

   /* vec4 res = mix(colors, colors1, colors.w);
    res = mix(res, colors2, colors1.w);*/
   // res = mix(res, colors, colors.w);
    /*vec4 res = mix(colors, colors1, step(0.5, newUV.x));
    res = mix(res, colors2, step(0.5, yellowUV.x)); */
  /*  vec3 coords = vec2(vUv.x * 10., uTime*0.2);
    float noiseSample = cnoise(coords);
    vec3 colours = vec3(noiseSample);*/
    //gl_FragColor = res;
    //res = dot(res, vec4(0. ,0., 0.,0.));
  
    float noiseValue = 0.0;
    noiseValue = snoise(vec3(vUv + uTime * 0.0005, 1.0));

  //  vec4 res = mix(colors1, bgColor, step(noiseValue , colors1.w));
       vec4 res = mix(colors1, bgColor, step(noiseValue , colors1.g)); 
       res = mix(colors2, res, step(noiseValue , colors2.g));
    //  res = mix(colors, res, step(noiseValue , colors.g));
      // res = mix(colors, res, step(noiseValue , colors.w));
   // res = mix(res, colors2, step(noiseValue * -1., colors2.w));
  //  res = mix(res, bgColor, step(noiseValue, colors.w));
    //res = mix(res, vec3(0.5), step(noiseValue, v))
    //vec3 unaColor = vec3(noiseValue);
    gl_FragColor = res;
   // gl_FragColor = colors;
  // gl_FragColor = vec4(unaColor, 1.0);
    // gl_FragColor = vec4(colors.x +  cos(colors.z + uTime * 0.001), colors.y, colors.z  + sin(colors.y + uTime * 0.001), colors.w);
}