import type { NodeTypes } from '@xyflow/svelte';
// import * as n from './nodes/*.svelte';
import FloodNode from './nodes/FloodNode.svelte';
import BlendNode from './nodes/BlendNode.svelte';
import GaussianBlurNode from './nodes/GaussianBlurNode.svelte';
import ConvolveMatrix from './nodes/ConvolveMatrix.svelte';
import DisplacementNode from './nodes/DisplacementNode.svelte';
import TurbulenceNode from './nodes/TurbulenceNode.svelte';
import PreviewNode from './nodes/PreviewNode.svelte';
import OffsetNode from './nodes/OffsetNode.svelte';
import SourceGraphicNode from './nodes/SourceGraphicNode.svelte';
import { ActivityIcon, BinaryIcon, ContrastIcon, FanIcon, MoveIcon, PaintRollerIcon, ScanEyeIcon, TargetIcon, WavesIcon, WindIcon } from 'lucide-svelte';
import DynamicNode from './nodes/DynamicNode.svelte';


const filterDefines = [
  {
    name: 'dynamic',
    icon: WindIcon,
    component: DynamicNode
  },

  {
    name: 'feFlood',
    icon: PaintRollerIcon,
    component:FloodNode
  },
  {
    name: 'feBlend',
    icon: ContrastIcon,
    component:BlendNode
  },
  {
    name: 'feGaussianBlur',
    icon: TargetIcon,
    component:GaussianBlurNode
  },
  {
    name: 'feConvolveMatrix',
    icon: BinaryIcon,
    component:ConvolveMatrix
  },
  {
    name: 'feDisplacementMap',
    icon: ActivityIcon,
    component:DisplacementNode
  },
  {
    name: 'feTurbulence',
    icon: WavesIcon,
    component:TurbulenceNode
  },
  {
    name: 'preview',
    icon: ScanEyeIcon,
    component:PreviewNode
  },
  {
    name: 'feOffset',
    icon: MoveIcon,
    component:OffsetNode
  },
  {
    name: 'sourceGraphic',
    icon: FanIcon,
    component:SourceGraphicNode
  }
];

export const xyFilterNodes: NodeTypes = {
  // [name]: component
  ...Object.fromEntries(filterDefines.map(({name, component}) => [name, component])),
};

