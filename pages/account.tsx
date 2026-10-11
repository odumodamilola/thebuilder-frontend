import React from 'react';

const AccountPage: React.FC = () => {
  const html = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">



<script src="ee031226-31cd-4711-a601-fb932996316b"></script>
</head>
<body>

<x-dc>
<helmet>
  <style>/* Webfonts — Google Fonts (Montserrat display, Inter UI, Source Serif 4 reading) */
/* cyrillic-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("b7e3c244-b952-4d2b-85b2-72ede38b53e4") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("a91bd044-f31d-4faf-8387-d9b9e30a57aa") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("a9869d6c-529a-47e9-819d-c7be3e565506") format('woff2');
  unicode-range: U+1F00-1FFF;
}
/* greek */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("cac69e7c-1a84-4969-ac24-444d5364e6e6") format('woff2');
  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("46281391-d3f9-4280-898b-e23f230f8b2f") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("2b616b46-c15e-4faf-acbf-f6b47051599b") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("41e131fe-2f5b-42f5-a643-ddeb73ffdf59") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("b7e3c244-b952-4d2b-85b2-72ede38b53e4") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("a91bd044-f31d-4faf-8387-d9b9e30a57aa") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("a9869d6c-529a-47e9-819d-c7be3e565506") format('woff2');
  unicode-range: U+1F00-1FFF;
}
/* greek */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("cac69e7c-1a84-4969-ac24-444d5364e6e6") format('woff2');
  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("46281391-d3f9-4280-898b-e23f230f8b2f") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("2b616b46-c15e-4faf-acbf-f6b47051599b") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("41e131fe-2f5b-42f5-a643-ddeb73ffdf59") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("b7e3c244-b952-4d2b-85b2-72ede38b53e4") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("a91bd044-f31d-4faf-8387-d9b9e30a57aa") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("a9869d6c-529a-47e9-819d-c7be3e565506") format('woff2');
  unicode-range: U+1F00-1FFF;
}
/* greek */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("cac69e7c-1a84-4969-ac24-444d5364e6e6") format('woff2');
  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("46281391-d3f9-4280-898b-e23f230f8b2f") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("2b616b46-c15e-4faf-acbf-f6b47051599b") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("41e131fe-2f5b-42f5-a643-ddeb73ffdf59") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("b7e3c244-b952-4d2b-85b2-72ede38b53e4") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("a91bd044-f31d-4faf-8387-d9b9e30a57aa") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("a9869d6c-529a-47e9-819d-c7be3e565506") format('woff2');
  unicode-range: U+1F00-1FFF;
}
/* greek */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("cac69e7c-1a84-4969-ac24-444d5364e6e6") format('woff2');
  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("46281391-d3f9-4280-898b-e23f230f8b2f") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("2b616b46-c15e-4faf-acbf-f6b47051599b") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("41e131fe-2f5b-42f5-a643-ddeb73ffdf59") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("754981fb-496f-4233-ac69-e52732991ffa") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("69629905-650b-4ea2-b46f-747a95ccc33c") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* vietnamese */
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("bb83a74e-6470-4dcd-baf4-163d47d6f0c8") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("c4e55dd2-d7de-4231-9ee0-14a572c2a305") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("7ee2e021-71ca-4c02-a27c-db1d6b97c48b") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("754981fb-496f-4233-ac69-e52732991ffa") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("69629905-650b-4ea2-b46f-747a95ccc33c") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* vietnamese */
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("bb83a74e-6470-4dcd-baf4-163d47d6f0c8") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("c4e55dd2-d7de-4231-9ee0-14a572c2a305") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("7ee2e021-71ca-4c02-a27c-db1d6b97c48b") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 800;
  font-display: swap;
  src: url("754981fb-496f-4233-ac69-e52732991ffa") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 800;
  font-display: swap;
  src: url("69629905-650b-4ea2-b46f-747a95ccc33c") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* vietnamese */
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 800;
  font-display: swap;
  src: url("bb83a74e-6470-4dcd-baf4-163d47d6f0c8") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 800;
  font-display: swap;
  src: url("c4e55dd2-d7de-4231-9ee0-14a572c2a305") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 800;
  font-display: swap;
  src: url("7ee2e021-71ca-4c02-a27c-db1d6b97c48b") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Source Serif 4';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url("24db84ba-8b25-4898-b551-85fe910388be") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Source Serif 4';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url("4afffc2d-1fe5-4250-8ec2-35665e91ceec") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek */
