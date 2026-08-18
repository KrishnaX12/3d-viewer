import { CadViewer } from "src/CadViewer"

/**
 * Reproduction story for unfixed extra copper pads protruding beyond board edges and corner cutouts.
 *
 * When plated holes (circular, pill, or rectangular pads) are placed on the outer board perimeter
 * or at the corners of a board (e.g. castellated pads, mounting holes, or corner cutouts),
 * their copper annular rings and pads extend outside the PCB boundary into empty space.
 */
export const BoardWithCornerAndEdgePlatedHoles = () => (
  <CadViewer>
    <board width="20mm" height="20mm">
      {/* 1. Corner Plated Holes (Protrude in both X and Y directions) */}
      <platedhole
        shape="circle"
        pcbX={10}
        pcbY={10}
        holeDiameter={2}
        outerDiameter={4}
      />
      <platedhole
        shape="circle"
        pcbX={-10}
        pcbY={10}
        holeDiameter={2}
        outerDiameter={4}
      />
      <platedhole
        shape="circle"
        pcbX={10}
        pcbY={-10}
        holeDiameter={2}
        outerDiameter={4}
      />
      <platedhole
        shape="circle"
        pcbX={-10}
        pcbY={-10}
        holeDiameter={2}
        outerDiameter={4}
      />

      {/* 2. Edge Plated Holes (Protrude past board edges) */}
      <platedhole
        shape="circle"
        pcbX={10}
        pcbY={0}
        holeDiameter={2}
        outerDiameter={5}
      />
      <platedhole
        shape="circle"
        pcbX={-10}
        pcbY={0}
        holeDiameter={1}
        outerDiameter={3}
      />
      <platedhole
        shape="circle"
        pcbX={0}
        pcbY={10}
        holeDiameter={2}
        outerDiameter={4}
      />
      <platedhole
        shape="circle"
        pcbX={0}
        pcbY={-10}
        holeDiameter={2}
        outerDiameter={4}
      />

      {/* 3. Rectangular / Pill Pad on Edge */}
      <platedhole
        shape="circular_hole_with_rect_pad"
        holeDiameter={1.5}
        rectPadWidth={3}
        rectPadHeight={3}
        pcbX={5}
        pcbY={10}
      />
    </board>
  </CadViewer>
)

BoardWithCornerAndEdgePlatedHoles.storyName =
  "Corner & Edge Plated Holes with Protruding Copper"

export default {
  title: "Bugs/Corner & Edge Plated Hole Cutout",
  component: BoardWithCornerAndEdgePlatedHoles,
}
