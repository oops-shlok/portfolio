// Smarix: a code knowledge graph with queries pulsing along its edges.
const nodes = [
  [50, 50, 7], [22, 28, 4], [78, 24, 5], [84, 62, 4], [62, 82, 5], [26, 74, 4], [12, 50, 3], [40, 14, 3], [90, 40, 3], [44, 66, 3], [66, 40, 3],
] as const;
const edges = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 6], [1, 7], [2, 8], [2, 10], [3, 8], [4, 9], [5, 9], [5, 6], [9, 0], [10, 0], [7, 2],
] as const;

export default function GraphArt() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="g-glow">
          <stop offset="0%" stopColor="#cdfa50" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#cdfa50" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill="url(#g-glow)" />
      {edges.map(([a, b], i) => {
        const [x1, y1] = nodes[a];
        const [x2, y2] = nodes[b];
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgb(236 235 230 / 0.18)" strokeWidth="0.3" />
            <circle r="0.9" fill="#cdfa50">
              <animateMotion dur={`${2.4 + (i % 5) * 0.7}s`} repeatCount="indefinite" path={`M${x1},${y1} L${x2},${y2}`} begin={`${(i * 0.37) % 2}s`} />
            </circle>
          </g>
        );
      })}
      {nodes.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill="#0e0e13" stroke={i === 0 ? "#cdfa50" : "rgb(236 235 230 / 0.5)"} strokeWidth="0.5" />
          {i === 0 && (
            <circle cx={x} cy={y} r={r} fill="none" stroke="#cdfa50" strokeWidth="0.4">
              <animate attributeName="r" values={`${r};${r + 8}`} dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0" dur="2.4s" repeatCount="indefinite" />
            </circle>
          )}
        </g>
      ))}
    </svg>
  );
}
