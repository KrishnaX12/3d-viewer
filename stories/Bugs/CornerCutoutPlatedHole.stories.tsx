import { CadViewer } from "src/CadViewer"

/**
 * Super simple reproduction: A single large plated hole placed on the board edge
 * creating a half/semi-circular cutout, demonstrating the extra copper pad
 * protruding outside the board boundary.
 */
export const SingleBigEdgeSemiHole = () => (
  <CadViewer>
    <board width="20mm" height="20mm">
      {/* One single large plated hole on the right edge (x = 10mm) */}
      <platedhole
        shape="circle"
        pcbX={10}
        pcbY={0}
        holeDiameter={6}
        outerDiameter={10}
      />
    </board>
  </CadViewer>
)

SingleBigEdgeSemiHole.storyName = "Single Big Edge Semi-Hole (Repro)"

export default {
  title: "Bugs/Single Big Edge Semi-Hole",
  component: SingleBigEdgeSemiHole,
}
