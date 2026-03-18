import { Component, OnInit, OnDestroy, inject, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrackerService } from '../../services/tracker.service';
import { DS_COMPONENTS, ToastService } from '../../shared/ds';
import type { RadioOption, DropdownOption } from '../../shared/ds';

@Pipe({ name: 'initials', standalone: true })
export class InitialsPipe implements PipeTransform {
  transform(name: string): string {
    return name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }
}

const SLUG = 'project-archive-creation-flow-testing';

type AppView = 'main' | 'order';

interface Archive {
  id: number;
  name: string;
  documents: string;
  includeRecycleBin: boolean;
  reports: string;
  includeQA: boolean;
}

interface Recipient {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  company: string;
  country: string;
  city: string;
  postalCode: string;
  address: string;
  usbCounts: { [archiveId: number]: number };
}

function freshArchiveForm() {
  return { name: '', documents: 'all', includeRecycleBin: false, reports: 'all', includeQA: false };
}

function freshRecipientForm() {
  return { email: '', fullName: '', phone: '', company: '', country: 'Luxembourg', city: '', postalCode: '', address: '' };
}

@Component({
  selector: 'fvdr-project-archive-creation-flow-testing',
  standalone: true,
  imports: [CommonModule, FormsModule, InitialsPipe, ...DS_COMPONENTS],
  template: `
    <div class="shell">

      <!-- ── Sidebar ── -->
      <aside class="sidebar">
        <div class="sidebar-top">
          <div class="project-row">
            <div class="project-logo">PA</div>
            <span class="project-name">Project Alpha</span>
            <fvdr-icon name="chevron-down" class="chevron-ic"></fvdr-icon>
          </div>
          <nav>
            <a class="nav-item"><span class="nav-ic"><fvdr-icon name="nav-overview"></fvdr-icon></span><span class="nav-lbl">Dashboard</span></a>
            <a class="nav-item"><span class="nav-ic"><fvdr-icon name="folder"></fvdr-icon></span><span class="nav-lbl">Documents</span></a>
            <a class="nav-item"><span class="nav-ic"><fvdr-icon name="participants"></fvdr-icon></span><span class="nav-lbl">Participants</span></a>
            <a class="nav-item"><span class="nav-ic"><fvdr-icon name="lock-close"></fvdr-icon></span><span class="nav-lbl">Permissions</span></a>
            <a class="nav-item"><span class="nav-ic"><fvdr-icon name="info"></fvdr-icon></span><span class="nav-lbl">Q&amp;A</span></a>
            <a class="nav-item"><span class="nav-ic"><fvdr-icon name="reports"></fvdr-icon></span><span class="nav-lbl">Reports</span><fvdr-icon name="chevron-down" class="nav-end-ic"></fvdr-icon></a>
            <a class="nav-item"><span class="nav-ic"><fvdr-icon name="settings"></fvdr-icon></span><span class="nav-lbl">Settings</span><fvdr-icon name="chevron-down" class="nav-end-ic"></fvdr-icon></a>
            <a class="nav-item nav-item--active"><span class="nav-ic"><fvdr-icon name="storage"></fvdr-icon></span><span class="nav-lbl nav-lbl--bold">Project archiving</span></a>
            <a class="nav-item"><span class="nav-ic"><fvdr-icon name="trash"></fvdr-icon></span><span class="nav-lbl">Recycle bin</span></a>
          </nav>
        </div>
        <div class="sidebar-foot">
          <span class="ideals-logo">ideals.</span>
          <button class="collapse-btn"><fvdr-icon name="angle-double-left"></fvdr-icon></button>
        </div>
      </aside>

      <!-- ── Main ── -->
      <div class="main">

        <!-- Header -->
        <header class="top-bar">
          <div class="breadcrumb">
            <span [class.bc-link]="view === 'order'" (click)="view === 'order' && cancelOrder()">Project archiving</span>
            <ng-container *ngIf="view === 'order'">
              <fvdr-icon name="chevron-right" class="bc-sep"></fvdr-icon>
              <span>Place order</span>
            </ng-container>
          </div>
          <div class="hdr-actions">
            <button class="ic-btn"><fvdr-icon name="theme-dark"></fvdr-icon></button>
            <button class="ic-btn"><fvdr-icon name="help"></fvdr-icon></button>
            <fvdr-avatar initials="IR" size="lg" color="#eceef9" textColor="#1f2129"></fvdr-avatar>
          </div>
        </header>

        <!-- ══ VIEW: MAIN ══ -->
        <div class="content" *ngIf="view === 'main'">
          <section class="section" data-track="usb-drive-section">
            <div class="sec-hdr">
              <h2 class="sec-title">USB drive</h2>
              <button class="action-btn action-btn--green" data-track="place-order" (click)="goToOrder()">
                <fvdr-icon name="storage"></fvdr-icon> Place order
              </button>
            </div>
            <ul class="bullet-list">
              <li>Each USB drive is encrypted, password- and write-protected.</li>
              <li>Comfort letter is provided for each recipient.</li>
              <li>Estimated delivery date to Luxembourg: Sep 20, 2023</li>
            </ul>
          </section>
          <hr class="divider"/>
          <section class="section" data-track="project-closure-section">
            <div class="sec-hdr">
              <h2 class="sec-title">Project closure</h2>
              <button class="action-btn action-btn--red" data-track="close-project" (click)="onCloseProject()">
                <fvdr-icon name="cancel"></fvdr-icon> Close project
              </button>
            </div>
            <p class="sec-desc">Access will be terminated on the selected time for all participants, including administrators</p>
          </section>
        </div>

        <!-- ══ VIEW: ORDER ══ -->
        <div class="order-wrap" *ngIf="view === 'order'">
          <div class="order-cols">

            <!-- Archives column -->
            <div class="col">
              <div class="col-hdr">Archives</div>

              <!-- Archive cards -->
              <div class="arch-card" *ngFor="let arch of archives">
                <div class="arch-card__icon"><fvdr-icon name="storage"></fvdr-icon></div>
                <div class="arch-card__body">
                  <strong>{{ arch.name }}</strong>
                  <span><b>Documents:</b> {{ docLabel(arch.documents) }}</span>
                  <span><b>Recycle bin:</b> {{ arch.includeRecycleBin ? 'Include' : 'Exclude' }}</span>
                  <span><b>Reports:</b> {{ reportsLabel(arch.reports) }}</span>
                  <span><b>Q&amp;A contents:</b> {{ arch.includeQA ? 'Include' : 'Exclude' }}</span>
                </div>
                <div class="arch-card__actions">
                  <button class="card-ic-btn" (click)="deleteArchive(arch.id)" title="Delete"><fvdr-icon name="trash"></fvdr-icon></button>
                  <button class="card-ic-btn" (click)="duplicateArchive(arch)" title="Duplicate"><fvdr-icon name="move"></fvdr-icon></button>
                  <button class="card-ic-btn" (click)="editArchive(arch)" title="Edit"><fvdr-icon name="edit"></fvdr-icon></button>
                </div>
              </div>

              <!-- Archive form -->
              <div class="arch-form" *ngIf="archiveFormOpen">
                <div class="arch-form__title">{{ editingArchiveId !== null ? archiveForm.name : ('Archive ' + (archives.length + 1)) }}</div>

                <div class="field">
                  <label class="field-lbl">Name</label>
                  <fvdr-input [(ngModel)]="archiveForm.name" [placeholder]="'Archive ' + (archives.length + 1)"></fvdr-input>
                </div>

                <div class="field">
                  <label class="field-lbl">Documents</label>
                  <fvdr-radio [options]="docOptions" [value]="archiveForm.documents" layout="horizontal"
                              (valueChange)="archiveForm.documents = $event"></fvdr-radio>
                </div>

                <div class="field field--row">
                  <fvdr-toggle [checked]="archiveForm.includeRecycleBin"
                               (checkedChange)="archiveForm.includeRecycleBin = $event"
                               label="Include recycle bin"></fvdr-toggle>
                </div>

                <div class="field">
                  <label class="field-lbl">Reports</label>
                  <fvdr-dropdown [options]="reportsOptions" [value]="archiveForm.reports"
                                 (valueChange)="archiveForm.reports = asString($event)"></fvdr-dropdown>
                  <span class="field-hint">Reports will include only the data and activity related to the selected user group.</span>
                </div>

                <div class="field field--row">
                  <fvdr-toggle [checked]="archiveForm.includeQA"
                               (checkedChange)="archiveForm.includeQA = $event"
                               label="Include Q&A contents"></fvdr-toggle>
                </div>

                <div class="arch-form__footer">
                  <button class="link-btn link-btn--red" (click)="cancelArchiveForm()">
                    <fvdr-icon name="trash"></fvdr-icon> Delete
                  </button>
                  <button class="ghost-btn" (click)="addAndDuplicateArchive()">
                    <fvdr-icon name="move"></fvdr-icon> Add and duplicate
                  </button>
                  <fvdr-btn label="Add" size="s" (clicked)="addArchive()"></fvdr-btn>
                </div>
              </div>

              <!-- Add archive button -->
              <button class="add-row-btn" *ngIf="!archiveFormOpen" (click)="openArchiveForm()">
                <fvdr-icon name="plus"></fvdr-icon> Archive
              </button>
            </div>

            <!-- Recipients column -->
            <div class="col">
              <div class="col-hdr">Recipients</div>

              <!-- Recipient cards -->
              <div class="recip-card" *ngFor="let r of recipients">
                <div class="recip-card__top">
                  <fvdr-avatar initials="{{ r.fullName | initials }}" size="md" color="#eceef9" textColor="#1f2129"></fvdr-avatar>
                  <div class="recip-card__info">
                    <strong>{{ r.fullName }}</strong>
                    <span class="recip-card__sub">Estimated delivery: Sep 20, 2023 to {{ r.country }}</span>
                  </div>
                </div>
                <div class="recip-arch-row" *ngFor="let arch of archives">
                  <span class="recip-arch-name">{{ arch.name }}</span>
                  <fvdr-icon name="storage" class="usb-ic"></fvdr-icon>
                  <span class="usb-label">USB drives</span>
                  <div class="usb-counter">
                    <button class="usb-btn" (click)="decUsb(r, arch.id)"><fvdr-icon name="chevron-left"></fvdr-icon></button>
                    <span>{{ r.usbCounts[arch.id] || 1 }}</span>
                    <button class="usb-btn" (click)="incUsb(r, arch.id)"><fvdr-icon name="chevron-right"></fvdr-icon></button>
                  </div>
                  <button class="usb-remove" (click)="removeArchiveFromRecipient(r, arch.id)"><fvdr-icon name="close"></fvdr-icon></button>
                </div>
              </div>

              <!-- Recipient form -->
              <div class="recip-form" *ngIf="recipientFormOpen">
                <div class="field">
                  <label class="field-lbl">Email</label>
                  <fvdr-input [(ngModel)]="recipientForm.email" placeholder="Enter email" type="email"></fvdr-input>
                </div>
                <div class="field">
                  <label class="field-lbl">Full name</label>
                  <fvdr-input [(ngModel)]="recipientForm.fullName" placeholder="Enter full name" iconLeft="participants"></fvdr-input>
                </div>
                <div class="field">
                  <label class="field-lbl">Phone number</label>
                  <fvdr-phone-input [(ngModel)]="recipientForm.phone"></fvdr-phone-input>
                </div>
                <div class="field">
                  <label class="field-lbl">Company</label>
                  <fvdr-input [(ngModel)]="recipientForm.company" placeholder="Enter company name"></fvdr-input>
                </div>
                <div class="field-row">
                  <div class="field field--grow">
                    <label class="field-lbl">Country</label>
                    <fvdr-dropdown [options]="countryOptions" [value]="recipientForm.country"
                                   (valueChange)="recipientForm.country = asString($event)"></fvdr-dropdown>
                    <span class="field-hint">The archive will include only the information available to the selected user group.</span>
                  </div>
                  <div class="field">
                    <label class="field-lbl">Estimated delivery</label>
                    <span class="est-date">Sep 20, 2023</span>
                  </div>
                </div>
                <div class="field-row">
                  <div class="field field--grow">
                    <label class="field-lbl">City</label>
                    <fvdr-input [(ngModel)]="recipientForm.city" placeholder="London"></fvdr-input>
                  </div>
                  <div class="field">
                    <label class="field-lbl">Postal/ZIP code</label>
                    <fvdr-input [(ngModel)]="recipientForm.postalCode" placeholder="000000"></fvdr-input>
                  </div>
                </div>
                <div class="field">
                  <label class="field-lbl">Address</label>
                  <fvdr-input [(ngModel)]="recipientForm.address" placeholder="Street, building, unit, suite, apartment, floor, etc."></fvdr-input>
                  <span class="field-hint">Indicate a physical address, not a PO box, as the recipient must sign for the package</span>
                </div>

                <div class="recip-form__footer">
                  <button class="link-btn link-btn--red" (click)="cancelRecipientForm()">
                    <fvdr-icon name="trash"></fvdr-icon> Delete
                  </button>
                  <fvdr-btn label="Add" size="s" (clicked)="addRecipient()"></fvdr-btn>
                </div>
              </div>

              <!-- Add recipient buttons -->
              <div class="recip-add-row" *ngIf="!recipientFormOpen">
                <button class="add-row-btn" (click)="openRecipientForm()">
                  <fvdr-icon name="plus"></fvdr-icon> Recipient
                </button>
                <button class="link-btn" *ngIf="recipients.length === 0" (click)="iAmRecipient()">I am the recipient</button>
              </div>
              <p class="recip-empty-hint" *ngIf="recipients.length === 0 && !recipientFormOpen">
                Add recipient or order USB drive with archive for yourself
              </p>
            </div>

          </div>

          <!-- Order footer -->
          <div class="order-footer">
            <fvdr-btn label="Cancel" variant="ghost" (clicked)="cancelOrder()"></fvdr-btn>
            <fvdr-btn label="Confirm" (clicked)="openConfirmModal()" [disabled]="archives.length === 0 || recipients.length === 0"></fvdr-btn>
          </div>
        </div>

      </div><!-- /main -->

      <!-- ── Confirm order modal ── -->
      <div class="overlay" *ngIf="confirmModalOpen" (click)="confirmModalOpen = false">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal__hdr">
            <span class="modal__title">Confirm order</span>
            <button class="modal__close" (click)="confirmModalOpen = false">
              <fvdr-icon name="close"></fvdr-icon>
            </button>
          </div>
          <div class="modal__body">
            <label class="field-lbl">Specific requirements (optional)</label>
            <textarea class="modal__textarea" [(ngModel)]="specificRequirements"
                      placeholder="Enter your specific requirements"
                      maxlength="1000"></textarea>
            <span class="char-count">{{ specificRequirements.length }}/1000</span>
          </div>
          <div class="modal__footer">
            <fvdr-btn label="Cancel" variant="ghost" (clicked)="confirmModalOpen = false"></fvdr-btn>
            <fvdr-btn label="Order" (clicked)="placeOrder()"></fvdr-btn>
          </div>
        </div>
      </div>

      <!-- Chat bubble -->
      <div class="chat-bubble">
        <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" fill="white"/>
        </svg>
      </div>

    </div>
  `,
  styles: [`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .shell {
      display: flex; height: 100vh;
      font-family: var(--font-family, 'Open Sans', sans-serif);
      background: #fff; overflow: hidden; position: relative;
    }

    /* ── Sidebar ── */
    .sidebar {
      width: 280px; min-width: 280px; height: 100%;
      background: #f7f7f7; border-right: 1px solid #dee0eb;
      display: flex; flex-direction: column; justify-content: space-between;
    }
    .sidebar-top { display: flex; flex-direction: column; gap: 24px; flex: 1; overflow-y: auto; }
    .project-row { display: flex; align-items: center; gap: 16px; padding: 12px 16px; cursor: pointer; }
    .project-logo {
      width: 40px; height: 40px; background: #1a2e4a; border-radius: 4px;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700; color: white; flex-shrink: 0;
    }
    .project-name { flex: 1; font-size: 16px; font-weight: 600; color: #1f2129; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .chevron-ic { font-size: 16px; color: #5f616a; flex-shrink: 0; }
    nav { display: flex; flex-direction: column; }
    .nav-item {
      display: flex; align-items: center; height: 48px; padding-right: 24px;
      cursor: pointer; text-decoration: none; color: #40424b; transition: background 0.12s;
    }
    .nav-item:hover { background: #eef0f8; }
    .nav-ic { width: 72px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 24px; color: #5f616a; }
    .nav-item--active .nav-ic { color: #1f2129; }
    .nav-lbl { flex: 1; font-size: 16px; font-weight: 400; color: #40424b; white-space: nowrap; }
    .nav-lbl--bold { font-weight: 600; color: #1f2129; }
    .nav-end-ic { font-size: 16px; color: #5f616a; flex-shrink: 0; }
    .sidebar-foot {
      display: flex; align-items: center; justify-content: space-between;
      padding: 24px 16px 24px 24px; border-top: 1px solid #dee0eb;
    }
    .ideals-logo { font-size: 18px; font-weight: 800; color: #1f2129; font-style: italic; }
    .collapse-btn { background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; font-size: 16px; color: #5f616a; }

    /* ── Main ── */
    .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

    .top-bar {
      height: 64px; min-height: 64px; background: white; border-bottom: 1px solid #dee0eb;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 24px; flex-shrink: 0;
    }
    .breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 16px; font-weight: 600; color: #1f2129; }
    .bc-link { color: #358CEB; cursor: pointer; }
    .bc-link:hover { text-decoration: underline; }
    .bc-sep { font-size: 14px; color: #5f616a; }
    .hdr-actions { display: flex; align-items: center; gap: 24px; }
    .ic-btn { background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; font-size: 20px; color: #5f616a; transition: color 0.12s; }
    .ic-btn:hover { color: #1f2129; }

    /* ── Main view ── */
    .content { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; }
    .section { display: flex; flex-direction: column; gap: 16px; padding-bottom: 24px; max-width: 632px; }
    .sec-hdr { display: flex; align-items: center; justify-content: space-between; }
    .sec-title { font-size: 16px; font-weight: 600; color: #1f2129; line-height: 24px; }
    .action-btn {
      display: flex; align-items: center; gap: 8px; background: none; border: none; cursor: pointer;
      font-size: 15px; font-weight: 400; font-family: inherit; padding: 0; line-height: 1; transition: opacity 0.12s;
    }
    .action-btn:hover { opacity: 0.75; }
    .action-btn fvdr-icon { font-size: 16px; flex-shrink: 0; }
    .action-btn--green { color: #2c9c74; }
    .action-btn--red { color: #e54430; }
    .bullet-list { padding-left: 22px; }
    .bullet-list li { font-size: 15px; color: #1f2129; line-height: 24px; list-style: disc; }
    .divider { height: 1px; border: none; background: #dee0eb; max-width: 632px; margin-bottom: 24px; }
    .sec-desc { font-size: 15px; color: #1f2129; line-height: 24px; }

    /* ── Order view ── */
    .order-wrap { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .order-cols { flex: 1; display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #dee0eb; overflow-y: auto; }
    .col { display: flex; flex-direction: column; gap: 12px; padding: 24px; border-right: 1px solid #dee0eb; }
    .col:last-child { border-right: none; }
    .col-hdr { font-size: 15px; font-weight: 600; color: #1f2129; padding-bottom: 8px; border-bottom: 1px solid #dee0eb; }

    /* Archive card */
    .arch-card {
      display: flex; align-items: flex-start; gap: 12px;
      border: 1px solid #dee0eb; border-radius: 8px; padding: 14px;
      position: relative; transition: background 0.12s;
    }
    .arch-card:hover { background: #f7f7f7; }
    .arch-card:hover .arch-card__actions { opacity: 1; }
    .arch-card__icon { font-size: 24px; color: #5f616a; flex-shrink: 0; margin-top: 2px; }
    .arch-card__body { flex: 1; display: flex; flex-direction: column; gap: 2px; font-size: 13px; color: #1f2129; }
    .arch-card__body strong { font-size: 14px; font-weight: 600; margin-bottom: 2px; }
    .arch-card__body b { font-weight: 600; }
    .arch-card__actions {
      display: flex; gap: 4px; opacity: 0; transition: opacity 0.12s;
      position: absolute; top: 10px; right: 10px;
    }
    .card-ic-btn { background: none; border: none; cursor: pointer; padding: 4px; font-size: 16px; color: #5f616a; border-radius: 4px; transition: color 0.12s, background 0.12s; display: flex; }
    .card-ic-btn:hover { color: #1f2129; background: #eef0f8; }

    /* Archive form */
    .arch-form {
      border: 1px solid #dee0eb; border-radius: 8px; padding: 16px;
      display: flex; flex-direction: column; gap: 14px;
    }
    .arch-form__title { font-size: 14px; font-weight: 600; color: #1f2129; }
    .arch-form__footer { display: flex; align-items: center; gap: 8px; padding-top: 4px; }

    /* Recipient card */
    .recip-card {
      border: 1px solid #dee0eb; border-radius: 8px; padding: 14px;
      display: flex; flex-direction: column; gap: 10px;
    }
    .recip-card__top { display: flex; align-items: center; gap: 10px; }
    .recip-card__info { display: flex; flex-direction: column; gap: 2px; }
    .recip-card__info strong { font-size: 14px; font-weight: 600; color: #1f2129; }
    .recip-card__sub { font-size: 12px; color: #5f616a; }
    .recip-arch-row {
      display: flex; align-items: center; gap: 8px;
      font-size: 13px; color: #1f2129; padding: 4px 0; border-top: 1px solid #f0f0f0;
    }
    .recip-arch-name { flex: 1; }
    .usb-ic { font-size: 14px; color: #5f616a; }
    .usb-label { font-size: 12px; color: #5f616a; }
    .usb-counter { display: flex; align-items: center; gap: 0; border: 1px solid #dee0eb; border-radius: 4px; }
    .usb-btn { background: none; border: none; cursor: pointer; padding: 2px 6px; font-size: 12px; color: #5f616a; display: flex; }
    .usb-btn:hover { color: #1f2129; }
    .usb-counter span { padding: 0 6px; font-size: 13px; min-width: 24px; text-align: center; }
    .usb-remove { background: none; border: none; cursor: pointer; font-size: 14px; color: #b0b0b0; display: flex; transition: color 0.12s; }
    .usb-remove:hover { color: #e54430; }

    /* Recipient form */
    .recip-form { border: 1px solid #dee0eb; border-radius: 8px; padding: 16px; display: flex; flex-direction: column; gap: 14px; }
    .recip-form__footer { display: flex; align-items: center; justify-content: space-between; padding-top: 4px; }

    /* Add buttons */
    .add-row-btn {
      display: inline-flex; align-items: center; gap: 6px;
      background: none; border: 1px solid #dee0eb; border-radius: 6px;
      padding: 6px 14px; font-size: 14px; color: #1f2129; font-family: inherit;
      cursor: pointer; transition: border-color 0.12s, color 0.12s;
    }
    .add-row-btn fvdr-icon { font-size: 14px; }
    .add-row-btn:hover { border-color: #2c9c74; color: #2c9c74; }
    .recip-add-row { display: flex; align-items: center; gap: 12px; }
    .recip-empty-hint { font-size: 13px; color: #5f616a; }

    /* Links */
    .link-btn {
      background: none; border: none; cursor: pointer; padding: 0;
      font-size: 14px; color: #358CEB; font-family: inherit; display: flex; align-items: center; gap: 4px;
      transition: opacity 0.12s;
    }
    .link-btn:hover { opacity: 0.75; }
    .link-btn--red { color: #e54430; }
    .link-btn fvdr-icon { font-size: 14px; }
    .ghost-btn {
      display: inline-flex; align-items: center; gap: 6px;
      background: none; border: 1px solid #dee0eb; border-radius: 6px;
      padding: 5px 12px; font-size: 13px; color: #5f616a; font-family: inherit;
      cursor: pointer; transition: border-color 0.12s;
    }
    .ghost-btn fvdr-icon { font-size: 14px; }
    .ghost-btn:hover { border-color: #5f616a; }

    /* Fields */
    .field { display: flex; flex-direction: column; gap: 4px; }
    .field--grow { flex: 1; }
    .field--row { flex-direction: row; align-items: center; }
    .field-row { display: flex; gap: 12px; }
    .field-lbl { font-size: 13px; font-weight: 600; color: #5f616a; }
    .field-hint { font-size: 11px; color: #9b9da6; }
    .est-date { font-size: 14px; color: #1f2129; padding-top: 6px; white-space: nowrap; }

    /* Order footer */
    .order-footer {
      display: flex; align-items: center; justify-content: flex-start; gap: 8px;
      padding: 16px 24px; background: white; flex-shrink: 0;
    }

    /* Modal */
    .overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.45);
      display: flex; align-items: center; justify-content: center; z-index: 100;
    }
    .modal {
      width: 480px; max-width: calc(100vw - 32px);
      background: white; border-radius: 12px; overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,.18);
    }
    .modal__hdr {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 24px 0;
    }
    .modal__title { font-size: 16px; font-weight: 600; color: #1f2129; }
    .modal__close { background: none; border: none; cursor: pointer; font-size: 18px; color: #5f616a; display: flex; }
    .modal__close:hover { color: #1f2129; }
    .modal__body { padding: 16px 24px; display: flex; flex-direction: column; gap: 8px; }
    .modal__textarea {
      width: 100%; height: 120px; resize: none;
      border: 1px solid #dee0eb; border-radius: 6px;
      padding: 10px 12px; font-size: 14px; font-family: inherit; color: #1f2129;
      outline: none; transition: border-color 0.15s;
    }
    .modal__textarea:focus { border-color: #2c9c74; }
    .modal__textarea::placeholder { color: #b0b3c0; }
    .char-count { font-size: 11px; color: #9b9da6; text-align: right; }
    .modal__footer { display: flex; justify-content: flex-end; gap: 8px; padding: 12px 24px 20px; }

    /* Chat bubble */
    .chat-bubble {
      position: fixed; bottom: 24px; right: 24px;
      width: 62px; height: 62px; background: #2c9c74; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; box-shadow: 0 4px 16px rgba(0,0,0,.18);
    }
  `],
})
export class ProjectArchiveCreationFlowTestingComponent implements OnInit, OnDestroy {
  private tracker = inject(TrackerService);
  private toast = inject(ToastService);

