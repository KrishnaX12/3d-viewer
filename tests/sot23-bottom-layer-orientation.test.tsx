import { expect, test } from "bun:test"
import { Circuit } from "@tscircuit/core"
import type { CadComponent, PcbComponent, PcbSmtPad } from "circuit-json"
import { getCadModelTransform } from "../src/utils/cad-model-transform"

test("reproduction: SOT-23 (C2891263) circuit json generation on top vs bottom layer", () => {
  const circuit = new Circuit()

  circuit.add(
    <board width="30mm" height="20mm">
      <chip
        name="U1_TOP"
        footprint="sot23"
        supplierPartNumbers={{
          jlcpcb: ["C2891263"],
        }}
        layer="top"
        pcbX="-7mm"
        pcbY="0mm"
      />
      <chip
        name="U2_BOTTOM"
        footprint="sot23"
        supplierPartNumbers={{
          jlcpcb: ["C2891263"],
        }}
        layer="bottom"
        pcbX="7mm"
        pcbY="0mm"
      />
    </board>,
  )

  const circuitJson = circuit.getCircuitJson()

  const pcbComponents = circuitJson.filter(
    (el): el is PcbComponent => el.type === "pcb_component",
  )
  expect(pcbComponents.length).toBe(2)

  const topComponent = pcbComponents.find((c) => c.layer === "top")
  const bottomComponent = pcbComponents.find((c) => c.layer === "bottom")

  expect(topComponent).toBeDefined()
  expect(bottomComponent).toBeDefined()

  // Verify pad placement parity
  const smtPads = circuitJson.filter(
    (el): el is PcbSmtPad => el.type === "pcb_smtpad",
  )
  const topPads = smtPads.filter((p) => p.layer === "top")
  const bottomPads = smtPads.filter((p) => p.layer === "bottom")

  expect(topPads.length).toBe(3)
  expect(bottomPads.length).toBe(3)

  // Verify CAD component transform resolution
  const cadComponents = circuitJson.filter(
    (el): el is CadComponent => el.type === "cad_component",
  )

  for (const cad of cadComponents) {
    const isBottom = cad.pcb_component_id === bottomComponent?.pcb_component_id
    const transform = getCadModelTransform(cad, {
      layer: isBottom ? "bottom" : "top",
      pcbThickness: 1.4,
      modelType: "obj",
    })

    expect(transform).toBeDefined()
    expect(transform.position).toBeDefined()
  }
})
