
interface FilterAttributes {
  result?: string;
  [key: string]: any;
}

interface FilterElement {
  _attributes: FilterAttributes;
  _text?: string;
}

interface FilterNode {
  _attributes?: FilterAttributes;
  [key: string]: FilterElement | FilterElement[] | any;
}

type FilterInputRaw = 
| { svg: { filter: FilterNode } }
| { filter: FilterNode }
| FilterNode;

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

type SvelteInputEvent = Event & { currentTarget: EventTarget & HTMLInputElement }