  view: AppView = 'main';

  // Archives
  archives: Archive[] = [];
  archiveFormOpen = false;
  editingArchiveId: number | null = null;
  archiveForm = freshArchiveForm();
  private nextArchiveId = 1;

  // Recipients
  recipients: Recipient[] = [];
  recipientFormOpen = false;
  recipientForm = freshRecipientForm();

  // Confirm modal
  confirmModalOpen = false;
  specificRequirements = '';

  readonly docOptions: RadioOption[] = [
    { value: 'all', label: 'All' },
    { value: 'viewpoint', label: 'From the viewpoint of group' },
    { value: 'selected', label: 'Selected folders' },
  ];

  readonly reportsOptions: DropdownOption[] = [
    { value: 'all', label: 'Selected all' },
    { value: 'history', label: 'History of all actions, Folder access' },
    { value: 'custom', label: 'Custom' },
  ];

  readonly countryOptions: DropdownOption[] = [
    { value: 'Luxembourg', label: 'Luxembourg' },
    { value: 'Germany', label: 'Germany' },
    { value: 'France', label: 'France' },
    { value: 'United Kingdom', label: 'United Kingdom' },
  ];

  // ── Lifecycle ────────────────────────────────────────────────────────────────

  ngOnInit(): void { this.tracker.trackPageView(SLUG); }
  ngOnDestroy(): void { this.tracker.destroyListeners(); }

