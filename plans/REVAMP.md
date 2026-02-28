# SVG Filter Editor — Full Visual Revamp Plan

> **Status: ✅ IMPLEMENTED** — All phases complete. Dev server verified. No regressions.

## 1. Design Direction: "Forge"

**Concept**: Industrial creative tool aesthetic — like a digital workshop where SVG filters are forged. Warm, confident, and professional. The warmth of molten metal meets the precision of digital craft.

**What makes it unforgettable**: The warm orange/amber accent system against deep charcoal creates an atmosphere no other node editor has. Most tools default to cold blues or purples — Forge goes warm, grounded, and bold.

**Tone**: Industrial-luxe. Warm. Confident. Not playful, not sterile — *purposeful*.

---

## 2. Color Palette

### Dark Theme (Primary)
| Token | Value | Role |
|---|---|---|
| `--clr-bg` | `#0C0A09` | Base background — warm near-black |
| `--clr-text` | `#FAFAF9` | Primary text — warm off-white |
| `--clr-primary` | `#F97316` | Primary accent — vivid forge orange |
| `--clr-secondary` | `#1C1917` | Surface/card backgrounds — warm dark |
| `--clr-accent` | `#06B6D4` | Cool cyan complement — for info/handles |
| `--clr-surface` | `#292524` | Elevated surfaces |
| `--clr-border` | `#44403C` | Border color base |
| `--clr-text-muted` | `#A8A29E` | Muted/secondary text |
| `--clr-success` | `#10B981` | Success/connected states |
| `--clr-danger` | `#EF4444` | Delete/error states |

### Light Theme
| Token | Value |
|---|---|
| `--clr-bg` | `#FAFAF9` |
| `--clr-text` | `#0C0A09` |
| `--clr-secondary` | `#F5F5F4` |

The existing color-mix shade generation system (50-950 + t50-t900 transparency) is kept — only base values change.

---

## 3. Typography

### Font Stack
| Role | Font | Source | Fallback |
|---|---|---|---|
| **Display / Headings** | Bricolage Grotesque | Google Fonts | system-ui |
| **Body / UI** | Outfit | Google Fonts | system-ui |
| **Monospace / Code / Values** | JetBrains Mono | Google Fonts | monospace |

### Scale
- Base: `16px` (fixed for the editor, not responsive root)
- Node titles: `0.85rem` semi-bold, Bricolage Grotesque
- Node values/labels: `0.75rem`, Outfit
- Code: `0.75rem`, JetBrains Mono
- Sidebar items: `0.8rem`, Outfit
- Sidebar header: `0.65rem` uppercase tracking, Outfit

**Why these fonts**:
- *Bricolage Grotesque* — geometric with personality, slightly quirky letterforms that feel hand-crafted (matches the "forge" metaphor)
- *Outfit* — geometric sans with warmth, excellent at small sizes for UI
- *JetBrains Mono* — ligatures and clarity for code/numeric values

---

## 4. Component Revamp Details

### 4.1 Global Styles (`styles.css`)
- [ ] Replace Manrope with Outfit + Bricolage Grotesque + JetBrains Mono imports
- [ ] Update all base CSS custom properties to Forge palette
- [ ] Update body background with subtle radial gradient (warm center glow)
- [ ] Refine noise texture opacity (reduce to 0.15 for subtlety)
- [ ] Update scrollbar to use primary accent with rounded ends
- [ ] Node styling: add top-edge gradient shine (1px orange glow on top border)
- [ ] Node selection: warm glow ring (`box-shadow` with primary-t300)
- [ ] Handle styling: smaller, with subtle pulse animation on hover
- [ ] Add CSS utility classes for new animation patterns
- [ ] Add `--font-display`, `--font-body`, `--font-mono` variables

### 4.2 Filters (`filters.css`)
- [ ] Update glass filter to use warmer blur with slight warm tint
- [ ] Increase blur to 24px for more frosted feel

