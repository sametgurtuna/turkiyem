# 📋 TODO — turkiyem CLI Yol Haritası

> Eklenecek özellikler ve entegrasyonlar.  
> Her madde bir milestona karşılık gelir. Tamamlanan maddeler `[x]` ile işaretlenir.

---

## 🚍 Yeni Şehir Entegrasyonları — Toplu Taşıma

### Kocaeli GTFS Verileri
- [ ] Kocaeli ulaşım açık veri kaynağını araştır (GTFS formatında mı?)
- [ ] GTFS dosyalarını indir ve önbelleğe al (`~/.turkiyem/kocaeli_gtfs/`)
- [ ] `kocaeliService.js` servisi oluştur
- [ ] Hat araması, durak listesi, sefer saatleri komutları ekle
- [ ] `turkiyem sehir kocaeli` desteği ekle

### Konya GTFS Verileri
- [ ] Konya Büyükşehir Belediyesi açık veri / GTFS kaynağını araştır
- [ ] GTFS dosyalarını indir ve önbelleğe al (`~/.turkiyem/konya_gtfs/`)
- [ ] `konyaService.js` servisi oluştur
- [ ] Hat araması, durak listesi, sefer saatleri komutları ekle
- [ ] `turkiyem sehir konya` desteği ekle

### Mersin Ulaşım Tarifeleri
- [ ] Mersin Büyükşehir Belediyesi ulaşım veri kaynağını araştır (API / web scraping)
- [ ] `mersinService.js` servisi oluştur
- [ ] Hat ve tarife sorgulama komutları ekle
- [ ] `turkiyem sehir mersin` desteği ekle

### Samsun Otobüs Bilgileri
- [ ] Samsun Büyükşehir Belediyesi toplu taşıma veri kaynağını araştır
- [ ] `samsunService.js` servisi oluştur
- [ ] Hat ve durak bilgi sorgulama komutları ekle
- [ ] `turkiyem sehir samsun` desteği ekle

### Trabzon Ulaşım Bilgileri
- [ ] Trabzon Büyükşehir Belediyesi ulaşım veri kaynağını araştır
- [ ] `trabzonService.js` servisi oluştur
- [ ] Hat ve sefer bilgisi sorgulama komutları ekle
- [ ] `turkiyem sehir trabzon` desteği ekle

---

## 💊 Sağlık Modülleri

### İzmir Nöbetçi Eczane
- [ ] İzmir Eczacı Odası veya İBB açık veri kaynağını araştır
- [ ] `eczaneService.js` servisi oluştur (şehir parametreli)
- [ ] Bölge / ilçe bazlı nöbetçi eczane listesi komutu ekle
- [ ] `turkiyem eczane` komutu ekle (seçili şehre göre)

### Kayseri Nöbetçi Eczane
- [ ] Kayseri Eczacı Odası veya belediye veri kaynağını araştır
- [ ] `eczaneService.js` içine Kayseri desteği ekle
- [ ] İlçe bazlı nöbetçi eczane listesi komutu ekle

### e-Nabız / e-Sağlık Entegrasyonu
- [ ] e-Nabız API erişim yollarını araştır (resmi API, token mekanizması)
- [ ] Kullanıcı kimlik doğrulama akışını tasarla (güvenli token saklama)
- [ ] Randevu sorgulama komutu ekle  
- [ ] Sağlık geçmişi özet komutu ekle
- [ ] `turkiyem saglik` komutu ekle

---

## 🛠️ Genel İyileştirmeler

- [ ] Tüm yeni şehirler için interaktif menüye (`turkiyem`) seçenek ekle
- [ ] Sağlık modülleri için menüye yeni kategori ekle
- [ ] README dokümantasyonunu her yeni modül sonrası güncel tut
- [ ] Birim testleri ekle (en azından servis katmanı için)
- [ ] GitHub Actions CI/CD pipeline kur

---

> **Katkıda bulunmak isteyenler:** Bu listeden bir madde seçip PR açabilir.  
> Her yeni şehir entegrasyonu için `services/` altında ayrı bir servis dosyası,  
> `commands/` altında ilgili komut güncellemesi ve `display.js`'de tablo fonksiyonu eklenmesi beklenir.
