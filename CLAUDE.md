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
