import { useEffect, useRef } from 'react';

const SCALE = 3;
const W = 14, H = 14;

// 0=transparent 1=black 2=white 3=pink
const COLORS = { 1: '#111111', 2: '#f0f0f0', 3: '#ffb3c6' };

/* ── Panda pixel art frames ─────────────────────────────────────
   Each row = 14 pixels across (W=14)
   Ears are black, eye patches black, white face, pink nose
───────────────────────────────────────────────────────────────── */
const FRAMES = [
  // Frame A — walk left foot forward
  [
    [0,1,1,0,0,0,0,0,0,0,1,1,0,0], // ear bumps
    [0,1,1,1,1,1,1,1,1,1,1,1,0,0], // top of head
    [0,1,1,2,2,2,2,2,2,2,1,1,0,0], // head row
    [0,1,1,2,1,1,2,2,1,1,2,1,0,0], // eye patches
    [0,1,2,2,1,1,2,2,1,1,2,2,1,0], // eye patches 2
    [0,0,1,2,2,2,2,2,2,2,2,1,0,0], // cheeks
    [0,0,1,2,2,3,2,2,3,2,2,1,0,0], // blush / nose
    [0,0,0,1,1,1,1,1,1,1,1,0,0,0], // chin
    [0,0,1,1,2,2,2,2,2,1,1,0,0,0], // upper body
    [0,0,1,2,2,2,2,2,2,2,1,0,0,0], // body
    [0,0,1,1,2,2,2,2,2,1,1,0,0,0], // lower body
    [0,1,1,0,0,1,1,0,0,0,1,1,0,0], // legs A: left fwd
    [0,1,0,0,0,1,0,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ],
  // Frame B — walk right foot forward
  [
    [0,1,1,0,0,0,0,0,0,0,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,2,2,2,2,2,2,2,1,1,0,0],
    [0,1,1,2,1,1,2,2,1,1,2,1,0,0],
    [0,1,2,2,1,1,2,2,1,1,2,2,1,0],
    [0,0,1,2,2,2,2,2,2,2,2,1,0,0],
    [0,0,1,2,2,3,2,2,3,2,2,1,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,2,2,2,2,2,1,1,0,0,0],
    [0,0,1,2,2,2,2,2,2,2,1,0,0,0],
    [0,0,1,1,2,2,2,2,2,1,1,0,0,0],
    [0,1,1,0,0,0,1,1,0,0,1,1,0,0], // legs B: right fwd
    [0,1,0,0,0,0,0,1,0,0,0,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ],
];

const LERP = 0.07;

export default function PetCursor() {
  const canvasRef = useRef(null);
  const wrapRef   = useRef(null);
  const pos    = useRef({ px: -300, py: -300, tx: -300, ty: -300 });
  const state  = useRef({ tick: 0, frame: 0, flipped: false });
  const rafId  = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    function draw() {
      ctx.clearRect(0, 0, W * SCALE, H * SCALE);
      const pixels = FRAMES[state.current.frame];
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const v = pixels[y][x];
          if (!v) continue;
          ctx.fillStyle = COLORS[v];
          ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
        }
      }
    }

    function onMove(e) {
      pos.current.tx = e.clientX;
      pos.current.ty = e.clientY;
    }

    function tick() {
      const p = pos.current;
      const s = state.current;
      const dx = p.tx - p.px;
      const dy = p.ty - p.py;

      p.px += dx * LERP;
      p.py += dy * LERP;

      const moving = Math.abs(dx) + Math.abs(dy) > 0.5;
      if (Math.abs(dx) > 0.3) s.flipped = dx < 0;

      s.tick++;
      if (moving && s.tick % 12 === 0) {
        s.frame = (s.frame + 1) % FRAMES.length;
      }

      wrap.style.left      = `${p.px}px`;
      wrap.style.top       = `${p.py}px`;
      wrap.style.transform = s.flipped
        ? 'scaleX(-1) translate(50%, -100%)'
        : 'translate(-50%, -100%)';

      draw();
      rafId.current = requestAnimationFrame(tick);
    }

    document.addEventListener('mousemove', onMove, { passive: true });
    rafId.current = requestAnimationFrame(tick);
    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div ref={wrapRef} className="pet-cursor" aria-hidden="true">
      <canvas
        ref={canvasRef}
        width={W * SCALE}
        height={H * SCALE}
        style={{ imageRendering: 'pixelated', display: 'block' }}
      />
    </div>
  );
}
