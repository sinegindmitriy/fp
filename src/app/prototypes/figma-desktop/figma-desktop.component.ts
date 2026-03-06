import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackerService } from '../../services/tracker.service';

interface Integration {
  id: string;
  name: string;
  domain: string;
  description: string;
  logoText: string;
  logoColor: string;
  logoBg: string;
  logoType: 'text' | 'icon';
  tags: string[];
}

interface Project {
  id: string;
  name: string;
  initials: string;
}

@Component({
  selector: 'fvdr-figma-desktop',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-wrapper">

      <!-- Top header -->
      <div class="top-header">
        <div class="top-left">
          <div class="user-avatar green">PA</div>
        </div>
        <div class="breadcrumb">
          <span class="bc-item">Settings</span>
          <span class="bc-sep">›</span>
          <span class="bc-item active">Integrations</span>
        </div>
        <div class="top-right">
          <button class="icon-action" title="Help">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#888" stroke-width="1.5"/>
              <text x="10" y="15" text-anchor="middle" font-size="12" fill="#888" font-weight="600">?</text>
            </svg>
          </button>
          <div class="user-avatar gray">TN</div>
        </div>
      </div>

      <div class="content-wrapper">
        <!-- Sidebar -->
        <div class="sidebar">
          <button class="sidebar-icon" title="Dashboard">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="2" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
              <rect x="11" y="2" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
              <rect x="2" y="11" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
              <rect x="11" y="11" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </button>
          <button class="sidebar-icon" title="Documents">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <line x1="7" y1="7" x2="13" y2="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <line x1="7" y1="11" x2="13" y2="11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
          <button class="sidebar-icon" title="Team">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="8" cy="7" r="3" stroke="currentColor" stroke-width="1.5"/>
              <path d="M2 17c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="15" cy="7" r="2.5" stroke="currentColor" stroke-width="1.5"/>
              <path d="M18 17c0-2.485-1.343-4-3-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
          <button class="sidebar-icon" title="Analytics">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="10" width="3" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
              <rect x="8.5" y="6" width="3" height="11" rx="1" stroke="currentColor" stroke-width="1.5"/>
              <rect x="14" y="3" width="3" height="14" rx="1" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </button>
          <button class="sidebar-icon" title="Institution">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L18 7H2L10 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              <rect x="3" y="7" width="3" height="8" stroke="currentColor" stroke-width="1.5"/>
              <rect x="8.5" y="7" width="3" height="8" stroke="currentColor" stroke-width="1.5"/>
              <rect x="14" y="7" width="3" height="8" stroke="currentColor" stroke-width="1.5"/>
              <line x1="2" y1="15" x2="18" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <line x1="2" y1="17" x2="18" y2="17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
          <button class="sidebar-icon active" title="Settings">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <line x1="2" y1="5" x2="18" y2="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <line x1="2" y1="10" x2="18" y2="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <line x1="2" y1="15" x2="18" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="6" cy="5" r="2" fill="white" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="14" cy="10" r="2" fill="white" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="8" cy="15" r="2" fill="white" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </button>
        </div>

        <!-- Main content -->
        <div class="main-content">
          <!-- Tabs -->
          <div class="tabs-bar">
            <button class="tab" [class.active]="false">Security</button>
            <button class="tab" [class.active]="true">Integrations</button>
          </div>

          <!-- Info banner -->
          <div class="info-banner">
            <svg class="info-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#555" stroke-width="1.3"/>
              <line x1="8" y1="7" x2="8" y2="12" stroke="#555" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="8" cy="4.5" r="0.8" fill="#555"/>
            </svg>
            <span>Only integrations allowed at the corporate account level can be enabled for individual projects.&nbsp;<a class="link" href="#">Learn more</a></span>
          </div>

          <!-- Integrations grid -->
          <div class="integrations-grid">
            @for (integration of integrations; track integration.id) {
              <div class="integration-card">
                <div class="card-header">
                  <div class="card-logo" [style.background]="integration.logoBg">
                    <span class="logo-text" [style.color]="integration.logoColor">{{ integration.logoText }}</span>
                  </div>
                  <div class="card-title-block">
                    <div class="card-name">{{ integration.name }}</div>
                    <div class="card-domain">{{ integration.domain }}</div>
                  </div>
                </div>
                <div class="card-description">{{ integration.description }}</div>
                <div class="card-tags">
                  @for (tag of integration.tags; track tag) {
                    <span class="tag">{{ tag }}</span>
                  }
                </div>
                <button class="allow-btn" (click)="openModal(integration)">
                  <span class="plus-icon">+</span> Allow
                </button>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Modal overlay -->
      @if (modalOpen()) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2 class="modal-title">Allow integration</h2>
              <button class="modal-close" (click)="closeModal()">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <line x1="2" y1="2" x2="14" y2="14" stroke="#333" stroke-width="1.8" stroke-linecap="round"/>
                  <line x1="14" y1="2" x2="2" y2="14" stroke="#333" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </button>
            </div>

            <p class="modal-desc">
              <strong>&#123;&#123;integrationName&#125;&#125;</strong> will be allowed to be used in the selected projects by authorized participants.
            </p>

            <div class="field-group">
              <label class="field-label">Projects</label>
              <div class="select-wrapper" [class.error]="showError()" [class.has-value]="selectedProjects().length > 0">
                <div class="select-trigger" (click)="toggleDropdown()">
                  @if (selectedProjects().length === 0) {
                    <span class="select-placeholder">Select</span>
                  } @else {
                    <span class="select-value">{{ selectedProjects().length }} selected</span>
                  }
                  <div class="select-actions">
                    @if (selectedProjects().length > 0) {
                      <button class="clear-btn" (click)="clearSelection($event)" title="Clear">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <line x1="2" y1="2" x2="12" y2="12" stroke="#666" stroke-width="1.6" stroke-linecap="round"/>
                          <line x1="12" y1="2" x2="2" y2="12" stroke="#666" stroke-width="1.6" stroke-linecap="round"/>
                        </svg>
                      </button>
                    }
                    <svg class="chevron" [class.open]="dropdownOpen()" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6l4 4 4-4" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </div>

                @if (dropdownOpen()) {
                  <div class="dropdown-panel">
                    <div class="dropdown-search">
                      <svg class="search-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="6" cy="6" r="4.5" stroke="#999" stroke-width="1.3"/>
                        <line x1="9.5" y1="9.5" x2="12.5" y2="12.5" stroke="#999" stroke-width="1.3" stroke-linecap="round"/>
                      </svg>
                      <input type="text" placeholder="Search" [value]="searchQuery()" (input)="searchQuery.set($any($event.target).value)" class="search-input" (click)="$event.stopPropagation()"/>
                    </div>
                    <div class="dropdown-item select-all-item" (click)="toggleSelectAll()">
                      <div class="checkbox" [class.checked]="allSelected()" [class.indeterminate]="someSelected()">
                        @if (allSelected()) {
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        } @else if (someSelected()) {
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <line x1="2" y1="5" x2="8" y2="5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                          </svg>
                        }
                      </div>
                      <span class="item-label">Select all</span>
                    </div>
                    @for (project of filteredProjects(); track project.id) {
                      <div class="dropdown-item" [class.selected]="isSelected(project.id)" (click)="toggleProject(project.id)">
                        <div class="checkbox" [class.checked]="isSelected(project.id)">
                          @if (isSelected(project.id)) {
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          }
                        </div>
                        <div class="project-avatar">{{ project.initials }}</div>
                        <span class="item-label">{{ project.name }}</span>
                      </div>
                    }
                  </div>
                }
              </div>
              @if (showError()) {
                <div class="field-error">Fill in to continue</div>
              }
            </div>

            @if (selectedProjects().length === 0) {
              <label class="checkbox-row">
                <div class="checkbox-outer" [class.checked]="includeNewProjects()" (click)="includeNewProjects.set(!includeNewProjects())">
                  @if (includeNewProjects()) {
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  }
                </div>
                <span class="checkbox-label">Include newly created projects to allowed list</span>
              </label>
            }

            <div class="info-box">
              <svg class="info-icon-sm" width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="7.5" cy="7.5" r="6.5" stroke="#555" stroke-width="1.2"/>
                <line x1="7.5" y1="6.5" x2="7.5" y2="11" stroke="#555" stroke-width="1.4" stroke-linecap="round"/>
                <circle cx="7.5" cy="4.5" r="0.75" fill="#555"/>
              </svg>
              <span>Project administrators can later manage integrations in the project settings.&nbsp;<a class="link" href="#">Learn more</a></span>
            </div>

            <div class="modal-footer">
              <button class="btn-cancel" (click)="closeModal()">Cancel</button>
              <button class="btn-confirm" (click)="confirm()">Confirm</button>
            </div>
          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .page-wrapper {
      display: flex;
      flex-direction: column;
      width: 100vw;
      height: 100vh;
      background: #F4F4F5;
      font-family: -apple-system, 'Inter', 'Helvetica Neue', sans-serif;
      font-size: 14px;
      color: #1A1A1A;
      overflow: hidden;
      position: relative;
    }

    /* Top header */
    .top-header {
      display: flex;
      align-items: center;
      height: 56px;
      background: #F4F4F5;
      padding: 0 20px;
      flex-shrink: 0;
      position: relative;
    }
    .top-left { display: flex; align-items: center; }
    .breadcrumb {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
    }
    .bc-item { color: #666; }
    .bc-item.active { color: #1A1A1A; font-weight: 600; }
    .bc-sep { color: #999; font-size: 16px; }
    .top-right { margin-left: auto; display: flex; align-items: center; gap: 12px; }
    .user-avatar {
      width: 34px; height: 34px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700; color: white; flex-shrink: 0;
    }
    .user-avatar.green { background: #2D6A4F; }
    .user-avatar.gray { background: #5A6070; }
    .icon-action {
      background: none; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; border-radius: 50%;
    }
    .icon-action:hover { background: rgba(0,0,0,0.05); }

    /* Content wrapper */
    .content-wrapper {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    /* Sidebar */
    .sidebar {
      width: 60px;
      background: white;
      border-right: 1px solid #E5E7EB;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px 0;
      gap: 4px;
      flex-shrink: 0;
    }
    .sidebar-icon {
      width: 40px; height: 40px; border-radius: 8px;
      border: none; background: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: #9CA3AF;
    }
    .sidebar-icon:hover { background: #F3F4F6; color: #374151; }
    .sidebar-icon.active { color: #2D6A4F; }

    /* Main content */
    .main-content {
      flex: 1;
      overflow-y: auto;
      padding: 0 32px 32px;
      background: #F4F4F5;
    }

    /* Tabs */
    .tabs-bar {
      display: flex;
      border-bottom: 1px solid #E5E7EB;
      margin-bottom: 20px;
      background: #F4F4F5;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .tab {
      padding: 14px 18px 12px;
      background: none; border: none; cursor: pointer;
      font-size: 14px; color: #6B7280;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
      font-weight: 500;
    }
    .tab.active {
      color: #1A1A1A;
      border-bottom-color: #2D6A4F;
      font-weight: 600;
    }
    .tab:hover:not(.active) { color: #374151; }

    /* Info banner */
    .info-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13.5px;
      color: #374151;
      margin-bottom: 24px;
      padding: 2px 0;
    }
    .info-icon { flex-shrink: 0; }
    .link { color: #2D6A4F; text-decoration: none; font-weight: 500; }
    .link:hover { text-decoration: underline; }

    /* Integrations grid */
    .integrations-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    /* Integration card */
    .integration-card {
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .card-logo {
      width: 44px; height: 44px;
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      border: 1px solid #E5E7EB;
      overflow: hidden;
    }
    .logo-text {
      font-size: 11px;
      font-weight: 700;
      text-align: center;
      line-height: 1.1;
    }
    .card-title-block { display: flex; flex-direction: column; gap: 2px; }
    .card-name { font-size: 15px; font-weight: 600; color: #111827; }
    .card-domain { font-size: 12.5px; color: #9CA3AF; }
    .card-description {
      font-size: 13.5px;
      color: #374151;
      line-height: 1.5;
    }
    .card-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .tag {
      background: #F3F4F6;
      border: 1px solid #E5E7EB;
      border-radius: 4px;
      padding: 3px 8px;
      font-size: 12px;
      color: #4B5563;
    }
    .allow-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #2D6A4F;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 9px 16px;
      font-size: 13.5px;
      font-weight: 600;
      cursor: pointer;
      width: fit-content;
      margin-top: 4px;
    }
    .allow-btn:hover { background: #245C43; }
    .plus-icon { font-size: 16px; font-weight: 400; line-height: 1; }

    /* Modal overlay */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }

    /* Modal */
    .modal {
      background: white;
      border-radius: 10px;
      width: 460px;
      max-width: calc(100vw - 40px);
      padding: 28px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.18);
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .modal-title {
      font-size: 17px;
      font-weight: 700;
      color: #111827;
    }
    .modal-close {
      background: none; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; border-radius: 6px;
      color: #374151;
    }
    .modal-close:hover { background: #F3F4F6; }

    .modal-desc {
      font-size: 14px;
      color: #374151;
      line-height: 1.55;
      margin-top: -8px;
    }
    .modal-desc strong { font-weight: 600; }

    /* Field group */
    .field-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .field-label {
      font-size: 13.5px;
      font-weight: 600;
      color: #111827;
    }

    /* Select wrapper */
    .select-wrapper {
      position: relative;
      border: 1px solid #D1D5DB;
      border-radius: 6px;
      background: white;
    }
    .select-wrapper.error {
      border-color: #EF4444;
    }
    .select-trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      cursor: pointer;
      min-height: 42px;
      user-select: none;
    }
    .select-placeholder { color: #9CA3AF; font-size: 14px; }
    .select-value { color: #111827; font-size: 14px; }
    .select-actions { display: flex; align-items: center; gap: 4px; }
    .clear-btn {
      background: none; border: none; cursor: pointer;
      display: flex; align-items: center; padding: 2px;
      border-radius: 4px;
    }
    .clear-btn:hover { background: #F3F4F6; }
    .chevron { transition: transform 0.15s; flex-shrink: 0; }
    .chevron.open { transform: rotate(180deg); }

    .field-error {
      font-size: 12.5px;
      color: #EF4444;
      margin-top: 2px;
    }

    /* Dropdown panel */
    .dropdown-panel {
      position: absolute;
      top: calc(100% + 4px);
      left: 0; right: 0;
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      z-index: 200;
      max-height: 240px;
      overflow-y: auto;
    }
    .dropdown-search {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-bottom: 1px solid #F3F4F6;
    }
    .search-icon { flex-shrink: 0; }
    .search-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 13.5px;
      color: #111827;
      background: transparent;
    }
    .search-input::placeholder { color: #9CA3AF; }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      cursor: pointer;
      transition: background 0.1s;
    }
    .dropdown-item:hover { background: #F9FAFB; }
    .dropdown-item.selected { background: #F0FBF6; }
    .select-all-item {
      border-bottom: 1px solid #F3F4F6;
    }

    /* Checkbox */
    .checkbox {
      width: 16px; height: 16px;
      border-radius: 3px;
      border: 1.5px solid #D1D5DB;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      background: white;
    }
    .checkbox.checked {
      background: #2D6A4F;
      border-color: #2D6A4F;
    }
    .checkbox.indeterminate {
      background: #2D6A4F;
      border-color: #2D6A4F;
    }

    /* Project avatar in dropdown */
    .project-avatar {
      width: 24px; height: 24px; border-radius: 5px;
      background: #2D6A4F;
      color: white;
      font-size: 9px;
      font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .item-label { font-size: 13.5px; color: #111827; }

    /* Checkbox row */
    .checkbox-row {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }
    .checkbox-outer {
      width: 16px; height: 16px;
      border-radius: 3px;
      border: 1.5px solid #D1D5DB;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      background: white;
      cursor: pointer;
    }
    .checkbox-outer.checked {
      background: #2D6A4F;
      border-color: #2D6A4F;
    }
    .checkbox-label { font-size: 13.5px; color: #374151; }

    /* Info box */
    .info-box {
      background: #F9FAFB;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      padding: 12px 14px;
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 13px;
      color: #374151;
      line-height: 1.5;
    }
    .info-icon-sm { flex-shrink: 0; margin-top: 1px; }

    /* Modal footer */
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 4px;
    }
    .btn-cancel {
      padding: 9px 22px;
      background: white;
      border: 1px solid #D1D5DB;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      cursor: pointer;
    }
    .btn-cancel:hover { background: #F9FAFB; }
    .btn-confirm {
      padding: 9px 22px;
      background: #2D6A4F;
      border: 1px solid #2D6A4F;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      color: white;
      cursor: pointer;
    }
    .btn-confirm:hover { background: #245C43; }
  `],
})
export class FigmaDesktopComponent implements OnInit, OnDestroy {
  private tracker = inject(TrackerService);

  modalOpen = signal(false);
  dropdownOpen = signal(false);
  selectedProjects = signal<string[]>([]);
  showError = signal(false);
  includeNewProjects = signal(false);
  searchQuery = signal('');
  activeIntegration: Integration | null = null;

  integrations: Integration[] = [
    {
      id: 'emma',
      name: 'Emma',
      domain: 'emma.legal',
      description: 'Accelerate end-to-end M&A due diligence by mapping project documents and surfacing clause-level risks for full deal visibility',
      logoText: 'Emma',
      logoColor: '#333',
      logoBg: '#F3F4F6',
      logoType: 'text',
      tags: ['Enabled projects', 'Available documents', 'Permission-based downloads'],
    },
    {
      id: 'jurimesh',
      name: 'Jurimesh',
      domain: 'jurimesh.com',
      description: 'Automate document analysis, identify legal risks, and standardize review outputs at scale to streamline contract-focused due diligence',
      logoText: 'JM',
      logoColor: '#444',
      logoBg: '#F3F4F6',
      logoType: 'text',
      tags: ['Enabled projects', 'Available documents', 'Permission-based downloads'],
    },
    {
      id: 'prudentia',
      name: 'Prudentia sciences',
      domain: 'prudentiasciences.com',
      description: 'Support life sciences deal evaluation and investment decisions by transforming scientific, clinical, and financial data into actionable insights',
      logoText: 'PS',
      logoColor: '#c0392b',
      logoBg: '#FEF2F2',
      logoType: 'text',
      tags: ['Enabled projects', 'Available documents', 'Permission-based downloads'],
    },
    {
      id: 'zapier',
      name: 'Zapier',
      domain: 'zapier.com',
      description: 'Automate data room processes by connecting your virtual data room to other tools, triggering uploads, notifications, and workflow actions',
      logoText: 'zapier',
      logoColor: '#FFFFFF',
      logoBg: '#FF4A00',
      logoType: 'text',
      tags: ['Enabled projects', 'Available documents', 'Permission-based downloads'],
    },
    {
      id: 'appx',
      name: 'App X',
      domain: 'App.com',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi',
      logoText: 'M',
      logoColor: '#444',
      logoBg: '#F3F4F6',
      logoType: 'text',
      tags: ['Enabled projects', 'Available documents', 'Permission-based downloads'],
    },
    {
      id: 'appx2',
      name: 'App X2',
      domain: 'App2.com',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi',
      logoText: 'M',
      logoColor: '#444',
      logoBg: '#F3F4F6',
      logoType: 'text',
      tags: ['Enabled projects', 'Available documents', 'Permission-based downloads'],
    },
  ];

  projects: Project[] = [
    { id: 'p1', name: 'Project Alpha', initials: 'PA' },
    { id: 'p2', name: 'Project Alpha', initials: 'PA' },
    { id: 'p3', name: 'Project Alpha', initials: 'PA' },
    { id: 'p4', name: 'Project Beta', initials: 'PB' },
    { id: 'p5', name: 'Project Gamma', initials: 'PG' },
  ];

  filteredProjects = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return q ? this.projects.filter(p => p.name.toLowerCase().includes(q)) : this.projects;
  });

  allSelected = computed(() => this.selectedProjects().length === this.projects.length);
  someSelected = computed(() => this.selectedProjects().length > 0 && this.selectedProjects().length < this.projects.length);

  ngOnInit(): void {
    this.tracker.trackPageView('figma-desktop');
  }

  ngOnDestroy(): void {
    this.tracker.destroyListeners();
  }

  openModal(integration: Integration): void {
    this.activeIntegration = integration;
    this.selectedProjects.set([]);
    this.showError.set(false);
    this.dropdownOpen.set(false);
    this.includeNewProjects.set(false);
    this.searchQuery.set('');
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
    this.dropdownOpen.set(false);
  }

  toggleDropdown(): void {
    this.dropdownOpen.update(v => !v);
  }

  toggleProject(id: string): void {
    const current = this.selectedProjects();
    if (current.includes(id)) {
      this.selectedProjects.set(current.filter(p => p !== id));
    } else {
      this.selectedProjects.set([...current, id]);
    }
    if (this.selectedProjects().length > 0) {
      this.showError.set(false);
    }
  }

  toggleSelectAll(): void {
    if (this.allSelected()) {
      this.selectedProjects.set([]);
    } else {
      this.selectedProjects.set(this.projects.map(p => p.id));
    }
    if (this.selectedProjects().length > 0) {
      this.showError.set(false);
    }
  }

  isSelected(id: string): boolean {
    return this.selectedProjects().includes(id);
  }

  clearSelection(event: Event): void {
    event.stopPropagation();
    this.selectedProjects.set([]);
  }

  confirm(): void {
    if (this.selectedProjects().length === 0) {
      this.showError.set(true);
      return;
    }
    this.tracker.trackTask('figma-desktop', 'task_complete');
    this.closeModal();
  }
}
