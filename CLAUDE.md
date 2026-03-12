# Claude Code — Agent Instructions
> Read this file before touching anything. It defines the rules every agent must follow in this repo.

---

## What this repo is

An Angular 17 prototype platform for UX/design testing. Designers create flows in Figma, Claude converts them to Angular components, Vercel deploys each branch automatically, Supabase captures click analytics.

**Stack:** Angular 17 (standalone) · TypeScript strict · Vercel · Supabase · Open Sans

---

## Your job as an agent

When a designer gives you a Figma link + brief:

1. Fetch design context from Figma MCP if available
2. Generate the Angular component
3. Run the scaffolding script (see below)
4. Commit and push to the correct branch
5. Return the Vercel preview URL

That is it. Do not refactor existing components. Do not change global styles unless asked. Do not add dependencies.

---

## Scaffold a new prototype — always use this script

```bash
node scripts/new-proto.js \
  --slug "my-flow" \
  --title "My Flow Title" \
  --figma "https://www.figma.com/design/...?node-id=xxxx:yyyy" \
  --status wip \
  --description "One line description"
```

**Slug rules:** lowercase letters, numbers, hyphens only. No spaces. No uppercase.

The script automatically:
- Creates `src/app/prototypes/<slug>/<slug>.component.ts`
- Registers the lazy route in `app.routes.ts`
- Adds the card entry to `proto-registry.ts`

After the script runs, open the generated component and replace the placeholder template with the actual Figma-driven UI.

---

## Component rules — follow these exactly

Every prototype component must:

```typescript
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackerService } from '../../services/tracker.service';

@Component({
  selector: 'fvdr-<slug>',   // always fvdr- prefix
  standalone: true,
  imports: [CommonModule],   // add others only if needed
  template: `...`,
  styles: [`...`]
})
export class <PascalSlug>Component implements OnInit, OnDestroy {
  private tracker = inject(TrackerService);

  ngOnInit(): void {
    this.tracker.trackPageView('<slug>');  // required
  }

  ngOnDestroy(): void {
    this.tracker.destroyListeners();      // required — prevents memory leaks
  }
}
```

Add `data-track="<label>"` on every interactive element so click events get labelled:

```html
<button data-track="submit-cta" (click)="onSuccess()">Submit</button>
<button data-track="cancel"     (click)="onFail()">Cancel</button>
<a      data-track="nav-link">Settings</a>
```

---

## Design tokens — use these, never invent new colors

All tokens are in `src/styles.css` as CSS custom properties.

| CSS variable              | Value       | Use               |
|---------------------------|-------------|-------------------|
| `--color-primary-500`     | `#2C9C74`   | Accent, CTA       |
| `--color-primary-400`     | `#3FB67D`   | Hover, success    |
| `--color-orange-500`      | `#F4640C`   | Warning, WIP tag  |
| `--color-red-500`         | `#EF5350`   | Error, danger     |
| `--color-blue-500`        | `#4862D3`   | Secondary, info   |
| `--color-dodger-500`      | `#358CEB`   | Links             |
| `--color-bg`              | `#0B1410`   | App background    |
| `--color-surface`         | `#101A16`   | Cards, panels     |
| `--color-border`          | `#1e2e28`   | Borders, dividers |
| `--color-text`            | `#e8f5f0`   | Body text         |
| `--color-muted`           | `#9bbfb0`   | Secondary text    |

Font is **Open Sans** — already loaded in `index.html`, use `font-family: 'Open Sans', sans-serif`.

---

## Git workflow

**One prototype = one branch = one Vercel preview URL.**

```
proto/<slug>        → Vercel preview deploy (designer testing)
master              → Vercel production deploy (dashboard cards go live here)
```

### Steps to push a new prototype

```bash
git checkout -b proto/<slug>
git add src/app/prototypes/<slug>/ src/app/app.routes.ts src/app/proto-registry.ts
git commit -m "feat: add <slug> prototype"
git push -u origin proto/<slug>
```

### Steps to promote to master (requires approval)

Designers open a Merge Request (GitLab) from `proto/<slug>` → `master`.
The Head of Design reviews and approves before merge.
On merge, Vercel production re-deploys and the new card appears on the dashboard automatically.

**Never push directly to master.** Always go through a Merge Request.

---

## File locations

