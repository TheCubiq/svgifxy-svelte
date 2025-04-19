// @ts-nocheck

const nodeSetup = {
  displayName: 'Normal Map',
  name: 'normalMap',
  props: []
}

const normalMap = encodeAsset(html`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1" color-interpolation-filters="sRGB">
    <g>
      <rect width="1" height="1" fill="black" />
      <rect width="1" height="1" fill="url(#red)" style="mix-blend-mode:screen" />
      <rect width="1" height="1" fill="url(#green)" style="mix-blend-mode:screen" />
      <rect width="1" height="1" fill="url(#yellow)" style="mix-blend-mode:screen" />
    </g>
    <defs>
      <radialGradient id="yellow" cx="0" cy="0" r="1" >
        <stop stop-color="yellow" />
        <stop stop-color="yellow" offset="1" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="green" cx="1" cy="0" r="1" >
        <stop stop-color="green" />
        <stop stop-color="green" offset="1" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="red" cx="0" cy="1" r="1" >
        <stop stop-color="red" />
        <stop stop-color="red" offset="1" stop-opacity="0" />
      </radialGradient>
    </defs>
  </svg>
`);

const nodeLogic = (props, id) => html`
  <feImage 
    result="${id}"
    crossorigin="anonymous" 
    href="data:image/svg+xml, ${normalMap}" 
    preserveAspectRatio="xMidYMid slice" 
  />
`;