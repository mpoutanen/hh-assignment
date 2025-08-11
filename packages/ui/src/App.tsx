import React from 'react';
import styled from 'styled-components';
import { GridIndex } from './pages/GridIndex';
import { GraphqlProvider } from './providers/graphql';
import { GlobalStyles } from './styles/styles';

const StyledApp = styled.main``;

const App = () => {
  return (
    <>
      <GlobalStyles />
      <GraphqlProvider>
        <StyledApp>
          <GridIndex />;
        </StyledApp>
      </GraphqlProvider>
    </>
  );
};

export default App;
