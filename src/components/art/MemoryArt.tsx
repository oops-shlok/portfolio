// LifeOS: memories orbiting a core, recalled one at a time.
const rings = [14, 24, 34, 44];

export default function MemoryArt() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      {rings.map((r, i) => (
        <g key={r}>
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgb(236 235 230 / 0.14)" strokeWidth="0.3" strokeDasharray={i % 2 ? "1 2" : "none"} />
          <g>
            <animateTransform attributeName="transform" type="rotate" from={`${i * 70} 50 50`} to={`${i * 70 + (i % 2 ? -360 : 360)} 50 50`} dur={`${14 + i * 6}s`} repeatCount="indefinite" />
            {Array.from({ length: 2 + i }).map((_, j) => {
              const a = (j / (2 + i)) * Math.PI * 2;
              const hot = (i + j) % 4 === 0;
              return (
                <circle key={j} cx={+(50 + Math.cos(a) * r).toFixed(3)} cy={+(50 + Math.sin(a) * r).toFixed(3)} r={hot ? 1.6 : 1} fill={hot ? "#cdfa50" : "rgb(236 235 230 / 0.7)"}>
                  {hot && <animate attributeName="r" values="1.6;2.6;1.6" dur="2s" repeatCount="indefinite" />}
                </circle>
              );
            })}
          </g>
        </g>
      ))}
      <circle cx="50" cy="50" r="6" fill="#cdfa50" opacity="0.9">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
