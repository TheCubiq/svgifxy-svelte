export interface NodeType {
  name: string;
  attributes: string[];
  // inputs?:
  // outputs?: 
}


export const nodeTypes = {


  // Variable Nodes
  veColor: {
    name: 'veColor',
    type: 'variable',
    attributes: {
      "color": {
        type: 'color'
      }
    },
  },
  veNumber: {
    name: 'veNumber',
    type: 'variable',
    attributes: {
      "number": {
        type: 'number'
      }
    },
  },

  // Filter Nodes
  feFlood: {
    name: 'feFlood',
    type: 'filter',
    attributes: {
      "flood-color": {
        type: 'color'
      },
      'flood-opacity': {
        type: 'number'
      }
    },
    outputs: [
      {
        position: 'bottom',
        id: null
      }
    ]
  },
  feBlend: {
    name: 'feBlend',
    type: 'filter',
    attributes: {
      "in": {
        type: 'string'
      },
      "in2": {
        type: 'string'
      },
      "mode": {
        type: 'string'
      }
    },
    outputs: [
      {
        position: 'bottom',
        id: null
      }
    ]

  },
  feGaussianBlur: {

  },
  feDisplacementMap: {

  },
  feTurbulence: {

  },
  preview: {

  },
  sourceGraphic: {

  },
}