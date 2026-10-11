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

        // Enhanced movement speed and multi-frequency flow
        float t = u_time * 0.36;
        vec2 mouse = u_mouse * 0.08;

        // Flowing diagonal chromatic light stream with dynamic undulating movement
        float diagCoord = (p.x * 0.68 - p.y * 0.72);
        
        // Multi-frequency wave displacement for rich, visible, elegant motion
        float wave1 = sin(diagCoord * 3.6 + t * 1.35 + mouse.x * 2.2) * 0.26;
        float wave2 = cos(p.y * 4.4 - t * 1.05 + wave1 * 1.3) * 0.22;
        float wave3 = sin((p.x + p.y) * 2.6 + t * 0.75 + mouse.y * 1.8) * 0.18;
        float noiseVal1 = vnoise(p * 2.5 + vec2(t * 0.42, -t * 0.28)) * 0.30;
        float noiseVal2 = vnoise(p * 4.8 - vec2(t * 0.22, t * 0.18)) * 0.14;

        // Dynamic fluid beam center with undulating ribbons
        float beamCenter = 0.05 + wave1 + wave2 + wave3 + noiseVal1 + noiseVal2;
        float distToBeam = abs(diagCoord - beamCenter);

        // Luminous light feathering - soft, airy, and gentle
        float coreGlow = smoothstep(0.72, 0.0, distToBeam * 1.55);
        float softGlow = smoothstep(1.20, 0.0, distToBeam * 0.90);
        float ambientBloom = smoothstep(1.75, 0.0, distToBeam * 0.50);

        // Secondary floating luminous cloud with active drift
        vec2 cloudPos = vec2(0.80 + sin(t * 0.4) * 0.12, 0.85 + cos(t * 0.35) * 0.10);
        float cloud2 = smoothstep(0.75, 0.0, length(uv - cloudPos - mouse * 0.4)) * 0.35;

        // Tertiary subtle accent ray drifting across the lower left
        float ray3 = smoothstep(0.60, 0.0, abs((p.x * 0.5 + p.y * 0.5) - (0.45 + sin(t * 0.5) * 0.15))) * 0.22;

        // Lighter, luminous, ethereal pastel purple palette (never dark or muddy)
        vec3 col_white = vec3(0.992, 0.995, 1.0);             // Pure luminous white canvas
        vec3 col_light_lilac = vec3(0.82, 0.65, 0.98);        // #d2a6fa - bright luminous lilac
        vec3 col_electric_violet = vec3(0.70, 0.46, 0.96);    // #b375f5 - light vibrant electric violet
        vec3 col_radiant_orchid = vec3(0.78, 0.55, 0.98);     // #c78cfa - glowing light orchid
        vec3 col_soft_lavender = vec3(0.92, 0.85, 0.99);      // #ebd9fc - airy pastel lavender highlight

        // Compose the light beam gradient (purely high-luma pastel purple tones)
        vec3 beamColor = mix(col_electric_violet, col_radiant_orchid, smoothstep(0.1, 0.55, coreGlow));
        beamColor = mix(beamColor, col_light_lilac, pow(coreGlow, 1.2));
        beamColor = mix(beamColor, col_soft_lavender, pow(coreGlow, 2.0));

        // Blend onto pure white background with airy pastel transparency
        float totalIntensity = clamp(coreGlow * 0.46 + softGlow * 0.22 + ambientBloom * 0.10 + cloud2 * 0.30 + ray3 * 0.18, 0.0, 0.52);
        vec3 finalColor = mix(col_white, beamColor, totalIntensity);

        // Delicate aesthetic film grain
        float grain = (hash(gl_FragCoord.xy + fract(u_time * 23.17)) - 0.5) * 0.026;
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