| What                    | Where                                        |
|-------------------------|----------------------------------------------|
| Prototype components    | `src/app/prototypes/<slug>/<slug>.component.ts` |
| Route registration      | `src/app/app.routes.ts`                      |
| Dashboard card registry | `src/app/proto-registry.ts`                  |
| Click tracker service   | `src/app/services/tracker.service.ts`        |
| Heatmap component       | `src/app/components/heatmap/heatmap.component.ts` |
| Global styles           | `src/styles.css`                             |
| Env template            | `src/environments/environment.ts`            |
| Scaffold script         | `scripts/new-proto.js`                       |
| Build env script        | `scripts/set-env.js`                         |
| Supabase schema         | `supabase/schema.sql`                        |

---

## Using Storybook components

The team has an official Storybook at `https://storybook-fvdr-frontend.qa.stagevdr.com/`.

**Rule: read from it, never write to it.** This repo has zero connection to the Storybook/frontend repo.

### How to use a Storybook component in a prototype

1. Open Storybook → find the component → click the **Docs** tab
2. Click **Show code** to see the rendered HTML and CSS class names
3. Copy that markup into the prototype's inline template
4. Copy any `--ideals-*` CSS variables it uses into the component's inline `styles: [...]`

The prototype is self-contained — reproduce the markup and styles locally. Do not import from the frontend repo.

### Storybook CSS variables (prefix: `--ideals-`)

These come from the main product design system. Use them when matching a Storybook component:

| Variable                        | Use                        |
|---------------------------------|----------------------------|
| `--ideals-border-radius`        | `4px` — all rounded corners |
| `--ideals-main-bg`              | Page/surface background    |
| `--ideals-text-color`           | Body text                  |
| `--ideals-document-icon-size`   | `1.25rem` — icon sizing    |
| `--ideals-radio-button-size`    | `1rem` — radio controls    |

Copy additional `--ideals-*` values directly from the Storybook "Show code" output as needed.

### When to reach for Angular CDK instead

For interactive patterns not covered by static markup (modals, focus traps, dropdowns, tooltips, drag-and-drop), use **Angular CDK** — it is the headless primitive layer built into the Angular ecosystem and requires no new dependency.

```bash
# Already available — no install needed if @angular/cdk is in package.json
# Check: cat package.json | grep angular/cdk
```

**CDK modules available for use in prototypes:**

| CDK module          | Import from                    | Use for                          |
|---------------------|--------------------------------|----------------------------------|
| `OverlayModule`     | `@angular/cdk/overlay`         | Dropdowns, tooltips, popovers    |
| `A11yModule`        | `@angular/cdk/a11y`            | Focus trap inside modals         |
| `DragDropModule`    | `@angular/cdk/drag-drop`       | Drag-and-drop reordering         |
| `PortalModule`      | `@angular/cdk/portal`          | Render content outside component |
| `ScrollingModule`   | `@angular/cdk/scrolling`       | Virtual scroll for long lists    |

Import only what the prototype needs:

```typescript
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule }    from '@angular/cdk/a11y';

@Component({
  standalone: true,
  imports: [CommonModule, OverlayModule, A11yModule],
  ...
})
```

**Do not use Angular CDK for things plain CSS handles** (transitions, hover states, visibility toggles). Only reach for it when the interaction genuinely requires it.

Do not install `@angular/material` — it pulls in a full component library and conflicts with the design system visuals.

---

## What NOT to do

- Do not modify `tracker.service.ts`, `heatmap.component.ts`, or `app.component.ts` unless explicitly asked
- Do not change `styles.css` global tokens unless asked
- Do not add npm packages without asking first
- Do not push to `master` — use Merge Requests
- Do not commit `src/environments/environment.local.ts` or `environment.prod.ts` — they are gitignored for a reason (they contain secrets)
- Do not use `HttpClient` — Supabase JS client handles all data
- Do not create separate CSS files for prototypes — inline `styles: [...]` only

---

## Checklist before pushing

- [ ] `node scripts/new-proto.js` ran without errors
- [ ] Component has `trackPageView` in `ngOnInit`
- [ ] Component has `destroyListeners` in `ngOnDestroy`
- [ ] Interactive elements have `data-track` attributes
- [ ] Only design token colors used (no hardcoded hex outside the token list)
- [ ] Branch name is `proto/<slug>`
- [ ] Commit message follows `feat: add <slug> prototype`
