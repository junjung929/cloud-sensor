import { injectGlobal } from "styled-components";

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
    min-width: 100%;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  }

  th {
    text-align: center
  }
  a:hover, a:active, a:visited {
    text-decoration: none;
  }

  .divisionLine {
    clear: both;
    height: 1vh
  }

  .btn-default {
    border: 1px solid gray
  }
`;