  // ── Navigation ───────────────────────────────────────────────────────────────

  goToOrder(): void {
    this.tracker.trackTask(SLUG, 'task_complete', 'place_order');
    this.archives = [];
    this.recipients = [];
    this.archiveFormOpen = false;
    this.recipientFormOpen = false;
    this.archiveForm = freshArchiveForm();
    this.recipientForm = freshRecipientForm();
    this.nextArchiveId = 1;
    this.view = 'order';
  }

  cancelOrder(): void {
    this.view = 'main';
  }

  onCloseProject(): void {
    this.tracker.trackTask(SLUG, 'task_fail', 'close_project');
  }

  // ── Archives ─────────────────────────────────────────────────────────────────

  openArchiveForm(): void {
    this.editingArchiveId = null;
    this.archiveForm = freshArchiveForm();
    this.archiveForm.name = `Archive ${this.archives.length + 1}`;
    this.archiveFormOpen = true;
  }

  editArchive(arch: Archive): void {
    this.editingArchiveId = arch.id;
    this.archiveForm = { ...arch };
    this.archiveFormOpen = true;
  }

  addArchive(): void {
    if (this.editingArchiveId !== null) {
      const idx = this.archives.findIndex(a => a.id === this.editingArchiveId);
      if (idx !== -1) this.archives[idx] = { id: this.editingArchiveId, ...this.archiveForm };
    } else {
      const arch: Archive = { id: this.nextArchiveId++, ...this.archiveForm };
      this.archives = [...this.archives, arch];
      // Give each existing recipient a USB count for new archive
      this.recipients.forEach(r => r.usbCounts[arch.id] = 1);
    }
    this.archiveFormOpen = false;
    this.editingArchiveId = null;
  }

