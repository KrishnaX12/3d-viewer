import { expect, test } from "bun:test"
import { Circuit } from "@tscircuit/core"
import type { PcbBoard, PcbPlatedHole } from "circuit-json"

test("reproduction: single big edge semi-hole exceeds board boundary", () => {
  const circuit = new Circuit()

  circuit.add(
    <board width="20mm" height="20mm">
      {/* Single big semi-hole on the right edge (x = 10) */}
      <platedhole
        shape="circle"
        pcbX={10}
        pcbY={0}
        holeDiameter={6}
        outerDiameter={10}
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

  const boardMaxX = (board.center?.x ?? 0) + board.width / 2 // +10

  const platedHoles = circuitJson.filter(
    (el): el is PcbPlatedHole => el.type === "pcb_plated_hole",
  )
  expect(platedHoles.length).toBe(1)

  const edgeHole = platedHoles[0]
  expect(edgeHole.x).toBe(10)
  expect(edgeHole.hole_diameter).toBe(6)
  expect(edgeHole.outer_diameter).toBe(10)

  // Outer pad radius is 5mm, centered at x=10mm -> extends to x=15mm (5mm outside board boundary)
  const outerRadius = (edgeHole.outer_diameter ?? 10) / 2
  expect(edgeHole.x + outerRadius).toBe(15)
  expect(edgeHole.x + outerRadius).toBeGreaterThan(boardMaxX)
})
