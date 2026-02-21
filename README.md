<p align="center">
  <img src="https://img.shields.io/npm/v/turkiyem?style=for-the-badge&logo=npm&logoColor=white&color=CB3837" alt="npm version" />
  <img src="https://img.shields.io/badge/node-%3E%3D20-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="node" />
  <img src="https://img.shields.io/npm/l/turkiyem?style=for-the-badge&color=blue" alt="license" />
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey?style=for-the-badge" alt="platform" />
</p>

<h1 align="center">🇹🇷 turkiyem</h1>

<p align="center">
  <strong>Türkiye'nin en kapsamlı terminal tabanlı toplu taşıma, deprem, hava durumu ve ekonomi CLI aracı.</strong>
</p>

<p align="center">
  9 şehrin toplu taşıma verileri, güncel nöbetçi eczaneler, AFAD deprem bilgileri, Open-Meteo hava durumu, TCMB döviz kurları — hepsi tek bir <code>npm</code> paketi içinde.
</p>

---

## 📖 İçindekiler

- [Neden turkiyem?](#-neden-turkiyem)
- [Desteklenen Şehirler](#-desteklenen-şehirler)
- [Özellikler](#-özellikler)
- [Kurulum](#-kurulum)
- [Hızlı Başlangıç](#-hızlı-başlangıç)
- [Komut Referansı](#-komut-referansı)
  - [Şehir Seçimi](#şehir-seçimi)
  - [Hat Sorgulama](#hat-sorgulama)
  - [Durak Sorgulama](#durak-sorgulama)
  - [Canlı Konum](#canlı-konum)
  - [Deprem (AFAD)](#deprem-afad)
  - [Hava Durumu & Kalite](#hava-durumu--kalite)
  - [Döviz Kurları (TCMB)](#döviz-kurları-tcmb)
  - [Yardımcı Komutlar](#yardımcı-komutlar)
- [Veri Kaynakları & Lisanslar](#-veri-kaynakları--lisanslar)
- [Mimari & Proje Yapısı](#-mimari--proje-yapısı)
- [Yapılandırma & Önbellek](#-yapılandırma--önbellek)
- [Hata Yönetimi & Güvenilirlik](#-hata-yönetimi--güvenilirlik)
- [Geliştirme](#-geliştirme)
- [Yayınlama (npm)](#-yayınlama-npm)
- [Yol Haritası](#-yol-haritası)
- [Sık Karşılaşılan Sorunlar](#-sık-karşılaşılan-sorunlar)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)

---

## 🎯 Neden turkiyem?

Türkiye'de toplu taşıma verileri onlarca farklı belediye sitesi, API ve veri formatına dağılmış durumda. **turkiyem**, bu dağınık verileri tek bir CLI arayüzü altında birleştirir:

- 🔎 Tarayıcı açmadan **hat ve durak sorgulama**
- 📍 Terminal üzerinden **canlı araç takibi** (İstanbul, Bursa)
- 💊 Anlık **nöbetçi eczane** sorgulama seçenekleri
- 🌍 **Deprem bildirimleri** renkli uyarılarla
- ⛅ **Hava durumu** ve **hava kalitesi** API key gerektirmeden
- 💱 **TCMB döviz kurları** tek komutla
- 🖥️ Sunucu, Raspberry Pi veya herhangi bir terminal ortamında çalışır

---

## 🏙️ Desteklenen Şehirler

| Şehir | Kaynak | Hat | Durak | Canlı Konum | Sefer Saatleri |
|-------|--------|:---:|:-----:|:-----------:|:--------------:|
| **Ankara** | EGO Genel Müdürlüğü | ✅ | — | — | ✅ |
| **İstanbul** | IETT (GTFS + SOAP) | ✅ | — | ✅ | ✅ |
| **Adana** | Adana Büyükşehir Belediyesi | ✅ | ✅ | — | ✅ |
| **Antalya** | Antalya Büyükşehir Belediyesi | ✅ | ✅ | — | ✅ |
| **Bursa** | Burulaş (Bursakart API) | ✅ | ✅ | ✅ | ✅ |
| **İzmir** | ESHOT (GTFS Açık Veri) | ✅ | ✅ | — | ✅ |
| **Trabzon** | Trabzon Büyükşehir Belediyesi | ✅ | — | — | ✅ |
| **Samsun** | Samulaş | ✅ | ✅ | — | ✅ |
| **Mersin** | Mersin Büyükşehir Belediyesi | ✅ | — | — | ✅ |
| **Kayseri** | Sadece Nöbetçi Eczane | — | — | — | — |

> Yeni şehir entegrasyonları için [yol haritasına](#-yol-haritası) bakın.

---

## ✨ Özellikler

### 🚌 Toplu Taşıma (9 Şehir)
- Hat numarası veya adıyla arama
- Durak listesi ve sıralı güzergah görüntüleme
- Sefer saatleri (gün tipi ve yöne göre)
- Durak bazlı geçen hat ve zaman sorgulama
- Birden fazla sonuçta interaktif seçim menüsü

### 💊 Sağlık & Nöbetçi Eczane
- **İzmir** ve **Kayseri** için nöbetçi eczane sorgulama
- İzmir genel eczane arama ve lokasyon bilgisi
- Telefon numarası ve harita bağlantısı gösterimi

### 📍 Canlı Araç Takibi
- **İstanbul (IETT):** Anlık araç konumu, yön, yakın durak bilgisi
- **Bursa (Burulaş):** Plaka, hız, doluluk oranı gösterimi

### 🌍 Deprem Bilgileri (AFAD)
- Son 24 saat / Son 7 gün deprem listesi
- Büyüklüğe göre filtreleme (`turkiyem deprem buyukluk 4.0`)
- ≥ 4.0 büyüklüğündeki depremler için kırmızı uyarı kutusu
- Sayfalı listeleme (15'erli)

### ⛅ Hava Durumu & Kalite (Open-Meteo)
- Güncel sıcaklık, rüzgar, nem
- 1-7 günlük saatlik tahmin + ASCII sıcaklık grafiği
- Hava kalitesi: PM10, PM2.5, CO, NO₂
- Şehir adı veya koordinat ile sorgulama
- **API key gerektirmez**

### 💱 Ekonomi (TCMB)
- Güncel döviz kurları (alış/satış)
- Popüler kurlar veya tüm kurlar gösterimi
- Doğrudan TCMB XML'den çekim

### 🖥️ CLI Deneyimi
- Renkli ve tablo formatında çıktı (`cli-table3`, `chalk`)
- Komut bazlı spinner (`ora`)
- İnteraktif menü sistemi (argümansız `turkiyem` çalıştırıldığında)
- ASCII banner + gradient başlık
- Global şehir yapılandırması (`~/.turkiyem/config.json`)
- Bellek içi önbellek (`node-cache`) ile hızlı tekrar sorgulama

---

## 📦 Kurulum

### Global Kurulum (önerilen)

```bash
npm install -g turkiyem
```

Kurulumdan sonra herhangi bir terminalde:

```bash
turkiyem
```

### Yerel Geliştirme

```bash
git clone https://github.com/<kullanici>/turkiyem.git
cd turkiyem
npm install
npm link   # Global olarak `turkiyem` komutunu aktif eder
```

### Gereksinimler

| Gereksinim | Minimum Versiyon |
|-----------|:----------------:|
| Node.js   | `≥ 20.0.0`       |
| npm       | `≥ 9.0.0`        |

---

## 🚀 Hızlı Başlangıç

```bash
# 1. İnteraktif menüyü aç
turkiyem

# 2. Şehir seç
turkiyem sehir istanbul

# 3. Hat sorgula
turkiyem hat 34AS

# 4. Deprem kontrol
turkiyem deprem son24

# 5. Hava durumu
turkiyem hava guncel

# 6. Döviz kurları
turkiyem doviz
```

---

## 📚 Komut Referansı

### Şehir Seçimi

```bash
turkiyem sehir                # Mevcut seçili şehri göster
turkiyem sehir ankara         # Şehri Ankara olarak ayarla
turkiyem sehir istanbul       # Şehri İstanbul olarak ayarla
turkiyem sehir adana          # Şehri Adana olarak ayarla
turkiyem sehir antalya        # Şehri Antalya olarak ayarla
turkiyem sehir bursa          # Şehri Bursa olarak ayarla
turkiyem sehir izmir          # Şehri İzmir olarak ayarla
turkiyem sehir samsun         # Şehri Samsun olarak ayarla
turkiyem sehir mersin         # Şehri Mersin olarak ayarla
turkiyem sehir kayseri        # Şehri Kayseri olarak ayarla
```

> 💡 `hat` ve `durak` komutları her zaman seçili şehre göre çalışır.

### Hat Sorgulama

```bash
# Ankara (EGO) — Hat bilgisi + gün tipine göre sefer saatleri
turkiyem sehir ankara
turkiyem hat 340

# İstanbul (IETT) — GTFS özeti + SOAP planlanan saatler
turkiyem sehir istanbul
turkiyem hat 34AS

# Adana — Hat bilgisi + sefer saatleri + durak listesi
turkiyem sehir adana
turkiyem hat KM02

# Antalya — Hat güzergahı + gün ve yön bazlı tarife
turkiyem sehir antalya
turkiyem hat KC06

# Bursa (Burulaş) — Hat durakları + yön seçimi
turkiyem sehir bursa
turkiyem hat 17

# İzmir (ESHOT GTFS) — Hat durakları + sefer saatleri
turkiyem sehir izmir
turkiyem hat 34

# Trabzon — Hat bilgisi + kalkış ve dönüş yönlü sefer saatleri
turkiyem sehir trabzon
turkiyem hat 103

# Samsun (Samulaş) — Hat bilgisi + duraklar + kalkış saatleri
turkiyem sehir samsun
turkiyem hat E1

# Mersin — Hat bilgisi + kalkış saatleri
turkiyem sehir mersin
turkiyem hat 11M  # veya 'merkez' yazarak hat seçimi yapabilirsiniz
```

> Birden fazla eşleşen hat varsa interaktif bir seçim menüsü sunulur.

### Sağlık & Nöbetçi Eczane (İzmir / Kayseri)

```bash
turkiyem eczane nobetci          # Seçili şehirdeki tüm nöbetçi eczaneleri listeler
turkiyem eczane nobetci bornova  # Seçili şehirde "bornova" ilçesi için arar
turkiyem eczane ara yusuf        # İzmir'de adı/adresi "yusuf" olan tüm eczaneleri getirir
```

### Durak Sorgulama

```bash
# Adana — Durak detayı + geçen hatlar
turkiyem sehir adana
turkiyem durak 43681

# Antalya — Durak tarifesi (gün ve yön seçimli)
turkiyem sehir antalya
turkiyem durak 1234

# Bursa — Durağa yaklaşan araçlar ve kalan süre
turkiyem sehir bursa
turkiyem durak 5678

# İzmir — Durak araması + geçecek hatlar ve saatler
turkiyem sehir izmir
turkiyem durak konak
```

### Canlı Konum

```bash
# İstanbul (IETT) — Anlık araç konumları
turkiyem sehir istanbul
turkiyem hat canli 34AS          # Özet (aktif araç sayısı, yön dağılımı)
turkiyem hat canli 34AS --detay  # Detay (araç bazlı konum, yakın durak)

# Bursa (Burulaş) — Anlık araç bilgileri
turkiyem sehir bursa
turkiyem hat canli 17            # Plaka, hız, doluluk oranı
```

### Deprem (AFAD)

```bash
turkiyem deprem son24            # Son 24 saat depremleri
turkiyem deprem 7gun             # Son 7 gün depremleri
turkiyem deprem buyukluk 4.0     # ≥ 4.0 büyüklüğündeki depremler
```

> ⚠️ Büyüklüğü ≥ 4.0 olan depremler kırmızı uyarı kutusuyla vurgulanır.

### Hava Durumu & Kalite

```bash
# Seçili şehir
turkiyem hava guncel                    # Güncel hava
turkiyem hava saatlik                   # 2 günlük saatlik tahmin
turkiyem hava kalite                    # Hava kalitesi (PM10, PM2.5, CO, NO₂)

# Şehir adıyla
turkiyem hava guncel istanbul
turkiyem hava saatlik ankara --gun 5    # 5 günlük saatlik tahmin
turkiyem hava kalite izmir

# Koordinatla
turkiyem hava guncel 41.0082,28.9784
```

### Döviz Kurları (TCMB)

```bash
turkiyem doviz           # Popüler kurlar (USD, EUR, GBP vb.)
turkiyem doviz --tum     # Tüm döviz kurları
```

### Yardımcı Komutlar

```bash
turkiyem                 # İnteraktif menü
turkiyem help            # Yardım
turkiyem --version       # Versiyon bilgisi
turkiyem temizle         # Cache ve yapılandırmayı sıfırla
```

---

## 📡 Veri Kaynakları & Lisanslar

| Kaynak | Veri Tipi | Şehir / Modül | Lisans |
|--------|-----------|---------------|--------|
| [AFAD](https://deprem.afad.gov.tr) | Deprem verileri | Tüm Türkiye | Kamu verisi |
| [EGO Genel Müdürlüğü](https://www.ego.gov.tr) | Hat / sefer saatleri | Ankara | Kamu verisi |
| [IETT GTFS](https://data.ibb.gov.tr) | Hat özeti / durak | İstanbul | İBB Açık Veri |
| [IETT SOAP](https://iett.istanbul) | Planlanan saatler, canlı konum | İstanbul | Kamu API |
| [Adana Büyükşehir](https://www.adana.bel.tr) | Hat / durak / tarife | Adana | Kamu verisi |
| [Antalya Büyükşehir](https://www.antalya.bel.tr) | Hat / tarife | Antalya | Kamu verisi |
| [Burulaş (Bursakart)](https://www.bursakart.com.tr) | Hat / durak / canlı konum | Bursa | Kamu API |
| [ESHOT GTFS](https://acikveri.bizizmir.com) | Hat / durak / sefer saatleri | İzmir | İzmir Açık Veri Lisansı |
| [Trabzon Büyükşehir](https://ulasim.trabzon.bel.tr) | Hat / sefer saatleri | Trabzon | Kamu verisi |
| [Samulaş](https://samulas.com.tr) | Hat / durak / sefer saatleri | Samsun | Kamu verisi |
| [Mersin Büyükşehir](https://ulasim.mersin.bel.tr) | Hat / sefer saatleri | Mersin | Kamu API |
| [İzmir BB Açık Veri](https://acikveri.bizizmir.com) | Eczane Bilgileri | İzmir | İzmir Açık Veri Lisansı |
| [Kayseri BB Açık Veri](https://acikveri.kayseri.bel.tr) | Nöbetçi Eczaneler | Kayseri | Kamu API |
| [Open-Meteo](https://open-meteo.com) | Hava durumu, hava kalitesi | Tüm dünya | CC BY 4.0 |
| [TCMB](https://www.tcmb.gov.tr) | Döviz kurları | — | Kamu verisi |

---

## 🏗️ Mimari & Proje Yapısı

```text
turkiyem/
├── src/
│   ├── index.js                    # Commander.js giriş noktası
│   ├── commands/
│   │   ├── sehir.js                # Şehir seçim komutu
│   │   ├── hat.js                  # Hat sorgulama (7 şehir)
│   │   ├── durak.js                # Durak sorgulama (4 şehir)
│   │   ├── deprem.js               # AFAD deprem komutları
│   │   ├── hava.js                 # Hava durumu komutları
│   │   ├── doviz.js                # TCMB döviz komutu
│   │   ├── menu.js                 # İnteraktif menü sistemi
│   │   └── temizle.js              # Cache temizleme
│   ├── services/
│   │   ├── egoService.js           # Ankara EGO API
│   │   ├── iettService.js          # İstanbul IETT GTFS + SOAP
│   │   ├── adanaService.js         # Adana belediye scraping
│   │   ├── antalyaService.js       # Antalya belediye API
│   │   ├── bursaService.js         # Bursa Burulaş API
│   │   ├── izmirService.js         # İzmir ESHOT GTFS
│   │   ├── trabzonService.js       # Trabzon belediyesi açık verisi
│   │   ├── afadService.js          # AFAD deprem API
│   │   ├── weatherService.js       # Open-Meteo API
│   │   └── tcmbService.js          # TCMB döviz XML
│   └── utils/
│       ├── display.js              # Tablo oluşturma fonksiyonları
│       ├── config.js               # Yapılandırma yönetimi
│       ├── cache.js                # Bellek içi önbellek
│       └── banner.js               # ASCII banner & yardım
├── package.json
├── TODO.md                         # Yol haritası
└── README.md                       # Bu dosya
```

### Mimari Prensipler

| Prensip | Açıklama |
|---------|----------|
| **Katmanlı Ayrım** | `commands/` → kullanıcı etkileşimi, `services/` → veri çekimi, `utils/` → ortak yardımcılar |
| **Servis İzolasyonu** | Her şehir / veri kaynağı kendi servis dosyasında izole edilir |
| **Graceful Degradation** | SOAP başarısızsa GTFS'e fallback, ağ hatalarında kullanıcı dostu mesajlar |
| **Önbellek Stratejisi** | Bellek içi TTL tabanlı cache + disk tabanlı GTFS cache (haftalık) |
| **Sıfır Yapılandırma** | API key gerektirmez, kurun ve kullanın |

---

## ⚙️ Yapılandırma & Önbellek

### Yapılandırma Dosyası

```text
~/.turkiyem/config.json
```

```json
{
  "city": "istanbul"
}
```

### Önbellek Katmanları

| Katman | Konum | Süre | Kullanım |
|--------|-------|------|----------|
| **Bellek İçi** | RAM (`node-cache`) | Kaynak bazlı TTL | API yanıtları (hava, deprem vb.) |
| **Disk (GTFS)** | `~/.turkiyem/izmir_gtfs/` | 7 gün | İzmir ESHOT GTFS ZIP (~18 MB) |
| **Disk (IETT)** | `~/.turkiyem/` | Oturum bazlı | İstanbul IETT GTFS |

### Temizleme

```bash
turkiyem temizle          # Tüm cache ve yapılandırmayı sıfırlar
```

---

## 🛡️ Hata Yönetimi & Güvenilirlik

- **Global hata yakalama:** `unhandledRejection` ve `uncaughtException` dinleyicileri
- **API timeout:** Tüm dış isteklerde timeout + anlamlı hata mesajı
- **Fallback mekanizması:** IETT SOAP erişilemezse GTFS özetine otomatik geçiş
- **Ağ hataları:** Bağlantı sorunlarında kullanıcı dostu açıklamalar
- **Veri doğrulama:** Boş veya hatalı veri döndüğünde bilgilendirme mesajı
- **Spinner durumu:** Hata anında spinner durum göstergesinin doğru güncellenmesi

---

## 🔧 Geliştirme

### Ortam Hazırlığı

```bash
git clone https://github.com/<kullanici>/turkiyem.git
cd turkiyem
npm install
npm link
```

### Geliştirme Komutları

```bash
# Doğrudan çalıştır
node src/index.js help
node src/index.js deprem son24
node src/index.js hava guncel istanbul
node src/index.js sehir izmir
node src/index.js hat 34

# npm start ile
npm start
```

### Yeni Şehir Ekleme Rehberi

1. `src/services/<sehir>Service.js` — Veri çekme servisi oluştur
2. `src/utils/display.js` — İlgili tablo fonksiyonlarını ekle
3. `src/commands/hat.js` — `queryYeniSehir()` fonksiyonu ekle
4. `src/commands/durak.js` — Durak desteği varsa `queryYeniSehirStop()` ekle
5. `src/commands/sehir.js` — `SUPPORTED_CITIES` dizisine ekle
6. `src/commands/menu.js` — İnteraktif menüye ekle
7. `README.md` — Dokümantasyonu güncelle

---

## 📤 Yayınlama (npm)

```bash
# 1. Sürüm artır
npm version patch       # 1.6.0 → 1.6.1  (hata düzeltme)
npm version minor       # 1.6.0 → 1.7.0  (yeni özellik)
npm version major       # 1.6.0 → 2.0.0  (breaking change)

# 2. Yayınla
npm publish --access public

# 3. Doğrula
npm view turkiyem version
```

---

## 🗺️ Yol Haritası

Detaylı yol haritası için [`TODO.md`](./TODO.md) dosyasına bakın.

| Özellik | Durum |
|---------|-------|
| Kocaeli GTFS Verileri | 📋 Planlandı |
| Konya GTFS Verileri | 📋 Planlandı |
| Mersin Ulaşım Tarifeleri | ✅ Tamamlandı |
| Samsun Otobüs Bilgileri | ✅ Tamamlandı |
| Trabzon Ulaşım Bilgileri | ✅ Tamamlandı |
| İzmir Nöbetçi Eczane | ✅ Tamamlandı |
| Kayseri Nöbetçi Eczane | ✅ Tamamlandı |
| e-Nabız / e-Sağlık | 📋 Planlandı |

---

## ❓ Sık Karşılaşılan Sorunlar

<details>
<summary><strong><code>npm publish</code> 403 — Aynı sürüm</strong></summary>

Önceden yayınlanmış bir sürüm numarasını tekrar gönderemezsiniz.

```bash
npm version patch
npm publish --access public
```
</details>

<details>
<summary><strong><code>npm publish</code> 403 — 2FA / Token</strong></summary>

NPM hesabınız için 2FA veya granular token gereksinimi olabilir. NPM hesabında token/2FA ayarlarını tamamlayın.
</details>

<details>
<summary><strong>IETT canlı konum 500 hatası</strong></summary>

IETT SOAP servisi geçici olarak erişilemez olabilir. Kısa süre sonra tekrar deneyin.
</details>

<details>
<summary><strong>İzmir GTFS indirme uzun sürüyor</strong></summary>

İlk kullanımda ~18 MB'lık GTFS dosyası indirilir. Bu işlem internet hızınıza bağlı olarak 1-5 dakika sürebilir. İndirme tamamlandıktan sonra veriler 7 gün boyunca önbellekten okunur.
</details>

<details>
<summary><strong>Bursa API 400/415 hatası</strong></summary>

Burulaş API, `Origin` header'ı gerektirir. turkiyem bu header'ı otomatik olarak ekler. Eğer hata devam ediyorsa API tarafında geçici sorun olabilir.
</details>

---

## 🤝 Katkıda Bulunma

1. Bu repoyu **fork** edin
2. Yeni bir **feature branch** oluşturun (`git checkout -b feat/yeni-sehir`)
3. Değişikliklerinizi **commit** edin (`git commit -m 'feat: yeni şehir desteği eklendi'`)
4. Branch'inizi **push** edin (`git push origin feat/yeni-sehir`)
5. Bir **Pull Request** açın

> Her yeni özellik için ilgili servis, komut ve tablo güncellemelerinin birlikte gelmesi beklenir. [Yeni Şehir Ekleme Rehberi](#yeni-şehir-ekleme-rehberi) bölümüne göz atın.

---

## 📄 Lisans

Bu proje [MIT Lisansı](https://opensource.org/licenses/MIT) altında lisanslanmıştır.

---

<p align="center">
  <sub>Built with ❤️ for Türkiye 🇹🇷</sub>
</p>
