import { createGlobalStyle } from 'styled-components';

/**
 * Default set of global styles, good to have on every project to override browsers nasty defaults
 */
const Styles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    box-sizing: inherit;
    width: 100%;
  }

  // Scrollbar styles 
  html {
    scrollbar-width: thin;
  }

  body::-webkit-scrollbar {
    width: 6px;
  }

  body::-webkit-scrollbar-thumb {
    background-color: var(--black);
    border-radius: 10px;
  }

  body {
    margin: 0 auto;
    font-family: 'Poppins';
  }

  ul, li, ol {
    list-style: none;
  }

  a {
    text-decoration: none;
  }
`;

// Casting shenanigans due incompatibility with React 18, ref: https://github.com/styled-components/styled-components/issues/3738
export const GlobalStyles = Styles as any as React.FC
