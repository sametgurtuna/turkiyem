# turkiyem

Turkiye Toplu Tasima ve Deprem CLI araci.

AFAD deprem verileri, EGO (Ankara) otobus saatleri ve IETT (Istanbul) hat/saat bilgilerini terminalden sorgulayabilirsiniz.
Open-Meteo ile API key gerektirmeden guncel hava, saatlik tahmin ve hava kalitesi sorgulayabilirsiniz.

## Kurulum

```bash
npm install -g turkiyem
```

Veya yerel olarak:

```bash
git clone <repo-url>
cd turkiyemCLI
npm install
npm link
```

## Gereksinimler

- Node.js 20+

## Kullanim

### Banner ve Yardim

```bash
turkiyem
turkiyem help
```

### Sehir Secimi

Hat sorgulama icin once sehir secmelisiniz:

```bash
turkiyem sehir ankara
turkiyem sehir istanbul
```

### Hat Sorgulama

Secili sehre gore hat bilgilerini sorgular:

```bash
# Ankara (EGO)
turkiyem sehir ankara
turkiyem hat 340

# Istanbul (IETT)
turkiyem sehir istanbul
turkiyem hat 34AS
```

Ankara icin EGO web sitesinden sefer saatleri cekilir.
Istanbul icin once IETT SOAP Planlanan Sefer Saati servisi ile kalkis saatleri getirilir.
SOAP servisi gecici olarak erisilemezse otomatik olarak GTFS ozet verisine dusulur.

Istanbul cikti sirasi:
- Hat bilgileri (GTFS)
- Planlanan sefer saatleri (SOAP)
- SOAP hatasinda: yalnizca GTFS ozet + uyari

### Deprem Sorgulama

AFAD API uzerinden gercek zamanli deprem verileri:

```bash
# Son 24 saat
turkiyem deprem son24

# Son 7 gun
turkiyem deprem 7gun

# Buyukluge gore filtrele (ornegin >= 4.0)
turkiyem deprem buyukluk 4.0
```

Buyuklugu 4.0 ve ustu olan depremler kirmizi ile vurgulanir.

### Hava Durumu ve Hava Kalitesi

Open-Meteo uzerinden API key gerektirmeden sorgu yapar:

```bash
# Secili sehir icin guncel hava
turkiyem hava guncel

# Sehir bazli guncel hava
turkiyem hava guncel istanbul

# Koordinat bazli guncel hava
turkiyem hava guncel 41.0082,28.9784

# Saatlik tahmin (varsayilan 2 gun)
turkiyem hava saatlik istanbul

# Saatlik tahmin gun sayisi (1-7)
turkiyem hava saatlik istanbul --gun 3

# Hava kalitesi
turkiyem hava kalite ankara
```

### Temizleme

Cache ve yapilandirmayi sifirlar:

```bash
turkiyem temizle
```

### Versiyon

```bash
turkiyem --version
```

## Yapilandirma

Secili sehir `~/.turkiyem/config.json` dosyasinda saklanir. Bu dosya otomatik olusturulur.

## Veri Kaynaklari

| Kaynak | Aciklama |
|--------|----------|
| AFAD | Deprem verileri (deprem.afad.gov.tr) |
| EGO | Ankara otobus sefer saatleri (ego.gov.tr) |
| IETT | Istanbul GTFS hat verileri (data.ibb.gov.tr) |
| IETT SOAP | Planlanan sefer saatleri (api.ibb.gov.tr) |
| Open-Meteo | Guncel hava ve saatlik tahmin (api.open-meteo.com) |
| Open-Meteo AQ | Hava kalitesi (air-quality-api.open-meteo.com) |

## npm Publish

1. npm hesabiniza giris yapin:

```bash
npm login
```

2. package.json icindeki `name`, `version`, `author` alanlarini duzenleyin.

3. Yayinlayin:

```bash
npm publish
```

4. Guncelleme icin versiyonu artirin:

```bash
npm version patch
npm publish
```

## Lisans

MIT
