# SKILL — Design System Reference

Цей файл є джерелом правди для UI-рішень у прототипах: кольори, типографіка, токени, іконки, організми.

---

## Figma files

| Файл | Key | Призначення |
|------|-----|-------------|
| FVDR - Design System | `liyNDiFf1piO8SQmHNKoeU` | DS: іконки, кольори, компоненти |
| Icons node | node `15846:7469` | Стандартні іконки 16/20/24px |
| Nav icons node | node `1689:13136` | Іконки навігації (VDR sidebar) |

---

## Design Tokens

### Colors

| Токен | HEX | Використання |
|-------|-----|--------------|
| `$stone-1000` | `#1F2129` | Основний текст, заголовки |
| `$stone-800` | `#5F616A` | Вторинний текст, іконки |
| `$stone-600` | `#40424b` | Текст nav-item (default) |
| `$stone-100` | `#dee0eb` | Розділювачі, бордери |
| `$stone-50` | `#f7f7f7` | Background sidebar |
| `$stone-75` | `#efefef` | Hover sidebar header |
| `$stone-25` | `#e8e8e8` | Hover collapse button |
| `$primary-500` | `#2C9C74` | Акцент (active, success, green actions) |
| `$primary-50` | `#eceef9` | Background avatar (soft) |

### Typography

Шрифт: системний (без кастомного шрифту у DS-компонентах).

| Застосування | Розмір | Вага |
|--------------|--------|------|
| Nav item default | 16px | 400 |
| Nav item hover/active | 16px | 600 |
| Sub-item default | 14px | 400 |
| Sub-item active | 14px | 600 |
| Account name | 16px | 600 |
| Breadcrumb link | 15px | 600 |
| Breadcrumb current | 15px | 600 |

---

## Organisms

### VDR Left Menu (Sidebar)

**Референс:** `src/app/prototypes/project-archive-creation-flow-testing/project-archive-creation-flow-testing.component.ts`

**Figma:** Nav icons → `liyNDiFf1piO8SQmHNKoeU`, node `1689:13136`

#### Розміри

| Елемент | Значення |
|---------|----------|
| Sidebar expanded | `280px` width |
| Sidebar collapsed | `72px` width |
| Transition | `width 0.22s ease, min-width 0.22s ease` |
| Nav item height | `32px` |
| Icon zone width | `72px` (centered icon) |
| Icon size | `24px` (font-size) |
| Header (account switcher) | `64px` min-height |
| Footer (sidebar-bottom) | `72px` min-height |
| Nav list top padding | `24px` |
| Nav list gap | `24px` |

#### Структура HTML

```html
<nav class="sidebar" [class.sidebar--collapsed]="sidebarCollapsed">

  <!-- Project switcher -->
  <div class="account-switcher">
    <div class="account-switcher-left">
      <div class="account-logo">PA</div>
      <span class="account-name" *ngIf="!sidebarCollapsed">Project Alpha</span>
    </div>
    <fvdr-icon *ngIf="!sidebarCollapsed" name="chevron-down" class="account-chevron"></fvdr-icon>
  </div>

  <!-- Nav list -->
  <div class="nav-list">
    <div class="nav-group" *ngFor="let item of navItems">
      <button class="nav-item"
              [class.nav-item--active]="item.active"
              [class.nav-item--open]="item.open"
              [title]="sidebarCollapsed ? item.label : ''"
              (click)="toggleNavItem(item)">
        <span class="nav-icon-zone">
          <span class="nav-icon">
            <fvdr-icon class="icon-default" [name]="item.icon"></fvdr-icon>
            <fvdr-icon class="icon-active" [name]="item.iconActive"></fvdr-icon>
          </span>
        </span>
        <span class="nav-label" *ngIf="!sidebarCollapsed">{{ item.label }}</span>
        <fvdr-icon *ngIf="!sidebarCollapsed && item.children" name="chevron-down"
                   class="nav-chevron" [class.nav-chevron--up]="item.open"></fvdr-icon>
      </button>
      <div *ngIf="!sidebarCollapsed && item.open && item.children" class="nav-subitems">
        <button *ngFor="let child of item.children" class="nav-subitem"
                [class.nav-subitem--active]="child.active">{{ child.label }}</button>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="sidebar-bottom">
    <div class="sidebar-logo" *ngIf="!sidebarCollapsed"><!-- ideals. SVG logo --></div>
    <button class="collapse-btn" (click)="sidebarCollapsed = !sidebarCollapsed">
      <fvdr-icon [name]="sidebarCollapsed ? 'angle-double-right' : 'angle-double-left'"></fvdr-icon>
    </button>
  </div>
</nav>
```

