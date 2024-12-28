
interface FilterAttributes {
  result?: string;
  [key: string]: any;
}

interface FilterElement {
  _attributes: FilterAttributes;
  _text?: string;
}

interface FilterInput {
  filter: {
    _attributes?: FilterAttributes;
    [key: string]: FilterElement | FilterElement[] | any;
  };
}

interface Position {
  x: number;
  y: number;
}

interface Node {
  id: string;
  type: string;
  data: Record<string, any>;
  position: Position;
}