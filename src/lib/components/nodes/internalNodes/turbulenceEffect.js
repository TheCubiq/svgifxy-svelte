// @ts-nocheck
const nodeSetup = {
  displayName: 'Turbulence',
  name: 'feTurbulence',
  props: [
    {
      displayName: 'Base Frequency',
      name: 'baseFrequency',
      type: 'pan2d',
      default: '0 0',
      description: 'The base frequency of turbulence',
      controllerConfig: {
        sensitivitySettings: {
          default: 1,
          speed: [0.05, 5]
        },
        infiniteMouse: true,
        smoothScroll: true,
        mode: 'relative',
        // for now fine, in terms of typing, a bit too dynamic but yeah..
        clamping: {
          minX: false,
          maxX: true,
          minY: false,
          maxY: true
        }, 
        max: { x: 0, y: 0 },
        min: { x: .010, y: .010 }
      }
    },
    {
      displayName: 'Type',
      name: 'type',
      type: 'select',
      default: 'turbulence',
      description: 'The type of noise',
      controllerConfig: {
        options: [
          { name: 'Turbulence', value: 'turbulence' },
          { name: 'Fractal Noise', value: 'fractalNoise' }
        ]
      }
    },
    {
      displayName: 'Octaves',
      name: 'numOctaves',
      type: 'number',
      default: '3',
      description: 'The number of noise octaves'
    },
    {
      displayName: 'Seed',
      name: 'seed',
      type: 'number',
      default: '0',
      description: 'The randomization seed'
    },
    {
      displayName: 'Stitch Tiles',
      name: 'stitchTiles',
      type: 'select',
      default: 'noStitch',
      description: 'Controls how tiles are stitched together',
      controllerConfig: {
        options: [
          { name: 'No Stitch', value: 'noStitch' },
          { name: 'Stitch', value: 'stitch' }
        ]
      }
    }
  ]
};

const nodeLogic = (props, id) => {
  const {
    baseFrequency = '0.01 0.01',
    type = 'turbulence',
    numOctaves = 3,
    seed = 0,
    stitchTiles = 'noStitch'
  } = props;

  return `
    <feTurbulence
      result="${id}"
      type="${type}"
      baseFrequency="${baseFrequency}"
      numOctaves="${numOctaves}"
      seed="${seed}"
      stitchTiles="${stitchTiles}"
    />
  `;
};
