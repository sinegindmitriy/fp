# Color Foundation

## Color Palette (Primitives)

### Neutral / Stone

| Name | Primitive Token | Hex | Usage |
|---|---|---|---|
| White | `--primitive-neutral-0` | #ffffff | Page background, card bg, input bg |
| Subtle bg | `--primitive-neutral-25` | #fbfbfb | Droplist search header, toast bg |
| Surface | `--primitive-neutral-50` | #f7f7f7 | Sidebar, banners, section header, card icon wrap |
| Hover light | `--primitive-neutral-75` | #efefef | Account switcher hover |
| Hover bg | `--primitive-neutral-100` | #eef0f8 | Card action button hover |
| Border | `--primitive-neutral-200` | #dee0eb | Dividers, card borders, header borders |
| Border input | `--primitive-neutral-300` | #bbbdc8 | Input/button borders, disabled states |
| Placeholder | `--primitive-neutral-350` | #b0b3c0 | Textarea placeholder |
| Disabled text | `--primitive-neutral-400` | #9b9da6 | Char count, subtle disabled text |
| Subtle text | `--primitive-neutral-450` | #9c9ea8 | Droplist empty, breadcrumb sub |
| Icon / secondary text | `--primitive-neutral-500` | #5f616a | Icons, secondary text |
| Text muted | `--primitive-neutral-600` | #73757f | Field hints, captions |
| Dark text | `--primitive-neutral-700` | #40424b | Nav item text, button cancel text |
| Primary text | `--primitive-neutral-800` | #1f2129 | Primary text, titles, headings |

### Green / Primary

| Name | Primitive Token | Hex | Usage |
|---|---|---|---|
| Green tint | `--primitive-green-50` | #ebf8ef | Selected row bg |
| Success surface | `--primitive-green-100` | #e8f5ee | Success background |
| Selected hover | `--primitive-green-200` | #dff4e8 | Selected row hover |
| Active nav bg | `--primitive-green-400` | #f0faf5 | Active nav item background (CA prototype) |
| Primary | `--primitive-green-500` | #2c9c74 | CTA buttons, links, active states, icons |
| Hover | `--primitive-green-700` | #268a65 | Button hover state |
| Active | `--primitive-green-800` | #1c8269 | Button active/pressed |

### Red / Danger

| Name | Primitive Token | Hex | Usage |
|---|---|---|---|
| Danger surface | `--primitive-red-50` | #fff5f4 | Danger button hover bg |
| Error bg | `--primitive-red-100` | #fdf0ee | Error message background |
| Error border | `--primitive-red-200` | #f5c4bc | Error state border (light) |
| Error light | `--primitive-red-300` | #ed7c6e | Danger button border, error border |
| Danger | `--primitive-red-500` | #e54430 | Error text, danger buttons, trash icons |
| Danger hover | `--primitive-red-700` | #cc3926 | Danger button hover |

### Blue / Info

| Name | Primitive Token | Hex | Usage |
|---|---|---|---|
| Selection bg | `--primitive-blue-50` | #eceef9 | Avatar color, selection highlight |
| Feature badge bg | `--primitive-blue-100` | #ebf4fd | Feature badge background |
| Primary | `--primitive-blue-500` | #358ceb | Info state, links |

### Orange / Brand

| Name | Primitive Token | Hex | Usage |
|---|---|---|---|
| Brand orange | `--primitive-orange-500` | #f4640c | Account logo background |

---

## Semantic Aliases

| Alias Token | Maps To | Hex | When to Use |
|---|---|---|---|
| `--color-text-primary` | `--primitive-neutral-800` | #1f2129 | Main body text, titles |
| `--color-text-secondary` | `--primitive-neutral-500` | #5f616a | Secondary labels, icon color |
| `--color-text-muted` | `--primitive-neutral-600` | #73757f | Hints, captions, helper text |
| `--color-text-placeholder` | `--primitive-neutral-350` | #b0b3c0 | Input placeholders |
| `--color-text-disabled` | `--primitive-neutral-400` | #9b9da6 | Disabled and subtle text |
| `--color-text-subtle` | `--primitive-neutral-450` | #9c9ea8 | Droplist empty state, sub-breadcrumb |
| `--color-text-inverse` | `--primitive-neutral-0` | #ffffff | Text on dark/colored backgrounds |
| `--color-bg-page` | `--primitive-neutral-0` | #ffffff | Page root background |
| `--color-bg-surface` | `--primitive-neutral-50` | #f7f7f7 | Sidebar, banners, section headers |
| `--color-bg-subtle` | `--primitive-neutral-25` | #fbfbfb | Toast, droplist search area |
| `--color-hover-bg` | `--primitive-neutral-100` | #eef0f8 | Card icon-button hover |
| `--color-hover-light` | `--primitive-neutral-75` | #efefef | Light surface hover |
| `--color-border` | `--primitive-neutral-200` | #dee0eb | All borders, dividers |
| `--color-border-input` | `--primitive-neutral-300` | #bbbdc8 | Input/button borders |
| `--color-interactive-primary` | `--primitive-green-500` | #2c9c74 | Primary CTA color |
| `--color-interactive-hover` | `--primitive-green-700` | #268a65 | Primary CTA hover |
| `--color-interactive-secondary` | `--primitive-neutral-700` | #40424b | Cancel button text |
| `--color-nav-active` | `--primitive-green-500` | #2c9c74 | Active nav sub-item |
| `--color-selection-bg` | `--primitive-blue-50` | #eceef9 | Avatar bg, selection |
| `--color-selected-row` | `--primitive-green-50` | #ebf8ef | Droplist selected row bg |
| `--color-danger` | `--primitive-red-500` | #e54430 | Danger actions, error text |
| `--color-danger-border` | `--primitive-red-300` | #ed7c6e | Danger outline border |
| `--color-icon` | `--primitive-neutral-500` | #5f616a | Default icon color |
| `--color-brand-orange` | `--primitive-orange-500` | #f4640c | Brand/account logo |
| `--color-feature-bg` | `--primitive-blue-100` | #ebf4fd | Feature badge background |
