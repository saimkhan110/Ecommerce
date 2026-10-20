// ===== Winter snowfall - subtle decorative background =====
// Deterministic flakes (no random re-renders).
// contained=true -> absolute inside parent (z-index 0); else fixed behind page (z-index -1).
const FLAKES = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 6.3 + 3) % 100,
  size: 5 + (i % 4) * 3,
  duration: 9 + (i % 5) * 2.5,
  delay: -(i % 10),
  opacity: 0.35 + (i % 3) * 0.18,
}))

export default function Snowfall({ contained = false }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: contained ? 'absolute' : 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: contained ? 0 : -1,
      }}
    >
      {FLAKES.map((f, i) => (
        <span
          key={i}
          className="snow-flake"
          style={{
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
