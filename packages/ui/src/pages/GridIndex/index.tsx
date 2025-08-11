import * as React from "react";
import { gql, useQuery } from "urql";
import styled from "styled-components";

import { TopBar } from "../../components/TopBar";

import { Grid } from "../../components/Grid";
import { Sidebar } from "../../components/Sidebar";
import type { User } from "../../types/types";

interface IHeroIndexProps {}

// GraphQL queries to fetch users and department summaries
// These queries should match the schema defined in the server code

const userRiskQuery = gql`
  query GetUsers($departmentId: ID!) {
    users(departmentId: $departmentId) {
      id
      department {
        id
        name
      }
      risk
    }
  }
`;

const departmentSummaryQuery = gql`
  query GetDepartmentSummary {
    departments {
      id
      name
      userCount
    }
  }
`;

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

const handleNoData = () => <div>No data!</div>;

const handleError = (message: string) => <div>Error! {message}</div>;

/**
 * Groups users by their department.
 * Returns an object where the keys are department names and the values are arrays of users.
 */

export const GridIndex: React.FC<IHeroIndexProps> = () => {
  const [activeDepartment, setActiveDepartment] = React.useState<number>(0);
  // Queries to fetch users and department summaries
  const [userResult] = useQuery<{
    users: User[];
  }>({
    query: userRiskQuery,
    variables: {
      departmentId: activeDepartment, // Fetch first department by default
    },
  });

  const [departmentResult] = useQuery<{
    departments: { name: string; userCount: number; id: number }[];
  }>({
    query: departmentSummaryQuery,
  });

  // Combine the results from both queries for fetching and error handling
  const queryResults = [userResult, departmentResult];

  const isFetching = queryResults.some((result) => result.fetching);
  const firstError = queryResults.find((result) => result.error)?.error;

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (firstError) {
    return handleError(firstError.message);
  }

  if (!userResult.data) {
    return handleNoData();
  }

  const departmentUsers = userResult.data?.users;

  const departments =
    departmentResult.data?.departments?.reduce(
      (acc, { userCount, id, name }) => {
        acc[name] = {
          userCount,
          id,
        };
        return acc;
      },
      {} as Record<string, { userCount: number; id: number }>
    ) ?? {};

  const handleDepartmentClick = (departmentId: number) => {
    setActiveDepartment(departmentId);
  };

  return (
    <>
      <TopBar />
      <GridContainer>
        <Sidebar
          departments={departments}
          activeDepartment={activeDepartment}
          onDepartmentClick={handleDepartmentClick}
        />
        <Grid users={departmentUsers} />
      </GridContainer>
    </>
  );
};
