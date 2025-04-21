// @ts-nocheck
const nodeSetup = {
  displayName: 'Tile',
  name: 'feTile',
  inputs: ['source'],
  props: [] // No custom properties needed
};

const nodeLogic = (props, id, inputs) => {
  const { source = 'SourceGraphic' } = inputs;
  return `
    <feTile
      in="${source}"
      result="${id}"
      width="1000%"
      height="1000%"
    />
  `;
};
