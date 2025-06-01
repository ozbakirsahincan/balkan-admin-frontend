# Balkan Backerei Admin Panel

Modern ve kullanıcı dostu admin paneli - Next.js, Redux Toolkit ve Tailwind CSS ile geliştirilmiştir.

## 🚀 Özellikler

- **Kullanıcı Yönetimi**: Sistem kullanıcılarını ekle, düzenle, sil ve yönet
- **Kategori Yönetimi**: Ürün kategorilerini organize et
- **Ürün Yönetimi**: Ürünleri ekle, düzenle ve stok takibi yap
- **Dashboard**: Genel sistem istatistikleri ve hızlı erişim
- **Güvenli Giriş**: JWT tabanlı kimlik doğrulama
- **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- **Modern UI**: Tailwind CSS ile şık ve kullanışlı arayüz

## 🛠️ Teknolojiler

- **Frontend**: Next.js 15.3.3
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS 4
- **Form Management**: React Hook Form + Yup validation
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 📋 Gereksinimler

- Node.js 18+ 
- npm veya yarn
- Backend API (http://localhost:3001)

## 🚀 Kurulum

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd balkan-admin-frontend
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Ortam değişkenlerini ayarlayın**
```bash
# .env.local dosyası oluşturun
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

5. **Tarayıcıda açın**
```
http://localhost:3000
```

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard sayfaları
│   │   ├── users/        # Kullanıcı yönetimi
│   │   ├── categories/   # Kategori yönetimi
│   │   └── products/     # Ürün yönetimi
│   ├── login/            # Giriş sayfası
│   ├── layout.js         # Ana layout
│   ├── page.js           # Ana sayfa
│   └── providers.js      # Redux Provider
├── components/
│   └── Layout/
│       └── DashboardLayout.js  # Dashboard layout bileşeni
└── lib/
    ├── store.js          # Redux store
    └── features/         # Redux slices
        ├── auth/         # Kimlik doğrulama
        ├── users/        # Kullanıcı yönetimi
        ├── categories/   # Kategori yönetimi
        └── products/     # Ürün yönetimi
```

## 🔐 Kimlik Doğrulama

Sistem JWT tabanlı kimlik doğrulama kullanır:

1. `/login` sayfasından giriş yapın
2. Token otomatik olarak localStorage'da saklanır
3. Korumalı sayfalara erişim için token gereklidir
4. Token süresi dolduğunda otomatik olarak login sayfasına yönlendirilir

## 📊 Kullanıcı Rolleri

- **Admin**: Tüm yetkilere sahip
- **Supervisor**: Sınırlı yönetim yetkileri
- **Clerk**: Temel işlem yetkileri

## 🎨 UI/UX Özellikleri

- **Responsive Design**: Mobil, tablet ve masaüstü uyumlu
- **Dark/Light Mode**: Kullanıcı tercihi (gelecek güncellemede)
- **Loading States**: Tüm işlemler için yükleme göstergeleri
- **Error Handling**: Kullanıcı dostu hata mesajları
- **Form Validation**: Gerçek zamanlı form doğrulama
- **Search & Filter**: Gelişmiş arama ve filtreleme

## 🔧 Geliştirme

### Yeni Sayfa Ekleme

1. `src/app/dashboard/` altında yeni klasör oluşturun
2. `page.js` dosyası ekleyin
3. `DashboardLayout` bileşenini kullanın
4. Gerekirse yeni Redux slice oluşturun

### Yeni Redux Slice Ekleme

1. `src/lib/features/` altında yeni klasör oluşturun
2. Slice dosyasını oluşturun
3. `store.js`'e ekleyin

## 📝 API Entegrasyonu

Backend API endpoint'leri:

- `POST /auth/login` - Giriş
- `GET /users` - Kullanıcı listesi
- `POST /users` - Yeni kullanıcı
- `PUT /users/:id` - Kullanıcı güncelle
- `DELETE /users/:id` - Kullanıcı sil
- `GET /categories` - Kategori listesi
- `POST /categories` - Yeni kategori
- `PUT /categories/:id` - Kategori güncelle
- `DELETE /categories/:id` - Kategori sil
- `GET /products` - Ürün listesi
- `POST /products` - Yeni ürün
- `PUT /products/:id` - Ürün güncelle
- `DELETE /products/:id` - Ürün sil

## 🚀 Production Build

```bash
# Production build oluştur
npm run build

# Production sunucusu başlat
npm start
```

## 🐛 Hata Ayıklama

### Yaygın Sorunlar

1. **API Bağlantı Hatası**: `.env.local` dosyasında API URL'ini kontrol edin
2. **Token Hatası**: localStorage'ı temizleyin ve tekrar giriş yapın
3. **Build Hatası**: `node_modules` klasörünü silin ve `npm install` çalıştırın

### Geliştirme Araçları

- Redux DevTools Extension kullanın
- React Developer Tools kullanın
- Network sekmesinde API çağrılarını kontrol edin

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👥 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

Sorularınız için lütfen iletişime geçin.

---

**Balkan Backerei Admin Panel** - Modern, güvenli ve kullanıcı dostu yönetim paneli.
