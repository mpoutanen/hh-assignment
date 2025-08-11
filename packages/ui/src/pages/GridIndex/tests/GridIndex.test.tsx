import React from "react";

import { describe, it, expect } from "vitest";

import { render, screen } from "@testing-library/react";
import { fromValue } from "wonka";
import { Provider } from "urql";
import { GridIndex } from "..";

function getMockUsers(count: number, name: string = "Engineering") {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    department: {
      id: 1,
      name,
    },
    risk: name === "Engineering" ? 0 : i % 2 === 0 ? 0 : 1, // Alternate risk values
  }));
}

describe("Home", () => {
  it("renders grid index without data", () => {
    const responseState = {
      executeQuery: () =>
        fromValue({
          data: {},
        }),
    } as any;

    render(
      <Provider value={responseState}>
        <GridIndex />
      </Provider>
    );

    expect(screen.getByText("Organization Risk Matrix")).toBeInTheDocument();
  });

  it("renders grid index with data", () => {
    const responseState = {
      executeQuery: () =>
        fromValue({
          data: {
            users: getMockUsers(25),
          },
        }),
    } as any;

    render(
      <Provider value={responseState}>
        <GridIndex />
      </Provider>
    );

    expect(screen.getByText("Organization Risk Matrix")).toBeInTheDocument();
  });
});
