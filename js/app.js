/**
 * EKRAF PURWOKERTO - Public Portal Application Controller
 * Mengatur tampilan publik: Hero, Filter 17 Subsektor, Direktori UMKM,
 * Katalog Produk Unggulan, Event Kota, Destinasi Kreatif, Berita, & Pendaftaran Mandiri.
 */

class PublicPortalApp {
  constructor() {
    this.currentSector = 'all';
    this.searchQuery = '';
    this.selectedUMKM = null;

    this.init();
  }

  init() {
    this.renderCategoryPills();
    this.renderMetrics();
    this.renderUMKMDirectory();
    this.renderFeaturedProducts();
    this.renderEvents();
    this.renderDestinations();
    this.renderNews();
    this.bindEvents();

    // Listen to changes from CMS
    window.addEventListener('ekraf_data_changed', (e) => {
      this.refreshAll();
    });
  }

  refreshAll() {
    this.renderMetrics();
    this.renderUMKMDirectory();
    this.renderFeaturedProducts();
    this.renderEvents();
    this.renderDestinations();
    this.renderNews();
  }

  bindEvents() {
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderUMKMDirectory();
      });
    }

    // Category select dropdown
    const selectCategory = document.getElementById('select-category');
    if (selectCategory) {
      selectCategory.addEventListener('change', (e) => {
        this.currentSector = e.target.value;
        this.updateActivePill(this.currentSector);
        this.renderUMKMDirectory();
      });
    }

    // Reset search
    const resetSearchBtn = document.getElementById('btn-reset-search');
    if (resetSearchBtn) {
      resetSearchBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (selectCategory) selectCategory.value = 'all';
        this.searchQuery = '';
        this.currentSector = 'all';
        this.updateActivePill('all');
        this.renderUMKMDirectory();
      });
    }

    // Public Registration Modal
    const btnOpenRegister = document.getElementById('btn-open-register');
    if (btnOpenRegister) {
      btnOpenRegister.addEventListener('click', () => {
        this.openModal('modal-register-umkm');
      });
    }

    const formRegisterUMKM = document.getElementById('form-public-register-umkm');
    if (formRegisterUMKM) {
      formRegisterUMKM.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handlePublicRegistration(formRegisterUMKM);
      });
    }

    // Close modal triggers
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-backdrop');
        if (modal) modal.classList.remove('open');
      });
    });

    // Close on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
        }
      });
    });
  }

  renderMetrics() {
    const umkmList = window.EkrafStore.getUMKM();
    const products = window.EkrafStore.getProducts();
    const events = window.EkrafStore.getEvents();

    const heroUmkm = document.getElementById('metric-hero-umkm');
    const heroProd = document.getElementById('metric-hero-products');
    const heroEvent = document.getElementById('metric-hero-events');

    if (heroUmkm) heroUmkm.innerText = `${(1240 + umkmList.length).toLocaleString()}+`;
    if (heroProd) heroProd.innerText = `${(320 + products.length).toLocaleString()}+`;
    if (heroEvent) heroEvent.innerText = `${(40 + events.length).toLocaleString()}+`;
  }

  renderCategoryPills() {
    const container = document.getElementById('sector-pills-container');
    const select = document.getElementById('select-category');
    if (!container) return;

    let html = `
      <button class="sector-pill ${this.currentSector === 'all' ? 'active' : ''}" data-sector="all">
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
        <span>Semua Sektor</span>
      </button>
    `;

    let selectOptions = `<option value="all">Semua 17 Subsektor Ekraf</option>`;

    window.EKRAF_CATEGORIES.forEach(cat => {
      html += `
        <button class="sector-pill ${this.currentSector === cat.id ? 'active' : ''}" data-sector="${cat.id}">
          <span>${cat.name}</span>
        </button>
      `;
      selectOptions += `<option value="${cat.id}">${cat.name}</option>`;
    });

    container.innerHTML = html;
    if (select) select.innerHTML = selectOptions;

    // Attach pill click events
    container.querySelectorAll('.sector-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const sector = pill.getAttribute('data-sector');
        this.currentSector = sector;
        this.updateActivePill(sector);
        if (select) select.value = sector;
        this.renderUMKMDirectory();
      });
    });
  }

  updateActivePill(sectorId) {
    document.querySelectorAll('.sector-pill').forEach(p => {
      if (p.getAttribute('data-sector') === sectorId) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
  }

  renderUMKMDirectory() {
    const container = document.getElementById('umkm-grid-container');
    if (!container) return;

    let list = window.EkrafStore.getUMKM();

    // Filter by Sector
    if (this.currentSector !== 'all') {
      list = list.filter(u => u.category === this.currentSector);
    }

    // Filter by Search Query
    if (this.searchQuery) {
      list = list.filter(u => 
        u.name.toLowerCase().includes(this.searchQuery) ||
        u.owner.toLowerCase().includes(this.searchQuery) ||
        u.description.toLowerCase().includes(this.searchQuery) ||
        u.categoryName.toLowerCase().includes(this.searchQuery) ||
        u.address.toLowerCase().includes(this.searchQuery)
      );
    }

    const countEl = document.getElementById('umkm-result-count');
    if (countEl) {
      countEl.innerText = `${list.length} Pelaku Usaha Ditemukan`;
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: #FFFFFF; border-radius: var(--radius-xl); border: 1.5px dashed var(--border-light);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">Tidak Ada UMKM Ditemukan</h3>
          <p style="color: var(--text-muted); max-width: 460px; margin: 0 auto 1.5rem;">
            Coba gunakan kata kunci lain atau pilih sektor berbeda untuk menemukan kreasi lokal Purwokerto.
          </p>
          <button class="btn btn-outline btn-sm" id="btn-reset-filters-empty">
            Reset Pencarian
          </button>
        </div>
      `;
      const btnReset = document.getElementById('btn-reset-filters-empty');
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          this.searchQuery = '';
          this.currentSector = 'all';
          this.updateActivePill('all');
          const searchInput = document.getElementById('search-input');
          const selectCategory = document.getElementById('select-category');
          if (searchInput) searchInput.value = '';
          if (selectCategory) selectCategory.value = 'all';
          this.renderUMKMDirectory();
        });
      }
      return;
    }

    let html = '';
    list.forEach(umkm => {
      const waNumber = umkm.whatsapp ? umkm.whatsapp.replace(/\D/g, '') : '';
      const waMsg = encodeURIComponent(`Halo ${umkm.name}, saya melihat profil usaha Anda di Aplikasi Resmi EKRAF Purwokerto. Saya tertarik untuk mengetahui produk dan layanan Anda.`);
      const waLink = waNumber ? `https://wa.me/${waNumber}?text=${waMsg}` : '#';

      html += `
        <article class="umkm-card magic-tilt" data-id="${umkm.id}">
          <div class="umkm-card-img-wrap">
            <img src="${umkm.image || 'assets/images/purwokerto_hero_bg.jpg'}" alt="${umkm.name}" loading="lazy" />
            <div class="card-category-tag">
              <span class="diagonal-badge diagonal-badge-gold">
                <span>${umkm.categoryName || 'Ekraf'}</span>
              </span>
            </div>
            <div class="card-rating-tag">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="#F59E0B" stroke="#F59E0B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span>${umkm.rating || 4.9}</span>
            </div>
          </div>

          <div class="umkm-card-body">
            <div class="umkm-owner">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>Pemilik: ${umkm.owner}</span>
            </div>
            
            <h3 class="umkm-title">${umkm.name}</h3>
            
            <p class="umkm-desc">${umkm.description}</p>
            
            <div class="umkm-address-info">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${umkm.address}</span>
            </div>
          </div>

          <div class="umkm-card-actions">
            <button class="btn btn-outline btn-sm btn-detail-umkm" data-id="${umkm.id}">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              <span>Profil Lengkap</span>
            </button>
            <a href="${waLink}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm magic-shimmer-btn">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              <span>WhatsApp</span>
            </a>
          </div>
        </article>
      `;
    });

    container.innerHTML = html;

    // Detail button clicks
    container.querySelectorAll('.btn-detail-umkm').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.openUMKMDetailModal(id);
      });
    });
  }

  openUMKMDetailModal(id) {
    const umkm = window.EkrafStore.getUMKM().find(u => u.id === id);
    if (!umkm) return;

    this.selectedUMKM = umkm;
    const modal = document.getElementById('modal-umkm-detail');
    if (!modal) return;

    // Filter products made by this UMKM
    const products = window.EkrafStore.getProducts().filter(p => p.umkmId === umkm.id);

    const waNumber = umkm.whatsapp ? umkm.whatsapp.replace(/\D/g, '') : '';
    const waMsg = encodeURIComponent(`Halo ${umkm.name}, saya membaca profil Anda di Platform EKRAF Purwokerto dan tertarik berkolaborasi/memesan produk.`);
    const waLink = waNumber ? `https://wa.me/${waNumber}?text=${waMsg}` : '#';

    let prodsHtml = '';
    if (products.length > 0) {
      products.forEach(p => {
        prodsHtml += `
          <div style="display: flex; gap: 1rem; align-items: center; padding: 0.85rem; background: #F8FAFC; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
            <img src="${p.image}" alt="${p.name}" style="width: 65px; height: 65px; border-radius: 8px; object-fit: cover;" />
            <div style="flex-grow: 1;">
              <h5 style="font-size: 0.95rem; font-weight: 700;">${p.name}</h5>
              <p style="font-size: 0.8rem; color: var(--text-muted);">${p.description || ''}</p>
              <div style="font-weight: 800; color: var(--primary-gold-dark); font-size: 0.95rem; margin-top: 0.2rem;">
                Rp ${p.price.toLocaleString('id-ID')} <span style="font-size: 0.75rem; font-weight: 500; color: var(--text-subtle);">/${p.unit || 'pcs'}</span>
              </div>
            </div>
            <a href="${waLink}" target="_blank" class="btn btn-sm btn-gold">Pesan</a>
          </div>
        `;
      });
    } else {
      prodsHtml = `<p style="font-size: 0.85rem; color: var(--text-muted); font-style: italic;">Belum ada katalog produk yang diunggah.</p>`;
    }

    const body = modal.querySelector('.modal-body');
    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div style="position: relative; height: 240px; border-radius: var(--radius-lg); overflow: hidden; border: 2px solid var(--border-light);">
          <img src="${umkm.image || 'assets/images/purwokerto_hero_bg.jpg'}" alt="${umkm.name}" style="width: 100%; height: 100%; object-fit: cover;" />
          <div style="position: absolute; bottom: 1rem; left: 1rem;">
            <span class="diagonal-badge diagonal-badge-gold">
              <span>${umkm.categoryName}</span>
            </span>
          </div>
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;">
            <div>
              <h2 style="font-size: 1.7rem; font-weight: 800; color: #0F172A;">${umkm.name}</h2>
              <p style="font-size: 0.9rem; color: var(--primary-gold-dark); font-weight: 700;">Pengelola: ${umkm.owner}</p>
            </div>
            <span class="status-pill status-verified">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              <span>${umkm.status || 'Terverifikasi'}</span>
            </span>
          </div>

          <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.7; margin-top: 1rem;">
            ${umkm.description}
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding: 1.25rem; background: #F1F5F9; border-radius: var(--radius-md);">
          <div>
            <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-subtle);">Jam Operasional</div>
            <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-main); margin-top: 0.2rem;">${umkm.openingHours || '08:00 - 20:00 WIB'}</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-subtle);">Instagram</div>
            <div style="font-size: 0.9rem; font-weight: 600; color: var(--sapphire-blue); margin-top: 0.2rem;">${umkm.instagram || '-'}</div>
          </div>
          <div style="grid-column: 1 / -1;">
            <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-subtle);">Alamat Lengkap</div>
            <div style="font-size: 0.9rem; font-weight: 500; color: var(--text-main); margin-top: 0.2rem;">${umkm.address}</div>
          </div>
        </div>

        <div>
          <h4 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 0.85rem; color: #0F172A;">Katalog Produk & Penawaran</h4>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${prodsHtml}
          </div>
        </div>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <a href="${waLink}" target="_blank" class="btn btn-whatsapp" style="flex: 1;">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            <span>Hubungi via WhatsApp</span>
          </a>
          ${umkm.mapsUrl ? `
            <a href="${umkm.mapsUrl}" target="_blank" class="btn btn-outline" style="flex: 1;">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Petunjuk Arah Google Maps</span>
            </a>
          ` : ''}
        </div>
      </div>
    `;

    this.openModal('modal-umkm-detail');
  }

  renderFeaturedProducts() {
    const container = document.getElementById('featured-products-container');
    if (!container) return;

    const products = window.EkrafStore.getProducts();
    const umkmList = window.EkrafStore.getUMKM();

    let html = '';
    products.slice(0, 6).forEach(p => {
      const parentUmkm = umkmList.find(u => u.id === p.umkmId) || {};
      const waNumber = parentUmkm.whatsapp ? parentUmkm.whatsapp.replace(/\D/g, '') : '';
      const waMsg = encodeURIComponent(`Halo, saya mau memesan produk *${p.name}* (Rp ${p.price.toLocaleString('id-ID')}) dari katalog EKRAF Purwokerto.`);
      const waLink = waNumber ? `https://wa.me/${waNumber}?text=${waMsg}` : '#';

      html += `
        <div class="product-card magic-tilt">
          <div class="product-img-wrap">
            <img src="${p.image || 'assets/images/purwokerto_kuliner.jpg'}" alt="${p.name}" loading="lazy" />
          </div>
          <div class="product-body">
            <span class="product-category-chip">${p.category}</span>
            <h4 class="product-name">${p.name}</h4>
            <div class="product-price">Rp ${p.price.toLocaleString('id-ID')}</div>
            <div class="product-meta-row">
              <span>🏪 ${parentUmkm.name || 'UMKM Binaan'}</span>
              <span>Terjual ${p.sold || 50}+</span>
            </div>
            <a href="${waLink}" target="_blank" class="btn btn-sm btn-gold magic-shimmer-btn" style="margin-top: 0.75rem; width: 100%;">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              <span>Pesan Sekarang</span>
            </a>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  renderEvents() {
    const container = document.getElementById('events-grid-container');
    if (!container) return;

    const events = window.EkrafStore.getEvents();
    let html = '';

    events.forEach(ev => {
      // Split date
      const dateParts = ev.date.split(' ');
      const day = dateParts[0] || '20';
      const month = dateParts[1] || 'SEP';

      html += `
        <div class="event-card magic-tilt">
          <div class="event-img-wrap">
            <img src="${ev.image || 'assets/images/purwokerto_festival.jpg'}" alt="${ev.title}" loading="lazy" />
            <div class="event-date-badge">
              <span class="event-date-day">${day}</span>
              <span class="event-date-month">${month}</span>
            </div>
            <div style="position: absolute; bottom: 1rem; right: 1rem;">
              <span class="diagonal-badge diagonal-badge-blue">
                <span>${ev.category}</span>
              </span>
            </div>
          </div>

          <div class="event-body">
            <h3 class="event-title">${ev.title}</h3>
            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              ${ev.description}
            </p>

            <ul class="event-info-list" style="margin-top: 0.5rem;">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>${ev.date} (${ev.time})</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>${ev.location}</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>Penyelenggara: ${ev.organizer}</span>
              </li>
            </ul>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--bg-secondary);">
              <span style="font-size: 0.95rem; font-weight: 800; color: var(--emerald-green);">${ev.price}</span>
              <button class="btn btn-sm btn-blue btn-rsvp-event" data-title="${ev.title}">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
                <span>Daftar / Info</span>
              </button>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.btn-rsvp-event').forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-title');
        this.showToast(`Pendaftaran minat untuk "${title}" tercatat! Kami akan mengirimkan reminder acara.`, 'info');
      });
    });
  }

  renderDestinations() {
    const container = document.getElementById('destinations-container');
    if (!container) return;

    const destinations = window.EkrafStore.getDestinations();
    let html = '';

    destinations.forEach(d => {
      html += `
        <div class="dest-card">
          <img src="${d.image || 'assets/images/purwokerto_hero_bg.jpg'}" alt="${d.name}" loading="lazy" />
          <div class="dest-card-overlay">
            <span class="diagonal-badge diagonal-badge-white" style="margin-bottom: 0.6rem; align-self: flex-start;">
              <span>${d.category}</span>
            </span>
            <h3>${d.name}</h3>
            <p>${d.description}</p>
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.75rem;">
              ${(d.highlights || []).map(h => `<span style="font-size: 0.72rem; background: rgba(255,255,255,0.22); padding: 0.2rem 0.6rem; border-radius: 12px; backdrop-filter: blur(4px);">${h}</span>`).join('')}
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  renderNews() {
    const container = document.getElementById('news-grid-container');
    if (!container) return;

    const newsList = window.EkrafStore.getNews();
    let html = '';

    newsList.forEach(n => {
      html += `
        <article class="news-card magic-tilt">
          <div class="news-img-wrap">
            <img src="${n.image || 'assets/images/purwokerto_hero_bg.jpg'}" alt="${n.title}" loading="lazy" />
          </div>
          <div class="news-body">
            <div class="news-meta">
              <span>📅 ${n.date}</span>
              <span style="color: var(--primary-gold-dark); font-weight: 700;">${n.category}</span>
            </div>
            <h4 class="news-title">${n.title}</h4>
            <p class="news-summary">${n.summary}</p>
            <button class="btn btn-sm btn-outline btn-read-news" data-id="${n.id}" style="margin-top: auto; align-self: flex-start;">
              <span>Baca Selengkapnya</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>
        </article>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.btn-read-news').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.openNewsModal(id);
      });
    });
  }

  openNewsModal(id) {
    const news = window.EkrafStore.getNews().find(n => n.id === id);
    if (!news) return;

    const modal = document.getElementById('modal-news-detail');
    if (!modal) return;

    const body = modal.querySelector('.modal-body');
    body.innerHTML = `
      <article>
        <span class="diagonal-badge diagonal-badge-gold" style="margin-bottom: 0.75rem;">
          <span>${news.category}</span>
        </span>
        <h2 style="font-size: 1.8rem; font-weight: 800; color: #0F172A; margin: 0.5rem 0 1rem;">${news.title}</h2>
        <div style="display: flex; gap: 1rem; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-light);">
          <span>📅 ${news.date}</span>
          <span>✍ Penulis: ${news.author}</span>
        </div>
        <div style="border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 1.5rem; max-height: 320px;">
          <img src="${news.image}" alt="${news.title}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="font-size: 1rem; line-height: 1.8; color: var(--text-main);" class="article-rich-content">
          ${news.content}
        </div>
      </article>
    `;

    this.openModal('modal-news-detail');
  }

  handlePublicRegistration(form) {
    const name = form.querySelector('[name="name"]').value.trim();
    const owner = form.querySelector('[name="owner"]').value.trim();
    const category = form.querySelector('[name="category"]').value;
    const description = form.querySelector('[name="description"]').value.trim();
    const address = form.querySelector('[name="address"]').value.trim();
    const whatsapp = form.querySelector('[name="whatsapp"]').value.trim();
    const instagram = form.querySelector('[name="instagram"]').value.trim();

    if (!name || !owner || !whatsapp) {
      alert('Mohon lengkapi Nama Usaha, Nama Pemilik, dan Nomor WhatsApp');
      return;
    }

    const catObj = window.EKRAF_CATEGORIES.find(c => c.id === category) || { name: 'Kreatif Purwokerto' };

    // Create new UMKM entry
    const newUmkm = {
      name,
      owner,
      category,
      categoryName: catObj.name,
      description: description || 'Pelaku ekonomi kreatif Purwokerto binaan baru.',
      address: address || 'Purwokerto, Kabupaten Banyumas',
      whatsapp,
      instagram: instagram.startsWith('@') ? instagram : (instagram ? '@' + instagram : ''),
      image: 'assets/images/purwokerto_hero_bg.jpg',
      status: 'Menunggu Verifikasi',
      openingHours: '08:00 - 17:00 WIB',
      isFeatured: false,
      rating: 5.0,
      reviewsCount: 1
    };

    window.EkrafStore.saveUMKM(newUmkm);

    // Close modal
    this.closeModal('modal-register-umkm');
    form.reset();

    // Trigger celebratory sparkles & jingle
    if (window.Magic) {
      window.Magic.createBurst(window.innerWidth / 2, window.innerHeight / 2, 35);
      window.Magic.playSuccessJingle();
    }

    this.showToast(`Pendaftaran UMKM "${name}" Berhasil! Data telah masuk sistem dan menunggu kurasi admin.`, 'success');
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✨' : 'ℹ️'}</span>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 20);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }
}

window.PublicPortal = new PublicPortalApp();