#### TypeScript interface + navItems

```typescript
interface NavItem {
  id: string;
  label: string;
  icon: FvdrIconName;
  iconActive: FvdrIconName;
  active?: boolean;
  open?: boolean;
  children?: { label: string; active?: boolean }[];
}

navItems: NavItem[] = [
  { id: 'dashboard',    label: 'Dashboard',        icon: 'nav-overview',     iconActive: 'nav-overview-active' },
  { id: 'documents',    label: 'Documents',         icon: 'nav-documents',    iconActive: 'nav-documents-active' },
  { id: 'participants', label: 'Participants',       icon: 'nav-participants', iconActive: 'nav-participants-active' },
  { id: 'permissions',  label: 'Permissions',        icon: 'nav-permissions',  iconActive: 'nav-permissions-active' },
  { id: 'qa',           label: 'Q&A',               icon: 'nav-qa',           iconActive: 'nav-qa-active' },
  { id: 'reports',      label: 'Reports',            icon: 'nav-reports',      iconActive: 'nav-reports-active',
    children: [{ label: 'Activity log' }, { label: 'Documents overview' }] },
  { id: 'settings',     label: 'Settings',           icon: 'nav-settings',     iconActive: 'nav-settings-active',
    children: [{ label: 'General' }, { label: 'Integrations' }] },
  { id: 'archiving',    label: 'Project archiving',  icon: 'nav-archiving',    iconActive: 'nav-archiving-active' },
  { id: 'recycle',      label: 'Recycle bin',        icon: 'nav-recycle',      iconActive: 'nav-recycle-active' },
];
```

#### Nav icons mapping (Figma → FvdrIconName)

| Figma type | FvdrIconName | FvdrIconName (active) |
|------------|-------------|----------------------|
| Overview / Dashboard | `nav-overview` | `nav-overview-active` |
| Documents | `nav-documents` | `nav-documents-active` |
| User & groups / Participants | `nav-participants` | `nav-participants-active` |
| Permissions | `nav-permissions` | `nav-permissions-active` |
| Q&A | `nav-qa` | `nav-qa-active` |
| Reports | `nav-reports` | `nav-reports-active` |
| Settings 2 | `nav-settings` | `nav-settings-active` |
| Project archiving | `nav-archiving` | `nav-archiving-active` |
| Recycle bin | `nav-recycle` | `nav-recycle-active` |

#### Поведінка станів

| Стан | Відображення |
|------|-------------|
| Default | `icon-default` видимий, текст `color: #40424b`, weight 400 |
| Hover | `icon-default` прихований, `icon-active` видимий, weight 600 |
| Active (`nav-item--active`) | `icon-active` видимий, `color: #1f2129`, weight 600 |
| Open (з children) | `nav-item--open` = same as active |
| Sub-item active | `color: #2C9C74`, weight 600 |
| Collapsed | sidebar `72px`, показується лише icon-zone + tooltip через `[title]` |

#### CSS (повний блок)

