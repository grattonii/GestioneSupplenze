import { pie, arc } from "d3";

function ReportGrafico({ data }) {
  const radius = 420; // Dimensioni base del grafico
  const gap = 0.02; // Gap tra le fette
  const lightStrokeEffect = 10; // Effetto luce 3D attorno alle fette

  // Layout del grafico a torta e generatore di arco
  const pieLayout = pie()
    .value((d) => d.value)
    .padAngle(gap); // Gap tra le fette

  // Impostazione dell'innerRadius per creare la forma della ciambella
  const innerRadius = radius / 1.625;
  const arcGenerator = arc()
    .innerRadius(innerRadius)
    .outerRadius(radius)
    .cornerRadius(lightStrokeEffect + 2); // Angoli arrotondati

  // Generatore di arco per il percorso del clip che corrisponde al percorso esterno dell'arco
  const arcClip = arc()
    .innerRadius(innerRadius + lightStrokeEffect / 2)
    .outerRadius(radius)
    .cornerRadius(lightStrokeEffect + 2) || undefined;

  const labelRadius = radius * 0.825;
  const arcLabel = arc().innerRadius(labelRadius).outerRadius(labelRadius);

  const arcs = pieLayout(data);

  // Calcolare l'angolo per ogni fetta
  function computeAngle(d) {
    return ((d.endAngle - d.startAngle) * 180) / Math.PI;
  }

  // Angolo minimo per visualizzare il testo
  const minAngle = 20;

  const colors = ["#7e4cfe", "#895cfc", "#956bff", "#a37fff", "#b291fd", "#b597ff"]; // Colori delle fette

  return (
    <div className="donut-chart-container">
      {/* Testo centrato sopra il grafico */}
      <div className="donut-chart-text">
        <p className="total-text">Total</p>
        <p className="total-value">184</p>
      </div>
      <svg
        viewBox={`-${radius} -${radius} ${radius * 2} ${radius * 2}`}
        className="donut-chart-svg"
      >
        {/* Fette */}
        {arcs.map((d, i) => (
          <clipPath key={`donut-c1-clip-${i}`} id={`donut-c1-clip-${i}`}>
            <path d={arcClip(d) || undefined} />
            <linearGradient key={i} id={`donut-c1-gradient-${i}`}>
              <stop offset="55%" stopColor={colors[i]} stopOpacity={0.95} />
            </linearGradient>
          </clipPath>
        ))}

        {/* Etichette con rendering condizionale */}
        {arcs.map((d, i) => {
          const angle = computeAngle(d);
          let centroid = arcLabel.centroid(d);
          if (d.endAngle > Math.PI) {
            centroid[0] += 10;
            centroid[1] += 0;
          } else {
            centroid[0] -= 20;
            centroid[1] -= 0;
          }

          return (
            <g key={i}>
              <g clipPath={`url(#donut-c1-clip-${i})`}>
                <path
                  fill={`url(#donut-c1-gradient-${i})`}
                  className="donut-slice"
                  stroke="#ffffff33" // Stroke più chiaro per un effetto 3D
                  strokeWidth={lightStrokeEffect} // Larghezza del bordo per l'effetto desiderato
                  d={arcGenerator(d) || undefined}
                />
              </g>

              <g className="donut-labels" opacity={angle > minAngle ? 1 : 0}>
                <text transform={`translate(${centroid})`} textAnchor="middle" fontSize={38}>
                  <tspan y="-0.4em" fontWeight="600" fill="#eee">
                    {d.data.name}
                  </tspan>
                  {angle > minAngle && (
                    <tspan x={0} y="0.7em" fillOpacity={0.7} fill="#eee">
                      {d.data.value.toLocaleString("en-US")}% {/* Visualizza la percentuale */}
                    </tspan>
                  )}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default ReportGrafico;