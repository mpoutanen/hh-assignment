import React from 'react';

import { describe, it, expect } from 'vitest';

import { render, screen } from '@testing-library/react';
import { fromValue } from 'wonka';
import { Provider } from 'urql';
import { GridIndex } from '..';

describe('Home', () => {
  it('renders grid index without data', () => {
    const responseState = {
      executeQuery: () =>
        fromValue({
          data: {},
        }),
    } as any;

    render(
      <Provider value={responseState}>
        <GridIndex />
      </Provider>,
    );

    expect(screen.getByText('Organization Risk Matrix')).toBeInTheDocument();
  });

  // TODO: This test fails. <GridIndex> seems "a little" constrained in terms
  // of what inputs it works with. That's something to improve on!
  it('renders grid index with data', () => {
    const responseState = {
      executeQuery: () =>
        fromValue({
          data: {
            users: [
              {
                id: 1,
                department: {
                  id: 1,
                  name: 'Engineering',
                },
                // Engineers are safe.
                risk: 0,
              },
            ],
          },
        }),
    } as any;

    render(
      <Provider value={responseState}>
        <GridIndex />
      </Provider>,
    );

    expect(screen.getByText('Organization Risk Matrix')).toBeInTheDocument();
  });
});
