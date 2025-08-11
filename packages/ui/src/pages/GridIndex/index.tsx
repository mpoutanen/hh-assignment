import * as React from 'react';
import { gql, useQuery } from 'urql';
import styled from 'styled-components';

import { TopBar } from '../../components/TopBar';
import { Section } from '../../components/Section';
import { Footer } from '../../components/Footer';
import { Grid } from '../../components/Grid';

const userRiskQuery = gql`
  query GetUsers {
    users {
      id
      department {
        id
        name
      }
      risk
    }
  }
`;

interface IHeroIndexProps {}

const GridContainer = styled.div`
  display: flex;
  padding: 10px;
  align-self: center;
  max-width: 1150px;
  @media (min-width: 1400px) {
    margin-left: auto;
    margin-right: auto;
  }
`;

const handleLoading = () => <div>Loading...</div>;

const handleNoData = () => <div>No data!</div>;

const handleError = (message: string) => <div>Error! {message}</div>;

type User = {
  id: number;
  department: { id: number; name: string };
  risk: number;
};

export const GridIndex: React.FC<IHeroIndexProps> = () => {
  const [result] = useQuery<{
    users: User[];
  }>({
    query: userRiskQuery,
  });

  if (result.fetching) {
    return handleLoading();
  }

  if (result.error) {
    return handleError(result.error.message);
  }

  if (!result.data) {
    return handleNoData();
  }

  return (
    <main>
      <TopBar />
      <Section heading={'Organization Risk Matrix'} paragraph={``} />

      {/** Improve this section. Data provided is defined on top in GraphQL query. You can decide what you use and what you dont't.*/}
      <GridContainer>{<Grid users={result.data.users} />}</GridContainer>

      <Footer />
    </main>
  );
};
