import { measurements } from "@jscad/modeling"
import { expect, test } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { BoardGeomBuilder } from "src/BoardGeomBuilder"

const BOARD_EDGE_X = 10
const PIXELS_PER_MM = 1200

const circuitJson: AnyCircuitElement[] = [
  {
    type: "pcb_board",
    pcb_board_id: "board_0",
    center: { x: 0, y: 0 },
    width: 20,
    height: 20,
    thickness: 1.4,
    material: "fr4",
    num_layers: 2,
  },
  {
    type: "pcb_plated_hole",
    pcb_plated_hole_id: "edge_hole",
    shape: "circle",
    x: 10,
    y: 0,
    hole_diameter: 2,
    outer_diameter: 5,
    layers: ["top", "bottom"],
  },
]

test("renders plated-hole edge clipping repro", () => {
  const builder = new BoardGeomBuilder(circuitJson, () => {})
  while (!builder.step(10)) {}

  const platedHoleGeom = (builder as unknown as { platedHoleGeoms: any[] })
    .platedHoleGeoms[0]
  const copperMaxX = measurements.measureBoundingBox(platedHoleGeom)[1][0]
  const overhang = copperMaxX - BOARD_EDGE_X
  const edgeX = 500
  const copperMaxSvgX = edgeX + overhang * PIXELS_PER_MM

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
      <rect width="800" height="400" fill="#f8fafc" />
      <text x="40" y="52" font-family="sans-serif" font-size="24" font-weight="700" fill="#172033">
        Plated-hole copper exceeds the board edge
      </text>
      <rect x="40" y="110" width="460" height="180" rx="4" fill="#247a52" />
      <text x="64" y="145" font-family="sans-serif" font-size="18" fill="#ffffff">PCB</text>
      <rect x="300" y="165" width="${copperMaxSvgX - 300}" height="70" rx="8" fill="#d99b2b" />
      <rect x="${edgeX}" y="165" width="${copperMaxSvgX - edgeX}" height="70" fill="#e34850" />
      <line x1="${edgeX}" y1="90" x2="${edgeX}" y2="315" stroke="#172033" stroke-width="3" stroke-dasharray="9 7" />
      <text x="${edgeX - 12}" y="340" text-anchor="end" font-family="sans-serif" font-size="18" fill="#172033">
        board edge x=${BOARD_EDGE_X.toFixed(2)} mm
      </text>
      <line x1="${copperMaxSvgX}" y1="145" x2="${copperMaxSvgX}" y2="255" stroke="#b4232a" stroke-width="3" />
      <text x="${copperMaxSvgX + 14}" y="190" font-family="sans-serif" font-size="18" font-weight="700" fill="#b4232a">
        copper x=${copperMaxX.toFixed(2)} mm
      </text>
      <text x="${copperMaxSvgX + 14}" y="218" font-family="sans-serif" font-size="17" fill="#b4232a">
        +${overhang.toFixed(2)} mm overhang
      </text>
    </svg>
  `.trim()

  expect(svg).toMatchSvgSnapshot(import.meta.path)
})
