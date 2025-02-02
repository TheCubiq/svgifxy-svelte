// @ts-nocheck
const nodeInputs = [
  {
    displayName: 'Flood Color',
    name: 'flood-color',
    type: 'color',
    default: "#000",
    description: 'The color of the flood'
  },
  {
    displayName: 'Flood Opacity',
    name: 'flood-opacity',
    type: 'number',
    default: "1",
  }
];

const nodeLogic = (inputs) => {
  const {
    id,
    'flood-color': floodColor,
    'flood-opacity': floodOpacity
  } = inputs;

  return `<feFlood result="${id}" flood-color="${floodColor}" flood-opacity="${floodOpacity}" />`
};