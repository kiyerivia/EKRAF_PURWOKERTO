/**
 * EKRAF PURWOKERTO - Supabase Database Client Integration
 * Menghubungkan aplikasi ke cloud PostgreSQL Supabase secara realtime.
 */

const SUPABASE_STORAGE = {
  URL: 'ekraf_supabase_url',
  KEY: 'ekraf_supabase_anon_key'
};

class SupabaseService {
  constructor() {
    this.client = null;
    this.url = localStorage.getItem(SUPABASE_STORAGE.URL) || '';
    this.key = localStorage.getItem(SUPABASE_STORAGE.KEY) || '';
    this.isConnected = false;

    this.init();
  }

  init() {
    if (this.url && this.key && window.supabase) {
      try {
        this.client = window.supabase.createClient(this.url, this.key);
        this.isConnected = true;
        console.log('⚡ Supabase Client initialized successfully!');
        this.syncInitialData();
      } catch (err) {
        console.error('Failed to initialize Supabase client:', err);
        this.isConnected = false;
      }
    } else {
      console.log('ℹ️ Supabase credentials not set or SDK loading. Running on local storage engine.');
    }
  }

  setCredentials(url, key) {
    this.url = url.trim();
    this.key = key.trim();
    localStorage.setItem(SUPABASE_STORAGE.URL, this.url);
    localStorage.setItem(SUPABASE_STORAGE.KEY, this.key);

    if (window.supabase) {
      this.client = window.supabase.createClient(this.url, this.key);
      this.isConnected = true;
      return this.testConnection();
    }
    return Promise.reject(new Error('Supabase SDK belum termuat'));
  }

  disconnect() {
    localStorage.removeItem(SUPABASE_STORAGE.URL);
    localStorage.removeItem(SUPABASE_STORAGE.KEY);
    this.url = '';
    this.key = '';
    this.client = null;
    this.isConnected = false;
  }

  async testConnection() {
    if (!this.client) throw new Error('Supabase client belum dikonfigurasi');
    const { data, error } = await this.client.from('umkm').select('id').limit(1);
    if (error) throw error;
    this.isConnected = true;
    return true;
  }

  // Tarik data dari cloud Supabase ke LocalStorage cache
  async syncInitialData() {
    if (!this.client) return;
    try {
      const [umkmRes, prodRes, eventRes, newsRes] = await Promise.all([
        this.client.from('umkm').select('*'),
        this.client.from('products').select('*'),
        this.client.from('events').select('*'),
        this.client.from('news').select('*')
      ]);

      if (umkmRes.data && umkmRes.data.length > 0) {
        // Map database columns to app format
        const umkmList = umkmRes.data.map(u => ({
          id: u.id,
          name: u.name,
          owner: u.owner,
          category: u.category,
          categoryName: u.category_name,
          description: u.description,
          address: u.address,
          mapsUrl: u.maps_url,
          whatsapp: u.whatsapp,
          instagram: u.instagram,
          website: u.website,
          image: u.image,
          openingHours: u.opening_hours,
          status: u.status,
          rating: u.rating,
          reviewsCount: u.reviews_count
        }));
        localStorage.setItem(STORAGE_KEYS.UMKM, JSON.stringify(umkmList));
      }

      if (prodRes.data && prodRes.data.length > 0) {
        const prodList = prodRes.data.map(p => ({
          id: p.id,
          umkmId: p.umkm_id,
          name: p.name,
          price: p.price,
          category: p.category,
          image: p.image,
          description: p.description,
          stock: p.stock,
          sold: p.sold,
          unit: p.unit
        }));
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(prodList));
      }

      if (eventRes.data && eventRes.data.length > 0) {
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(eventRes.data));
      }

      if (newsRes.data && newsRes.data.length > 0) {
        localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(newsRes.data));
      }

      window.EkrafStore.triggerUpdate('all');
      console.log('✅ Berhasil menyinkronkan data dari Supabase ke aplikasi!');
    } catch (err) {
      console.warn('Gagal sync otomatis dari Supabase:', err);
    }
  }

  // Upload/Migrasi seluruh sample data lokal ke Supabase (1-Click Seed)
  async seedAllToSupabase() {
    if (!this.client) throw new Error('Supabase client belum siap');

    const umkm = window.EkrafStore.getUMKM().map(u => ({
      id: u.id,
      name: u.name,
      owner: u.owner,
      category: u.category,
      category_name: u.categoryName,
      description: u.description,
      address: u.address,
      maps_url: u.mapsUrl || '',
      whatsapp: u.whatsapp || '',
      instagram: u.instagram || '',
      website: u.website || '',
      image: u.image || '',
      opening_hours: u.openingHours || '08:00 - 20:00 WIB',
      status: u.status || 'Terverifikasi',
      rating: u.rating || 4.9,
      reviews_count: u.reviewsCount || 100
    }));

    const products = window.EkrafStore.getProducts().map(p => ({
      id: p.id,
      umkm_id: p.umkmId,
      name: p.name,
      price: p.price,
      category: p.category,
      image: p.image,
      description: p.description,
      stock: p.stock,
      sold: p.sold,
      unit: p.unit
    }));

    const events = window.EkrafStore.getEvents();
    const news = window.EkrafStore.getNews();

    // Upsert to Supabase
    await this.client.from('umkm').upsert(umkm);
    await this.client.from('products').upsert(products);
    await this.client.from('events').upsert(events);
    await this.client.from('news').upsert(news);

    return true;
  }

  // CRUD Sync Methods
  async saveUMKMToCloud(umkmData) {
    if (!this.client) return;
    const dbPayload = {
      id: umkmData.id,
      name: umkmData.name,
      owner: umkmData.owner,
      category: umkmData.category,
      category_name: umkmData.categoryName,
      description: umkmData.description,
      address: umkmData.address,
      maps_url: umkmData.mapsUrl || '',
      whatsapp: umkmData.whatsapp || '',
      instagram: umkmData.instagram || '',
      website: umkmData.website || '',
      image: umkmData.image || '',
      opening_hours: umkmData.openingHours || '08:00 - 20:00 WIB',
      status: umkmData.status || 'Terverifikasi'
    };
    const { error } = await this.client.from('umkm').upsert(dbPayload);
    if (error) console.error('Gagal simpan ke Supabase:', error);
  }

  async deleteUMKMFromCloud(id) {
    if (!this.client) return;
    const { error } = await this.client.from('umkm').delete().eq('id', id);
    if (error) console.error('Gagal hapus di Supabase:', error);
  }

  async saveNewsToCloud(newsData) {
    if (!this.client) return;
    const { error } = await this.client.from('news').upsert(newsData);
    if (error) console.error('Gagal simpan artikel ke Supabase:', error);
  }

  async deleteNewsFromCloud(id) {
    if (!this.client) return;
    const { error } = await this.client.from('news').delete().eq('id', id);
    if (error) console.error('Gagal hapus artikel di Supabase:', error);
  }
}

window.EkrafSupabase = new SupabaseService();