  addAndDuplicateArchive(): void {
    this.addArchive();
    this.archiveForm = { ...this.archiveForm, name: `Archive ${this.archives.length + 1}` };
    this.archiveFormOpen = true;
  }

  cancelArchiveForm(): void {
    this.archiveFormOpen = false;
    this.editingArchiveId = null;
  }

  deleteArchive(id: number): void {
    this.archives = this.archives.filter(a => a.id !== id);
    this.recipients.forEach(r => delete r.usbCounts[id]);
  }

  duplicateArchive(arch: Archive): void {
    const dup: Archive = { ...arch, id: this.nextArchiveId++, name: `${arch.name} (copy)` };
    this.archives = [...this.archives, dup];
    this.recipients.forEach(r => r.usbCounts[dup.id] = 1);
  }

  // ── Recipients ───────────────────────────────────────────────────────────────

  openRecipientForm(): void {
    this.recipientForm = freshRecipientForm();
    this.recipientFormOpen = true;
  }

  iAmRecipient(): void {
    this.recipientForm = {
      email: 'ivan.r@ideals.com',
      fullName: 'Ivan R.',
      phone: '+352 27 17 62 1',
      company: 'iDeals',
      country: 'Luxembourg',
      city: 'Luxembourg',
      postalCode: '9053',
      address: '37A Av. John F. Kennedy 3rd floor, Kirchberg',
    };
    this.recipientFormOpen = true;
  }

