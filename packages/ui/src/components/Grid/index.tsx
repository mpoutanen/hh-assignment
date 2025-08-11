import * as React from "react";
import { HexGrid, Layout, Hexagon, GridGenerator } from "react-hexgrid";
import colormap from "colormap";
import styled from "styled-components";
import { IGridProps, User } from "../../types/types";

interface IHexProps {
  i: number;
  q: number;
  r: number;
  s: number;
  value: number;
  isActive?: boolean;
  onMouseEnter: (activeNode: number) => void;
  onMouseLeave: () => void;
}
type HexSize = {
  x: number;
  y: number;
};

const StyledHeader = styled.h3`
  color: #001147;
  margin: 16px 0;
  text-transform: capitalize;
`;

const Container = styled.div`
  position: absolute;
  left: 250px;
  max-width: 1250px;
  padding: 24px;
  width: 100%;
`;

/*
 ** Set an arbitrary maximum number of items per grid to avoid oversized grids
 ** 40 rows * 40 columns = 1600 items
 ** Consult with design team for better UX
 */
const MAX_ITEMS_PER_GRID = 1600; // 40 rows * 40 columns

// Define a fixed number of color shades to use for the hexagons
const N_SHADES = 40;

const DrawHex: React.FC<IHexProps> = (props) => {
  const colorIndex = Math.floor(props.value * N_SHADES);
  return (
    <Hexagon
      key={props.i}
      q={props.q}
      r={props.r}
      s={props.s}
      cellStyle={{
        fill: colors[colorIndex],
      }}
      onMouseEnter={() => props.onMouseEnter(props.i)}
      onMouseLeave={() => props.onMouseLeave()}
    />
  );
};

const colors = colormap({
  colormap: "jet",
  nshades: N_SHADES,
  format: "hex",
  alpha: 1,
});

/**
 * This function builds the hex grid based on the users provided
 * It calculates the grid size based on the number of users and their departments
 */

function buildHexGrid(users: User[]) {
  const totalUsers = users.length;
  const gridWidth = Math.ceil(Math.sqrt(totalUsers));
  const gridHeight = Math.ceil(totalUsers / gridWidth);
  const hexagons = GridGenerator.orientedRectangle(gridWidth, gridHeight);

  return { hexagons, gridWidth, gridHeight };
}

function getHexGridDimensions(
  hexSize: HexSize,
  gridWidth: number,
  gridHeight: number
) {
  const padding = 150;

  // Use precise geometric calculations for a flat-topped grid
  const hexFullWidth = hexSize.x * 2;
  const hexFullHeight = Math.sqrt(3) * hexSize.y;

  // Calculate the total pixel span of the grid from edge to edge
  const contentWidth = (gridWidth - 1) * (hexSize.x * 1.5) + hexFullWidth;
  const contentHeight = (gridHeight - 1) * (hexSize.y * 1.5) + hexFullHeight;

  // The viewBox needs to be large enough for the content PLUS padding on both sides
  const viewBoxWidth = contentWidth + padding;
  const viewBoxHeight = contentHeight + padding;

  return { viewBoxWidth, viewBoxHeight };
}

export const Grid: React.FC<IGridProps> = ({ users, loading }) => {
  if (!users || !Object.values(users).length) {
    return null;
  }

  const showLoading = () => <div>Loading...</div>;

  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const handleHoveredIndex = (index: number | null) => {
    setHoveredIndex(index);
  };

  const displayGroups: Record<string, User[]> = {};

  // If the number of users is less than or equal to MAX_ITEMS_PER_GRID, display them in a single group
  // Otherwise, split them into groups based on their department
  // Temporary measure to avoid oversized grids
  if (users.length <= MAX_ITEMS_PER_GRID) {
    displayGroups[users[0].department.name] = users;
  } else {
    const numChunks = Math.ceil(users.length / MAX_ITEMS_PER_GRID);
    for (let i = 0; i < numChunks; i++) {
      const chunk = users.slice(
        i * MAX_ITEMS_PER_GRID,
        (i + 1) * MAX_ITEMS_PER_GRID
      );
      const departmentName = chunk[0].department.name;
      const newGroupName = `${departmentName} ${i + 1}`;
      displayGroups[newGroupName] = chunk;
    }
  }

  if (loading) {
    return <Container>{showLoading()}</Container>;
  }

  return (
    <Container>
      {/* Ideally we would have a single group with all users */}
      {Object.entries(displayGroups).map(([groupName, groupUsers]) => {
        const hexSize = { x: 10, y: 10 }; // Adjust size as needed
        const { hexagons, gridWidth, gridHeight } = buildHexGrid(groupUsers);
        const { viewBoxWidth, viewBoxHeight } = getHexGridDimensions(
          hexSize,
          gridWidth,
          gridHeight
        );

        // Start the viewBox from a negative coordinate to create top/left margin
        const viewBox = `-10 -10 ${viewBoxWidth} ${viewBoxHeight}`;

        return (
          <div key={groupName}>
            <div>
              <StyledHeader>{groupName}</StyledHeader>
              <HexGrid
                width={viewBoxWidth}
                height={viewBoxHeight}
                viewBox={viewBox}
              >
                <Layout
                  size={hexSize}
                  flat={true}
                  spacing={1.05}
                  origin={{ x: 0, y: 0 }}
                >
                  {hexagons.map((hex, i) => (
                    <DrawHex
                      {...hex}
                      key={i}
                      i={i}
                      value={groupUsers[i]?.risk ?? 0}
                      onMouseEnter={() => handleHoveredIndex(i)}
                      onMouseLeave={() => handleHoveredIndex(null)}
                    />
                  ))}
                </Layout>
              </HexGrid>
            </div>
          </div>
        );
      })}
    </Container>
  );
};
