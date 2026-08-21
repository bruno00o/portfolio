import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { createPortal } from 'preact/compat';

interface RogueInit {
  x: number;
  y: number;
  pointerId: number;
  pointerX: number;
  pointerY: number;
}

interface TrailDot {
  id: string;
  x: number;
  y: number;
}

interface RoguePhysicsProps {
  initial: RogueInit;
  onReturn: () => void;
  returning: boolean;
  getHomePos: () => { x: number; y: number };
}

function RoguePhysics({ initial, onReturn, returning, getHomePos }: RoguePhysicsProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const stateRef = useRef({
    x: initial.x,
    y: initial.y,
    vx: 0,
    vy: 0,
    dragging: true,
    returning: false,
    pointerOffsetX: 0,
    pointerOffsetY: 0,
    lastX: initial.x,
    lastY: initial.y,
    lastT: performance.now(),
    rafId: 0,
  });
  const [trails, setTrails] = useState<TrailDot[]>([]);
  const trailIdRef = useRef(0);
  const trailTimersRef = useRef<Set<number>>(new Set());

  const dropTrail = useCallback((x: number, y: number) => {
    const id = String(++trailIdRef.current);
    setTrails((current) => [...current.slice(-11), { id, x, y }]);
    const timer = window.setTimeout(() => {
      trailTimersRef.current.delete(timer);
      setTrails((current) => current.filter((t) => t.id !== id));
    }, 500);
    trailTimersRef.current.add(timer);
  }, []);

  useEffect(() => {
    const timers = trailTimersRef.current;
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      timers.clear();
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const s = stateRef.current;
    s.pointerOffsetX = initial.pointerX - initial.x;
    s.pointerOffsetY = initial.pointerY - initial.y;

    try { el.setPointerCapture(initial.pointerId); } catch {}

    const onMove = (e: PointerEvent) => {
      if (!s.dragging) return;
      const now = performance.now();
      const dt = Math.max(1, now - s.lastT);
      const newX = e.clientX - s.pointerOffsetX;
      const newY = e.clientY - s.pointerOffsetY;
      s.vx = ((newX - s.lastX) / dt) * 16;
      s.vy = ((newY - s.lastY) / dt) * 16;
      s.lastX = s.x = newX;
      s.lastY = s.y = newY;
      s.lastT = now;
      el.style.left = s.x + 'px';
      el.style.top = s.y + 'px';
    };

    const onUp = (e: PointerEvent) => {
      if (!s.dragging) return;
      s.dragging = false;
      el.dataset.dragging = 'false';
      try { el.releasePointerCapture(e.pointerId); } catch {}
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);

    el.dataset.dragging = 'true';
    el.style.left = s.x + 'px';
    el.style.top = s.y + 'px';

    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
    };
  }, [initial.pointerId, initial.pointerX, initial.pointerY, initial.x, initial.y]);

  useEffect(() => {
    let lastTrail = 0;
    const tick = () => {
      const s = stateRef.current;
      if (s.returning) return;
      if (!s.dragging) {
        s.vy += 0.35;
        s.vx *= 0.992;
        s.vy *= 0.998;
        s.x += s.vx;
        s.y += s.vy;

        const W = window.innerWidth;
        const H = window.innerHeight;
        const R = 5;
        if (s.x < R) { s.x = R; s.vx = -s.vx * 0.7; }
        if (s.x > W - R) { s.x = W - R; s.vx = -s.vx * 0.7; }
        if (s.y < R) { s.y = R; s.vy = -s.vy * 0.7; }
        if (s.y > H - R) { s.y = H - R; s.vy = -s.vy * 0.6; }

        if (ref.current) {
          ref.current.style.left = s.x + 'px';
          ref.current.style.top = s.y + 'px';
        }

        const speed = Math.hypot(s.vx, s.vy);
        const now = performance.now();
        if (speed > 1.4 && now - lastTrail > 50) {
          dropTrail(s.x, s.y);
          lastTrail = now;
        }
      }
      stateRef.current.rafId = requestAnimationFrame(tick);
    };
    stateRef.current.rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(stateRef.current.rafId);
  }, [dropTrail]);

  useEffect(() => {
    if (!returning) return;
    const el = ref.current;
    if (!el) return;
    const s = stateRef.current;
    s.returning = true;
    s.dragging = false;
    cancelAnimationFrame(s.rafId);

    const home = getHomePos();
    const fromX = s.x;
    const fromY = s.y;
    const startT = performance.now();
    const duration = 480;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = () => {
      const elapsed = performance.now() - startT;
      const t = Math.min(1, elapsed / duration);
      const p = ease(t);
      s.x = fromX + (home.x - fromX) * p;
      s.y = fromY + (home.y - fromY) * p;
      if (ref.current) {
        ref.current.style.left = s.x + 'px';
        ref.current.style.top = s.y + 'px';
        ref.current.style.opacity = String(1 - p * 0.6);
      }
      if (t < 1) {
        s.rafId = requestAnimationFrame(step);
      } else {
        onReturn();
      }
    };
    s.rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(s.rafId);
  }, [returning, getHomePos, onReturn]);

  const onDblClick = () => onReturn();

  const onRepickPointerDown = (e: PointerEvent) => {
    const s = stateRef.current;
    const el = ref.current;
    if (!el) return;
    e.preventDefault();
    s.dragging = true;
    s.pointerOffsetX = e.clientX - s.x;
    s.pointerOffsetY = e.clientY - s.y;
    s.lastX = s.x;
    s.lastY = s.y;
    s.lastT = performance.now();
    s.vx = 0;
    s.vy = 0;
    try { el.setPointerCapture(e.pointerId); } catch {}
    el.dataset.dragging = 'true';
  };

  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      {trails.map((t) => (
        <span
          key={t.id}
          class="rogue-dot__trail"
          style={{ left: t.x - 3 + 'px', top: t.y - 3 + 'px' }}
        />
      ))}
      <span
        ref={ref}
        class="rogue-dot"
        onDblClick={onDblClick}
        onPointerDown={onRepickPointerDown}
        style={{
          left: stateRef.current.x + 'px',
          top: stateRef.current.y + 'px',
          transform: 'translate(-50%, -50%)',
        }}
        title="Double-click to send home"
      />
    </>,
    document.body,
  );
}

