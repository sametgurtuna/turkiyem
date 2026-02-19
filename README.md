# turkiyem

Türkiye için modern, terminal tabanlı bir **toplu taşıma + deprem + hava durumu** CLI aracı.

`turkiyem`; AFAD deprem verileri, EGO (Ankara) hat saatleri, IETT (İstanbul) hat bilgileri / planlanan sefer saatleri / canlı konum akışları ve Open-Meteo hava verilerini tek komutta toplar.

## İçindekiler

- [Özellikler](#özellikler)
- [Kurulum](#kurulum)
- [Hızlı Başlangıç](#hızlı-başlangıç)
- [Komut Referansı](#komut-referansı)
- [Veri Kaynakları](#veri-kaynakları)
- [Mimari ve Proje Yapısı](#mimari-ve-proje-yapısı)
- [Yapılandırma ve Cache](#yapılandırma-ve-cache)
- [Hata Yönetimi](#hata-yönetimi)
- [Geliştirme](#geliştirme)
- [Yayınlama (npm)](#yayınlama-npm)
- [Sık Karşılaşılan Sorunlar](#sık-karşılaşılan-sorunlar)
- [Lisans](#lisans)

## Özellikler

- **Deprem (AFAD):**
  - Son 24 saat / son 7 gün deprem listesi
  - Büyüklüğe göre filtreleme
  - `>= 4.0` depremler için renkli vurgu
- **Toplu taşıma (Ankara / EGO):**
  - Hat bilgileri
  - Gün tipine göre sefer saatleri (Hafta içi / Cumartesi / Pazar)
- **Toplu taşıma (İstanbul / IETT):**
  - GTFS tabanlı hat özeti
  - SOAP tabanlı planlanan sefer saatleri
  - SOAP başarısız olduğunda GTFS özete otomatik fallback
  - `hat canli` ile canlı araç konumu (servis erişimine bağlı)
- **Hava durumu (Open-Meteo):**
  - API key gerektirmeden güncel hava
  - Saatlik tahmin (1-7 gün)
  - Hava kalitesi (PM10, PM2.5, CO, NO2)
- **CLI UX:**
  - Komut bazlı spinner
  - Tablo tabanlı okunabilir terminal çıktısı
  - Global şehir ayarı (`~/.turkiyem/config.json`)
  - Bellek içi cache ile performans optimizasyonu

## Kurulum

### Global (önerilen)

```bash
npm install -g turkiyem
```

### Yerel geliştirme

```bash
git clone <repo-url>
cd turkiyemCLI
npm install
npm link
```

### Gereksinim

- Node.js `20+`

## Hızlı Başlangıç

```bash
turkiyem
turkiyem sehir istanbul
turkiyem hat 34AS
turkiyem deprem son24
turkiyem hava guncel
```

## Komut Referansı

### Genel

```bash
turkiyem
turkiyem help
turkiyem --version
turkiyem temizle
```

### Şehir seçimi

```bash
turkiyem sehir ankara
turkiyem sehir istanbul
```

> `hat` komutları seçili şehre göre çalışır.

### Hat sorgulama

```bash
# Ankara (EGO)
turkiyem sehir ankara
turkiyem hat 340

# İstanbul (IETT)
turkiyem sehir istanbul
turkiyem hat 34AS
```

İstanbul akışı:
- 1) GTFS hat özeti
- 2) SOAP planlanan sefer saatleri
- 3) SOAP erişilemezse GTFS özeti + bilgilendirme mesajı

### IETT canlı konum

```bash
# Özet çıktı
turkiyem hat canli 34AS

# Detay çıktı
turkiyem hat canli 34AS --detay
```

> Not: Canlı konum sadece `istanbul` şehir seçiliyken anlamlıdır ve servis erişimine bağlıdır.

### Deprem (AFAD)

```bash
turkiyem deprem son24
turkiyem deprem 7gun
turkiyem deprem buyukluk 4.0
```

### Hava durumu ve hava kalitesi (Open-Meteo)

```bash
# Seçili şehir
turkiyem hava guncel

# Şehir adıyla
turkiyem hava guncel istanbul
turkiyem hava saatlik ankara --gun 3
turkiyem hava kalite izmir

# Koordinatla
turkiyem hava guncel 41.0082,28.9784
```

## Veri Kaynakları

| Kaynak | Kullanım |
|---|---|
| AFAD | Deprem verileri |
| EGO | Ankara hat/sefer saatleri |
| IETT GTFS | İstanbul hat özeti |
| IETT SOAP (PlanlananSeferSaati) | İstanbul planlanan sefer saatleri |
| IETT SOAP (SeferGerceklesme) | İstanbul canlı araç konumu |
| Open-Meteo Forecast | Güncel hava + saatlik tahmin |
| Open-Meteo Air Quality | Hava kalitesi |

## Mimari ve Proje Yapısı

```text
src/
  commands/   # CLI komut handler'ları
  services/   # Dış API / scraping / SOAP katmanı
  utils/      # Tablo, cache, config, banner yardımcıları
  index.js    # Commander giriş noktası
```

Mimari prensipleri:
- Komut katmanı ile servis katmanı ayrımı
- API bağımlılıklarının servis içinde izole edilmesi
- Tekrarlanan işlerin util katmanına alınması
- Tüm dış isteklerde timeout + anlamlı hata mesajı

## Yapılandırma ve Cache

- Seçili şehir dosyası:
  - `~/.turkiyem/config.json`
- Varsayılan cache:
  - Bellek içi (`node-cache`)
  - Kaynak bazlı TTL (ör. IETT SOAP, hava durumu vb.)

Temizleme:

```bash
turkiyem temizle
```

## Hata Yönetimi

Projede:
- `unhandledRejection` ve `uncaughtException` yakalanır
- API hataları kullanıcı dostu mesajlara çevrilir
- Ağ timeout / bağlantı sorunları için özel açıklamalar verilir
- Erişilemeyen kaynaklarda mümkün olan yerlerde fallback uygulanır

## Geliştirme

```bash
npm install
npm start
```

Örnek geliştirme doğrulama komutları:

```bash
node src/index.js help
node src/index.js deprem son24
node src/index.js hava guncel istanbul
node src/index.js hat 34AS
```

## Yayınlama (npm)

```bash
# 1) sürüm artır
npm version patch

# 2) publish
npm publish --access public

# 3) kontrol
npm view turkiyem version
```

## Sık Karşılaşılan Sorunlar

### `npm publish` 403 (aynı sürüm)
Önceden yayınlanmış bir sürüm numarasını tekrar gönderemezsiniz.  
Çözüm: `npm version patch|minor|major` sonrası tekrar publish.

### `npm publish` 403 (2FA / token)
NPM hesabınız için 2FA veya granular token gereksinimi olabilir.  
Çözüm: NPM hesabında token/2FA ayarlarını tamamlayın.

### IETT canlı konum 500
SOAP servis tarafı geçici olarak hata döndürebilir.  
Bu durumda kısa süre sonra tekrar deneyin.

## Lisans

MIT
