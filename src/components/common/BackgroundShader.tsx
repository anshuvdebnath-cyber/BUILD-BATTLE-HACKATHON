import React, { useEffect, useRef } from 'react';

export const BackgroundShader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // Fullscreen quad
    const vsSource = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = (position + 1.0) * 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment Shader: Glowing electric violet/purple/lilac chromatic light on a pure white canvas
    // with fine aesthetic film grain texture (matching user reference image)
    const fsSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 vUv;

      // High-precision pseudo-random noise for aesthetic film grain
      float hash(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * 0.1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
      }

      // Smooth 2D value noise for fluid light flow
      float vnoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 p = uv;
        p.x *= aspect;

        float t = u_time * 0.18;
        vec2 mouse = u_mouse * 0.05;

        // Flowing diagonal chromatic light stream (matching reference image)
        // Diagonal tilt from top-left to bottom-right
        float diagCoord = (p.x * 0.65 - p.y * 0.75);
        
        // Fluid organic undulating light displacement
        float wave1 = sin(diagCoord * 3.2 + t * 0.9 + mouse.x * 2.0) * 0.22;
        float wave2 = cos(p.y * 3.6 - t * 0.6 + wave1) * 0.18;
        float noiseVal = vnoise(p * 2.4 + vec2(t * 0.25, -t * 0.18)) * 0.30;

        // Distance from the curved chromatic light beam
        float beamCenter = 0.08 + wave1 + wave2 + noiseVal;
        float distToBeam = abs(diagCoord - beamCenter);

        // Core electric purple beam glow
        float coreGlow = smoothstep(0.70, 0.0, distToBeam * 1.6);
        float softGlow = smoothstep(1.15, 0.0, distToBeam * 0.95);
        float ambientBloom = smoothstep(1.65, 0.0, distToBeam * 0.55);

        // Secondary soft violet cloud floating in upper right
        float cloud2 = smoothstep(0.65, 0.0, length(uv - vec2(0.85, 0.88) - mouse * 0.4)) * 0.38;

        // Color palette based directly on user reference image:
        // Pure crisp white base, deep royal violet, vibrant electric purple, luminous lilac, and soft lavender highlight
        vec3 col_white = vec3(0.985, 0.99, 1.0);              // Clean crisp white canvas
        vec3 col_deep_violet = vec3(0.42, 0.12, 0.82);         // #6b1fd1
        vec3 col_electric_purple = vec3(0.56, 0.22, 0.93);     // #8f38ed
        vec3 col_neon_lilac = vec3(0.76, 0.52, 0.98);          // #c285fa
        vec3 col_lavender_highlight = vec3(0.91, 0.84, 0.99);  // #e8d6fc

        // Blend the chromatic layers
        vec3 beamColor = mix(col_deep_violet, col_electric_purple, smoothstep(0.15, 0.6, coreGlow));
        beamColor = mix(beamColor, col_neon_lilac, pow(coreGlow, 1.4));
        beamColor = mix(beamColor, col_lavender_highlight, pow(coreGlow, 2.5));

        // Blend onto pure white background so the backdrop remains brightly white with the violet beam floating across
        float totalIntensity = clamp(coreGlow * 0.55 + softGlow * 0.28 + ambientBloom * 0.10 + cloud2 * 0.35, 0.0, 0.68);
        vec3 finalColor = mix(col_white, beamColor, totalIntensity);

        // Aesthetic fine film grain (matching user reference image texture)
        float grain = (hash(gl_FragCoord.xy + fract(u_time * 19.37)) - 0.5) * 0.038;
        finalColor += grain;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.warn(glCtx.getShaderInfoLog(shader));
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationFrameId: number;
    let startTime = performance.now();

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      const now = performance.now();
      const elapsed = (now - startTime) / 1000;

      gl.uniform1f(uTime, elapsed);
      if (canvas) {
        gl.uniform2f(uResolution, canvas.width, canvas.height);
      }
      gl.uniform2f(uMouse, mouseX, mouseY);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* 
        Hardware-Accelerated WebGL Animated Chromatic Purple/Violet Light Stream
        Over Pure White/Slate Background with Dense Aesthetic Film Grain
      */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-100 transition-opacity duration-1000"
      />
    </div>
  );
};

export default BackgroundShader;
