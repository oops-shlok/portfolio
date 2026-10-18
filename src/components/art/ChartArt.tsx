// ChartingApp: candlesticks with a moving-average line drawing across them.
const candles = Array.from({ length: 22 }, (_, i) => {
  const base = 55 - Math.sin(i / 3) * 14 - i * 0.6;
  const open = base + Math.sin(i * 1.7) * 5;
  const close = base + Math.cos(i * 1.3) * 5;
  return { x: 6 + i * 4.1, open, close, hi: Math.min(open, close) - 3 - (i % 3), lo: Math.max(open, close) + 3 + (i % 2) };
});
const ma = candles.map((c, i) => `${i ? "L" : "M"}${c.x},${(c.open + c.close) / 2}`).join(" ");

export default function ChartArt() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      {[25, 45, 65, 85].map((y) => (
        <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="rgb(236 235 230 / 0.07)" strokeWidth="0.3" />
      ))}
      {candles.map((c, i) => {
        const up = c.close < c.open;
        const col = up ? "#cdfa50" : "rgb(236 235 230 / 0.45)";
        return (
          <g key={i} opacity="0">
            <animate attributeName="opacity" from="0" to="1" begin={`${i * 0.06}s`} dur="0.3s" fill="freeze" />
            <line x1={c.x} x2={c.x} y1={c.hi} y2={c.lo} stroke={col} strokeWidth="0.35" />
            <rect x={c.x - 1.2} width="2.4" y={Math.min(c.open, c.close)} height={Math.max(Math.abs(c.open - c.close), 0.6)} fill={col} />
          </g>
        );
      })}
      <path d={ma} fill="none" stroke="#cdfa50" strokeWidth="0.5" strokeDasharray="200" strokeDashoffset="200">
        <animate attributeName="stroke-dashoffset" from="200" to="0" dur="2.6s" begin="0.8s" fill="freeze" repeatCount="1" />
      </path>
    </svg>
  );
}
