import { injectGlobal } from "styled-components";

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
    min-width: 100%;
    top: 0px !important;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  }
  
  #home {
    min-height: 100vh;
  }
  th, td {
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

  .table-responsive {
    display: inline-table;
  }
  svg.Modal-closeIcon-0-1-4 {
    display: none;
  }
  .react-tags {
    position: relative;
    padding: 6px 0 0 6px;
    border: 1px solid #D1D1D1;
    border-radius: 1px;
    z-index: 1;
  
    /* shared font styles */
    font-size: 1em;
    line-height: 1.2;
  
    /* clicking anywhere will focus the input */
    cursor: text;
  }
  
  .react-tags.is-focused {
    border-color: #B1B1B1;
  }
  
  .react-tags__selected {
    display: inline;
  }
  
  .react-tags__selected-tag {
    display: inline-block;
    box-sizing: border-box;
    margin: 0 6px 6px 0;
    padding: 6px 8px;
    border: 1px solid #D1D1D1;
    border-radius: 2px;
    background: #F1F1F1;
  
    /* match the font styles */
    font-size: inherit;
    line-height: inherit;
  }
  
  .react-tags__selected-tag:after {
    content: '\\2715';
    color: #AAA;
    margin-left: 8px;
  }
  
  .react-tags__selected-tag:hover,
  .react-tags__selected-tag:focus {
    border-color: #B1B1B1;
  }
  
  .react-tags__search {
    display: inline-block;
  
    /* match tag layout */
    padding: 7px 2px;
    margin-bottom: 6px;
  
    /* prevent autoresize overflowing the container */
    max-width: 100%;
  }
  
  @media screen and (min-width: 30em) {
  
    .react-tags__search {
      /* this will become the offsetParent for suggestions */
      position: relative;
    }
  
  }
  
  .react-tags__search input {
    /* prevent autoresize overflowing the container */
    max-width: 100%;
  
    /* remove styles and layout from this element */
    margin: 0;
    padding: 0;
    border: 0;
    outline: none;
  
    /* match the font styles */
    font-size: inherit;
    line-height: inherit;
  }
  
  .react-tags__search input::-ms-clear {
    display: none;
  }
  
  .react-tags__suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
  }
  
  @media screen and (min-width: 30em) {
  
    .react-tags__suggestions {
      width: 240px;
    }
  
  }
  
  .react-tags__suggestions ul {
    margin: 4px -1px;
    padding: 0;
    list-style: none;
    background: white;
    border: 1px solid #D1D1D1;
    border-radius: 2px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
  
  .react-tags__suggestions li {
    border-bottom: 1px solid #ddd;
    padding: 6px 8px;
  }
  
  .react-tags__suggestions li mark {
    text-decoration: underline;
    background: none;
    font-weight: 600;
  }
  
  .react-tags__suggestions li:hover {
    cursor: pointer;
    background: #eee;
  }
  
  .react-tags__suggestions li.is-active {
    background: #b7cfe0;
  }
  
  .react-tags__suggestions li.is-disabled {
    opacity: 0.5;
    cursor: auto;
  }

  .fadeIn{
    color:white;
    -webkit-animation: fadein 0.7s; /* Safari, Chrome and Opera > 12.1 */
       -moz-animation: fadein 0.7s; /* Firefox < 16 */
        -ms-animation: fadein 0.7s; /* Internet Explorer */
         -o-animation: fadein 0.7s; /* Opera < 12.1 */
            animation: fadein 0.7s;
  }

  @keyframes fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
  }

  /* Firefox < 16 */
  @-moz-keyframes fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
  }

  /* Safari, Chrome and Opera > 12.1 */
  @-webkit-keyframes fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
  }

  /* Internet Explorer */
  @-ms-keyframes fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
  }

  /* Opera < 12.1 */
  @-o-keyframes fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
  }

  .text-center {
    text-align: center !important;
  }
  
  .text-left {
    text-align: left !important;
  }
  
  .text-right {
    text-align: right !important;
  }

  .pull-left {
    float: left !important;
  }

  .pull-right {
    float: right !important;
  }
`;
