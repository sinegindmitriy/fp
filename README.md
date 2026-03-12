# FVDR Prototype Platform
Angular 17 · Vercel · Supabase · Click Tracking / Heatmaps

---

## Workflow
```
1. Create mockup in Figma
2. Paste Figma link + brief to Claude
3. Claude generates Angular component + registers slug
4. git push origin proto/<slug>  →  Vercel auto-deploys
5. Share URL  →  real users or synthetic personas test it
6. View click heatmap at bottom-right 🔥 button
7. Open Merge Request proto/<slug> → master for approval
8. After Head of Design approves → merge → card goes live on dashboard
```

---

## Designer Onboarding — Setting Up Your Machine

### Prerequisites

Install these tools before anything else:

| Tool           | Install                                      | Check             |
|----------------|----------------------------------------------|-------------------|
| Node.js 20+    | [nodejs.org](https://nodejs.org) (LTS)       | `node -v`         |
| Git            | [git-scm.com](https://git-scm.com)           | `git --version`   |
| Claude Code    | `npm install -g @anthropic-ai/claude-code`   | `claude --version`|

### Step 1 — Clone the repository

Ask the Head of Design for your GitLab account invite, then:

```bash
git clone git@gitlab.com:<org>/fp.git
cd fp
```

> If you use HTTPS instead of SSH: `git clone https://gitlab.com/<org>/fp.git`

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Configure local environment

```bash
cp src/environments/environment.ts src/environments/environment.local.ts
```

Open `environment.local.ts` and fill in the values. Ask the Head of Design for the Supabase credentials — never share them publicly.

```typescript
export const environment = {
  production: false,
  supabaseUrl: 'https://xxxx.supabase.co',      // get from Head of Design
  supabaseAnonKey: 'eyJ...',                     // get from Head of Design
};
```

### Step 4 — Run the dev server

```bash
npm start
```

Open `http://localhost:4200` — you should see the prototype dashboard.

### Step 5 — Configure Claude Code

```bash
claude
```

On first launch Claude Code will ask for an API key. Get yours from [console.anthropic.com](https://console.anthropic.com). Then run inside the project:

```bash
claude --mcp-config  # only if Figma MCP is needed — ask Head of Design for config
```

---

## Designer Push Process — Step by Step

This is the full lifecycle of a prototype from Figma to the dashboard.

### Phase 1 — Create the prototype

Open Claude Code in the project folder:

```bash
claude
```

Paste this prompt (replace the placeholders):

```
New prototype:
- Figma link: https://www.figma.com/design/...?node-id=xxxx:yyyy
- Slug: my-flow-name
- Title: "My Flow Title"
- Description: "One sentence about what this tests"
- Brief: <describe the user journey, key interactions, edge cases>
```

Claude will:
1. Read the Figma design
2. Generate the Angular component
3. Run `scripts/new-proto.js`
4. Commit and push to `proto/my-flow-name`
5. Give you the Vercel preview URL

### Phase 2 — Review and iterate

Open the Vercel preview URL. Test the flow yourself. If changes are needed, tell Claude what to fix:

```
Update the prototype:
- The CTA button should say "Get Started" not "Submit"
- Add a loading state after the button click
```

Claude edits the component, commits, and pushes. Vercel redeploys automatically within ~1 minute.

### Phase 3 — Open a Merge Request for approval

When the prototype is ready to go live on the main dashboard:

1. Go to GitLab → your project → **Merge Requests** → **New merge request**
2. Source branch: `proto/<slug>`
3. Target branch: `master`
4. Title: `feat: add <slug> prototype`
5. Add a short description and a screenshot or Loom of the flow
6. Assign the Head of Design as reviewer
7. Click **Create merge request**

**Do not merge yourself.** Wait for approval.

### Phase 4 — After approval

The Head of Design approves and merges. Vercel redeploys production automatically. The new card appears on the dashboard at the production URL.

---

## Setup (one-time — for project admins)

### 1. Supabase
1. Create project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL editor
3. Copy **Project URL** and **anon public key**

### 2. Vercel
1. Import this repo into Vercel
2. Build command: `npm run build:proto`
3. Output dir: `dist/fvdr-prototypes/browser`
4. Add environment variables:
   ```
   SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_ANON_KEY=eyJ...
   ```
5. Enable **Preview Deployments** → each branch gets its own URL

### 3. Local dev
```bash
npm install
cp src/environments/environment.ts src/environments/environment.local.ts
# edit environment.local.ts — fill in SUPABASE_URL and SUPABASE_ANON_KEY
npm start
```

---

## Generating a new prototype

**You give Claude:**
- The Figma node URL (`?node-id=xxxx:yyyy`)
- A written brief: what the flow does, key interactions, edge cases

**Claude will:**
1. Fetch design context from Figma MCP
2. Generate the Angular component
3. Run `node scripts/new-proto.js --slug <slug> --title "..." --figma "..." --status wip`
4. Push to `proto/<slug>` branch
5. Return the Vercel preview URL

**Manual scaffold:**
```bash
node scripts/new-proto.js \
  --slug "deal-room" \
  --title "Deal Room Dashboard" \
  --figma "https://www.figma.com/design/liyNDiFf1piO8SQmHNKoeU?node-id=1042:12890" \
  --status wip \
  --description "Active deals overview with quick actions"
```

---

## Analytics / Heatmap

Events are written to Supabase `proto_events` table automatically:

| event_type      | when                                  |
|-----------------|---------------------------------------|
| `page_view`     | User lands on prototype route         |
| `click`         | Any click (includes x/y coordinates)  |
| `scroll`        | Scroll depth checkpoint               |
| `task_complete` | Prototype calls `tracker.trackTask()` |
| `task_fail`     | User cancels or error path            |

**Heatmap:** click the 🔥 button (bottom-right of any prototype) to see a live overlay of all click positions aggregated across sessions.

**Query example (Supabase dashboard):**
```sql
select * from proto_summary order by sessions desc;
```

---

## Prototype component template

Every generated prototype is a standalone Angular component:

```typescript
@Component({
  selector: 'fvdr-my-flow',
  standalone: true,
  imports: [CommonModule],
  template: `...`,
  styles: [`...`]
})
export class MyFlowComponent implements OnInit, OnDestroy {
  private tracker = inject(TrackerService);

  ngOnInit() { this.tracker.trackPageView('my-flow'); }
  ngOnDestroy() { this.tracker.destroyListeners(); }

  onSuccess() { this.tracker.trackTask('my-flow', 'task_complete'); }
}
// Add data-track attribute to key elements for labelled click events:
// <button data-track="submit-form">Submit</button>
```

---

## Design tokens

| Token        | Value     | Use               |
|--------------|-----------|-------------------|
| Primary 500  | `#2C9C74` | Accent, CTA       |
| Primary 400  | `#3FB67D` | Hover, success    |
| Orange 500   | `#F4640C` | Warning           |
| Red 500      | `#EF5350` | Error, danger     |
| Blue 500     | `#4862D3` | Secondary, info   |
| Dodger 500   | `#358CEB` | Links, info       |
| Background   | `#0B1410` | App bg            |
| Surface      | `#101A16` | Cards, panels     |

Font: **Open Sans** (matches Figma design system)

---

## GitLab — Protecting master (admin setup)

To enforce the approval workflow, the Head of Design must protect the master branch in GitLab:

1. GitLab project → **Settings** → **Repository** → **Protected branches**
2. Add rule for `master`:
   - **Allowed to merge:** Maintainers (Head of Design role)
   - **Allowed to push:** No one (or Maintainers only)
   - **Require approval:** 1 approval from owner
3. Click **Protect**

This means designers can push `proto/*` branches freely but cannot merge to master without approval.

**Optional — auto-close preview branches:**
In GitLab → **Settings** → **Merge Requests**, enable:
- "Delete source branch by default" — cleans up `proto/*` branches after merge

---

## Branch naming reference

| Branch pattern | Purpose                          | Who pushes    |
|----------------|----------------------------------|---------------|
| `master`       | Production — live dashboard      | Head of Design (merge only) |
| `proto/<slug>` | One prototype in progress        | Designers + Claude |
| `claude/*`     | Claude Code agent work branches  | Claude only   |
