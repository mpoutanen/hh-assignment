// It is your job to implement this. More info in README

import * as React from 'react';
import { HexGrid, Layout, Hexagon, GridGenerator } from 'react-hexgrid';

import colormap from 'colormap';

const N_SHADES = 40;

let colors = colormap({
  colormap: 'jet',
  nshades: N_SHADES,
  format: 'hex',
  alpha: 1,
});

interface IHexProps {
  i: number;
  q: number;
  r: number;
  s: number;
  value: number;
}

const DrawHex: React.FC<IHexProps> = props => {
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
    />
  );
};

interface IGridProps {
  users: {
    id: number;
    department: {
      id: number;
      name: string;
    };
    risk?: number;
  }[];
}

export const Grid: React.FC<IGridProps> = ({ users }) => {
  if (!users) {
    return null;
  }

  // TODO Implement org based split
  // TODO Shape is pretty weird? and it will brake if data size changes, now it works as 101*114 = 11514
  const hexagons = GridGenerator.parallelogram(0, 101, 0, 111);
  const Hexes = hexagons.map((hex, i) => (
    <DrawHex {...hex} i={i} value={users[i].risk} />
  ));
  return (
    <div id='Grid'>
      <HexGrid width={1200} height={800} viewBox='0 0 100 100'>
        <Layout
          size={{ x: 0.5, y: 0.5 }}
          flat={true}
          spacing={1.1}
          origin={{ x: 0, y: 0 }}
        >
          {Hexes}
        </Layout>
      </HexGrid>
    </div>
  );
};
