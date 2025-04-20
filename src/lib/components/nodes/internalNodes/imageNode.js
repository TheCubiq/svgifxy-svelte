// @ts-nocheck

const nodeSetup = {
  displayName: 'Image',
  name: 'image',
  props: [
    {
      displayName: 'Image',
      name: 'imageData',
      type: 'file',
      default: '',
      description: 'Upload an image to use in the filter',
      controllerConfig: {
        accept: 'image/*'
      }
    },
    {
      displayName: 'Preserve Aspect Ratio',
      name: 'preserveAspectRatio',
      type: 'select',
      default: 'none',
      controllerConfig: {
        options: [
          { name: 'None', value: 'none' },
          { name: 'Meet', value: 'meet' },
          { name: 'Slice', value: 'slice' }
        ]
      }
    }
  ]
};

const nodeLogic = ({imageData = '', preserveAspectRatio = 'none'}, id) => {
  if (!imageData) return '';
  
  return `
    <feImage
      result="${id}"
      href="${imageData}"
      preserveAspectRatio="${preserveAspectRatio} meet"
      x="0"
      y="0"
      width="100%"
      height="100%"
    />
  `;
};
