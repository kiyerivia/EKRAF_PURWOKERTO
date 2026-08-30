/**
 * EKRAF PURWOKERTO - Hostinger-Style CMS Dashboard Controller
 * Mengelola panel CMS: Metrik, CRUD UMKM, Editor Berita Blogspot-Style,
 * Manajemen Modul App Store, dan Sinkronisasi Real-Time.
 */

class CMSController {
  constructor() {
    this.currentView = 'dashboard'; // 'dashboard', 'umkm', 'products', 'news', 'events', 'destinations', 'modules', 'settings'
    this.editingItem = null;
    this.init();
  }

  init() {
    this.bindNavigation();
    this.bindActionModals();
    this.renderCurrentView();

    // Re-render when data updates
    window.addEventListener('ekraf_data_changed', () => {
      this.renderCurrentView();
    });
  }

  bindNavigation() {
    // Mode switcher buttons (Top bar)
    const btnModePublic = document.getElementById('btn-mode-public');
    const btnModeCMS = document.getElementById('btn-mode-cms');
    const publicContainer = document.getElementById('public-portal-container');
    const cmsContainer = document.getElementById('cms-dashboard-container');

    if (btnModePublic && btnModeCMS) {
      btnModePublic.addEventListener('click', () => {
        btnModePublic.classList.add('active');
        btnModeCMS.classList.remove('cms-active');
        publicContainer.style.display = 'block';
        cmsContainer.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (window.Magic) window.Magic.playMagicChime(640, 0.1);
      });

      btnModeCMS.addEventListener('click', () => {
        btnModeCMS.classList.add('cms-active');
        btnModePublic.classList.remove('active');
        publicContainer.style.display = 'none';
        cmsContainer.style.display = 'grid';
        this.renderCurrentView();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (window.Magic) window.Magic.playMagicChime(780, 0.12);
      });
    }

    // CMS Sidebar links
    document.querySelectorAll('[data-cms-view]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.getAttribute('data-cms-view');
        this.switchView(view);
      });
    });

    // Role switcher pills
    const roleSelector = document.getElementById('cms-role-selector');
    if (roleSelector) {
      roleSelector.addEventListener('change', (e) => {
        const newRole = e.target.value;
        window.EkrafStore.setRole(newRole);
        this.showToast(`Mode pengguna diubah menjadi: ${newRole.toUpperCase()}`);
        this.renderCurrentView();
      });
    }
  }

  switchView(viewName) {
    this.currentView = viewName;
    document.querySelectorAll('[data-cms-view]').forEach(link => {
      if (link.getAttribute('data-cms-view') === viewName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    this.renderCurrentView();
  }

  renderCurrentView() {
    const mainEl = document.getElementById('cms-content-mount');
    if (!mainEl) return;

    // Update sidebar counts
    const umkmCount = window.EkrafStore.getUMKM().length;
    const prodCount = window.EkrafStore.getProducts().length;
    const eventCount = window.EkrafStore.getEvents().length;
    const newsCount = window.EkrafStore.getNews().length;

    const badgeUmkm = document.getElementById('badge-count-umkm');
    const badgeProd = document.getElementById('badge-count-prod');
    const badgeEvent = document.getElementById('badge-count-event');
    const badgeNews = document.getElementById('badge-count-news');

    if (badgeUmkm) badgeUmkm.innerText = umkmCount;
    if (badgeProd) badgeProd.innerText = prodCount;
    if (badgeEvent) badgeEvent.innerText = eventCount;
    if (badgeNews) badgeNews.innerText = newsCount;

    switch (this.currentView) {
      case 'dashboard':
        this.renderDashboardView(mainEl);
        break;
      case 'umkm':
        this.renderUMKMView(mainEl);
        break;
      case 'products':
        this.renderProductsView(mainEl);
        break;
      case 'news':
        this.renderNewsView(mainEl);
        break;
      case 'events':
        this.renderEventsView(mainEl);
        break;
      case 'destinations':
        this.renderDestinationsView(mainEl);
        break;
      case 'modules':
        this.renderModulesView(mainEl);
        break;
      case 'settings':
        this.renderSettingsView(mainEl);
        break;
      default:
        this.renderDashboardView(mainEl);
    }
  }

  // ==========================================
  // VIEW: DASHBOARD OVERVIEW (ala Hostinger)
  // ==========================================
  renderDashboardView(mount) {
    const umkmList = window.EkrafStore.getUMKM();
    const products = window.EkrafStore.getProducts();
    const events = window.EkrafStore.getEvents();
    const currentRole = window.EkrafStore.getRole();

    mount.innerHTML = `
      <div class="cms-header-row">
        <div class="cms-page-title">
          <h2>Dashboard Ringkasan EKRAF</h2>
          <p>Selamat Datang, <strong>${currentRole === 'admin' ? 'Admin Utama EKRAF' : 'Pelaku UMKM (Bintang)'}</strong>. Kelola seluruh aset dan konten kota dengan mudah tanpa koding.</p>
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <button class="btn btn-sm btn-outline" id="btn-quick-preview-public">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            <span>Buka Portal Publik</span>
          </button>
          <button class="btn btn-sm btn-gold magic-shimmer-btn" id="btn-quick-add-umkm">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            <span>Tambah Data Baru</span>
          </button>
        </div>
      </div>

      <!-- Metric Stat Cards -->
      <div class="cms-stats-grid">
        <div class="cms-stat-card gold magic-tilt">
          <div class="cms-stat-top">
            <span class="cms-stat-label">Total Pelaku Ekraf & UMKM</span>
            <div class="cms-stat-icon" style="background: #FEF3C7; color: #D97706;">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
          </div>
          <div class="cms-stat-value">${(1240 + umkmList.length).toLocaleString()}</div>
          <div class="cms-stat-trend">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            <span>+14% bulan ini</span>
          </div>
        </div>

        <div class="cms-stat-card blue magic-tilt">
          <div class="cms-stat-top">
            <span class="cms-stat-label">Produk Kreatif Terdaftar</span>
            <div class="cms-stat-icon" style="background: #DBEAFE; color: #1D4ED8;">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </div>
          </div>
          <div class="cms-stat-value">${(320 + products.length).toLocaleString()}</div>
          <div class="cms-stat-trend">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            <span>+28 produk baru</span>
          </div>
        </div>

        <div class="cms-stat-card emerald magic-tilt">
          <div class="cms-stat-top">
            <span class="cms-stat-label">Event & Festival Aktif</span>
            <div class="cms-stat-icon" style="background: #D1FAE5; color: #059669;">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            </div>
          </div>
          <div class="cms-stat-value">${(40 + events.length).toLocaleString()}</div>
          <div class="cms-stat-trend">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            <span>Festival Menara Teratai Siap</span>
          </div>
        </div>

        <div class="cms-stat-card purple magic-tilt">
          <div class="cms-stat-top">
            <span class="cms-stat-label">Estimasi Kunjungan & Interaksi</span>
            <div class="cms-stat-icon" style="background: #EDE9FE; color: #7C3AED;">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
          </div>
          <div class="cms-stat-value">54.8K</div>
          <div class="cms-stat-trend">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            <span>+32% pengunjung online</span>
          </div>
        </div>
      </div>

      <!-- Visual Growth Chart & Recent Activity -->
      <div style="display: grid; grid-template-columns: 1.6fr 1fr; gap: 1.75rem; margin-bottom: 2rem;">
        <!-- Traffic Chart Card -->
        <div class="cms-card-panel">
          <div class="cms-panel-header">
            <div>
              <h3 style="font-size: 1.1rem; font-weight: 700;">Tren Aktivitas Ekonomi Kreatif Banyumas</h3>
              <p style="font-size: 0.8rem; color: var(--text-muted);">Peningkatan traffic pengunjung & pencarian UMKM 7 hari terakhir</p>
            </div>
            <span class="diagonal-badge diagonal-badge-emerald"><span>Live Data</span></span>
          </div>
          <div style="padding: 1.5rem;">
            <!-- Interactive SVG Sparkline Chart -->
            <svg viewBox="0 0 600 200" style="width: 100%; height: auto; overflow: visible;">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.35"/>
                  <stop offset="100%" stop-color="#3B82F6" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <!-- Grid lines -->
              <line x1="0" y1="40" x2="600" y2="40" stroke="#F1F5F9" stroke-width="1.5" />
              <line x1="0" y1="90" x2="600" y2="90" stroke="#F1F5F9" stroke-width="1.5" />
              <line x1="0" y1="140" x2="600" y2="140" stroke="#F1F5F9" stroke-width="1.5" />
              
              <!-- Area fill -->
              <path d="M 30,150 Q 110,130 190,95 T 350,70 T 470,35 T 570,20 L 570,180 L 30,180 Z" fill="url(#chartGradient)" />
              
              <!-- Main curve -->
              <path d="M 30,150 Q 110,130 190,95 T 350,70 T 470,35 T 570,20" fill="none" stroke="#2563EB" stroke-width="3.5" stroke-linecap="round" />
              
              <!-- Data Points -->
              <circle cx="30" cy="150" r="5" fill="#FFFFFF" stroke="#2563EB" stroke-width="3" />
              <circle cx="190" cy="95" r="5" fill="#FFFFFF" stroke="#2563EB" stroke-width="3" />
              <circle cx="350" cy="70" r="5" fill="#FFFFFF" stroke="#2563EB" stroke-width="3" />
              <circle cx="470" cy="35" r="5" fill="#FFFFFF" stroke="#2563EB" stroke-width="3" />
              <circle cx="570" cy="20" r="6" fill="#F59E0B" stroke="#FFFFFF" stroke-width="3" />

              <!-- Day labels -->
              <text x="30" y="195" font-size="11" fill="#94A3B8" text-anchor="middle">Senin</text>
              <text x="120" y="195" font-size="11" fill="#94A3B8" text-anchor="middle">Selasa</text>
              <text x="210" y="195" font-size="11" fill="#94A3B8" text-anchor="middle">Rabu</text>
              <text x="300" y="195" font-size="11" fill="#94A3B8" text-anchor="middle">Kamis</text>
              <text x="390" y="195" font-size="11" fill="#94A3B8" text-anchor="middle">Jumat</text>
              <text x="480" y="195" font-size="11" fill="#94A3B8" text-anchor="middle">Sabtu</text>
              <text x="570" y="195" font-size="11" fill="#F59E0B" font-weight="bold" text-anchor="middle">Minggu (Puncak)</text>
            </svg>
          </div>
        </div>

        <!-- Recent Activity Feed (ala PDF Page 6) -->
        <div class="cms-card-panel">
          <div class="cms-panel-header">
            <h3 style="font-size: 1.1rem; font-weight: 700;">Aktivitas Terbaru</h3>
            <span style="font-size: 0.78rem; color: var(--text-subtle);">Sistem Realtime</span>
          </div>
          <div style="padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
              <span style="width: 32px; height: 32px; border-radius: 8px; background: #D1FAE5; color: #059669; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; flex-shrink: 0;">🏪</span>
              <div>
                <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-main);">UMKM Baru Mendaftar</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">Sentra Mendoan & Kaos Dablongan verified</div>
                <div style="font-size: 0.72rem; color: var(--text-subtle); margin-top: 2px;">10 menit yang lalu</div>
              </div>
            </div>

            <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
              <span style="width: 32px; height: 32px; border-radius: 8px; background: #FEF3C7; color: #D97706; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; flex-shrink: 0;">📅</span>
              <div>
                <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-main);">Event Baru Terbit</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">Festival Ekonomi Kreatif Purwokerto 2026</div>
                <div style="font-size: 0.72rem; color: var(--text-subtle); margin-top: 2px;">1 jam yang lalu</div>
              </div>
            </div>

            <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
              <span style="width: 32px; height: 32px; border-radius: 8px; background: #DBEAFE; color: #1D4ED8; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; flex-shrink: 0;">📰</span>
              <div>
                <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-main);">Artikel Blog Dipublikasi</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">Menara Teratai Jadi Episentrum Ekraf</div>
                <div style="font-size: 0.72rem; color: var(--text-subtle); margin-top: 2px;">3 jam yang lalu</div>
              </div>
            </div>

            <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
              <span style="width: 32px; height: 32px; border-radius: 8px; background: #EDE9FE; color: #7C3AED; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; flex-shrink: 0;">🧩</span>
              <div>
                <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-main);">Modul Ekraf Diaktifkan</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">Katalog Produk & WA Order aktif</div>
                <div style="font-size: 0.72rem; color: var(--text-subtle); margin-top: 2px;">Kemarin</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions Grid -->
      <div class="cms-card-panel" style="padding: 1.5rem;">
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;">Aksi Cepat Pengelolaan (Seperti Hostinger/Blogspot)</h3>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;">
          <button class="btn btn-outline" style="justify-content: flex-start; padding: 1rem;" data-cms-view="umkm">
            <span style="font-size: 1.3rem;">🏪</span>
            <div style="text-align: left;">
              <div style="font-size: 0.9rem; font-weight: 700;">Kelola UMKM</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">CRUD profil & data usaha</div>
            </div>
          </button>
          <button class="btn btn-outline" style="justify-content: flex-start; padding: 1rem;" data-cms-view="news">
            <span style="font-size: 1.3rem;">📝</span>
            <div style="text-align: left;">
              <div style="font-size: 0.9rem; font-weight: 700;">Tulis Berita</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Editor ala Blogspot</div>
            </div>
          </button>
          <button class="btn btn-outline" style="justify-content: flex-start; padding: 1rem;" data-cms-view="events">
            <span style="font-size: 1.3rem;">📅</span>
            <div style="text-align: left;">
              <div style="font-size: 0.9rem; font-weight: 700;">Jadwalkan Event</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Kelola festival Menara Teratai</div>
            </div>
          </button>
          <button class="btn btn-outline" style="justify-content: flex-start; padding: 1rem;" data-cms-view="modules">
            <span style="font-size: 1.3rem;">🧩</span>
            <div style="text-align: left;">
              <div style="font-size: 0.9rem; font-weight: 700;">Modul Ekraf</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Toggle aktif/nonaktif modul</div>
            </div>
          </button>
        </div>
      </div>
    `;

    // Bind dashboard view button listeners
    const btnPreview = document.getElementById('btn-quick-preview-public');
    if (btnPreview) {
      btnPreview.addEventListener('click', () => {
        document.getElementById('btn-mode-public').click();
      });
    }

    const btnQuickAdd = document.getElementById('btn-quick-add-umkm');
    if (btnQuickAdd) {
      btnQuickAdd.addEventListener('click', () => {
        this.openUMKMFormModal();
      });
    }

    mount.querySelectorAll('[data-cms-view]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchView(btn.getAttribute('data-cms-view'));
      });
    });
  }

  // ==========================================
  // VIEW: MANAJEMEN UMKM (CRUD LENGKAP - PDF P.7)
  // ==========================================
  renderUMKMView(mount) {
    const list = window.EkrafStore.getUMKM();

    mount.innerHTML = `
      <div class="cms-header-row">
        <div class="cms-page-title">
          <h2>Manajemen UMKM & Pelaku Ekraf</h2>
          <p>Daftar seluruh pelaku usaha kreatif Purwokerto. Tambah, ubah, atau hapus data secara instan.</p>
        </div>
        <button class="btn btn-gold magic-shimmer-btn" id="btn-add-umkm-modal">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          <span>+ Tambah UMKM</span>
        </button>
      </div>

      <div class="cms-card-panel">
        <div class="cms-panel-header">
          <div style="display: flex; gap: 1rem; align-items: center; width: 100%; max-width: 420px;">
            <input type="text" id="cms-search-umkm" placeholder="Cari nama usaha, pemilik, kategori..." style="width: 100%; padding: 0.55rem 1rem; border-radius: var(--radius-sm); border: 1.5px solid var(--border-light);" />
          </div>
          <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted);">
            Total: <strong>${list.length}</strong> Usaha
          </span>
        </div>

        <div class="cms-table-wrapper">
          <table class="cms-table">
            <thead>
              <tr>
                <th>Nama Usaha & Pemilik</th>
                <th>Subsektor Ekraf</th>
                <th>Kontak & WhatsApp</th>
                <th>Alamat</th>
                <th>Status</th>
                <th style="text-align: right;">Aksi</th>
              </tr>
            </thead>
            <tbody id="cms-umkm-table-body">
              ${this.buildUMKMTableRows(list)}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Search filter in table
    const searchInput = document.getElementById('cms-search-umkm');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = list.filter(u => 
          u.name.toLowerCase().includes(query) ||
          u.owner.toLowerCase().includes(query) ||
          u.categoryName.toLowerCase().includes(query)
        );
        document.getElementById('cms-umkm-table-body').innerHTML = this.buildUMKMTableRows(filtered);
        this.bindUMKMTableActions();
      });
    }

    const btnAdd = document.getElementById('btn-add-umkm-modal');
    if (btnAdd) {
      btnAdd.addEventListener('click', () => {
        this.openUMKMFormModal();
      });
    }

    this.bindUMKMTableActions();
  }

  buildUMKMTableRows(list) {
    if (list.length === 0) {
      return `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">Tidak ada data UMKM.</td></tr>`;
    }

    return list.map(u => `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <img src="${u.image || 'assets/images/purwokerto_hero_bg.jpg'}" alt="${u.name}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover;" />
            <div>
              <div style="font-weight: 700; color: #0F172A;">${u.name}</div>
              <div style="font-size: 0.78rem; color: var(--primary-gold-dark);">Pemilik: ${u.owner}</div>
            </div>
          </div>
        </td>
        <td>
          <span class="diagonal-badge diagonal-badge-gold" style="font-size: 0.7rem; padding: 0.2rem 0.55rem;">
            <span>${u.categoryName}</span>
          </span>
        </td>
        <td>
          <div style="font-weight: 600;">${u.whatsapp || '-'}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${u.instagram || '-'}</div>
        </td>
        <td style="max-width: 220px; font-size: 0.82rem; color: var(--text-muted);">
          <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${u.address}</div>
        </td>
        <td>
          <span class="status-pill ${u.status === 'Terverifikasi' ? 'status-verified' : 'status-pending'}">
            <span>${u.status || 'Terverifikasi'}</span>
          </span>
        </td>
        <td style="text-align: right;">
          <div class="action-buttons-cell" style="justify-content: flex-end;">
            <button class="btn-table-action btn-edit-umkm" data-id="${u.id}" title="Edit Data">
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
            </button>
            <button class="btn-table-action delete btn-delete-umkm" data-id="${u.id}" title="Hapus Data">
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  bindUMKMTableActions() {
    document.querySelectorAll('.btn-edit-umkm').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const umkm = window.EkrafStore.getUMKM().find(u => u.id === id);
        if (umkm) this.openUMKMFormModal(umkm);
      });
    });

    document.querySelectorAll('.btn-delete-umkm').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Yakin ingin menghapus data UMKM ini dari sistem?')) {
          window.EkrafStore.deleteUMKM(id);
          this.showToast('Data UMKM berhasil dihapus', 'info');
        }
      });
    });
  }

  // ==========================================
  // MODAL FORM TAMBAH/EDIT UMKM (PDF HALAMAN 7)
  // ==========================================
  openUMKMFormModal(itemToEdit = null) {
    this.editingItem = itemToEdit;
    const modal = document.getElementById('modal-cms-crud-umkm');
    if (!modal) return;

    const titleEl = modal.querySelector('#modal-crud-title');
    const form = modal.querySelector('#form-crud-umkm');

    if (itemToEdit) {
      titleEl.innerText = 'Edit Data UMKM & Pelaku Ekraf';
      form.querySelector('[name="name"]').value = itemToEdit.name || '';
      form.querySelector('[name="owner"]').value = itemToEdit.owner || '';
      form.querySelector('[name="category"]').value = itemToEdit.category || 'kuliner';
      form.querySelector('[name="description"]').value = itemToEdit.description || '';
      form.querySelector('[name="address"]').value = itemToEdit.address || '';
      form.querySelector('[name="mapsUrl"]').value = itemToEdit.mapsUrl || '';
      form.querySelector('[name="whatsapp"]').value = itemToEdit.whatsapp || '';
      form.querySelector('[name="instagram"]').value = itemToEdit.instagram || '';
      form.querySelector('[name="website"]').value = itemToEdit.website || '';
      form.querySelector('[name="openingHours"]').value = itemToEdit.openingHours || '08:00 - 20:00 WIB';
      form.querySelector('[name="status"]').value = itemToEdit.status || 'Terverifikasi';
    } else {
      titleEl.innerText = '+ Tambah UMKM Baru (Seperti Blog/CMS)';
      form.reset();
      form.querySelector('[name="openingHours"]').value = '08:00 - 20:00 WIB';
      form.querySelector('[name="status"]').value = 'Terverifikasi';
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  bindActionModals() {
    const formUmkm = document.getElementById('form-crud-umkm');
    if (formUmkm) {
      formUmkm.addEventListener('submit', (e) => {
        e.preventDefault();
        const category = formUmkm.querySelector('[name="category"]').value;
        const catObj = window.EKRAF_CATEGORIES.find(c => c.id === category) || { name: 'Kreatif' };

        const payload = {
          id: this.editingItem ? this.editingItem.id : undefined,
          name: formUmkm.querySelector('[name="name"]').value.trim(),
          owner: formUmkm.querySelector('[name="owner"]').value.trim(),
          category: category,
          categoryName: catObj.name,
          description: formUmkm.querySelector('[name="description"]').value.trim(),
          address: formUmkm.querySelector('[name="address"]').value.trim(),
          mapsUrl: formUmkm.querySelector('[name="mapsUrl"]').value.trim(),
          whatsapp: formUmkm.querySelector('[name="whatsapp"]').value.trim(),
          instagram: formUmkm.querySelector('[name="instagram"]').value.trim(),
          website: formUmkm.querySelector('[name="website"]').value.trim(),
          openingHours: formUmkm.querySelector('[name="openingHours"]').value.trim(),
          status: formUmkm.querySelector('[name="status"]').value,
          image: this.editingItem && this.editingItem.image ? this.editingItem.image : 'assets/images/purwokerto_hero_bg.jpg'
        };

        window.EkrafStore.saveUMKM(payload);

        const modal = document.getElementById('modal-cms-crud-umkm');
        modal.classList.remove('open');
        document.body.style.overflow = '';

        if (window.Magic) {
          window.Magic.createBurst(window.innerWidth / 2, window.innerHeight / 2, 25);
          window.Magic.playSuccessJingle();
        }

        this.showToast(this.editingItem ? 'Data UMKM berhasil diperbarui!' : 'UMKM baru berhasil disimpan & langsung tampil di aplikasi!', 'success');
        this.editingItem = null;
      });
    }
  }

  // ==========================================
  // VIEW: BERITA & BLOG EDITOR (PDF P.5)
  // ==========================================
  renderNewsView(mount) {
    const newsList = window.EkrafStore.getNews();

    mount.innerHTML = `
      <div class="cms-header-row">
        <div class="cms-page-title">
          <h2>Editor Berita & Artikel (Ala Blogspot / WordPress)</h2>
          <p>Tulis dan publikasikan warta kegiatan, liputan UMKM, atau pengumuman resmi tanpa menyentuh kode program.</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 2rem;">
        <!-- Blog Composer Box -->
        <div class="blogspot-editor-container">
          <h3 style="font-size: 1.15rem; font-weight: 800; color: #0F172A;">Form Tulis Artikel Baru</h3>
          
          <div class="form-group">
            <label>Judul Artikel</label>
            <input type="text" id="blog-input-title" class="editor-input-title" placeholder="Contoh: Festival Ekonomi Kreatif Purwokerto 2026..." />
          </div>

          <!-- Formatting Toolbar ala Blogspot (PDF page 5) -->
          <div>
            <label style="font-size: 0.82rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.35rem; display: block;">Bilah Alat Format</label>
            <div class="editor-toolbar">
              <button type="button" class="toolbar-btn" data-tool="bold" title="Tebal"><strong>B</strong></button>
              <button type="button" class="toolbar-btn" data-tool="italic" title="Miring"><em>I</em></button>
              <button type="button" class="toolbar-btn" data-tool="link" title="Sisip Link">🔗 Link</button>
              <button type="button" class="toolbar-btn" data-tool="image" title="Sisip Foto">📷 Foto</button>
              <button type="button" class="toolbar-btn" data-tool="quote" title="Kutipan">❝ Quote</button>
              <button type="button" class="toolbar-btn" data-tool="list" title="Daftar Bullet">• List</button>
            </div>
          </div>

          <div class="form-group">
            <label>Isi Artikel / Narasi</label>
            <textarea id="blog-textarea-body" class="editor-textarea" placeholder="Tulis artikel di sini... Kamu bisa memasukkan paragraf, kutipan pelaku usaha, atau deskripsi acara."></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Kategori</label>
              <select id="blog-select-category">
                <option value="Event & Festival">Event & Festival</option>
                <option value="Ekraf News">Ekraf News</option>
                <option value="Teknologi & UMKM">Teknologi & UMKM</option>
                <option value="Kriya & Budaya">Kriya & Budaya</option>
                <option value="Kuliner Tradisional">Kuliner Tradisional</option>
              </select>
            </div>
            <div class="form-group">
              <label>Foto Sampul</label>
              <select id="blog-select-image">
                <option value="assets/images/purwokerto_hero_bg.jpg">Menara Teratai & Gunung Slamet</option>
                <option value="assets/images/purwokerto_festival.jpg">Pesta Kreatif Purwokerto</option>
                <option value="assets/images/purwokerto_kuliner.jpg">Kuliner Tempe Mendoan</option>
                <option value="assets/images/purwokerto_batik.jpg">Batik Tulis Banyumasan</option>
                <option value="assets/images/ekraf_logo.png">Ikon Lambang EKRAF Purwokerto</option>
              </select>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem;">
            <button type="button" class="btn btn-outline" id="btn-save-draft">Simpan Draft</button>
            <button type="button" class="btn btn-gold magic-shimmer-btn" id="btn-publish-blog">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              <span>TERBITKAN (PUBLISH)</span>
            </button>
          </div>
        </div>

        <!-- Published Articles List -->
        <div>
          <div class="cms-card-panel" style="padding: 1.5rem;">
            <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 1rem;">Artikel Terbit (${newsList.length})</h3>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              ${newsList.map(n => `
                <div style="display: flex; gap: 0.75rem; align-items: center; padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light); background: #F8FAFC;">
                  <img src="${n.image}" style="width: 50px; height: 50px; border-radius: 6px; object-fit: cover;" />
                  <div style="flex-grow: 1;">
                    <div style="font-size: 0.85rem; font-weight: 700; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${n.title}</div>
                    <div style="font-size: 0.72rem; color: var(--text-subtle); margin-top: 2px;">${n.date} • ${n.category}</div>
                  </div>
                  <button class="btn-table-action delete btn-delete-news" data-id="${n.id}" title="Hapus">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    // Format toolbar helpers
    const textarea = document.getElementById('blog-textarea-body');
    mount.querySelectorAll('.toolbar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.getAttribute('data-tool');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const sel = textarea.value.substring(start, end);

        let insert = '';
        if (tool === 'bold') insert = `**${sel || 'teks tebal'}**`;
        else if (tool === 'italic') insert = `*${sel || 'teks miring'}*`;
        else if (tool === 'link') insert = `[${sel || 'link tautan'}](https://)`;
        else if (tool === 'image') insert = `\n![Foto Kegiatan](assets/images/purwokerto_hero_bg.jpg)\n`;
        else if (tool === 'quote') insert = `\n> "${sel || 'Kutipan pelaku UMKM Purwokerto'}"\n`;
        else if (tool === 'list') insert = `\n- ${sel || 'Poin artikel'}\n- Poin berikutnya\n`;

        textarea.setRangeText(insert, start, end, 'end');
        textarea.focus();
      });
    });

    // Publish Blog Action
    const btnPublish = document.getElementById('btn-publish-blog');
    if (btnPublish) {
      btnPublish.addEventListener('click', () => {
        const title = document.getElementById('blog-input-title').value.trim();
        const body = document.getElementById('blog-textarea-body').value.trim();
        const cat = document.getElementById('blog-select-category').value;
        const img = document.getElementById('blog-select-image').value;

        if (!title || !body) {
          alert('Mohon isi Judul dan Narasi Artikel sebelum menerbitkan.');
          return;
        }

        const newPost = {
          title,
          date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          author: window.EkrafStore.getRole() === 'admin' ? 'Admin EKRAF Purwokerto' : 'Pelaku UMKM (Bintang)',
          category: cat,
          image: img,
          summary: body.slice(0, 140) + '...',
          content: `<p>${body.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`
        };

        window.EkrafStore.saveNews(newPost);

        if (window.Magic) {
          window.Magic.createBurst(window.innerWidth / 2, window.innerHeight / 2, 30);
          window.Magic.playSuccessJingle();
        }

        this.showToast(`Artikel "${title}" Berhasil Diterbitkan! Langsung tampil di ruang berita publik.`, 'success');
        this.renderNewsView(mount);
      });
    }

    // Delete News
    mount.querySelectorAll('.btn-delete-news').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Hapus artikel ini?')) {
          window.EkrafStore.deleteNews(id);
          this.showToast('Artikel berhasil dihapus.', 'info');
          this.renderNewsView(mount);
        }
      });
    });
  }

  // ==========================================
  // VIEW: MODUL EKRAF ("APP STORE" KECIL - PDF P.7-8)
  // ==========================================
  renderModulesView(mount) {
    const modules = window.EkrafStore.getModules();

    mount.innerHTML = `
      <div class="cms-header-row">
        <div class="cms-page-title">
          <h2>Modul & Fitur Ekosistem EKRAF</h2>
          <p>Konsep "App Store" modular sesuai rancangan. Anda dapat mengaktifkan atau menonaktifkan fitur tanpa perlu merombak ulang aplikasi dari nol.</p>
        </div>
      </div>

      <div class="modules-grid">
        ${modules.map(m => `
          <div class="module-card">
            <div>
              <div class="module-header-row">
                <span class="diagonal-badge ${m.active ? 'diagonal-badge-emerald' : 'diagonal-badge-blue'}" style="font-size: 0.72rem;">
                  <span>${m.active ? 'STATUS: AKTIF' : 'NONAKTIF'}</span>
                </span>
                ${m.required ? `
                  <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-subtle);">MODUL INTI</span>
                ` : `
                  <label class="switch">
                    <input type="checkbox" class="toggle-module-switch" data-id="${m.id}" ${m.active ? 'checked' : ''}>
                    <span class="slider"></span>
                  </label>
                `}
              </div>
              <h3 style="font-size: 1.15rem; font-weight: 700; margin-top: 1rem; color: #0F172A;">${m.name}</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.4rem; line-height: 1.5;">${m.desc}</p>
            </div>
            
            <div style="font-size: 0.75rem; color: var(--text-subtle); border-top: 1px solid var(--bg-secondary); padding-top: 0.75rem;">
              ${m.active ? '🟢 Siap diakses publik warga Purwokerto' : '⚪ Fitur disembunyikan sementara'}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Bind switch toggles
    mount.querySelectorAll('.toggle-module-switch').forEach(sw => {
      sw.addEventListener('change', (e) => {
        const id = sw.getAttribute('data-id');
        const checked = e.target.checked;
        window.EkrafStore.toggleModule(id, checked);
        this.showToast(`Modul diperbarui: ${checked ? 'Diaktifkan' : 'Dinonaktifkan'}`, 'info');
        this.renderModulesView(mount);
      });
    });
  }

  // ==========================================
  // VIEW: PRODUK KATALOG CRUD
  // ==========================================
  renderProductsView(mount) {
    const prods = window.EkrafStore.getProducts();

    mount.innerHTML = `
      <div class="cms-header-row">
        <div class="cms-page-title">
          <h2>Katalog Produk Kreatif Unggulan</h2>
          <p>Kelola etalase produk UMKM Purwokerto yang dapat dipesan langsung oleh masyarakat via WhatsApp.</p>
        </div>
      </div>

      <div class="cms-card-panel">
        <div class="cms-table-wrapper">
          <table class="cms-table">
            <thead>
              <tr>
                <th>Produk</th>
                <th>Kategori</th>
                <th>Harga Satuan</th>
                <th>Stok</th>
                <th>Terjual</th>
              </tr>
            </thead>
            <tbody>
              ${prods.map(p => `
                <tr>
                  <td>
                    <div style="display: flex; gap: 0.75rem; align-items: center;">
                      <img src="${p.image}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover;" />
                      <div>
                        <div style="font-weight: 700;">${p.name}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${p.description || ''}</div>
                      </div>
                    </div>
                  </td>
                  <td><span class="diagonal-badge diagonal-badge-blue" style="font-size: 0.7rem;"><span>${p.category}</span></span></td>
                  <td style="font-weight: 800; color: var(--primary-gold-dark);">Rp ${p.price.toLocaleString('id-ID')}</td>
                  <td>${p.stock} ${p.unit || 'pcs'}</td>
                  <td>${p.sold || 0}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ==========================================
  // VIEW: EVENT CRUD
  // ==========================================
  renderEventsView(mount) {
    const events = window.EkrafStore.getEvents();

    mount.innerHTML = `
      <div class="cms-header-row">
        <div class="cms-page-title">
          <h2>Kalender Event & Pesta Kreatif Kota</h2>
          <p>Kelola jadwal festival, workshop, dan agenda kesenian di Menara Pandang Teratai & Purwokerto.</p>
        </div>
      </div>

      <div class="cms-card-panel">
        <div class="cms-table-wrapper">
          <table class="cms-table">
            <thead>
              <tr>
                <th>Nama Event / Festival</th>
                <th>Tanggal & Waktu</th>
                <th>Lokasi</th>
                <th>Penyelenggara</th>
                <th>Harga Tiket</th>
              </tr>
            </thead>
            <tbody>
              ${events.map(ev => `
                <tr>
                  <td>
                    <div style="font-weight: 700; color: #0F172A;">${ev.title}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${ev.category}</div>
                  </td>
                  <td>${ev.date} (${ev.time})</td>
                  <td style="font-size: 0.85rem;">${ev.location}</td>
                  <td>${ev.organizer}</td>
                  <td><span class="status-pill status-verified"><span>${ev.price}</span></span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ==========================================
  // VIEW: DESTINASI WISATA
  // ==========================================
  renderDestinationsView(mount) {
    const destinations = window.EkrafStore.getDestinations();

    mount.innerHTML = `
      <div class="cms-header-row">
        <div class="cms-page-title">
          <h2>Destinasi & Ruang Kreatif Purwokerto</h2>
          <p>Pusat wisata dan sentra aktivitas warga (Menara Teratai, Baturraden, Kota Lama Banyumas).</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;">
        ${destinations.map(d => `
          <div class="cms-card-panel" style="padding: 1.25rem;">
            <img src="${d.image}" style="width: 100%; height: 160px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 0.75rem;" />
            <span class="diagonal-badge diagonal-badge-gold" style="font-size: 0.7rem; margin-bottom: 0.5rem;"><span>${d.category}</span></span>
            <h4 style="font-size: 1.1rem; font-weight: 700; margin-top: 0.35rem;">${d.name}</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.5rem 0;">${d.description}</p>
            <div style="font-size: 0.75rem; color: var(--sapphire-blue); font-weight: 600;">📍 ${d.location}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ==========================================
  // VIEW: SETTINGS & DATA BACKUP
  // ==========================================
  renderSettingsView(mount) {
    mount.innerHTML = `
      <div class="cms-header-row">
        <div class="cms-page-title">
          <h2>Pengaturan Platform & Cadangan Data</h2>
          <p>Konfigurasi sistem, backup data JSON, dan reset ke seed data Purwokerto bawaan.</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <div class="cms-card-panel" style="padding: 1.75rem;">
          <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.75rem;">Cadangkan & Pulihkan Data (JSON)</h3>
          <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
            Unduh seluruh data UMKM, produk, berita blog, dan event dalam format file JSON agar dapat dipindahkan ke server produksi kapan pun dibutuhkan.
          </p>
          <div style="display: flex; gap: 1rem;">
            <button class="btn btn-blue" id="btn-export-data">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>Download JSON Backup</span>
            </button>
          </div>
        </div>

        <div class="cms-card-panel" style="padding: 1.75rem; border-color: #FEE2E2;">
          <h3 style="font-size: 1.15rem; font-weight: 700; color: #DC2626; margin-bottom: 0.75rem;">Reset ke Data Awal</h3>
          <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
            Kembalikan seluruh isi database lokal ke data awal rekomendasi EKRAF Purwokerto (Mendoan Sawangan, Batik Hadipriyanto, Getuk Goreng Tohirin, dsb).
          </p>
          <button class="btn btn-outline" style="color: #DC2626; border-color: #FCA5A5;" id="btn-reset-defaults">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            <span>Reset Data Sample Purwokerto</span>
          </button>
        </div>
      </div>
    `;

    const btnExport = document.getElementById('btn-export-data');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const json = window.EkrafStore.exportJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ekraf_purwokerto_backup_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('File backup JSON berhasil diunduh.', 'success');
      });
    }

    const btnReset = document.getElementById('btn-reset-defaults');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin mereset seluruh data kembali ke kondisi awal?')) {
          window.EkrafStore.resetToDefaults();
          this.showToast('Data berhasil di-reset ke sample bawaan.', 'info');
        }
      });
    }
  }

  showToast(message, type = 'success') {
    if (window.PublicPortal) {
      window.PublicPortal.showToast(message, type);
    }
  }
}

window.CMS = new CMSController();
