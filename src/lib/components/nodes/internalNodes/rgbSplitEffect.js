// @ts-nocheck
const nodeSetup = {
	displayName: 'Chromatic Aberration',
	name: 'chromaticAberration',
	inputs: ['source'],
	props: [
		{
			displayName: 'Amount',
			name: 'amount',
			type: 'slider',
			default: '1',
			description: 'The amount of chromatic aberration',
			controllerConfig: {
				min: 0,
				max: 10
			}
		},
		{
			displayName: 'Mode',
			name: 'mode',
			type: 'select',
			default: '1',
			controllerConfig: {
				options: [
					{
						name: 'RGB',
						value: 1
					},
					{
						name: 'BRG',
						value: 2
					},
					{
						name: 'GBR',
						value: 3
					}
				]
			},
			description: 'The mode of chromatic aberration'
		},
		{
			displayName: 'Degrees',
			name: 'deg',
			type: 'knob',
			default: '20',
			description: 'The degrees of chromatic aberration',
			controllerConfig: {
				min: 0,
				max: 360
			}
		}
	]
};

const rot = (axis, channel, mode) => axis * (mod(mode + channel, 3) - 1);

const nodeLogic = (props, id, inputs) => {
	let { amount = 1, mode = 1, deg = 20 } = props;
	const {source = 'SourceGraphic'} = inputs;

	mode = Number(mode);

	const x = Math.sin((deg / 180) * Math.PI),
		y = Math.cos((deg / 180) * Math.PI);

	const rgbSplit = identify(
		id,
		html`
			<!-- B -->
			<feOffset
				in="__${source}__"
				result="off-b"
				dx="${amount * rot(x, 1, mode)}"
				dy="${amount * rot(y, 1, mode)}"
			/>
			<feColorMatrix
				type="matrix"
				in="off-b"
				result="B"
				values="0 0 0 0 0, 0 0 0 0 0, 0 0 1 0 0, 0 0 0 1 0"
			/>

			<!-- G -->
			<feOffset
				in="__${source}__"
				result="off-g"
				dx="${amount * rot(x, 0, mode)}"
				dy="${amount * rot(y, 0, mode)}"
			/>
			<feColorMatrix
				type="matrix"
				in="off-g"
				result="G"
				values="0 0 0 0 0, 0 1 0 0 0, 0 0 0 0 0, 0 0 0 1 0"
			/>

			<!-- R -->
			<feOffset
				in="__${source}__"
				result="off-r"
				dx="${amount * rot(x, -1, mode)}"
				dy="${amount * rot(y, -1, mode)}"
			/>
			<feColorMatrix
				type="matrix"
				in="off-r"
				result="R"
				values="1 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 1 0"
			/>

			<feBlend mode="screen" in="B" in2="G" result="BG" />
			<feBlend mode="screen" in="BG" in2="R" result="__${id}__" />
		`
	);

	return rgbSplit;
};
