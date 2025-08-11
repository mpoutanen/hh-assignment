import * as React from "react";
import styled from "styled-components";

const StyledLink = styled.a`
  color: #e0e6f6;
  text-decoration: none;
  text-transform: uppercase;
  transition: color 150ms;
  &:hover {
    color: #b0b8d1;
    cursor: pointer;
  }
  &.active {
    color: #ffcc00;
    cursor: default;
    pointer-events: none;
  }
`;

const DepartmentSize = styled.span`
  font-size: 0.8em;
  color: #b0b8d1;
`;

const StyledSidebar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background: #001147;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
  z-index: 100;
`;

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 50px;
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: center;
    justify-content: space-around;
  }
`;

interface ISideBarProps {
  departments: Record<string, { userCount: number; id: number }>;
  activeDepartment: number;
  onDepartmentClick: (departmentId: number) => void;
}

export const Sidebar: React.FC<ISideBarProps> = ({
  departments,
  activeDepartment,
  onDepartmentClick,
}) => {
  return (
    <StyledSidebar>
      <Container>
        <ul>
          {Object.entries(departments).map(
            ([name, { userCount, id }], index) => (
              <li
                key={index}
                onClick={() => activeDepartment !== id && onDepartmentClick(id)}
              >
                <StyledLink className={activeDepartment === id ? "active" : ""}>
                  {name} <DepartmentSize>({userCount})</DepartmentSize>{" "}
                </StyledLink>
              </li>
            )
          )}
        </ul>
      </Container>
    </StyledSidebar>
  );
};
