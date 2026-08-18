import { CadViewer } from "src/CadViewer"
import { Circuit } from "@tscircuit/core"

/**
 * Reproduction story for asymmetric 3-pin SOT-23 components (e.g. C2891263 / XC6206P282MR-G)
 * placed on layer="bottom".
 *
 * SOT-23 has 2 pins on one side and 1 pin on the other side.
 * When placed on layer="top", pins align with pads.
 * When placed on layer="bottom", the CAD model orientation can become flipped/mirrored
 * relative to the bottom copper pads.
 */
export const Sot23BottomOrientation = () => {
  const circuit = new Circuit()

  circuit.add(
    <board width="30mm" height="20mm">
      {/* Top Layer SOT-23 */}
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

      {/* Bottom Layer SOT-23 */}
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

  return <CadViewer circuitJson={circuitJson as any} />
}

export default {
  title: "Bugs/Sot23BottomOrientation",
  component: Sot23BottomOrientation,
}