```css
.sidebar {
  width: 280px; min-width: 280px; height: 100%;
  background: #f7f7f7; border-right: 1px solid #dee0eb;
  display: flex; flex-direction: column; overflow: hidden;
  transition: width 0.22s ease, min-width 0.22s ease; flex-shrink: 0;
}
.sidebar--collapsed { width: 72px; min-width: 72px; }

.account-switcher {
  min-height: 64px; background: #f7f7f7;
  display: flex; align-items: center; padding: 12px 16px; gap: 16px;
  cursor: pointer; overflow: hidden; flex-shrink: 0; justify-content: space-between;
}
.account-switcher:hover { background: #efefef; }
.account-switcher-left { display: flex; align-items: center; gap: 16px; }
.account-logo {
  width: 40px; height: 40px; min-width: 40px; border-radius: 4px; flex-shrink: 0;
  background: #e8673a; color: #fff; font-size: 14px; font-weight: 600;
  display: flex; align-items: center; justify-content: center;
}
.account-name { font-size: 14px; font-weight: 600; color: #1f2129; white-space: nowrap; }
.account-chevron { flex-shrink: 0; font-size: 16px; color: #5f616a; }

.nav-list { display: flex; flex-direction: column; flex: 1; overflow-y: auto; padding: 24px 0 8px; gap: 0; }
.nav-group { display: flex; flex-direction: column; }

.nav-item {
  width: 100%; height: 32px; min-height: 32px;
  border: none; background: transparent; color: #40424b;
  display: flex; align-items: center; cursor: pointer;
  font-size: 14px; text-align: left; white-space: nowrap; overflow: hidden;
}
.icon-active { display: none; }
.nav-item:hover { font-weight: 600; }
.nav-item:hover .icon-default { display: none; }
.nav-item:hover .icon-active  { display: inline-flex; }
.nav-item--active { color: #1f2129; font-weight: 600; }
.nav-item--open   { color: #1f2129; font-weight: 600; }
.nav-item--active .icon-default,
.nav-item--open   .icon-default { display: none; }
.nav-item--active .icon-active,
.nav-item--open   .icon-active  { display: inline-flex; }

.nav-icon-zone {
  width: 72px; min-width: 72px; height: 32px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.nav-icon { display: flex; align-items: center; justify-content: center; color: #5f616a; font-size: 24px; }
.nav-label { flex: 1; }
.nav-chevron { flex-shrink: 0; margin-right: 16px; transition: transform 0.2s; font-size: 16px; color: #5f616a; }
.nav-chevron--up { transform: rotate(180deg); }

.nav-subitems { display: flex; flex-direction: column; }
.nav-subitem {
  height: 32px; padding: 0 16px 0 72px;
  border: none; background: transparent; cursor: pointer;
  font-size: 14px; color: #5f616a; display: flex; align-items: center;
  text-align: left; white-space: nowrap;
}
.nav-subitem:hover { font-weight: 600; }
.nav-subitem--active { font-weight: 600; color: #2c9c74; }

.sidebar-bottom {
  height: 72px; min-height: 72px; background: #f7f7f7; border-top: 1px solid #dee0eb;
  display: flex; align-items: center; padding: 0 16px 0 24px;
  justify-content: space-between; overflow: hidden; flex-shrink: 0;
}
.sidebar-logo { display: flex; align-items: center; overflow: hidden; }
.collapse-btn {
  width: 32px; height: 32px; min-width: 32px;
  border: none; background: transparent; cursor: pointer; border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; color: #5f616a; margin-left: auto;
}
.collapse-btn:hover { background: #e8e8e8; }
```

---

## Organisms

### Breadcrumb (Header)

**Референс:** `ca-settings-integrations.component.ts`

```html
<nav class="breadcrumb" aria-label="breadcrumb">
  <!-- Parent: clickable, gray, chevron-right всередині -->
  <button class="bc-item bc-item--link" (click)="goBack()">
    Parent page
    <fvdr-icon name="chevron-right" class="bc-chevron bc-chevron--dim"></fvdr-icon>
  </button>
  <!-- Current page: dark, не clickable -->
  <button class="bc-item bc-item--current" disabled>
    Current page
  </button>
</nav>
```

```css
.breadcrumb { display: flex; align-items: center; gap: 0; }
.bc-item {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 8px; background: none; border: none; cursor: pointer;
  font-family: var(--font-family); font-size: 15px; font-weight: 600; line-height: 20px;
}
.bc-item--link { color: #5f616a; }
.bc-item--link:hover { color: #2c9c74; }   /* ← green hover! */
.bc-item--current { color: #1f2129; cursor: default; }
.bc-chevron { font-size: 16px; }
.bc-chevron--dim { color: #bbbdc8; }        /* ← dimmed separator */
```

---

## Other icons (non-nav)

| Іконка | FvdrIconName | Figma node | Де використовується |
|--------|-------------|-----------|---------------------|
| Flash drive (USB) | `flash-drive` | `17776:569` (16x16) | "Place order" кнопка |
| Archive box | `nav-archiving` | `18700:3405` (24x24) | Archive cards, sidebar |
