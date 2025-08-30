'use client';

import { useEffect, useRef } from 'react';
import { Renderer, Camera, Transform, Geometry, Program, Mesh } from 'ogl';

const vertexShader = `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;
  
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
  
  void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    st.x *= uResolution.x / uResolution.y;
    
    vec2 pos = st * 3.0;
    
    float time = uTime * 0.5;
    
    // Create flowing iridescent pattern
    float wave1 = sin(pos.x * 2.0 + time) * 0.5 + 0.5;
    float wave2 = sin(pos.y * 3.0 + time * 1.2) * 0.5 + 0.5;
    float wave3 = sin((pos.x + pos.y) * 1.5 + time * 0.8) * 0.5 + 0.5;
    
    // Combine waves for complex pattern
    float pattern = (wave1 + wave2 + wave3) / 3.0;
    
    // Create color cycling
    float hue = pattern + time * 0.1;
    float saturation = 0.6 + sin(time * 0.3) * 0.2;
    float brightness = 0.3 + pattern * 0.4;
    
    vec3 color = hsv2rgb(vec3(hue, saturation, brightness));
    
    // Add some sparkle effect
    float sparkle = sin(pos.x * 20.0 + time * 2.0) * sin(pos.y * 20.0 + time * 2.5);
    sparkle = smoothstep(0.8, 1.0, sparkle) * 0.3;
    
    color += sparkle;
    
    // Fade edges for better integration
    float vignette = 1.0 - length(st - 0.5) * 0.8;
    color *= vignette;
    
    gl_FragColor = vec4(color, 0.8);
  }
`;

export default function Iridescence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const programRef = useRef<Program | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new Renderer({ canvas, alpha: true });
    rendererRef.current = renderer;

    const camera = new Camera();
    const scene = new Transform();

    // Create fullscreen quad
    const geometry = new Geometry(renderer.gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });

    const program = new Program(renderer.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [window.innerWidth, window.innerHeight] },
      },
    });
    programRef.current = program;

    const mesh = new Mesh(renderer.gl, { geometry, program });
    mesh.setParent(scene);

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.perspective({ aspect: renderer.gl.canvas.width / renderer.gl.canvas.height });
      if (program.uniforms.uResolution) {
        program.uniforms.uResolution.value = [window.innerWidth, window.innerHeight];
      }
    };

    const animate = () => {
      const time = (Date.now() - startTimeRef.current) * 0.001;
      if (program.uniforms.uTime) {
        program.uniforms.uTime.value = time;
      }
      
      renderer.render({ scene, camera });
      requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      if (rendererRef.current) {
        rendererRef.current.gl.canvas.remove();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 opacity-60"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
