import type { Node } from '@xyflow/svelte';
import { getRandomPosition, toCamelCase } from './commonUtils';

// Helper function to create node object
const createNode = (type: string, attributes: FilterAttributes): Node => {
  const data = { ...attributes };
  delete data.result; // Remove result from data as it becomes id

  return {
    id: attributes.result || '',
    type,
    data,
    position: getRandomPosition()
  };
};

// Helper function to transform attributes to camelCase
const transformAttributes = (attributes: FilterAttributes): Record<string, any> => {
  const transformed: Record<string, any> = {};
  Object.entries(attributes).forEach(([key, value]) => {
    transformed[toCamelCase(key)] = value;
  });
  return transformed;
};

export const transformFilter = (objFilterRaw: FilterInput): Node[] => {
  const nodes: Node[] = [];
  const filter = objFilterRaw.filter;

  // Process all filter elements
  Object.entries(filter).forEach(([key, value]) => {
    if (key.startsWith('fe')) {
      if (Array.isArray(value)) {
        value.forEach(item => {
          nodes.push(createNode(key, item._attributes));
        });
      } else if (value && '_attributes' in value) {
        nodes.push(createNode(key, value._attributes));
      }
    }
  });

  // // convert data of each node to camelCase

  const nodeConverted = nodes.map(node => ({
    ...node,
    data: transformAttributes(node.data)
  }));

  console.log(nodeConverted);

  return nodeConverted;
};