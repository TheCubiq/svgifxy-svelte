// @ts-nocheck
const nodeSetup = {
  displayName: 'Offset',
  name: 'offset',
  inputs: ['source'],
  props: [
    {
      displayName: 'Position',
      name: 'position',
      type: 'pan2d',
      default: '0 0',
      description: 'The offset position',
      controllerConfig: {
        sensitivitySettings: {
          default: 1,
          speed: [0.05, 5]
        },
        infiniteMouse: true,
        smoothScroll: true,
        mode: 'relative',
        // for now fine, in terms of typing, a bit too dynamic but yeah..
        clamping: false, 
        min: { x: -100, y: -100 },
        max: { x: 100, y: 100 }
      }
    }
  ]
};

const nodeLogic = (props, id, inputs) => {
  const { position = '0 0' } = props;
  const { source = 'SourceGraphic' } = inputs;

  // Parse x y from position string
  const [dx, dy] = position.split(' ').map(Number);

  return `
    <feOffset
      in="__${source}__"
      result="__${id}__"
      dx="${dx}"
      dy="${dy}"
    />
  `;
};
