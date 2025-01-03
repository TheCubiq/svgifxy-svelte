import type { Connection, Edge, Node } from '@xyflow/svelte';
import { getRandomPosition, toCamelCase, toKebabCase } from './commonUtils';
import { js2xml } from 'xml-js';

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
  
  return nodes;
};

export const findAllConnections = (targetId: string, connections: Edge[]) => {
  const connectedIds = new Set<string>();
  
  const findSourceNodes = (currentId: string) => {
      // Find all edges where current ID is the target
      const sourceEdges = connections.filter(edge => edge.target === currentId);
      
      // For each source, add it to our set and recursively find its sources
      sourceEdges.forEach(edge => {
          if (!connectedIds.has(edge.source)) {
              connectedIds.add(edge.source);
              findSourceNodes(edge.source);
          }
      });
  }
  
  // Start the recursive search
  findSourceNodes(targetId);

  // console.log(connectedIds);
  
  // Convert Set to Array and return
  return Array.from(connectedIds).reverse();
}

const cssReadyEncode = (svg: string) => {
  // return encodeURIComponent(svg)

  // remove additional spaces
  svg = svg.replace(/\s+/g, ' ');

  return svg
    .replace(/%/g, '%25')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/#/g, '%23')
    .replace(/{/g, '%7B')
    .replace(/}/g, '%7D')
    .replace(/\|/g, '%7C')
    .replace(/&/g, '%26')
    .replace(/'/g, '%27')
    .replace(/"/g, "'")

};

export const createFilter = (id: string, filter: string, cssReady = false) => {
  let boilerplate = `<svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      color-interpolation-filters="sRGB"
    >
      <defs>
        <filter id="${id}">
          ${filter}
        </filter>
      </defs>
    </svg>`;

  if (cssReady) {
    boilerplate = `url("data:image/svg+xml,${cssReadyEncode(boilerplate)}#${id}")`;
  }

  return boilerplate;
};

export const convertToSvgFilter = (id: string, nodesData: Node[] | Node) => {
  const filterOutput = { elements: [] };

  if (!Array.isArray(nodesData)) {
    nodesData = [nodesData];
  }

  nodesData.forEach((node) => {
    let element = {
      type: 'element',
      name: node.type,
      attributes: {
        result: node.id,
        ...node.data
      }
    };

    filterOutput.elements.push(element);
  });

  return js2xml(filterOutput, { spaces: 2 });
};

export const getSource = (connection: Connection[]) => {
  if (connection.length === 0) return null;
  return connection[0].sourceHandle || connection[0].source;
}

export const limitedConnect = (connection: Connection[], max=1) => {
  return connection.length < max;
}