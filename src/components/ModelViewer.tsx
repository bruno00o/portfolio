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
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

interface Props {
  src: string;
}

const MAX_ROT_X = Math.PI / 3;
// Three-quarter view, the same angle as the CAD renders.
const REST_ROT_Y = -Math.PI / 5;
const REST_ROT_X = 0.28;
const ENTER_DURATION = 520;

/**
 * Same recipe as HeroHead, minus the torch: intensities here, every colour from
 * tokens.css at runtime so the print follows the theme.
 */
const LIGHTING = {
  dark: { ambient: 0.7, key: 1.9, fill: 0.9, rim: 3.0, exposure: 1.0 },
  light: { ambient: 0.2, key: 1.6, fill: 0.8, rim: 0.9, exposure: 0.92 },
} as const;

const readTheme = (): keyof typeof LIGHTING =>
  document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

export default function ModelViewer({ src }: Props) {
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
    const camera = new PerspectiveCamera(28, 4 / 3, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    const ambient = new AmbientLight(0xffffff);
    const key = new DirectionalLight(0xffffff);
    key.position.set(2.5, 3, 4);
    const fill = new DirectionalLight();
    fill.position.set(-3, 1, 2);
    const rim = new DirectionalLight();
    rim.position.set(-2, 2.5, -3);
    scene.add(ambient, key, fill, rim);

    // No normals in the file: flat shading turns the STL facets into the panels they are.
    const printMat = new MeshStandardMaterial({ roughness: 0.9, metalness: 0, flatShading: true });

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
      printMat.color.set(token('--head-clay', '#71717a'));
      fill.color.set(token('--head-fill', '#d4d8dc'));
      rim.color.set(token('--accent', '#1F9DFF'));
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
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const group = new Group();
    scene.add(group);

    let holder: Group | null = null;
    let targetScale = 1;
    let enterT0 = 0;

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      src,
      (gltf) => {
        const model = gltf.scene;
        model.traverse((o) => {
          const mesh = o as Mesh;
          if (mesh.isMesh) mesh.material = printMat;
        });
        // OpenSCAD exports Z up; three is Y up.
        model.rotation.x = -Math.PI / 2;
        model.updateMatrixWorld(true);

        const box = new Box3().setFromObject(model);
        const center = box.getCenter(new Vector3());
        const size = box.getSize(new Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        holder = new Group();
        holder.add(model);
        model.position.sub(center);
        targetScale = 2.3 / maxDim;
        holder.scale.setScalar(targetScale * 0.05);
        group.add(holder);

        enterT0 = performance.now();
        container.dataset.state = 'ready';
      },
      undefined,
      (err) => {
        container.dataset.state = 'error';
        console.error('[ModelViewer] GLB load failed:', err);
      },
    );

    let dragging = false;
    let pointerId = -1;
    let startPx = 0;
    let startPy = 0;
    let startRx = 0;
    let startRy = 0;
    let targetX = REST_ROT_X;
    let targetY = REST_ROT_Y;
    let currentX = REST_ROT_X;
    let currentY = REST_ROT_Y;
    // Y is unbounded so the object can be spun all the way round.
    let spinOffset = 0;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      pointerId = e.pointerId;
      startPx = e.clientX;
      startPy = e.clientY;
      startRx = currentX;
      startRy = currentY;
      container.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return;
      const dx = (e.clientX - startPx) / 160;
      const dy = (e.clientY - startPy) / 160;
      targetY = startRy + dx;
      targetX = MathUtils.clamp(startRx + dy, -MAX_ROT_X, MAX_ROT_X);
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      try { container.releasePointerCapture(e.pointerId); } catch {}
      // Settle on the rest tilt but keep whatever turn the drag produced.
      targetX = REST_ROT_X;
      spinOffset = targetY - REST_ROT_Y;
    };

    container.addEventListener('pointerdown', onDown);
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
      const idleY = idle ? Math.sin(t * 0.35) * 0.12 : 0;
      const idleX = idle ? Math.sin(t * 0.27) * 0.03 : 0;
      if (!dragging) targetY = REST_ROT_Y + spinOffset + idleY;

      const spring = 0.08;
      currentY = MathUtils.lerp(currentY, targetY, spring);
      currentX = MathUtils.lerp(currentX, targetX + idleX, spring);
      group.rotation.y = currentY;
      group.rotation.x = currentX;

      if (holder) renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };

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
      container.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerup', onUp);
      container.removeEventListener('pointercancel', onUp);
      scene.traverse((obj) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mesh = obj as any;
        if (mesh.geometry) mesh.geometry.dispose?.();
      });
      printMat.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [src]);

  return <div ref={containerRef} class="detail__model-canvas" />;
}
