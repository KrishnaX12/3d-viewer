import { expect, test } from "bun:test"
import * as jscadModeling from "@jscad/modeling"
import type { AnyCircuitElement } from "circuit-json"
import { BoardGeomBuilder } from "src/BoardGeomBuilder"

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

test("clips plated-hole copper flush with the board edge", () => {
  const builder = new BoardGeomBuilder(circuitJson, () => {})
  while (!builder.step(10)) {}

  const platedHoleGeoms = (builder as any).platedHoleGeoms
  const boundingBox = jscadModeling.measurements.measureBoundingBox(
    platedHoleGeoms[0],
  )

  // A 20 mm board centered at the origin ends at x=10. The unfixed geometry
  // reaches x=10.05 because the clipping volume extends beyond the board.
  expect(boundingBox[1][0]).toBeCloseTo(10, 4)
})
