import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrackerService } from '../../services/tracker.service';

interface Integration {
  id: string;
  name: string;
  domain: string;
  description: string;
  locked: boolean; // locked = cannot enable without CA-level unlock
  enabled: boolean;
}

@Component({
  selector: 'fvdr-integrations-template',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="shell">
      <!-- Left sidebar -->
      <aside class="sidebar">
        <div class="sidebar-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect width="10" height="10" rx="2" fill="#2c9c74"/>
            <rect x="13" width="10" height="10" rx="2" fill="#1f2129"/>
            <rect y="13" width="10" height="10" rx="2" fill="#1f2129"/>
            <rect x="13" y="13" width="10" height="10" rx="2" fill="#2c9c74"/>
          </svg>
        </div>
        <nav class="sidebar-nav">
          <button class="nav-item" data-track="nav-overview" title="Overview">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="6" height="6" rx="1" fill="#9c9ea8"/><rect x="12" y="2" width="6" height="6" rx="1" fill="#9c9ea8"/><rect x="2" y="12" width="6" height="6" rx="1" fill="#9c9ea8"/><rect x="12" y="12" width="6" height="6" rx="1" fill="#9c9ea8"/></svg>
          </button>
          <button class="nav-item active" data-track="nav-projects" title="Projects">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 5C2 3.9 2.9 3 4 3h12c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V5z" stroke="#2c9c74" stroke-width="1.5" fill="none"/><path d="M2 8h16" stroke="#2c9c74" stroke-width="1.5"/><path d="M7 3v5" stroke="#2c9c74" stroke-width="1.5"/></svg>
          </button>
          <button class="nav-item" data-track="nav-reports" title="Reports">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 2h8l4 4v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2z" stroke="#9c9ea8" stroke-width="1.5" fill="none"/><path d="M12 2v4h4" stroke="#9c9ea8" stroke-width="1.5"/><path d="M6 10h8M6 13h5" stroke="#9c9ea8" stroke-width="1.5"/></svg>
          </button>
          <button class="nav-item" data-track="nav-storage" title="Data storage">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><ellipse cx="10" cy="5" rx="7" ry="3" stroke="#9c9ea8" stroke-width="1.5"/><path d="M3 5v5c0 1.66 3.13 3 7 3s7-1.34 7-3V5" stroke="#9c9ea8" stroke-width="1.5"/><path d="M3 10v5c0 1.66 3.13 3 7 3s7-1.34 7-3v-5" stroke="#9c9ea8" stroke-width="1.5"/></svg>
          </button>
          <button class="nav-item" data-track="nav-billing" title="Billing">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" stroke="#9c9ea8" stroke-width="1.5" fill="none"/><path d="M2 8h16" stroke="#9c9ea8" stroke-width="1.5"/></svg>
          </button>
          <button class="nav-item" data-track="nav-settings" title="Settings">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3" stroke="#9c9ea8" stroke-width="1.5"/><path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.22 3.22l1.41 1.41M15.37 15.37l1.41 1.41M3.22 16.78l1.41-1.41M15.37 4.63l1.41-1.41" stroke="#9c9ea8" stroke-width="1.5"/></svg>
          </button>
        </nav>
      </aside>

      <!-- Main area -->
      <div class="main">
        <!-- Top header -->
        <header class="topbar">
          <nav class="breadcrumbs" aria-label="breadcrumb">
            <span class="crumb crumb-link">Projects</span>
            <span class="crumb-sep">
              <svg width="5" height="9" viewBox="0 0 5 9"><path d="M1 1l3 3.5L1 8" stroke="#9c9ea8" stroke-width="1.2" fill="none"/></svg>
            </span>
            <span class="crumb crumb-link">Template</span>
            <span class="crumb-sep">
              <svg width="5" height="9" viewBox="0 0 5 9"><path d="M1 1l3 3.5L1 8" stroke="#9c9ea8" stroke-width="1.2" fill="none"/></svg>
            </span>
            <span class="crumb crumb-active">
              Integrations
              <svg width="10" height="6" viewBox="0 0 10 6" style="margin-left:4px"><path d="M1 1l4 4 4-4" stroke="#1f2129" stroke-width="1.2" fill="none"/></svg>
            </span>
            <span class="crumb-sep">
              <svg width="5" height="9" viewBox="0 0 5 9"><path d="M1 1l3 3.5L1 8" stroke="#9c9ea8" stroke-width="1.2" fill="none"/></svg>
            </span>
            <span class="crumb crumb-gray">
              6.1 Patents and trademarks
              <svg width="10" height="6" viewBox="0 0 10 6" style="margin-left:4px"><path d="M1 1l4 4 4-4" stroke="#9c9ea8" stroke-width="1.2" fill="none"/></svg>
            </span>
          </nav>
          <div class="topbar-right">
            <button class="icon-btn" data-track="search-btn" title="Search">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="7.5" cy="7.5" r="5.5" stroke="#5f616a" stroke-width="1.5"/><path d="M12 12l4 4" stroke="#5f616a" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
            <div class="avatar" title="TN">TN</div>
          </div>
        </header>

        <!-- Content -->
        <div class="content">
          <!-- Tab bar -->
          <div class="tabs-wrapper">
            <div class="tabs-bar">
              @for (tab of tabs; track tab) {
                <button
                  class="tab-item"
                  [class.tab-active]="activeTab === tab"
                  [attr.data-track]="'tab-' + tab.toLowerCase().replace(' ', '-')"
                  (click)="activeTab = tab"
                >{{ tab }}</button>
              }
            </div>
          </div>

          <!-- Integrations view (shown only on Integrations tab) -->
          @if (activeTab === 'Integrations') {
            <div class="integrations-content">
              <!-- Info banner -->
              <div class="info-banner">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" class="banner-icon"><circle cx="9" cy="9" r="8" stroke="#5f616a" stroke-width="1.4"/><path d="M9 8v5M9 5.5v1" stroke="#5f616a" stroke-width="1.5" stroke-linecap="round"/></svg>
                <span>This applies to new projects only and doesn't affect the ones created before the template is changed.</span>
              </div>

              <!-- Cards grid -->
              <div class="cards-grid">
                @for (integration of integrations; track integration.id) {
                  <div class="card" [class.card-locked]="integration.locked" [class.card-enabled]="integration.enabled">
                    <!-- Card header: logo + name + domain -->
                    <div class="card-header-row">
                      <div class="card-logo">
                        @switch (integration.id) {
                          @case ('emma') {
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="#f0f4ff"/><text x="16" y="21" text-anchor="middle" font-size="14" font-weight="700" fill="#3B5BDB">E</text></svg>
                          }
                          @case ('jurimesh') {
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="#f0fff4"/><text x="16" y="21" text-anchor="middle" font-size="13" font-weight="700" fill="#2c9c74">JM</text></svg>
                          }
                          @case ('prudentia') {
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="#fff0f6"/><text x="16" y="21" text-anchor="middle" font-size="13" font-weight="700" fill="#c0392b">PS</text></svg>
                          }
                          @case ('zapier') {
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="#fff5f0"/><text x="16" y="21" text-anchor="middle" font-size="13" font-weight="700" fill="#ff4a00">Z</text></svg>
                          }
                          @default {
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="#f7f7f7"/><text x="16" y="21" text-anchor="middle" font-size="13" font-weight="700" fill="#5f616a">{{ integration.name[0] }}</text></svg>
                          }
                        }
                      </div>
                      <div class="card-name-wrap">
                        <div class="card-name">{{ integration.name }}</div>
                        <div class="card-domain">{{ integration.domain }}</div>
                      </div>
                    </div>

                    <!-- Description -->
                    <p class="card-desc">{{ integration.description }}</p>

                    <!-- Footer: badges + action -->
                    <div class="card-footer">
                      <div class="card-badges">
                        <span class="badge">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1C5.3 1 4 2.3 4 4v1H3a1 1 0 00-1 1v5a1 1 0 001 1h8a1 1 0 001-1V6a1 1 0 00-1-1h-1V4c0-1.7-1.3-3-3-3z" stroke="#2c9c74" stroke-width="1.2" fill="none"/><rect x="4" y="5" width="6" height="7" rx="1" fill="#e8f8f3"/></svg>
                          Available documents
                        </span>
                        <span class="badge">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1C5.3 1 4 2.3 4 4v1H3a1 1 0 00-1 1v5a1 1 0 001 1h8a1 1 0 001-1V6a1 1 0 00-1-1h-1V4c0-1.7-1.3-3-3-3z" stroke="#2c9c74" stroke-width="1.2" fill="none"/><rect x="4" y="5" width="6" height="7" rx="1" fill="#e8f8f3"/></svg>
                          Permission-based downloads
                        </span>
                      </div>

                      @if (integration.locked) {
                        <div class="card-locked-msg">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#4a90d9" stroke-width="1.2"/><path d="M7 6v4M7 4.5v.5" stroke="#4a90d9" stroke-width="1.3" stroke-linecap="round"/></svg>
                          To enable integration, allow it at the corporate account level.
                          <button class="link-btn" data-track="open-ca-settings">Open settings</button>
                        </div>
                      } @else if (integration.enabled) {
                        <button
                          class="btn btn-outline"
                          [attr.data-track]="'disable-' + integration.id"
                          (click)="onDisable(integration)"
                        >Enabled</button>
                      } @else {
                        <button
                          class="btn btn-primary"
                          [attr.data-track]="'enable-' + integration.id"
                          (click)="onEnableClick(integration)"
                        >Enable</button>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          } @else {
            <!-- Placeholder for other tabs -->
            <div class="tab-placeholder">
              <div class="placeholder-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="8" y="8" width="32" height="32" rx="4" stroke="#dee0eb" stroke-width="2" fill="none"/><path d="M16 20h16M16 26h10" stroke="#dee0eb" stroke-width="2" stroke-linecap="round"/></svg>
              </div>
              <p class="placeholder-text">{{ activeTab }} settings</p>
            </div>
          }
        </div>
      </div>

      <!-- Enable integration modal -->
      @if (modalIntegration()) {
        <div class="modal-backdrop" (click)="closeModal()">
          <div class="modal" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
            <div class="modal-header">
              <span class="modal-title">Enable integration</span>
              <div class="modal-header-actions">
                <button class="icon-btn" (click)="closeModal()" data-track="modal-minimize" title="Minimize">
                  <svg width="14" height="2" viewBox="0 0 14 2"><path d="M1 1h12" stroke="#1f2129" stroke-width="1.5" stroke-linecap="round"/></svg>
                </button>
                <button class="icon-btn" (click)="closeModal()" data-track="modal-close" title="Close">
                  <svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 1l12 12M13 1L1 13" stroke="#5f616a" stroke-width="1.5" stroke-linecap="round"/></svg>
                </button>
              </div>
            </div>
            <div class="modal-body">
              <!-- Name input -->
              <div class="field">
                <label class="field-label">Name <span class="field-optional">(optional)</span></label>
                <input
                  class="field-input"
                  type="text"
                  [(ngModel)]="integrationName"
                  placeholder="Enter link name"
                  data-track="modal-name-input"
                />
                <span class="field-hint">Hint</span>
              </div>

              <!-- Info lines -->
              <p class="modal-info-line">
                <strong>{{ modalIntegration()!.name }}</strong> will be allowed to be used in the project.
              </p>
              <p class="modal-info-line">
                Enabling an integration at the project level requires it to be enabled for specific user groups.
              </p>

              <!-- Banner -->
              <div class="modal-banner">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="#5f616a" stroke-width="1.4"/><path d="M9 8v5M9 5.5v.5" stroke="#5f616a" stroke-width="1.5" stroke-linecap="round"/></svg>
                <span>Project administrators can later manage integrations in the project settings. <button class="link-btn" data-track="modal-learn-more">Learn more</button></span>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-ghost" (click)="closeModal()" data-track="modal-cancel">Cancel</button>
              <button class="btn btn-primary" (click)="confirmEnable()" data-track="modal-confirm">Confirm</button>
            </div>
          </div>
        </div>
      }

      <!-- Chat FAB -->
      <button class="chat-fab" data-track="chat-open" title="Chat">
        <svg width="22" height="25" viewBox="0 0 22 25" fill="none"><path d="M20 1H2C1.4 1 1 1.4 1 2v14c0 .6.4 1 1 1h4v6l7-6h7c.6 0 1-.4 1-1V2c0-.6-.4-1-1-1z" stroke="white" stroke-width="1.5" fill="none"/></svg>
      </button>
    </div>
  `,
  styles: [`
    /* ── Reset & shell ───────────────────────────────────── */
    :host { display: block; font-family: 'Inter', 'Open Sans', system-ui, sans-serif; }

    .shell {
      display: flex;
      height: 100vh;
      overflow: hidden;
      background: #f7f7f7;
      color: #1f2129;
    }

    /* ── Left sidebar ────────────────────────────────────── */
    .sidebar {
      width: 72px;
      min-width: 72px;
      background: #f7f7f7;
      border-right: 1px solid #dee0eb;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px 0 24px;
      gap: 0;
      z-index: 10;
    }

    .sidebar-logo {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      flex: 1;
    }

    .nav-item {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      border: none;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.15s;
    }
    .nav-item:hover { background: #ebebeb; }
    .nav-item.active {
      background: #e8f8f3;
    }

    /* ── Main area ───────────────────────────────────────── */
    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: #ffffff;
    }

    /* ── Topbar ──────────────────────────────────────────── */
    .topbar {
      height: 64px;
      min-height: 64px;
      border-bottom: 1px solid #dee0eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px 0 24px;
      background: #ffffff;
    }

    .breadcrumbs {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .crumb {
      font-size: 15px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 2px;
    }
    .crumb-link { color: #5f616a; cursor: pointer; }
    .crumb-link:hover { color: #1f2129; }
    .crumb-active { color: #1f2129; }
    .crumb-gray { color: #9c9ea8; }
    .crumb-sep { display: flex; align-items: center; color: #9c9ea8; }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .icon-btn {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      border: none;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .icon-btn:hover { background: #f7f7f7; }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #eceef9;
      color: #1f2129;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
    }

    /* ── Content ─────────────────────────────────────────── */
    .content {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    /* ── Tabs ────────────────────────────────────────────── */
    .tabs-wrapper {
      border-bottom: 1px solid #dee0eb;
      padding: 0 24px;
      background: #ffffff;
    }

    .tabs-bar {
      display: flex;
      gap: 0;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .tabs-bar::-webkit-scrollbar { display: none; }

    .tab-item {
      padding: 12px 16px;
      font-size: 15px;
      font-weight: 400;
      color: #5f616a;
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      white-space: nowrap;
      transition: color 0.15s, border-color 0.15s;
      margin-bottom: -1px;
    }
    .tab-item:hover { color: #1f2129; }
    .tab-item.tab-active {
      color: #2c9c74;
      font-weight: 600;
      border-bottom-color: #2c9c74;
      background: #f2fdf7;
    }

    /* ── Integrations content ───────────────────────────── */
    .integrations-content {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .info-banner {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #f7f7f7;
      border-radius: 8px;
      padding: 10px 16px;
      font-size: 14px;
      color: #1f2129;
      max-width: 820px;
    }
    .banner-icon { flex-shrink: 0; }

    /* ── Cards grid ──────────────────────────────────────── */
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      max-width: 1296px;
    }

    .card {
      background: #ffffff;
      border: 1px solid #dee0eb;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: box-shadow 0.15s;
    }
    .card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.06); }
    .card-locked { background: #fafafa; }

    .card-header-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .card-logo {
      width: 40px;
      height: 40px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-name-wrap {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .card-name {
      font-size: 16px;
      font-weight: 600;
      color: #1f2129;
    }

    .card-domain {
      font-size: 12px;
      color: #5f616a;
    }

    .card-desc {
      font-size: 14px;
      color: #1f2129;
      line-height: 1.5;
      flex: 1;
      margin: 0;
    }

    .card-footer {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: auto;
    }

    .card-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: #ebf4fd;
      color: #1f2129;
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 20px;
      white-space: nowrap;
    }

    .card-locked-msg {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      font-size: 13px;
      color: #40424b;
      line-height: 1.4;
      flex-wrap: wrap;
    }

    /* ── Buttons ─────────────────────────────────────────── */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0 20px;
      height: 40px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: background 0.15s, opacity 0.15s;
      font-family: inherit;
    }

    .btn-primary {
      background: #2c9c74;
      color: #ffffff;
      width: fit-content;
    }
    .btn-primary:hover { background: #248a65; }

    .btn-outline {
      background: #ffffff;
      color: #2c9c74;
      border: 1.5px solid #2c9c74;
      width: fit-content;
    }
    .btn-outline:hover { background: #f0fdf9; }

    .btn-ghost {
      background: transparent;
      color: #5f616a;
    }
    .btn-ghost:hover { background: #f7f7f7; }

    .link-btn {
      background: none;
      border: none;
      color: #2c9c74;
      font-size: inherit;
      font-family: inherit;
      cursor: pointer;
      padding: 0;
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    .link-btn:hover { color: #248a65; }

    /* ── Tab placeholder ─────────────────────────────────── */
    .tab-placeholder {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      color: #9c9ea8;
      padding: 80px 24px;
    }
    .placeholder-text { font-size: 15px; }

    /* ── Modal ───────────────────────────────────────────── */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: #ffffff;
      border-radius: 12px;
      width: 512px;
      max-width: 95vw;
      box-shadow: 0 24px 64px rgba(0,0,0,.18);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid #dee0eb;
    }

    .modal-title {
      font-size: 16px;
      font-weight: 600;
      color: #343a40;
    }

    .modal-header-actions {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .modal-body {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .field-label {
      font-size: 15px;
      font-weight: 600;
      color: #1f2129;
    }
    .field-optional { font-weight: 400; color: #9c9ea8; }

    .field-input {
      height: 40px;
      border: 1.5px solid #dee0eb;
      border-radius: 8px;
      padding: 0 12px;
      font-size: 15px;
      color: #1f2129;
      font-family: inherit;
      outline: none;
      transition: border-color 0.15s;
    }
    .field-input:focus { border-color: #2c9c74; }
    .field-input::placeholder { color: #9c9ea8; }

    .field-hint {
      font-size: 12px;
      color: #5f616a;
    }

    .modal-info-line {
      font-size: 15px;
      color: #1f2129;
      line-height: 1.5;
      margin: 0;
    }

    .modal-banner {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      background: #f7f7f7;
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 14px;
      color: #1f2129;
      line-height: 1.5;
    }

    .modal-footer {
      padding: 20px 24px;
      border-top: 1px solid #dee0eb;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
    }

    /* ── Chat FAB ────────────────────────────────────────── */
    .chat-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #2c9c74;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(44,156,116,.4);
      z-index: 900;
      transition: background 0.15s;
    }
    .chat-fab:hover { background: #248a65; }
  `],
})
export class IntegrationsTemplateComponent implements OnInit, OnDestroy {
  private tracker = inject(TrackerService);

  tabs = [
    'General', 'Branding', 'Labels', 'Terms of use',
    'Watermarks', 'Participants', 'Security', 'AI tools',
    'Integrations', 'Contract #128182',
  ];
  activeTab = 'Integrations';

  integrations: Integration[] = [
    {
      id: 'emma',
      name: 'Emma',
      domain: 'emma.legal',
      description: 'Accelerate end-to-end M&A due diligence by mapping project documents and surfacing clause-level risks in real time.',
      locked: false,
      enabled: false,
    },
    {
      id: 'jurimesh',
      name: 'Jurimesh',
      domain: 'jurimesh.com',
      description: 'Automate document analysis, identify legal risks, and standardize review outputs across your deal team.',
      locked: false,
      enabled: false,
    },
    {
      id: 'prudentia',
      name: 'Prudentia Sciences',
      domain: 'prudentiasciences.com',
      description: 'Support life sciences deal evaluation and investment decisions by transforming scientific, clinical, and regulatory documents into structured insights.',
      locked: true,
      enabled: false,
    },
    {
      id: 'zapier',
      name: 'Zapier',
      domain: 'zapier.com',
      description: 'Automate data room processes by connecting your virtual data room to other tools, triggering uploads, notifications, and workflows.',
      locked: false,
      enabled: false,
    },
    {
      id: 'appx',
      name: 'App X',
      domain: 'App.com',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat.',
      locked: false,
      enabled: false,
    },
    {
      id: 'appx2',
      name: 'App X2',
      domain: 'App2.com',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat.',
      locked: false,
      enabled: false,
    },
  ];

  modalIntegration = signal<Integration | null>(null);
  integrationName = '';

  ngOnInit(): void {
    this.tracker.trackPageView('integrations-template');
  }

  ngOnDestroy(): void {
    this.tracker.destroyListeners();
  }

  onEnableClick(integration: Integration): void {
    this.integrationName = '';
    this.modalIntegration.set(integration);
  }

  onDisable(integration: Integration): void {
    integration.enabled = false;
    this.tracker.trackTask('integrations-template', 'task_complete', `disable-${integration.id}`);
  }

  closeModal(): void {
    this.modalIntegration.set(null);
  }

  confirmEnable(): void {
    const integration = this.modalIntegration();
    if (integration) {
      integration.enabled = true;
      this.tracker.trackTask('integrations-template', 'task_complete', `enabled-${integration.id}`);
    }
    this.closeModal();
  }
}
