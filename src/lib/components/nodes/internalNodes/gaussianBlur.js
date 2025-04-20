// @ts-nocheck
const nodeSetup = {
  displayName: 'Gaussian Blur',
  name: 'gaussianBlur',
  inputs: ['source'],
  props: [
      {
          displayName: 'Blur Amount',
          name: 'amount',
          type: 'slider',
          default: '5',
          description: 'The amount of blur to apply',
          controllerConfig: {
              min: 0,
              max: 50
          }
      }
  ]
};

const nodeLogic = (props, id, inputs) => {
  let { amount = 5 } = props;

  const {source = 'SourceGraphic'} = inputs;

  const blur = identify(
      id,
      html`
          <feGaussianBlur
              in="__${source}__"
              stdDeviation="${amount}"
              result="__${id}__"
          />
      `
  );

  return blur;
};
