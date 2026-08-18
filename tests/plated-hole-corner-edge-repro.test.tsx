import { expect, test } from "bun:test"
import { Circuit } from "@tscircuit/core"
import type { PcbBoard, PcbPlatedHole } from "circuit-json"

test("reproduction: plated holes at board corners and edges exceed board boundaries", () => {
  const circuit = new Circuit()

  circuit.add(
    <board width="20mm" height="20mm">
      {/* Corner Plated Hole at (10, 10) */}
      <platedhole
        shape="circle"
        pcbX={10}
        pcbY={10}
        holeDiameter={2}
        outerDiameter={4}
      />
      {/* Edge Plated Hole at (10, 0) */}
      <platedhole
        shape="circle"
        pcbX={10}
        pcbY={0}
        holeDiameter={2}
        outerDiameter={5}
      />
      {/* Edge Plated Hole at (-10, 0) */}
      <platedhole
        shape="circle"
        pcbX={-10}
        pcbY={0}
        holeDiameter={1}
        outerDiameter={3}
      />
      {/* Edge Plated Hole with Rectangular Pad at (5, 10) */}
      <platedhole
        shape="circular_hole_with_rect_pad"
        holeDiameter={1.5}
        rectPadWidth={3}
        rectPadHeight={3}
        pcbX={5}
        pcbY={10}
      />
    </board>,
  )

  const circuitJson = circuit.getCircuitJson()

  const boards = circuitJson.filter(
    (el): el is PcbBoard => el.type === "pcb_board",
  )
  expect(boards.length).toBe(1)
  const board = boards[0]
  expect(board.width).toBe(20)
  expect(board.height).toBe(20)

  const boardMinX = (board.center?.x ?? 0) - board.width / 2 // -10
  const boardMaxX = (board.center?.x ?? 0) + board.width / 2 // +10
  const boardMinY = (board.center?.y ?? 0) - board.height / 2 // -10
  const boardMaxY = (board.center?.y ?? 0) + board.height / 2 // +10

  const platedHoles = circuitJson.filter(
    (el): el is PcbPlatedHole => el.type === "pcb_plated_hole",
  )
  expect(platedHoles.length).toBe(4)

  // Verify corner plated hole at (10, 10) extends beyond both X and Y board edges
  const cornerHole = platedHoles.find((h) => h.x === 10 && h.y === 10)
  expect(cornerHole).toBeDefined()
  const cornerOuterRadius = (cornerHole?.outer_diameter ?? 4) / 2
  expect(cornerHole!.x + cornerOuterRadius).toBeGreaterThan(boardMaxX) // 10 + 2 = 12 > 10
  expect(cornerHole!.y + cornerOuterRadius).toBeGreaterThan(boardMaxY) // 10 + 2 = 12 > 10

  // Verify edge plated hole at (10, 0) extends beyond right board edge
  const rightEdgeHole = platedHoles.find((h) => h.x === 10 && h.y === 0)
  expect(rightEdgeHole).toBeDefined()
  const rightOuterRadius = (rightEdgeHole?.outer_diameter ?? 5) / 2
  expect(rightEdgeHole!.x + rightOuterRadius).toBeGreaterThan(boardMaxX) // 10 + 2.5 = 12.5 > 10

  // Verify edge plated hole at (-10, 0) extends beyond left board edge
  const leftEdgeHole = platedHoles.find((h) => h.x === -10 && h.y === 0)
  expect(leftEdgeHole).toBeDefined()
  const leftOuterRadius = (leftEdgeHole?.outer_diameter ?? 3) / 2
  expect(leftEdgeHole!.x - leftOuterRadius).toBeLessThan(boardMinX) // -10 - 1.5 = -11.5 < -10
})
