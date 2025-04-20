// @ts-nocheck
const nodeSetup = {
  displayName: 'Displacement',
  name: 'displacement',
  inputs: ['source', 'map'],
  props: [
    {
      displayName: 'Scale',
      name: 'scale',
      type: 'number',
      default: '10',
      description: 'The scale of displacement'
    },
    {
      displayName: 'X Channel',
      name: 'xChannelSelector',
      type: 'select',
      default: 'R',
      controllerConfig: {
        options: [
          { name: 'Red', value: 'R' },
          { name: 'Green', value: 'G' },
          { name: 'Blue', value: 'B' },
          { name: 'Alpha', value: 'A' }
        ]
      }
    },
    {
      displayName: 'Y Channel',
      name: 'yChannelSelector',
      type: 'select',
      default: 'G',
      controllerConfig: {
        options: [
          { name: 'Red', value: 'R' },
          { name: 'Green', value: 'G' },
          { name: 'Blue', value: 'B' },
          { name: 'Alpha', value: 'A' }
        ]
      }
    }
  ]
};

const nodeLogic = (props, id, inputs) => {
  const { scale = 10, xChannelSelector = 'R', yChannelSelector = 'G' } = props;
  const { source = 'SourceGraphic', map = 'SourceGraphic' } = inputs;

  return html`
    <feDisplacementMap
      in="${source}"
      in2="${map}"
      scale="${scale}"
      xChannelSelector="${xChannelSelector}"
      yChannelSelector="${yChannelSelector}"
      result="${id}"
    />
  `;
};