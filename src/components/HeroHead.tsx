import { useEffect, useRef } from 'preact/hooks';
import {
  ACESFilmicToneMapping,
  AmbientLight,
  Box3,
  DirectionalLight,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SpotLight,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const MAX_ROT_X = Math.PI / 6;
const MAX_ROT_Y = Math.PI / 4;
const ENTER_DURATION = 520;
const TORCH_RAMP = 0.06;
const TORCH_TRACK = 0.09;
const TORCH_ANGLE = 0.11;
// Fixed offset from the pool, not a fixed point: a constant direction keeps the modelling
// consistent, and front-left-above is what makes the light rake rather than flatten.
const LAMP_OFFSET = { x: -0.7, y: 0.8, z: 2.8 };
// The cursor unprojects up to ~1.2 units off-centre, overshooting a bust only ~0.95 wide.
const POOL_REACH = 0.8;

/**
 * Intensities only; every colour comes from tokens.css at runtime.
 *
 * The accent enters at a different place in each theme, and has to: a rim light only reads
 * as light against a dark ground, so on white the same saturated edge becomes a traced
 * outline. Dark puts the accent on the rim, light puts it in the shadow fill.
 */
const LIGHTING = {
  dark: {
    ambient: 0.78, key: 2.0, fill: 1.05, rim: 5.2,
    sweepBase: 0.18, sweepPulse: 0.08,
    sweepBackBase: 1.7, sweepBackPulse: 0.5,
    torch: 5.5,
    exposure: 1.0,
  },
  light: {
    ambient: 0.14, key: 1.6, fill: 0.85, rim: 1.1,
    sweepBase: 0.08, sweepPulse: 0.04,
    sweepBackBase: 0.55, sweepBackPulse: 0.18,
    torch: 8.0,
    exposure: 0.92,
  },
} as const;

const readTheme = (): keyof typeof LIGHTING =>
  document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

export default function HeroHead() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = reduceMotion.matches;
    const onReduceChange = () => {
      reduced = reduceMotion.matches;
    };
    reduceMotion.addEventListener('change', onReduceChange);

    const scene = new Scene();
    const camera = new PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // Bare on purpose: applyLighting and applyTokenColors run before the first frame and
    // own every intensity and colour below.
    const ambient = new AmbientLight(0xffffff);
    scene.add(ambient);

    const key = new DirectionalLight(0xffffff);
    key.position.set(2.5, 3, 4);
    scene.add(key);

    const fill = new DirectionalLight();
    fill.position.set(-3, 1, 2);
    scene.add(fill);

    const rim = new DirectionalLight();
    rim.position.set(-2, 2.5, -3);
    scene.add(rim);

    const sweep = new DirectionalLight(0xffffff);
    scene.add(sweep);

    const sweepBack = new DirectionalLight();
    scene.add(sweepBack);

    // Distance and decay left at 0: physical falloff would tie the intensity to how far the
    // cursor pushed the lamp, which a hand-held torch should not do.
    const torch = new SpotLight(0xffffff, 0, 0, TORCH_ANGLE, 0.85, 0);
    scene.add(torch);
    // In the scene, so render() refreshes its world matrix.
    scene.add(torch.target);

    const clayMat = new MeshStandardMaterial({ roughness: 0.85, metalness: 0.0 });

    let theme = readTheme();

    const applyLighting = () => {
      const p = LIGHTING[theme];
      ambient.intensity = p.ambient;
      key.intensity = p.key;
      fill.intensity = p.fill;
      rim.intensity = p.rim;
      renderer.toneMappingExposure = p.exposure;
    };

    const applyTokenColors = () => {
      const cs = getComputedStyle(document.documentElement);
      const token = (n: string, fallback: string) => cs.getPropertyValue(n).trim() || fallback;
      clayMat.color.set(token('--head-clay', '#71717a'));
      fill.color.set(token('--head-fill', '#d4d8dc'));
      const accent = token('--accent', '#1F9DFF');
      rim.color.set(accent);
      sweepBack.color.set(accent);
      // Dimming would only dim: the wash toward cyan-white is the green and blue channels
      // clipping, so the torch needs a deeper, more saturated blue.
      torch.color.set(accent).offsetHSL(-0.02, 0.22, -0.16);
    };

    applyLighting();
    applyTokenColors();

    const themeObserver = new MutationObserver(() => {
      const next = readTheme();
      if (next === theme) return;
      theme = next;
      applyLighting();
      applyTokenColors();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    const group = new Group();
    scene.add(group);

    let holder: Group | null = null;
    let targetScale = 1;
    let enterT0 = 0;

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      '/models/head.glb',
      (gltf) => {
        const model = gltf.scene;
        model.traverse((o) => {
          const mesh = o as Mesh;
          if (mesh.isMesh) mesh.material = clayMat;
        });

        const box = new Box3().setFromObject(model);
        const center = box.getCenter(new Vector3());
        const size = box.getSize(new Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        model.position.copy(center).negate();

        holder = new Group();
        holder.add(model);
        targetScale = 1.9 / maxDim;
        holder.scale.setScalar(targetScale * 0.05);
        group.add(holder);

        enterT0 = performance.now();
        container.dataset.state = 'ready';
      },
      undefined,
      (err) => {
        // Debug hook; the stylesheet only ever acts on 'ready', so the column stays empty.
        container.dataset.state = 'error';
        console.error('[HeroHead] GLB load failed:', err);
      },
    );

    let dragging = false;
    let pointerId = -1;
    let startPx = 0;
    let startPy = 0;
    let startRx = 0;
    let startRy = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let torchTX = 0;
    let torchTY = 0;
    let torchCX = 0;
    let torchCY = 0;
    let torchOn = false;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      pointerId = e.pointerId;
      startPx = e.clientX;
      startPy = e.clientY;
      startRx = currentX;
      startRy = currentY;
      container.setPointerCapture(e.pointerId);
    };
    const onLeave = () => {
      torchOn = false;
    };
    const onMove = (e: PointerEvent) => {
      // Doubles as the enter signal, and has to: the island hydrates late, so a cursor
      // already resting on the canvas by then has missed pointerenter for good.
      torchOn = true;
      const r = container.getBoundingClientRect();
      torchTX = ((e.clientX - r.left) / r.width) * 2 - 1;
      torchTY = 1 - ((e.clientY - r.top) / r.height) * 2;

      if (!dragging || e.pointerId !== pointerId) return;
      const dx = (e.clientX - startPx) / 200;
      const dy = (e.clientY - startPy) / 200;
      targetY = MathUtils.clamp(startRy + dx, -MAX_ROT_Y, MAX_ROT_Y);
      targetX = MathUtils.clamp(startRx + dy, -MAX_ROT_X, MAX_ROT_X);
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      try { container.releasePointerCapture(e.pointerId); } catch {}
      targetX = 0;
      targetY = 0;
    };

    container.addEventListener('pointerdown', onDown);
    container.addEventListener('pointerleave', onLeave);
    container.addEventListener('pointermove', onMove, { passive: true });
    container.addEventListener('pointerup', onUp);
    container.addEventListener('pointercancel', onUp);

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      if (clientWidth === 0 || clientHeight === 0) return;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    // Half-height of the frustum at the bust's depth, which turns a normalised cursor
    // position into a world point. The camera never moves, so it is fixed for the session.
    const poolH =
      camera.position.z * Math.tan(MathUtils.degToRad(camera.fov) / 2) * POOL_REACH;

    const start = performance.now();
    let rafId = 0;
    let visible = true;
    const tick = () => {
      if (!visible) {
        rafId = 0;
        return;
      }
      const now = performance.now();
      const t = (now - start) / 1000;

      if (holder && enterT0) {
        const e = (now - enterT0) / ENTER_DURATION;
        if (e < 1) {
          holder.scale.setScalar(targetScale * (0.05 + 0.95 * (1 - Math.pow(1 - e, 3))));
        } else {
          holder.scale.setScalar(targetScale);
          enterT0 = 0;
        }
      }

      const idle = !dragging && !reduced;
      const idleY = idle ? Math.sin(t * 0.45) * 0.06 : 0;
      const idleX = idle ? Math.sin(t * 0.32) * 0.03 : 0;

      const spring = 0.08;
      currentY = MathUtils.lerp(currentY, targetY + idleY, spring);
      currentX = MathUtils.lerp(currentX, targetX + idleX, spring);

      group.rotation.y = currentY;
      group.rotation.x = currentX;

      const p = LIGHTING[theme];

      // Frozen, not damped: driving the sweeps off t would keep the scene changing every
      // frame for the people who asked for less of it.
      const at = reduced ? 0 : t;
      const sweepT = at * 0.45;
      sweep.position.set(Math.cos(sweepT) * 5, Math.sin(sweepT * 0.6) * 2 + 2, Math.sin(sweepT) * 5 + 2);
      sweep.intensity = p.sweepBase + Math.sin(at * 0.7) * p.sweepPulse;

      const backT = at * 0.35 + Math.PI;
      sweepBack.position.set(Math.cos(backT) * 5, Math.sin(backT * 0.5) * 2 + 1, Math.sin(backT) * 5 - 2);
      sweepBack.intensity = p.sweepBackBase + Math.sin(at * 0.55 + 1.2) * p.sweepBackPulse;

      torchCX = MathUtils.lerp(torchCX, torchTX, TORCH_TRACK);
      torchCY = MathUtils.lerp(torchCY, torchTY, TORCH_TRACK);
      const px = torchCX * poolH * camera.aspect;
      const py = torchCY * poolH;
      torch.target.position.set(px, py, 0);
      torch.position.set(px + LAMP_OFFSET.x, py + LAMP_OFFSET.y, LAMP_OFFSET.z);
      torch.intensity = MathUtils.lerp(torch.intensity, torchOn ? p.torch : 0, TORCH_RAMP);

      if (holder) renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };

    // The hero sits at the top of a long page; without this the bust keeps re-shading
    // ~196k triangles against seven lights while someone reads the rest of it.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !rafId) rafId = requestAnimationFrame(tick);
    });
    io.observe(container);

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      reduceMotion.removeEventListener('change', onReduceChange);
      themeObserver.disconnect();
      ro.disconnect();
      io.disconnect();
      container.removeEventListener('pointerdown', onDown);
      container.removeEventListener('pointerleave', onLeave);
      container.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerup', onUp);
      container.removeEventListener('pointercancel', onUp);
      scene.traverse((obj) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mesh = obj as any;
        if (mesh.geometry) mesh.geometry.dispose?.();
        if (mesh.material) {
          if (Array.isArray(mesh.material)) mesh.material.forEach((m: { dispose?: () => void }) => m.dispose?.());
          else mesh.material.dispose?.();
        }
      });
      renderer.dispose();
      // dispose() leaves the GL context alive, and browsers cap those around sixteen.
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={containerRef} class="hero-head" aria-hidden="true" />;
}