@font-face {
  font-family: 'Source Serif 4';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url("5ce1baad-5b48-47bf-82c2-52e1927e163e") format('woff2');
  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'Source Serif 4';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url("16d10dd5-90e3-4757-b682-8f00714e7658") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Source Serif 4';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url("af20c104-3d26-4bbf-9b52-5a74c02bdb47") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Source Serif 4';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url("f3d375e1-6b1d-4551-8878-e6bd2e373287") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Source Serif 4';
  font-style: italic;
  font-weight: 600;
  font-display: swap;
  src: url("24db84ba-8b25-4898-b551-85fe910388be") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Source Serif 4';
  font-style: italic;
  font-weight: 600;
  font-display: swap;
  src: url("4afffc2d-1fe5-4250-8ec2-35665e91ceec") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek */
@font-face {
  font-family: 'Source Serif 4';
  font-style: italic;
  font-weight: 600;
  font-display: swap;
  src: url("5ce1baad-5b48-47bf-82c2-52e1927e163e") format('woff2');
  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'Source Serif 4';
  font-style: italic;
  font-weight: 600;
  font-display: swap;
  src: url("16d10dd5-90e3-4757-b682-8f00714e7658") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Source Serif 4';
  font-style: italic;
  font-weight: 600;
  font-display: swap;
  src: url("af20c104-3d26-4bbf-9b52-5a74c02bdb47") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Source Serif 4';
  font-style: italic;
  font-weight: 600;
  font-display: swap;
  src: url("f3d375e1-6b1d-4551-8878-e6bd2e373287") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Source Serif 4';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("6d7a42cf-ba7e-4ea6-abe5-e9647c85127e") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Source Serif 4';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("5a340ed5-5228-4e82-83ce-7a19d6d0c284") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek */
@font-face {
  font-family: 'Source Serif 4';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("9ea1e7e2-d22d-483f-822b-436b85912b35") format('woff2');
  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'Source Serif 4';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("b8ab16c7-5fe9-4db4-984e-59d123fe9ada") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Source Serif 4';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("c9c77a8f-1bd6-41bd-ad94-98043c879ebd") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Source Serif 4';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("94a7a8b0-78b5-4592-92bf-a0fb6941b955") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Source Serif 4';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("6d7a42cf-ba7e-4ea6-abe5-e9647c85127e") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Source Serif 4';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("5a340ed5-5228-4e82-83ce-7a19d6d0c284") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek */
@font-face {
  font-family: 'Source Serif 4';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("9ea1e7e2-d22d-483f-822b-436b85912b35") format('woff2');
  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'Source Serif 4';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("b8ab16c7-5fe9-4db4-984e-59d123fe9ada") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Source Serif 4';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("c9c77a8f-1bd6-41bd-ad94-98043c879ebd") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Source Serif 4';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("94a7a8b0-78b5-4592-92bf-a0fb6941b955") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
</style>
  <style>:root {
  /* Brand primitives (strict) */
  --navy-900: #0B2046;
  --navy-950: #071631;
  --navy-700: #13306A;
  --navy-50: #EEF1F7;
  --royal: #1E3F8F;
  --brand-red: #D8121B;
  --red-700: #B30F16;
  --red-50: #FCEBEC;
  --blush: #F3D9DC;
  --white: #FFFFFF;
  --ink: #0F172A;
  --slate: #5B6478;
  --slate-300: #A3ACBF; /* meta text on navy — slate fails AA on navy */
  --line: #E3E7EF;
  --line-dark: rgba(255,255,255,0.14);
  --console-bg: #F7F8FB;

  /* Semantic aliases */
  --surface-page: var(--white);
  --surface-card: var(--white);
  --surface-tint: var(--navy-50);
  --surface-inverse: var(--navy-900);
  --surface-inverse-deep: var(--navy-950);
  --surface-console: var(--console-bg);
  --surface-skeleton: var(--navy-50);

  --text-body: var(--ink);
  --text-heading: var(--navy-900);
  --text-meta: var(--slate);
  --text-on-inverse: var(--white);
  --text-meta-on-inverse: var(--slate-300);
  --text-accent: var(--brand-red);
  --text-error: var(--red-700);

  --border: var(--line);
  --border-strong: #C9D0DD;
  --border-inverse: var(--line-dark);

  --accent: var(--brand-red);
  --accent-hover: var(--red-700);
  --primary: var(--navy-900);
  --primary-hover: var(--navy-700);
  --focus-ring: var(--royal);

  --overlay: rgba(11,32,70,0.40);
  --hero-gradient: linear-gradient(20deg, rgba(7,22,49,0.92) 0%, rgba(11,32,70,0.55) 45%, rgba(11,32,70,0) 75%); /* @kind other */
  --dot-grid: radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1.2px); /* @kind other */
  --dot-grid-size: 18px 18px; /* @kind other */
}
</style>
  <style>:root {
  --font-display: "Montserrat", "Clash Display", system-ui, sans-serif;
  --font-ui: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-serif: "Source Serif 4", "Source Serif Pro", Georgia, serif;

  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
  --weight-black: 800;

  --tracking-display: -0.02em;
  --tracking-heading: -0.01em;
  --tracking-kicker: 0.08em;

  /* Scale — desktop (mobile overrides below) */
  --fs-display: 72px;  --lh-display: 76px;
  --fs-h1: 48px;       --lh-h1: 56px;
  --fs-h2: 32px;       --lh-h2: 40px;
  --fs-h3: 22px;       --lh-h3: 30px;
  --fs-body: 17px;     --lh-body: 28px;
  --fs-article: 19px;  --lh-article: 32px;
  --fs-meta: 13px;     --lh-meta: 18px;
  --fs-kicker: 12px;   --lh-kicker: 16px;
  --fs-label: 11px;
  --measure: 68ch;
}
@media (max-width: 767px) {
  :root {
    --fs-display: 40px; --lh-display: 44px;
    --fs-h1: 32px;      --lh-h1: 38px;
    --fs-h2: 24px;      --lh-h2: 30px;
    --fs-h3: 19px;      --lh-h3: 26px;
    --fs-article: 17px; --lh-article: 28px;
  }
}
</style>
  <style>:root {
  /* 8px base */
  --space-0: 0;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 40px;
  --space-8: 48px;
  --space-9: 64px;
  --space-10: 80px;
  --space-11: 96px;

  --container: 1280px;
  --gutter: 24px;
  --margin-mobile: 16px;
  --columns: 12; /* @kind other */
  --section-y: 96px;
  --article-col: 680px;
  --article-head: 760px;
  --article-media: 1040px;
  --header-h: 72px;
  --header-h-compact: 60px;
  --utility-h: 32px;

  --radius-card: 12px;
  --radius-control: 8px;
  --radius-chip: 999px;
  --radius-sm: 4px;

  --shadow-none: none;
  --shadow-hover: 0 8px 24px rgba(11,32,70,0.08);
  --shadow-overlay: 0 24px 64px rgba(7,22,49,0.24);
  --shadow-drag: 0 16px 40px rgba(11,32,70,0.18);

  --rule-w: 48px; /* @kind other */
  --rule-h: 3px; /* @kind other */
  --focus-width: 2px; /* @kind other */
  --focus-offset: 2px; /* @kind other */
  --tap-min: 44px; /* @kind other */
}
@media (max-width: 767px) {
  :root {
    --section-y: 56px;
    --gutter: 16px;
    --columns: 4; /* @kind other */
  }
}

:root {
  --ease-standard: cubic-bezier(0.22, 1, 0.36, 1); /* @kind other */
  --ease-exit: cubic-bezier(0.4, 0, 1, 1); /* @kind other */
  --dur-micro: 150ms; /* @kind other */
  --dur-small: 250ms; /* @kind other */
  --dur-medium: 400ms; /* @kind other */
  --dur-large: 700ms; /* @kind other */
  --dur-reveal: 500ms; /* @kind other */
  --stagger: 60ms; /* @kind other */
  --stagger-hero: 70ms; /* @kind other */
  --reveal-y: 16px; /* @kind other */
  --hover-zoom: 1.03; /* @kind other */
  --image-settle: 1.04; /* @kind other */
  /* Framer Motion springs (documentation tokens) */
  --spring-ui: "stiffness 320, damping 30"; /* @kind other */
  --spring-sheet: "stiffness 260, damping 32"; /* @kind other */
}
@media (prefers-reduced-motion: reduce) {
  :root {
    --reveal-y: 0px; /* @kind other */
    --hover-zoom: 1; /* @kind other */
    --image-settle: 1; /* @kind other */
    --stagger: 0ms; /* @kind other */
    --stagger-hero: 0ms; /* @kind other */
  }
}

*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;font-family:var(--font-ui);font-size:var(--fs-body);line-height:var(--lh-body);color:var(--text-body);background:var(--surface-page);-webkit-font-smoothing:antialiased}
img{max-width:100%;display:block}
a{color:var(--navy-900);text-decoration:none}
a:hover{color:var(--navy-700)}
:focus-visible{outline:var(--focus-width) solid var(--focus-ring);outline-offset:var(--focus-offset)}
button{font:inherit}
.tb-skip{position:absolute;left:16px;top:-48px;z-index:999;background:var(--navy-900);color:#fff;padding:10px 16px;border-radius:8px;font:600 14px var(--font-ui)}
.tb-skip:focus{top:8px;color:#fff}
.tb-link{position:relative;color:var(--navy-900);font-weight:600}
.tb-link::after{content:"";position:absolute;left:0;right:0;bottom:-2px;height:2px;background:var(--brand-red);transform:scaleX(0);transform-origin:left;transition:transform var(--dur-small) var(--ease-standard)}
.tb-link:hover::after,.tb-link:focus-visible::after{transform:scaleX(1)}
.tb-dots{background-image:var(--dot-grid);background-size:var(--dot-grid-size)}
@keyframes tb-pulse{0%,80%,100%{opacity:.25;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}
@keyframes tb-shimmer{0%{opacity:1}50%{opacity:.55}100%{opacity:1}}
@keyframes tb-rise{from{transform:translateY(100%)}to{transform:translateY(0)}}
@keyframes tb-pop{0%{transform:scale(0)}60%{transform:scale(1.2)}100%{transform:scale(1)}}
@keyframes tb-fadeup{from{opacity:0;transform:translateY(var(--reveal-y))}to{opacity:1;transform:none}}
@keyframes tb-settle{from{opacity:0;transform:scale(var(--image-settle))}to{opacity:1;transform:none}}
@keyframes tb-draw{from{stroke-dashoffset:var(--len,1000)}to{stroke-dashoffset:0}}
@keyframes tb-ring{0%{transform:scale(1);opacity:.6}100%{transform:scale(1.6);opacity:0}}
@keyframes tb-dotpulse{0%,100%{opacity:.6}50%{opacity:1}}
@keyframes tb-shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:1ms!important;animation-iteration-count:1!important;transition-duration:1ms!important}}
</style>
  <script src="95cc7ef7-7ce8-485d-a468-218e1c26b148"></script>
  <script src="15ecb37e-eaf1-4886-b104-fb11c2668dea"></script>
  <script src="c0dfc6d8-a6c2-41ee-acb5-e04f8921c50c"></script>
  <script src="08c916bf-a560-4fca-8e9b-216a4e05b048"></script>
  <style>body{margin:0;background:#fff} a{color:var(--navy-900)} a:hover{color:var(--navy-700)}</style>
</helmet>
<dc-import name="BodyAccount" hint-size="100%,100vh"></dc-import>
</x-dc>

</body></html>`;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default AccountPage;
