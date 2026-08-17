import { CadViewer } from "src/CadViewer"

export const rightEdgePlatedHole = () => (
  <CadViewer>
    <board width="20mm" height="20mm">
      <platedhole
        shape="circle"
        pcbX={10}
        pcbY={0}
        holeDiameter={2}
        outerDiameter={5}
      />
    </board>
  </CadViewer>
)

rightEdgePlatedHole.storyName = "Right Edge Plated Hole (Unfixed)"

export default {
  title: "Repros/Plated Hole Edge Clipping",
}
