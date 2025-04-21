import nodeInternals from '$lib/utils/nodeInternals.js?raw';
import feFlood from './internalNodes/feFlood.js?raw';
import gaussianBlur from './internalNodes/gaussianBlur.js?raw';
import rgbSplitEffect from './internalNodes/rgbSplitEffect.js?raw';
import displacementEffect from './internalNodes/displacementEffect.js?raw';
import imageNode from './internalNodes/imageNode.js?raw';
import normalMap from './internalNodes/normalMap.js?raw';
import offsetEffect from './internalNodes/offsetEffect.js?raw';
import tileEffect from './internalNodes/tileEffect.js?raw';
import turbulenceEffect from './internalNodes/turbulenceEffect.js?raw';

export const nodeRegistry = {
  feFlood,
  gaussianBlur,
  rgbSplitEffect, 
  displacementEffect,
  imageNode,
  normalMap,
  offsetEffect,
  feTile: tileEffect,
  turbulenceEffect
};

export const getNodeInfo = () => {
  // wip, for community nodes, the name will be defined in the 
  // db record to prevent running the code before consent
  return Object.entries(nodeRegistry).map(([id, source]) => {
    try {
      const wrapped = `
        ${nodeInternals}
        ${source}
        return nodeSetup;
      `;
      const setup = new Function(wrapped)();
      return {
        id,
        source,
        displayName: setup.displayName || id,
        description: setup.description || null
      };
    } catch (err) {
      console.error(`Failed to compile node ${id}:`, err);
      return {
        id,
        source,
        displayName: id,
        description: 'Failed to load node info'
      };
    }
  });
};
