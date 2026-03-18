import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackerService } from '../../services/tracker.service';
import { DS_COMPONENTS } from '../../shared/ds';

const SLUG = 'project-archive-creation-flow-testing';

@Component({
  selector: 'fvdr-project-archive-creation-flow-testing',
  standalone: true,
  imports: [CommonModule, ...DS_COMPONENTS],
  template: `
    <div class="shell">

      <!-- ── Sidebar ────────────────────────────────────────────── -->
      <aside class="sidebar">
        <div class="sidebar-top">

          <!-- Project switcher -->
          <div class="project-row">
            <div class="project-logo">PA</div>
            <span class="project-name">Project Alpha</span>
            <fvdr-icon name="chevron-down" class="chevron-ic"></fvdr-icon>
          </div>

          <!-- Nav -->
          <nav>
            <a class="nav-item">
              <span class="nav-ic"><fvdr-icon name="nav-overview"></fvdr-icon></span>
              <span class="nav-lbl">Dashboard</span>
            </a>

            <a class="nav-item">
              <span class="nav-ic"><fvdr-icon name="folder"></fvdr-icon></span>
              <span class="nav-lbl">Documents</span>
            </a>

            <a class="nav-item">
              <span class="nav-ic"><fvdr-icon name="participants"></fvdr-icon></span>
              <span class="nav-lbl">Participants</span>
            </a>

            <a class="nav-item">
              <span class="nav-ic"><fvdr-icon name="lock-close"></fvdr-icon></span>
              <span class="nav-lbl">Permissions</span>
            </a>

            <a class="nav-item">
              <span class="nav-ic"><fvdr-icon name="info"></fvdr-icon></span>
              <span class="nav-lbl">Q&amp;A</span>
            </a>

            <a class="nav-item">
              <span class="nav-ic"><fvdr-icon name="reports"></fvdr-icon></span>
              <span class="nav-lbl">Reports</span>
              <fvdr-icon name="chevron-down" class="nav-end-ic"></fvdr-icon>
            </a>

            <a class="nav-item">
              <span class="nav-ic"><fvdr-icon name="settings"></fvdr-icon></span>
              <span class="nav-lbl">Settings</span>
              <fvdr-icon name="chevron-down" class="nav-end-ic"></fvdr-icon>
            </a>

            <!-- Active item -->
            <a class="nav-item nav-item--active">
              <span class="nav-ic"><fvdr-icon name="storage"></fvdr-icon></span>
              <span class="nav-lbl nav-lbl--bold">Project archiving</span>
            </a>

            <a class="nav-item">
              <span class="nav-ic"><fvdr-icon name="trash"></fvdr-icon></span>
              <span class="nav-lbl">Recycle bin</span>
            </a>
          </nav>
        </div>

        <!-- Footer -->
        <div class="sidebar-foot">
          <span class="ideals-logo">ideals.</span>
          <button class="collapse-btn" aria-label="Collapse">
            <fvdr-icon name="angle-double-left"></fvdr-icon>
          </button>
        </div>
      </aside>

      <!-- ── Main ────────────────────────────────────────────────── -->
      <div class="main">

        <!-- Header -->
        <header class="top-bar">
          <span class="breadcrumb">Project archiving</span>
          <div class="hdr-actions">
            <button class="ic-btn" aria-label="Dark mode">
              <fvdr-icon name="theme-dark"></fvdr-icon>
            </button>
            <button class="ic-btn" aria-label="Help">
              <fvdr-icon name="help"></fvdr-icon>
            </button>
            <fvdr-avatar initials="IR" size="lg" color="#eceef9" textColor="#1f2129"></fvdr-avatar>
          </div>
        </header>

        <!-- Content -->
        <div class="content">

          <!-- USB Drive -->
          <section class="section" data-track="usb-drive-section">
            <div class="sec-hdr">
              <h2 class="sec-title">USB drive</h2>
              <button class="action-btn action-btn--green" data-track="place-order"
                      (click)="onPlaceOrder()">
                <fvdr-icon name="storage"></fvdr-icon>
                Place order
              </button>
            </div>
            <ul class="bullet-list">
              <li>Each USB drive is encrypted, password- and write-protected.</li>
              <li>Comfort letter is provided for each recipient.</li>
              <li>Estimated delivery date to Luxembourg: Sep 20, 2023</li>
            </ul>
          </section>

          <hr class="divider"/>

          <!-- Project closure -->
          <section class="section" data-track="project-closure-section">
            <div class="sec-hdr">
              <h2 class="sec-title">Project closure</h2>
              <button class="action-btn action-btn--red" data-track="close-project"
                      (click)="onCloseProject()">
                <fvdr-icon name="cancel"></fvdr-icon>
                Close project
              </button>
            </div>
            <p class="sec-desc">
              Access will be terminated on the selected time for all participants,
              including administrators
            </p>
          </section>

        </div>
      </div>

      <!-- Chat bubble (no DS chat icon — using inline SVG) -->
      <div class="chat-bubble" aria-label="Chat">
        <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" fill="white"/>
        </svg>
      </div>

    </div>
  `,
  styles: [`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .shell {
      display: flex;
      height: 100vh;
      font-family: var(--font-family, 'Open Sans', sans-serif);
      background: #fff;
      overflow: hidden;
      position: relative;
    }

    /* ── Sidebar ── */
    .sidebar {
      width: 280px;
      min-width: 280px;
      height: 100%;
      background: #f7f7f7;
      border-right: 1px solid #dee0eb;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .sidebar-top {
      display: flex;
      flex-direction: column;
      gap: 24px;
      flex: 1;
      overflow-y: auto;
    }

    .project-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 16px;
      cursor: pointer;
    }
    .project-logo {
      width: 40px; height: 40px;
      background: #1a2e4a;
      border-radius: 4px;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700; color: white;
      flex-shrink: 0;
    }
    .project-name {
      flex: 1;
      font-size: 16px; font-weight: 600; color: #1f2129;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .chevron-ic { font-size: 16px; color: #5f616a; flex-shrink: 0; }

    nav { display: flex; flex-direction: column; }
    .nav-item {
      display: flex;
      align-items: center;
      height: 48px;
      padding-right: 24px;
      cursor: pointer;
      text-decoration: none;
      color: #40424b;
      transition: background 0.12s;
    }
    .nav-item:hover { background: #eef0f8; }

    .nav-ic {
      width: 72px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      font-size: 24px;
      color: #5f616a;
    }
    .nav-item--active .nav-ic { color: #1f2129; }

    .nav-lbl {
      flex: 1;
      font-size: 16px; font-weight: 400; line-height: 24px; color: #40424b;
      white-space: nowrap;
    }
    .nav-lbl--bold { font-weight: 600; color: #1f2129; }

    .nav-end-ic { font-size: 16px; color: #5f616a; flex-shrink: 0; }

    .sidebar-foot {
      display: flex; align-items: center; justify-content: space-between;
      padding: 24px 16px 24px 24px;
      border-top: 1px solid #dee0eb;
    }
    .ideals-logo { font-size: 18px; font-weight: 800; color: #1f2129; font-style: italic; }
    .collapse-btn {
      background: none; border: none; cursor: pointer;
      padding: 0; display: flex; align-items: center;
      font-size: 16px; color: #5f616a;
    }

    /* ── Main ── */
    .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

    .top-bar {
      height: 64px; min-height: 64px;
      background: white; border-bottom: 1px solid #dee0eb;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 24px;
      flex-shrink: 0;
    }
    .breadcrumb { font-size: 16px; font-weight: 600; color: #1f2129; }
    .hdr-actions { display: flex; align-items: center; gap: 24px; }
    .ic-btn {
      background: none; border: none; cursor: pointer;
      padding: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; color: #5f616a;
      transition: color 0.12s;
    }
    .ic-btn:hover { color: #1f2129; }

    .content {
      flex: 1; overflow-y: auto;
      padding: 24px;
      display: flex; flex-direction: column;
    }

    .section {
      display: flex; flex-direction: column; gap: 16px;
      padding-bottom: 24px;
      max-width: 632px;
    }
    .sec-hdr { display: flex; align-items: center; justify-content: space-between; }
    .sec-title { font-size: 16px; font-weight: 600; color: #1f2129; line-height: 24px; }

    .action-btn {
      display: flex; align-items: center; gap: 8px;
      background: none; border: none; cursor: pointer;
      font-size: 15px; font-weight: 400; font-family: inherit;
      padding: 0; line-height: 1;
      transition: opacity 0.12s;
    }
    .action-btn:hover { opacity: 0.75; }
    .action-btn fvdr-icon { font-size: 16px; flex-shrink: 0; }
    .action-btn--green { color: #2c9c74; }
    .action-btn--red   { color: #e54430; }

    .bullet-list { padding-left: 22px; display: flex; flex-direction: column; }
    .bullet-list li {
      font-size: 15px; font-weight: 400; color: #1f2129; line-height: 24px;
      list-style: disc;
    }

    .divider {
      height: 1px; border: none;
      background: #dee0eb;
      max-width: 632px;
      margin-bottom: 24px;
    }

    .sec-desc { font-size: 15px; font-weight: 400; color: #1f2129; line-height: 24px; }

    /* ── Chat bubble ── */
    .chat-bubble {
      position: fixed; bottom: 24px; right: 24px;
      width: 62px; height: 62px;
      background: #2c9c74; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,.18);
    }
  `],
})
export class ProjectArchiveCreationFlowTestingComponent implements OnInit, OnDestroy {
  private tracker = inject(TrackerService);

  ngOnInit(): void {
    this.tracker.trackPageView(SLUG);
  }

  ngOnDestroy(): void {
    this.tracker.destroyListeners();
  }

  onPlaceOrder(): void {
    this.tracker.trackTask(SLUG, 'task_complete', 'place_order');
  }

  onCloseProject(): void {
    this.tracker.trackTask(SLUG, 'task_fail', 'close_project');
  }
}