  addRecipient(): void {
    const usbCounts: { [id: number]: number } = {};
    this.archives.forEach(a => usbCounts[a.id] = 1);
    const r: Recipient = {
      id: Date.now(),
      ...this.recipientForm,
      usbCounts,
    };
    this.recipients = [...this.recipients, r];
    this.recipientFormOpen = false;
    this.recipientForm = freshRecipientForm();
  }

  cancelRecipientForm(): void {
    this.recipientFormOpen = false;
  }

  incUsb(r: Recipient, archId: number): void {
    r.usbCounts[archId] = (r.usbCounts[archId] || 1) + 1;
  }

  decUsb(r: Recipient, archId: number): void {
    if ((r.usbCounts[archId] || 1) > 1) r.usbCounts[archId]--;
  }

  removeArchiveFromRecipient(r: Recipient, archId: number): void {
    delete r.usbCounts[archId];
  }

  // ── Confirm & Order ──────────────────────────────────────────────────────────

  openConfirmModal(): void {
    this.specificRequirements = '';
    this.confirmModalOpen = true;
  }

  placeOrder(): void {
    this.confirmModalOpen = false;
    this.tracker.trackTask(SLUG, 'task_complete', 'confirm_order');
    this.view = 'main';
    this.toast.show({ variant: 'success', message: 'Order successfully placed' });
  }

  // ── Labels ───────────────────────────────────────────────────────────────────

  docLabel(val: string): string {
    return { all: 'All files and folders', viewpoint: 'From the viewpoint of group', selected: 'Selected folders' }[val] ?? val;
  }

  asString(v: string | string[]): string { return Array.isArray(v) ? v[0] : v; }

  reportsLabel(val: string): string {
    return this.reportsOptions.find(o => o.value === val)?.label ?? val;
  }
}

