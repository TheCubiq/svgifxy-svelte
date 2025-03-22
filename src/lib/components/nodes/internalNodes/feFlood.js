// @ts-nocheck

const nodeSetup = {
  displayName: 'Flood',
  name: 'feFlood',
  props: [
    {
      displayName: 'Flood Color',
      name: 'flood-color',
      type: 'color',
      default: "#333333",
      description: 'The color of the flood'
    },
    {
      displayName: 'Flood Opacity',
      name: 'flood-opacity',
      type: 'number',
      default: "100",
    }
  ]
}


const nodeLogic = (inputs) => {
  const {
    id,
    'flood-color': floodColor,
    'flood-opacity': floodOpacity,
  } = inputs;

  return `<feFlood result="${id}" flood-color="${floodColor}" flood-opacity="${floodOpacity / 100}" />`
};