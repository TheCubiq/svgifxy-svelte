// @ts-nocheck
const nodeInputs = [
  {
    name: 'amount',
    type: 'number',
    description: 'The color of the flood',
    default: "1",
  },
  {
    name: 'mode',
    type: 'number',
    default: "1",
  },
  {
    name: 'deg',
    type: 'number',
    default: "90",
  }
];

const mod = (n, m) => ((n % m) + m) % m;
const rot = (axis, channel, mode) => axis * (mod((mode + channel), 3) - 1);

const nodeLogic = (inputs) => {
  let {
    id = 123,
    amount = 1,
    mode = 1,
    deg = 20,
  } = inputs;

  amount = amount;  

  const 
    x = Math.sin(deg / 180 * Math.PI),
    y = Math.cos(deg / 180 * Math.PI);


  const rgbSplit =     
    // B
    "<feOffset " +
    "in='SourceGraphic' result='off-b' " +
      `dx='${amount * rot(x, 1, mode)}' ` +
      `dy='${amount * rot(y, 1, mode)}' ` +
    "/>" +
    "<feColorMatrix type='matrix' in='off-b' result='B' " +
    "values='0 0 0 0 0, 0 0 0 0 0, 0 0 1 0 0, 0 0 0 1 0' " +
    "/>" +
    
    // G
    "<feOffset " +
    "in='SourceGraphic' result='off-g' " +
      `dx='${amount * rot(x, 0, mode)}' ` +
      `dy='${amount * rot(y, 0, mode)}' ` +
    "/>" +
    "<feColorMatrix type='matrix' in='off-g' result='G' " +
    "values='0 0 0 0 0, 0 1 0 0 0, 0 0 0 0 0, 0 0 0 1 0' " +
    "/>" +
      
      // R
    "<feOffset " +
    "in='SourceGraphic' result='off-r' " +
      `dx='${amount * rot(x, -1, mode)}' ` +
      `dy='${amount * rot(y, -1, mode)}' ` +
    "/>" +
    "<feColorMatrix type='matrix' in='off-r' result='R' " +
    "values='1 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 1 0' " +
    "/>" +
      
    "<feBlend mode='screen' in='B' in2='G' result='BG' />" +
    "<feBlend mode='screen' in='BG' in2='R' />"

  return rgbSplit;
};