### 4.3 Micro Animations (`micro-anims.css`)
- [ ] Keep existing Maximize2 animation (it's good)
- [ ] Add `@keyframes glow-pulse` for handle hover states
- [ ] Add `@keyframes slide-up-fade` for staggered list entries
- [ ] Add `@keyframes shimmer` for loading states
- [ ] Add `.hover-lift` utility class (translateY + shadow on hover)
- [ ] Add `.stagger-children` for cascading entrance animations

### 4.4 App HTML (`app.html`)
- [ ] Add meta theme-color for warm dark
- [ ] Preconnect to Google Fonts

### 4.5 Layout (`+layout.svelte`)
- [ ] No major changes needed, imports already clean

### 4.6 Page (`+page.svelte`)
- [ ] Add subtle entrance animation for the editor container

### 4.7 FilterEditor (`FilterEditor.svelte`)
- [ ] Canvas background: transparent (keep) but add subtle dot grid via CSS
- [ ] Add warm ambient glow in center of canvas (radial gradient pseudo-element)
- [ ] Refine portal containers
- [ ] Add a minimal bottom status bar with filter count

### 4.8 Sidebar (`Sidebar.svelte`)
- [ ] Redesign as vertical floating tool panel
- [ ] Add header with app icon/logo text "FORGE"
- [ ] Group nodes by category (Generators, Effects, Utility)
- [ ] Each node button: icon + name, hover slide animation
- [ ] Collapsible category sections
- [ ] Staggered entrance animation on mount
- [ ] Better visual hierarchy with muted category labels
- [ ] Add subtle separator lines between categories

### 4.9 RightSidebar (`RightSidebar.svelte`)
- [ ] Refine header with better typography (Bricolage Grotesque for title)
- [ ] Add top accent line (2px orange gradient)
- [ ] Improve button hover states with warm glow
- [ ] Better transition (keep the spring fly, refine params)

### 4.10 FloatingWindow (`FloatingWindow.svelte`)
- [ ] Add subtle shadow ring on drag
- [ ] Warm glass backdrop
- [ ] Better drag cursor feedback

### 4.11 Modal (`Modal.svelte`)
- [ ] Update backdrop to warm dark with blur
- [ ] Refine dialog with top accent gradient line
- [ ] Better close button styling
- [ ] Smoother entrance animation

### 4.12 DynamicNode (`DynamicNode.svelte`)
- [ ] Title bar: node name with icon, warm accent stripe on left edge
- [ ] Settings button: refined with hover glow
- [ ] Compile button: primary orange styling
- [ ] Better loading state ("Not Loaded Yet" → skeleton pulse)

### 4.13 PreviewNode (`PreviewNode.svelte`)
- [ ] Preview container with refined border
- [ ] Render mode toggle as segmented control (not dropdown)

### 4.14 SourceGraphicNode (`SourceGraphicNode.svelte`)  
- [ ] Add icon and better visual indicator
- [ ] Style the dual handles (SourceGraphic / SourceAlpha) with labels

### 4.15 Controls

#### Knob (`Knob.svelte`)
- [ ] Redesign with arc track indicator (SVG arc showing value range)
- [ ] Better inner label positioning
- [ ] Warm accent color for active state

#### Slider (`Slider.svelte`)
- [ ] Gradient fill track (transparent → primary)
- [ ] Better value display typography (JetBrains Mono)
- [ ] Refined border and background

#### Select (`Select.svelte` — controls)
- [ ] Better dropdown animation (scale + fade)
- [ ] Active option: orange accent indicator
- [ ] Improved keyboard navigation visual feedback

#### Pan2DControl (`Pan2DControl.svelte`)
- [ ] Grid overlay in warm accent
- [ ] Crosshair indicator at position
- [ ] Better value typography

### 4.16 Controller Components

#### ControllerDefines (`ControllerDefines.svelte`)
- [ ] Add label display for each controller
- [ ] Consistent spacing

#### SelectInput (`SelectInput.svelte`)
- [ ] Align with new Select visual language
- [ ] Better icon rendering

#### FileInput (`FileInput.svelte`)
- [ ] Drag-and-drop zone styling
- [ ] Preview thumbnail refinement

#### NumericInput / NumericDynamicInput
- [ ] Styled input with JetBrains Mono
- [ ] Better focus ring (orange glow)

#### DragAreaOverlay
- [ ] Grid color to match warm palette
- [ ] Crosshair indicator

---

## 5. Animation System

### Principles
1. **Enter from the edge**: Elements slide in from their associated direction
2. **Spring physics**: Use CSS spring-like easings (`linear()` function) for organic feel
3. **Stagger children**: Lists animate in sequence with `animation-delay`
4. **Hover = elevation**: Elements lift toward the user on hover
5. **Selection = glow**: Selected elements glow with primary accent

### Key Animations
| Animation | Where | Type |
|---|---|---|
| Stagger slide-up | Sidebar nodes on mount | CSS `animation-delay` |
| Hover lift | Sidebar buttons, node cards | `transform: translateY(-2px)` + shadow |
| Glow pulse | Handles on hover | `box-shadow` keyframes |
| Selection ring | Selected nodes | `box-shadow` with primary-t300 |
| Panel fly-in | Right sidebar | Svelte `fly` transition |
| Scale-bounce | Modal open | CSS `animation` with overshoot |
| Fade-slide | Dropdown open | Svelte `slide` + `fade` transition |
| Spring drag | Floating window | Svelte `Spring` (already exists) |

### Easing Functions
```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-spring: linear(0, 0.009, 0.037 2.7%, 0.153 6.2%, 0.776 18.6%, 1.001, 1.142 28%, 1.181, 1.187 33.3%, 1.157, 1.07 40.8%, 0.999 47.4%, 0.961, 0.944 53.5%, 0.947 56.1%, 1.003 65.8%, 1.014 72.3%, 1);
--ease-bounce: linear(0, 0.004, 0.016, 0.035, 0.063, 0.098, 0.141 13.6%, 0.25, 0.391, 0.563, 0.765, 1, 0.891 40.9%, 0.848, 0.82, 0.809, 0.814 54.5%, 0.84, 0.881, 0.938, 1.001 68.2%, 1.029, 1.041, 1.038, 1.024, 1.004 81.8%, 0.988, 0.979 88.6%, 0.984, 0.996, 1);
```

---

## 6. Implementation Order

### Phase 1: Foundation (styles.css, filters.css, micro-anims.css, app.html)
Change the entire visual foundation. Everything cascades from here.

### Phase 2: Shell (FilterEditor.svelte, +page.svelte, +layout.svelte)
Update the main canvas and layout containers.

### Phase 3: Panels (Sidebar.svelte, RightSidebar.svelte, FloatingWindow.svelte, Modal.svelte)
Redesign the primary UI panels the user interacts with.

### Phase 4: Nodes (DynamicNode.svelte, PreviewNode.svelte, SourceGraphicNode.svelte)
Revamp node card appearance and interactions.

### Phase 5: Controls (Knob, Slider, Select, Pan2D, NumericInput, etc.)
Polish all interactive control components.

### Phase 6: Micro-polish
- Hover states audit
- Focus ring consistency
- Animation timing refinement
- Cross-browser testing considerations

---

## 7. Files Changed

| File | Change Type |
|---|---|
| `src/routes/styles.css` | **Major rewrite** — new palette, typography, node styles |
| `src/routes/filters.css` | **Update** — warmer glass filter |
| `src/routes/micro-anims.css` | **Expand** — new animation utilities |
| `src/app.html` | **Minor** — meta tags, preconnect |
| `src/routes/+layout.svelte` | **Minor** — font imports |
| `src/routes/+page.svelte` | **Minor** — entrance animation |
| `src/lib/components/FilterEditor.svelte` | **Medium** — canvas styling, status bar |
| `src/lib/components/Sidebar.svelte` | **Major rewrite** — complete redesign |
| `src/lib/components/RightSidebar.svelte` | **Medium** — visual refinement |
| `src/lib/components/FloatingWindow.svelte` | **Medium** — visual refinement |
| `src/lib/components/Modal.svelte` | **Medium** — visual refinement |
| `src/lib/components/nodes/DynamicNode.svelte` | **Medium** — card redesign |
| `src/lib/components/nodes/PreviewNode.svelte` | **Medium** — card redesign |
| `src/lib/components/nodes/SourceGraphicNode.svelte` | **Medium** — card redesign |
| `src/lib/components/controls/Knob.svelte` | **Medium** — visual refinement |
| `src/lib/components/controls/Slider.svelte` | **Medium** — visual refinement |
| `src/lib/components/controls/Select.svelte` | **Medium** — dropdown refinement |
| `src/lib/components/controls/Pan2DControl.svelte` | **Minor** — color updates |
| `src/lib/components/nodes/controllers/SelectInput.svelte` | **Medium** — align with new Select |
| `src/lib/components/nodes/controllers/NumericInput.svelte` | **Minor** — styling |
| `src/lib/components/nodes/controllers/NumericDynamicInput.svelte` | **Minor** — styling |
| `src/lib/components/nodes/controllers/FileInput.svelte` | **Minor** — styling |
| `src/lib/components/nodes/controllers/DragAreaOverlay.svelte` | **Minor** — color updates |
| `src/lib/components/nodes/controllers/SvgPreview.svelte` | **Minor** — border refinements |
| `src/lib/components/nodes/controllers/DynamicMatrix.svelte` | **Minor** — grid styling |

---

*Plan authored for the SVG Filter Editor "Forge" revamp. Every change reinforces the warm industrial-creative aesthetic.*
