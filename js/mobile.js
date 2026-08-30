/**
 * EKRAF PURWOKERTO - Versi HP (Mobile App Controller)
 * Style: Polygon Hexagonal Abstract • Micro-Animations • Native Mobile UX
 */

class MobileAppController {
  constructor() {
    this.currentTab = 'home';
    this.currentSector = 'all';
    this.searchQuery = '';
    this.selectedItem = null;
    this.appMode = localStorage.getItem('ekraf_app_mode') || (window.innerWidth <= 768 ? 'mobile' : 'web');

    this.init();
  }

  init() {
    this.applyAppMode(this.appMode);
    this.renderStories();
    this.renderHexCategories();
    this.renderHeroSlide();
    this.renderFlashProducts();
    this.renderMobileUMKMFeed();
    this.renderMobileEvents();
    this.bindEvents();

    // Listen to store updates
    window.addEventListener('ekraf_data_changed', () => {
      this.renderFlashProducts();
      this.renderMobileUMKMFeed();
      this.renderMobileEvents();
    });
  }

  applyAppMode(mode) {
    this.appMode = mode;
    localStorage.setItem('ekraf_app_mode', mode);

    const mobileContainer = document.getElementById('mobile-app-view');
    const desktopContainer = document.getElementById('desktop-web-view');
    const floatingSwitcher = document.getElementById('floating-version-toggle');

    if (mode === 'mobile') {
      if (mobileContainer) mobileContainer.style.display = 'block';
      if (desktopContainer) desktopContainer.style.display = 'none';
      if (floatingSwitcher) floatingSwitcher.innerHTML = '<span>💻 Mode Web</span>';
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      if (mobileContainer) mobileContainer.style.display = 'none';
      if (desktopContainer) desktopContainer.style.display = 'block';
      if (floatingSwitcher) floatingSwitcher.innerHTML = '<span>📱 Mode HP (App)</span>';
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }

  toggleAppMode() {
    const nextMode = this.appMode === 'mobile' ? 'web' : 'mobile';
    this.applyAppMode(nextMode);
    if (window.PublicPortal) {
      window.PublicPortal.showToast(`Beralih ke ${nextMode === 'mobile' ? 'Versi HP (Mobile App)' : 'Versi Web (Desktop)'}`, 'info');
    }
  }

  // ==========================================
  // 1. STORY HIGHLIGHTS (Hexagonal Avatars)
  // ==========================================
  renderStories() {
    const container = document.getElementById('mobile-stories-list');
    if (!container) return;

    const stories = [
      { id: 'st-1', name: 'Menara', img: 'assets/images/purwokerto_hero_bg.jpg', tag: 'Live' },
      { id: 'st-2', name: 'Mendoan', img: 'assets/images/mendoan_asli.jpg', tag: 'Viral' },
      { id: 'st-3', name: 'Gethuk', img: 'assets/images/getuk_goreng_asli.jpg', tag: 'Khas' },
      { id: 'st-4', name: 'Baturraden', img: 'assets/images/baturraden_asli.jpg', tag: 'Wisata' },
      { id: 'st-5', name: 'Kopi Pinus', img: 'assets/images/kopi_limpakuwus.jpg', tag: 'Hangout' },
      { id: 'st-6', name: 'Batik', img: 'assets/images/purwokerto_batik.jpg', tag: 'Warisan' },
      { id: 'st-7', name: 'Kenthongan', img: 'assets/images/kenthongan_ebeg.jpg', tag: 'Seni' }
    ];

    container.innerHTML = stories.map(s => `
      <div class="story-item touch-btn" data-story-id="${s.id}">
        <div class="story-hex-avatar">
          <img src="${s.img}" alt="${s.name}" />
        </div>
        <span class="story-title">${s.name}</span>
      </div>
    `).join('');

    container.querySelectorAll('.story-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-story-id');
        const story = stories.find(s => s.id === id);
        if (story) {
          this.openStorySheet(story);
        }
      });
    });
  }

  // ==========================================
  // 2. HEXAGONAL CATEGORY LAUNCHER (17 Subsektor)
  // ==========================================
  renderHexCategories() {
    const grid = document.getElementById('mobile-hex-categories');
    if (!grid) return;

    const categories = [
      { id: 'all', name: 'Semua', icon: '🌟', colorClass: 'hex-bg-gold' },
      { id: 'kuliner', name: 'Kuliner', icon: '🍲', colorClass: 'hex-bg-amber' },
      { id: 'fashion', name: 'Batik & Kaos', icon: '👘', colorClass: 'hex-bg-blue' },
      { id: 'kriya', name: 'Sandal & Kriya', icon: '🪵', colorClass: 'hex-bg-emerald' },
      { id: 'seni-pertunjukan', name: 'Kenthongan', icon: '🥁', colorClass: 'hex-bg-purple' },
      { id: 'film-animasi', name: 'Animasi', icon: '🎬', colorClass: 'hex-bg-rose' },
      { id: 'kafe-kopi', name: 'Kopi Pinus', icon: '☕', colorClass: 'hex-bg-cyan' },
      { id: 'heritage', name: 'Destinasi', icon: '🏛️', colorClass: 'hex-bg-indigo' }
    ];

    grid.innerHTML = categories.map(cat => `
      <button class="hex-cat-btn touch-btn ${this.currentSector === cat.id ? 'active' : ''}" data-cat="${cat.id}">
        <div class="hex-icon-box ${cat.colorClass}">
          <span>${cat.icon}</span>
        </div>
        <span class="hex-cat-label">${cat.name}</span>
      </button>
    `).join('');

    grid.querySelectorAll('.hex-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const catId = btn.getAttribute('data-cat');
        this.currentSector = catId;
        grid.querySelectorAll('.hex-cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderMobileUMKMFeed();
      });
    });
  }

  // ==========================================
  // 3. HERO SLIDE CAROUSEL
  // ==========================================
  renderHeroSlide() {
    const banner = document.getElementById('mobile-hero-banner');
    if (!banner) return;

    banner.innerHTML = `
      <div class="hero-slide-card touch-btn">
        <img src="assets/images/purwokerto_hero_bg.jpg" alt="Menara Teratai Purwokerto" />
        <div class="hero-slide-overlay">
          <span class="hex-badge hex-badge-gold">Ikon Teratai 117m</span>
          <h4>Menara Pandang Teratai Purwokerto</h4>
          <p>Episentrum kebangkitan ekonomi kreatif & ruang kreasi anak muda Banyumas.</p>
        </div>
      </div>
    `;

    banner.querySelector('.hero-slide-card').addEventListener('click', () => {
      const dest = window.EkrafStore.getDestinations().find(d => d.id === 'dest-1');
      if (dest) this.openDetailSheet(dest, 'destinasi');
    });
  }

  // ==========================================
  // 4. FLASH PRODUCTS HORIZONTAL REEL
  // ==========================================
  renderFlashProducts() {
    const reel = document.getElementById('mobile-products-reel');
    if (!reel) return;

    const products = window.EkrafStore.getProducts();

    reel.innerHTML = products.map(p => `
      <div class="product-mini-card touch-btn" data-prod-id="${p.id}">
        <div class="product-mini-img-wrap">
          <img src="${p.image}" alt="${p.name}" loading="lazy" />
          <span class="hex-badge hex-badge-gold product-mini-cat">${p.category}</span>
        </div>
        <div class="product-mini-info">
          <div class="product-mini-title">${p.name}</div>
          <div class="product-mini-price">Rp ${p.price.toLocaleString('id-ID')}</div>
          <button class="poly-action-btn poly-btn-emerald product-mini-btn btn-order-wa" data-prod-id="${p.id}">
            <span>Pesan WA</span>
          </button>
        </div>
      </div>
    `).join('');

    // Bind card click
    reel.querySelectorAll('.product-mini-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-order-wa')) return; // handled separately
        const id = card.getAttribute('data-prod-id');
        const prod = products.find(p => p.id === id);
        if (prod) this.openDetailSheet(prod, 'produk');
      });
    });

    // Bind order WA button
    reel.querySelectorAll('.btn-order-wa').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-prod-id');
        const prod = products.find(p => p.id === id);
        if (prod) this.orderViaWhatsApp(prod);
      });
    });
  }

  // ==========================================
  // 5. DIREKTORI UMKM MOBILE CARD FEED
  // ==========================================
  renderMobileUMKMFeed() {
    const feed = document.getElementById('mobile-umkm-feed');
    if (!feed) return;

    let list = window.EkrafStore.getUMKM();

    // Filter by sector
    if (this.currentSector !== 'all') {
      if (this.currentSector === 'heritage') {
        // show destinations
        this.renderMobileDestinationsFeed(feed);
        return;
      }
      if (this.currentSector === 'kafe-kopi') {
        list = list.filter(u => u.name.toLowerCase().includes('kopi') || u.category === 'kuliner');
      } else {
        list = list.filter(u => u.category === this.currentSector);
      }
    }

    // Filter by search query
    if (this.searchQuery) {
      list = list.filter(u => 
        u.name.toLowerCase().includes(this.searchQuery) ||
        (u.description && u.description.toLowerCase().includes(this.searchQuery)) ||
        (u.address && u.address.toLowerCase().includes(this.searchQuery))
      );
    }

    if (list.length === 0) {
      feed.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem; background: #FFFFFF; border-radius: 16px;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
          <h4 style="font-size: 1rem; font-weight: 700; color: #0F172A;">Tidak ada UMKM ditemukan</h4>
          <p style="font-size: 0.8rem; color: #64748B; margin-top: 0.25rem;">Coba kata kunci lain atau pilih kategori Semua.</p>
        </div>
      `;
      return;
    }

    feed.innerHTML = list.map(u => `
      <div class="mobile-umkm-card touch-btn" data-umkm-id="${u.id}">
        <div class="mobile-umkm-thumb-wrap">
          <img src="${u.image}" alt="${u.name}" loading="lazy" />
          <div class="mobile-umkm-badge-row">
            <span class="hex-badge hex-badge-blue">${u.categoryName || u.category}</span>
            <div class="mobile-umkm-rating">
              <span>★</span>
              <span>${u.rating || 4.9}</span>
            </div>
          </div>
        </div>
        <div class="mobile-umkm-content">
          <div class="mobile-umkm-header">
            <h4 class="mobile-umkm-title">${u.name}</h4>
          </div>
          <p class="mobile-umkm-desc">${u.description || ''}</p>
          <div class="mobile-umkm-footer">
            <div class="mobile-umkm-location">
              <span>📍</span>
              <span>${u.address ? u.address.split(',')[0] : 'Purwokerto'}</span>
            </div>
            <div class="mobile-umkm-actions">
              <button class="btn-mini-action poly-btn-gold touch-btn btn-view-umkm" data-id="${u.id}">
                Lihat Detail
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    feed.querySelectorAll('.mobile-umkm-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-umkm-id');
        const umkm = list.find(u => u.id === id);
        if (umkm) this.openDetailSheet(umkm, 'umkm');
      });
    });
  }

  renderMobileDestinationsFeed(feed) {
    const dests = window.EkrafStore.getDestinations();
    feed.innerHTML = dests.map(d => `
      <div class="mobile-umkm-card touch-btn" data-dest-id="${d.id}">
        <div class="mobile-umkm-thumb-wrap">
          <img src="${d.image}" alt="${d.name}" loading="lazy" />
          <div class="mobile-umkm-badge-row">
            <span class="hex-badge hex-badge-emerald">${d.category}</span>
          </div>
        </div>
        <div class="mobile-umkm-content">
          <h4 class="mobile-umkm-title">${d.name}</h4>
          <p class="mobile-umkm-desc">${d.description || ''}</p>
          <div class="mobile-umkm-footer">
            <div class="mobile-umkm-location">📍 ${d.location}</div>
            <button class="btn-mini-action poly-btn-blue">Eksplorasi</button>
          </div>
        </div>
      </div>
    `).join('');

    feed.querySelectorAll('.mobile-umkm-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-dest-id');
        const dest = dests.find(d => d.id === id);
        if (dest) this.openDetailSheet(dest, 'destinasi');
      });
    });
  }

  // ==========================================
  // 6. EVENT & BERITA LIST
  // ==========================================
  renderMobileEvents() {
    const container = document.getElementById('mobile-events-feed');
    if (!container) return;

    const events = window.EkrafStore.getEvents();
    const news = window.EkrafStore.getNews();

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 0.85rem;">
        ${events.map(ev => `
          <div class="mobile-umkm-card touch-btn" style="border-left: 4px solid #F59E0B;" data-event-id="${ev.id}">
            <div style="display: flex; gap: 0.75rem; padding: 0.85rem;">
              <img src="${ev.image}" style="width: 76px; height: 76px; border-radius: 12px; object-fit: cover;" />
              <div style="flex: 1;">
                <span class="hex-badge hex-badge-gold" style="font-size: 0.65rem;">${ev.category}</span>
                <h4 style="font-size: 0.88rem; font-weight: 800; color: #0F172A; margin: 0.25rem 0;">${ev.title}</h4>
                <div style="font-size: 0.72rem; color: #2563EB; font-weight: 600;">📅 ${ev.date}</div>
              </div>
            </div>
          </div>
        `).join('')}

        <div class="mobile-section-header" style="padding: 0.5rem 0;">
          <h3>📰 Kabar & Warta Ekraf</h3>
        </div>

        ${news.slice(0, 3).map(n => `
          <div class="mobile-umkm-card touch-btn" data-news-id="${n.id}">
            <div style="display: flex; gap: 0.75rem; padding: 0.85rem;">
              <img src="${n.image}" style="width: 76px; height: 76px; border-radius: 12px; object-fit: cover;" />
              <div style="flex: 1;">
                <span class="hex-badge hex-badge-blue" style="font-size: 0.65rem;">${n.category}</span>
                <h4 style="font-size: 0.88rem; font-weight: 800; color: #0F172A; margin: 0.25rem 0;">${n.title}</h4>
                <div style="font-size: 0.72rem; color: #64748B;">✍️ ${n.author || 'Admin'} • ${n.date}</div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    container.querySelectorAll('[data-event-id]').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-event-id');
        const ev = events.find(e => e.id === id);
        if (ev) this.openDetailSheet(ev, 'event');
      });
    });

    container.querySelectorAll('[data-news-id]').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-news-id');
        const item = news.find(n => n.id === id);
        if (item) this.openDetailSheet(item, 'berita');
      });
    });
  }

  // ==========================================
  // 7. BOTTOM SHEET DRAWER (Mobile Modal)
  // ==========================================
  openDetailSheet(item, type) {
    this.selectedItem = item;
    const backdrop = document.getElementById('mobile-bottom-sheet-backdrop');
    const drawer = document.getElementById('mobile-bottom-sheet');
    const titleEl = document.getElementById('sheet-title');
    const bodyEl = document.getElementById('sheet-body');
    const footerEl = document.getElementById('sheet-footer');

    if (!backdrop || !drawer) return;

    if (type === 'umkm') {
      titleEl.innerText = item.name;
      bodyEl.innerHTML = `
        <div style="position: relative; margin: -1.25rem -1.25rem 1rem -1.25rem;">
          <img src="${item.image}" style="width: 100%; height: 200px; object-fit: cover;" />
          <span class="hex-badge hex-badge-blue" style="position: absolute; bottom: 10px; left: 14px;">${item.categoryName || item.category}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <div>
            <div style="font-size: 0.8rem; color: #64748B;">Pemilik / Penanggung Jawab:</div>
            <div style="font-size: 0.95rem; font-weight: 700; color: #0F172A;">${item.owner}</div>
          </div>
          <div style="background: #FEF3C7; color: #B45309; padding: 0.35rem 0.75rem; border-radius: 20px; font-weight: 800; font-size: 0.82rem;">
            ★ ${item.rating || 4.9} (${item.reviewsCount || 100}+ ulasan)
          </div>
        </div>
        <p style="font-size: 0.88rem; color: #334155; line-height: 1.6; margin-bottom: 1rem;">${item.description}</p>
        <div style="background: #F8FAFC; border-radius: 12px; padding: 0.85rem; font-size: 0.8rem; color: #475569; display: flex; flex-direction: column; gap: 0.4rem;">
          <div>📍 <strong>Alamat:</strong> ${item.address || 'Purwokerto, Banyumas'}</div>
          <div>⏰ <strong>Jam Operasional:</strong> ${item.openingHours || '08:00 - 21:00 WIB'}</div>
          <div>📱 <strong>WhatsApp:</strong> ${item.whatsapp || '-'}</div>
        </div>
      `;
      footerEl.innerHTML = `
        <a href="https://wa.me/${item.whatsapp}?text=Halo%20${encodeURIComponent(item.name)},%20saya%20tertarik%20dengan%20produk%20Anda%20melalui%20Aplikasi%20EKRAF%20Purwokerto" target="_blank" class="poly-action-btn poly-btn-emerald" style="flex: 1;">
          <span>💬 Chat WhatsApp</span>
        </a>
        <a href="${item.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(item.name + ' Purwokerto')}`}" target="_blank" class="poly-action-btn poly-btn-blue" style="flex: 1;">
          <span>📍 Buka Maps</span>
        </a>
      `;
    } else if (type === 'produk') {
      titleEl.innerText = item.name;
      bodyEl.innerHTML = `
        <div style="position: relative; margin: -1.25rem -1.25rem 1rem -1.25rem;">
          <img src="${item.image}" style="width: 100%; height: 220px; object-fit: cover;" />
          <span class="hex-badge hex-badge-gold" style="position: absolute; bottom: 10px; left: 14px;">${item.category}</span>
        </div>
        <div style="font-size: 1.35rem; font-weight: 900; color: #D97706; margin-bottom: 0.5rem;">
          Rp ${item.price.toLocaleString('id-ID')}
        </div>
        <p style="font-size: 0.88rem; color: #334155; line-height: 1.6; margin-bottom: 1rem;">${item.description}</p>
        <div style="font-size: 0.8rem; color: #64748B;">
          Stok tersedia: <strong>${item.stock} ${item.unit || 'pcs'}</strong> • Terjual: <strong>${item.sold || 0}</strong>
        </div>
      `;
      footerEl.innerHTML = `
        <button class="poly-action-btn poly-btn-emerald btn-order-wa-detail" style="width: 100%;">
          <span>🛒 Pesan Langsung via WhatsApp</span>
        </button>
      `;
      footerEl.querySelector('.btn-order-wa-detail').addEventListener('click', () => {
        this.orderViaWhatsApp(item);
      });
    } else if (type === 'destinasi' || type === 'event' || type === 'berita') {
      titleEl.innerText = item.title || item.name;
      bodyEl.innerHTML = `
        <div style="position: relative; margin: -1.25rem -1.25rem 1rem -1.25rem;">
          <img src="${item.image}" style="width: 100%; height: 200px; object-fit: cover;" />
          <span class="hex-badge hex-badge-gold" style="position: absolute; bottom: 10px; left: 14px;">${item.category || 'Purwokerto'}</span>
        </div>
        <p style="font-size: 0.88rem; color: #334155; line-height: 1.6; margin-top: 0.5rem;">${item.description || item.summary || ''}</p>
        ${item.content ? `<div style="font-size: 0.85rem; line-height: 1.6; margin-top: 1rem; color: #475569;">${item.content}</div>` : ''}
      `;
      footerEl.innerHTML = `
        <button class="poly-action-btn poly-btn-blue" style="width: 100%;" onclick="window.MobileApp.closeDetailSheet()">
          <span>Tutup</span>
        </button>
      `;
    }

    backdrop.classList.add('active');
    drawer.classList.add('active');
  }

  closeDetailSheet() {
    const backdrop = document.getElementById('mobile-bottom-sheet-backdrop');
    const drawer = document.getElementById('mobile-bottom-sheet');
    if (backdrop) backdrop.classList.remove('active');
    if (drawer) drawer.classList.remove('active');
  }

  openStorySheet(story) {
    this.openDetailSheet({
      name: `Highlight: ${story.name}`,
      category: 'Purwokerto Stories',
      image: story.img,
      description: `Cerita ragam kreativitas dan pesona kebanggaan masyarakat Purwokerto dan Banyumas. Nikmati sajian otentik, kekayaan budaya, serta karya seni lokal terkini.`
    }, 'destinasi');
  }

  orderViaWhatsApp(prod) {
    const umkmList = window.EkrafStore.getUMKM();
    const umkm = umkmList.find(u => u.id === prod.umkmId) || umkmList[0];
    const wa = umkm ? umkm.whatsapp : '6281226789001';
    const text = encodeURIComponent(`Halo, saya ingin memesan produk "${prod.name}" seharga Rp ${prod.price.toLocaleString('id-ID')} melalui Aplikasi Mobile EKRAF Purwokerto. Mohon informasi ketersediaan dan ongkirnya. Terima kasih!`);
    window.open(`https://wa.me/${wa}?text=${text}`, '_blank');
  }

  // ==========================================
  // 8. BIND EVENTS
  // ==========================================
  bindEvents() {
    // Mode Switchers
    const floatingToggle = document.getElementById('floating-version-toggle');
    if (floatingToggle) {
      floatingToggle.addEventListener('click', () => this.toggleAppMode());
    }

    const headerSwitch = document.getElementById('mobile-version-switch-btn');
    if (headerSwitch) {
      headerSwitch.addEventListener('click', () => this.applyAppMode('web'));
    }

    // Search
    const searchInput = document.getElementById('mobile-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderMobileUMKMFeed();
      });
    }

    // Sheet close
    const btnClose = document.getElementById('mobile-sheet-close');
    const backdrop = document.getElementById('mobile-bottom-sheet-backdrop');
    if (btnClose) btnClose.addEventListener('click', () => this.closeDetailSheet());
    if (backdrop) backdrop.addEventListener('click', () => this.closeDetailSheet());

    // Sticky Bottom Tabs
    const tabs = document.querySelectorAll('.mobile-nav-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentTab = target;

        if (target === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (target === 'umkm') {
          const el = document.getElementById('mobile-umkm-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else if (target === 'produk') {
          const el = document.getElementById('mobile-products-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else if (target === 'event') {
          const el = document.getElementById('mobile-events-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else if (target === 'cms') {
          // Switch to CMS
          this.applyAppMode('web');
          const cmsBtn = document.getElementById('btn-mode-cms');
          if (cmsBtn) cmsBtn.click();
        }
      });
    });

    // Mobile FAB (Daftar UMKM)
    const fab = document.getElementById('mobile-fab-register');
    if (fab) {
      fab.addEventListener('click', () => {
        if (window.PublicPortal) {
          window.PublicPortal.openModal('modal-register-umkm');
        }
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.MobileApp = new MobileAppController();
});