const DRAG_THRESHOLD_PX = 5;

export default function RogueDot() {
  const [rogue, setRogue] = useState<RogueInit | null>(null);
  const [returning, setReturning] = useState(false);
  const dotRef = useRef<HTMLSpanElement>(null);
  const rogueActiveRef = useRef(false);

  useEffect(() => {
    rogueActiveRef.current = !!rogue;
  }, [rogue]);

  useEffect(() => {
    if (!rogue) return;
    const initialY = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - initialY) > 4) {
        setReturning(true);
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [rogue]);

  const getHomePos = useCallback(() => {
    const dot = dotRef.current;
    if (!dot) return { x: 0, y: 0 };
    const rect = dot.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }, []);

  const handleReturn = useCallback(() => {
    setRogue(null);
    setReturning(false);
  }, []);

  useEffect(() => {
    const dot = dotRef.current;
    const mark = dot?.closest<HTMLAnchorElement>('a.mark');
    if (!mark || !dot) return;

    let startX = 0;
    let startY = 0;
    let pointerId = -1;
    let armed = false;
    let suppressClick = false;

    const onDown = (e: PointerEvent) => {
      if (rogueActiveRef.current) return;
      armed = true;
      startX = e.clientX;
      startY = e.clientY;
      pointerId = e.pointerId;
    };

    const onMove = (e: PointerEvent) => {
      if (!armed || e.pointerId !== pointerId) return;
      if (Math.hypot(e.clientX - startX, e.clientY - startY) < DRAG_THRESHOLD_PX) return;
      armed = false;
      suppressClick = true;
      e.preventDefault();
      const rect = dot.getBoundingClientRect();
      setRogue({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        pointerId: e.pointerId,
        pointerX: e.clientX,
        pointerY: e.clientY,
      });
    };

    const onUp = () => {
      armed = false;
    };

    const onClick = (e: MouseEvent) => {
      if (suppressClick || rogueActiveRef.current) {
        e.preventDefault();
        e.stopImmediatePropagation();
        suppressClick = false;
      }
    };

    mark.addEventListener('pointerdown', onDown);
    mark.addEventListener('pointermove', onMove);
    mark.addEventListener('pointerup', onUp);
    mark.addEventListener('pointercancel', onUp);
    mark.addEventListener('click', onClick, true);

    return () => {
      mark.removeEventListener('pointerdown', onDown);
      mark.removeEventListener('pointermove', onMove);
      mark.removeEventListener('pointerup', onUp);
      mark.removeEventListener('pointercancel', onUp);
      mark.removeEventListener('click', onClick, true);
    };
  }, []);

  return (
    <>
      <span
        ref={dotRef}
        class="mark__dot"
        style={{ visibility: rogue ? 'hidden' : 'visible' }}
        aria-label="Drag me"
      />
      {rogue && (
        <RoguePhysics
          key={rogue.pointerId + ':' + rogue.x}
          initial={rogue}
          onReturn={handleReturn}
          returning={returning}
          getHomePos={getHomePos}
        />
      )}
    </>
  );
}
