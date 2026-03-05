import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackerService } from '../../services/tracker.service';

@Component({
  selector: 'fvdr-figma-desktop',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="app">

      <!-- Title Bar -->
      <div class="titlebar">
        <div class="titlebar-left">
          <div class="traffic-lights">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <div class="nav-arrows">
            <button class="icon-btn" data-track="nav-back" title="Back">&#8592;</button>
            <button class="icon-btn" data-track="nav-forward" title="Forward">&#8594;</button>
          </div>
        </div>
        <div class="titlebar-center">
          <div class="file-breadcrumb">
            <span class="crumb" data-track="breadcrumb-team">My Team</span>
            <span class="sep">/</span>
            <span class="crumb" data-track="breadcrumb-project">Product Design</span>
            <span class="sep">/</span>
            <span class="crumb active" data-track="breadcrumb-file">Design System v2</span>
            <span class="unsaved-dot" [class.visible]="hasUnsaved()"></span>
          </div>
        </div>
        <div class="titlebar-right">
          <button class="share-btn" data-track="share" (click)="onShare()">Share</button>
          <div class="avatar-stack">
            <div class="avatar" style="background:#4862D3" title="Alice">A</div>
            <div class="avatar" style="background:#2C9C74" title="Bob">B</div>
          </div>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="toolbar">
        <div class="tool-group">
          <button class="tool-btn" [class.active]="activeTool() === 'move'" data-track="tool-move"
            (click)="setTool('move')" title="Move (V)">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3 1l10 7-5.5 1.5L6 14z"/>
            </svg>
          </button>
          <button class="tool-btn" [class.active]="activeTool() === 'frame'" data-track="tool-frame"
            (click)="setTool('frame')" title="Frame (F)">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="2" width="12" height="12" rx="1"/>
              <line x1="2" y1="5" x2="0" y2="5"/><line x1="14" y1="5" x2="16" y2="5"/>
              <line x1="2" y1="11" x2="0" y2="11"/><line x1="14" y1="11" x2="16" y2="11"/>
              <line x1="5" y1="2" x2="5" y2="0"/><line x1="11" y1="2" x2="11" y2="0"/>
              <line x1="5" y1="14" x2="5" y2="16"/><line x1="11" y1="14" x2="11" y2="16"/>
            </svg>
          </button>
          <button class="tool-btn" [class.active]="activeTool() === 'rect'" data-track="tool-rect"
            (click)="setTool('rect')" title="Rectangle (R)">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="4" width="12" height="8" rx="1"/>
            </svg>
          </button>
          <button class="tool-btn" [class.active]="activeTool() === 'ellipse'" data-track="tool-ellipse"
            (click)="setTool('ellipse')" title="Ellipse (O)">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <ellipse cx="8" cy="8" rx="6" ry="6"/>
            </svg>
          </button>
          <button class="tool-btn" [class.active]="activeTool() === 'text'" data-track="tool-text"
            (click)="setTool('text')" title="Text (T)">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <text x="2" y="13" font-size="12" font-weight="bold">T</text>
            </svg>
          </button>
        </div>
        <div class="tool-group">
          <button class="tool-btn" data-track="tool-comment" title="Comment (C)">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M2 2h12a1 1 0 011 1v7a1 1 0 01-1 1H5l-3 3V3a1 1 0 011-1z"/>
            </svg>
          </button>
        </div>
        <div class="zoom-control">
          <button class="icon-btn sm" data-track="zoom-out" (click)="zoom(-10)">&#x2212;</button>
          <span class="zoom-label">{{ zoomLevel() }}%</span>
          <button class="icon-btn sm" data-track="zoom-in" (click)="zoom(10)">+</button>
        </div>
      </div>

      <!-- Main Area -->
      <div class="main">

        <!-- Left Panel: Layers -->
        <div class="panel left-panel">
          <div class="panel-tabs">
            <button class="panel-tab active" data-track="tab-layers">Layers</button>
            <button class="panel-tab" data-track="tab-assets">Assets</button>
          </div>
          <div class="search-box">
            <input type="text" placeholder="Search layers..." />
          </div>
          <div class="layer-tree">
            @for (layer of layers; track layer.id) {
              <div class="layer-item" [class.selected]="selectedLayer() === layer.id"
                [style.padding-left.px]="layer.depth * 12 + 8"
                (click)="selectLayer(layer.id)" [attr.data-track]="'layer-' + layer.id">
                <span class="layer-icon">{{ layer.icon }}</span>
                <span class="layer-name">{{ layer.name }}</span>
                <span class="layer-action vis">&#128065;</span>
              </div>
            }
          </div>
        </div>

        <!-- Canvas -->
        <div class="canvas-area" (click)="onCanvasClick($event)" data-track="canvas">
          <div class="canvas" [style.transform]="'scale(' + zoomLevel() / 100 + ')'">

            <!-- Mobile Frame -->
            <div class="frame" [class.selected]="selectedLayer() === 'frame-1'"
              (click)="selectLayer('frame-1'); $event.stopPropagation()" data-track="frame-mobile">
              <div class="frame-label">Mobile / Home</div>
              <div class="frame-body mobile">
                <div class="mock-statusbar"></div>
                <div class="mock-nav">
                  <div class="mock-logo"></div>
                  <div class="mock-nav-items">
                    <div class="mock-chip active"></div>
                    <div class="mock-chip"></div>
                    <div class="mock-chip"></div>
                  </div>
                </div>
                <div class="mock-hero"></div>
                <div class="mock-cards">
                  <div class="mock-card"></div>
                  <div class="mock-card"></div>
                </div>
              </div>
            </div>

            <!-- Desktop Frame -->
            <div class="frame" [class.selected]="selectedLayer() === 'frame-2'"
              (click)="selectLayer('frame-2'); $event.stopPropagation()" data-track="frame-desktop">
              <div class="frame-label">Desktop / Home</div>
              <div class="frame-body desktop">
                <div class="mock-topbar">
                  <div class="mock-logo wide"></div>
                  <div class="mock-nav-items row">
                    <div class="mock-chip"></div>
                    <div class="mock-chip"></div>
                    <div class="mock-chip"></div>
                    <div class="mock-chip"></div>
                  </div>
                  <div class="mock-cta-btn"></div>
                </div>
                <div class="mock-hero wide"></div>
                <div class="mock-cards row">
                  <div class="mock-card"></div>
                  <div class="mock-card"></div>
                  <div class="mock-card"></div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Right Panel: Design -->
        <div class="panel right-panel">
          <div class="panel-tabs">
            <button class="panel-tab active" data-track="tab-design">Design</button>
            <button class="panel-tab" data-track="tab-inspect">Inspect</button>
            <button class="panel-tab" data-track="tab-prototype">Prototype</button>
          </div>

          @if (selectedLayer()) {
            <div class="prop-section">
              <div class="prop-label">Frame</div>
              <div class="prop-row">
                <label>X</label><input class="prop-input" type="number" value="0" />
                <label>Y</label><input class="prop-input" type="number" value="0" />
              </div>
              <div class="prop-row">
                <label>W</label>
                <input class="prop-input" type="number" [value]="selectedLayer() === 'frame-1' ? 390 : 1440" />
                <label>H</label>
                <input class="prop-input" type="number" [value]="selectedLayer() === 'frame-1' ? 844 : 900" />
              </div>
            </div>
            <div class="prop-section">
              <div class="prop-label">Fill</div>
              <div class="fill-row">
                <div class="color-swatch" style="background:#FFFFFF"></div>
                <span class="hex-val">FFFFFF</span>
                <span class="opacity-val">100%</span>
              </div>
            </div>
            <div class="prop-section">
              <div class="prop-label">Effects</div>
              <div class="effect-item">Drop Shadow</div>
            </div>
          } @else {
            <div class="empty-state">Select a layer to edit properties</div>
          }
        </div>

      </div>

      <!-- Status Bar -->
      <div class="statusbar">
        <span class="status-item" data-track="status-tool">Tool: {{ activeTool() }}</span>
        <span class="status-sep">&#xB7;</span>
        <span class="status-item">Zoom: {{ zoomLevel() }}%</span>
        <span class="status-sep">&#xB7;</span>
        <span class="status-item">{{ layers.length }} layers</span>
        <div class="status-right">
          <button class="flat-btn" data-track="save" (click)="onSave()">Save to Version History</button>
          <button class="flat-btn primary" data-track="complete" (click)="onSuccess()">Mark Complete</button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .app {
      display: flex;
      flex-direction: column;
      width: 100vw;
      height: 100vh;
      background: #1C1C1E;
      color: #E0E0E0;
      font-family: 'Inter', 'Open Sans', sans-serif;
      font-size: 13px;
      overflow: hidden;
    }

    /* Title Bar */
    .titlebar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 40px;
      background: #2C2C2E;
      border-bottom: 1px solid #3A3A3C;
      padding: 0 12px;
      flex-shrink: 0;
    }
    .titlebar-left, .titlebar-right { display: flex; align-items: center; gap: 8px; flex: 1; }
    .titlebar-right { justify-content: flex-end; }
    .titlebar-center { display: flex; justify-content: center; flex: 2; }
    .traffic-lights { display: flex; gap: 5px; }
    .dot { width: 12px; height: 12px; border-radius: 50%; }
    .dot.red { background: #FF5F57; }
    .dot.yellow { background: #FFBD2E; }
    .dot.green { background: #28C840; }
    .nav-arrows { display: flex; gap: 2px; }
    .icon-btn {
      background: none; border: none; color: #A0A0A0; cursor: pointer;
      padding: 4px 6px; border-radius: 4px; font-size: 14px; line-height: 1;
    }
    .icon-btn:hover { background: #3A3A3C; color: #E0E0E0; }
    .file-breadcrumb { display: flex; align-items: center; gap: 4px; font-size: 13px; }
    .crumb { color: #A0A0A0; cursor: pointer; }
    .crumb:hover { color: #E0E0E0; }
    .crumb.active { color: #E0E0E0; font-weight: 600; }
    .sep { color: #555; }
    .unsaved-dot { width: 6px; height: 6px; border-radius: 50%; background: #F4640C; display: none; }
    .unsaved-dot.visible { display: inline-block; }
    .share-btn {
      background: #2C9C74; color: #fff; border: none; padding: 5px 14px;
      border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;
    }
    .share-btn:hover { background: #3FB67D; }
    .avatar-stack { display: flex; }
    .avatar {
      width: 28px; height: 28px; border-radius: 50%; display: flex;
      align-items: center; justify-content: center; font-size: 11px; font-weight: 700;
      border: 2px solid #2C2C2E; color: #fff; margin-left: -6px;
    }
    .avatar:first-child { margin-left: 0; }

    /* Toolbar */
    .toolbar {
      display: flex;
      align-items: center;
      gap: 4px;
      height: 44px;
      background: #2C2C2E;
      border-bottom: 1px solid #3A3A3C;
      padding: 0 12px;
      flex-shrink: 0;
    }
    .tool-group {
      display: flex; gap: 2px;
      padding-right: 12px; border-right: 1px solid #3A3A3C; margin-right: 8px;
    }
    .tool-group:last-of-type { border-right: none; }
    .tool-btn {
      background: none; border: none; color: #A0A0A0; cursor: pointer;
      width: 32px; height: 32px; border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
    }
    .tool-btn:hover { background: #3A3A3C; color: #E0E0E0; }
    .tool-btn.active { background: #2C9C74; color: #fff; }
    .zoom-control { display: flex; align-items: center; gap: 4px; margin-left: auto; }
    .icon-btn.sm { padding: 2px 8px; font-size: 16px; font-weight: 300; }
    .zoom-label { font-size: 12px; color: #A0A0A0; min-width: 36px; text-align: center; }

    /* Main layout */
    .main { display: flex; flex: 1; overflow: hidden; }

    /* Panels */
    .panel {
      width: 240px;
      background: #2C2C2E;
      border-right: 1px solid #3A3A3C;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      overflow: hidden;
    }
    .right-panel { border-right: none; border-left: 1px solid #3A3A3C; }
    .panel-tabs { display: flex; border-bottom: 1px solid #3A3A3C; }
    .panel-tab {
      flex: 1; padding: 8px 4px; background: none; border: none; color: #A0A0A0;
      font-size: 12px; cursor: pointer; border-bottom: 2px solid transparent;
    }
    .panel-tab.active { color: #E0E0E0; border-bottom-color: #2C9C74; }
    .panel-tab:hover { color: #E0E0E0; }

    /* Layer tree */
    .search-box { padding: 6px 8px; border-bottom: 1px solid #3A3A3C; }
    .search-box input {
      width: 100%; background: #1C1C1E; border: 1px solid #3A3A3C; color: #E0E0E0;
      border-radius: 4px; padding: 4px 8px; font-size: 12px; outline: none;
    }
    .layer-tree { flex: 1; overflow-y: auto; padding: 4px 0; }
    .layer-item {
      display: flex; align-items: center; gap: 6px; height: 28px;
      cursor: pointer; border-radius: 4px; margin: 1px 4px; padding-right: 8px;
    }
    .layer-item:hover { background: #3A3A3C; }
    .layer-item.selected { background: rgba(44,156,116,0.2); }
    .layer-icon { font-size: 11px; flex-shrink: 0; }
    .layer-name { flex: 1; font-size: 12px; color: #C0C0C0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .layer-item.selected .layer-name { color: #E0E0E0; }
    .layer-action { opacity: 0; cursor: pointer; font-size: 11px; color: #666; }
    .layer-item:hover .layer-action { opacity: 1; }

    /* Right panel */
    .prop-section { padding: 12px; border-bottom: 1px solid #3A3A3C; }
    .prop-label { font-size: 11px; color: #777; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
    .prop-row { display: flex; align-items: center; gap: 4px; margin-bottom: 4px; }
    .prop-row label { font-size: 11px; color: #777; width: 14px; flex-shrink: 0; }
    .prop-input {
      flex: 1; background: #1C1C1E; border: 1px solid #3A3A3C; color: #E0E0E0;
      border-radius: 4px; padding: 3px 6px; font-size: 12px; outline: none; min-width: 0;
    }
    .prop-input:focus { border-color: #2C9C74; }
    .fill-row { display: flex; align-items: center; gap: 8px; }
    .color-swatch { width: 20px; height: 20px; border-radius: 4px; border: 1px solid #444; cursor: pointer; flex-shrink: 0; }
    .hex-val { font-size: 12px; font-family: monospace; flex: 1; }
    .opacity-val { font-size: 12px; color: #777; }
    .effect-item { font-size: 12px; color: #C0C0C0; background: #1C1C1E; border-radius: 4px; padding: 6px 8px; }
    .empty-state { padding: 20px 12px; font-size: 12px; color: #555; text-align: center; }

    /* Canvas */
    .canvas-area {
      flex: 1;
      overflow: auto;
      background: #141414;
      background-image: radial-gradient(circle, #2a2a2a 1px, transparent 1px);
      background-size: 24px 24px;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 60px 40px;
      cursor: crosshair;
    }
    .canvas {
      display: flex;
      gap: 80px;
      align-items: flex-start;
      transform-origin: top left;
      transition: transform 0.1s;
    }

    /* Frames */
    .frame { position: relative; cursor: default; }
    .frame.selected::after {
      content: '';
      position: absolute;
      inset: -2px;
      border: 2px solid #2C9C74;
      border-radius: 3px;
      pointer-events: none;
    }
    .frame-label {
      position: absolute; top: -22px; left: 0;
      font-size: 11px; color: #555; font-weight: 600; white-space: nowrap;
    }
    .frame.selected .frame-label { color: #2C9C74; }
    .frame-body { background: #fff; border-radius: 4px; overflow: hidden; }
    .frame-body.mobile { width: 390px; height: 440px; }
    .frame-body.desktop { width: 720px; height: 380px; }

    /* Mock UI elements */
    .mock-statusbar { height: 20px; background: #F8F8F8; }
    .mock-nav {
      display: flex; align-items: center; justify-content: space-between;
      padding: 8px 12px; background: #fff; border-bottom: 1px solid #eee;
    }
    .mock-logo { width: 60px; height: 12px; background: #DDD; border-radius: 2px; }
    .mock-logo.wide { width: 80px; }
    .mock-nav-items { display: flex; gap: 6px; }
    .mock-nav-items.row { flex: 1; justify-content: center; gap: 8px; }
    .mock-chip { width: 36px; height: 10px; background: #EEE; border-radius: 10px; }
    .mock-chip.active { background: #2C9C74; }
    .mock-hero {
      margin: 12px; height: 160px;
      background: linear-gradient(135deg, #E8F5F0 0%, #C8EAD8 100%);
      border-radius: 6px;
    }
    .mock-hero.wide { height: 180px; }
    .mock-cards { display: flex; gap: 8px; padding: 0 12px 12px; }
    .mock-cards.row { gap: 10px; }
    .mock-card { flex: 1; height: 80px; background: #F5F5F5; border-radius: 6px; border: 1px solid #EEE; }
    .mock-topbar {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 16px; background: #fff; border-bottom: 1px solid #eee;
    }
    .mock-cta-btn { width: 64px; height: 22px; background: #2C9C74; border-radius: 4px; margin-left: auto; }

    /* Status Bar */
    .statusbar {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 32px;
      background: #2C2C2E;
      border-top: 1px solid #3A3A3C;
      padding: 0 12px;
      flex-shrink: 0;
      font-size: 11px;
      color: #777;
    }
    .status-sep { color: #444; }
    .status-right { margin-left: auto; display: flex; gap: 8px; }
    .flat-btn {
      background: none; border: 1px solid #3A3A3C; color: #A0A0A0;
      padding: 3px 10px; border-radius: 4px; font-size: 11px; cursor: pointer;
    }
    .flat-btn:hover { border-color: #555; color: #E0E0E0; }
    .flat-btn.primary { background: #2C9C74; border-color: #2C9C74; color: #fff; }
    .flat-btn.primary:hover { background: #3FB67D; }
  `],
})
export class FigmaDesktopComponent implements OnInit, OnDestroy {
  private tracker = inject(TrackerService);

  activeTool = signal<string>('move');
  zoomLevel = signal<number>(100);
  selectedLayer = signal<string | null>(null);
  hasUnsaved = signal<boolean>(false);

  layers = [
    { id: 'page-1',        name: 'Page 1',          icon: '📄', depth: 0 },
    { id: 'frame-1',       name: 'Mobile / Home',   icon: '▦',  depth: 1 },
    { id: 'group-nav',     name: 'Navigation',      icon: '▤',  depth: 2 },
    { id: 'logo',          name: 'Logo',            icon: '◻',  depth: 3 },
    { id: 'nav-links',     name: 'Nav Links',       icon: '◻',  depth: 3 },
    { id: 'hero',          name: 'Hero Section',    icon: '▤',  depth: 2 },
    { id: 'cards',         name: 'Cards',           icon: '▤',  depth: 2 },
    { id: 'frame-2',       name: 'Desktop / Home',  icon: '▦',  depth: 1 },
    { id: 'topbar',        name: 'Top Bar',         icon: '▤',  depth: 2 },
    { id: 'hero-desktop',  name: 'Hero Section',    icon: '◻',  depth: 2 },
    { id: 'cards-desktop', name: 'Cards Row',       icon: '▤',  depth: 2 },
  ];

  ngOnInit(): void {
    this.tracker.trackPageView('figma-desktop');
  }

  ngOnDestroy(): void {
    this.tracker.destroyListeners();
  }

  setTool(tool: string): void {
    this.activeTool.set(tool);
    this.hasUnsaved.set(true);
  }

  zoom(delta: number): void {
    this.zoomLevel.set(Math.min(400, Math.max(10, this.zoomLevel() + delta)));
  }

  selectLayer(id: string): void {
    this.selectedLayer.set(id);
  }

  onCanvasClick(_e: MouseEvent): void {
    this.selectedLayer.set(null);
  }

  onShare(): void {
    this.tracker.trackTask('figma-desktop', 'task_complete');
  }

  onSave(): void {
    this.hasUnsaved.set(false);
    this.tracker.trackTask('figma-desktop', 'task_complete');
  }

  onSuccess(): void {
    this.tracker.trackTask('figma-desktop', 'task_complete');
  }

  onFail(): void {
    this.tracker.trackTask('figma-desktop', 'task_fail');
  }
}
