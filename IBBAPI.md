Özet

IBB CRM kapsaminda IETT hat/durak sorgulari sunan SOAP/ASMX servisi.

Notlar

HatServisi_GYY ve DurakDetay_GYY metotlari hat_kodu ile testte 200 dondu.

Kullanım Senaryoları

Hat bazli durak detayi
CRM entegrasyonlari

HatServisi_GYY: https://api.ibb.gov.tr/iett/ibb/ibb.asmx
DurakDetay_GYY: https://api.ibb.gov.tr/iett/ibb/ibb.asmx



Özet

IETT planlanan sefer saatlerini SOAP/ASMX uzerinden sunan servis.

Notlar

GetPlanlananSeferSaati_json icin HatKodu zorunlu; ornek parametreyle 200 dondu.

Kullanım Senaryoları

Hat bazli sefer saatleri
Toplu tasima zamanlama uygulamalari

GetPlanlananSeferSaati_json: https://api.ibb.gov.tr/iett/UlasimAnaVeri/PlanlananSeferSaati.asmx


Özet

IETT filo durum ve sefer gerceklesme verilerini sunan SOAP/ASMX servisleri.

Notlar

GetFiloAracKonum_json parametresiz 200. GetHatOtoKonum_json icin HatKodu gerekli.

Kullanım Senaryoları

Filo konum takibi
Hat bazli operasyon izleme

GetFiloAracKonum_json:https://api.ibb.gov.tr/iett/FiloDurum/SeferGerceklesme.asmx
GetHatOtoKonum_json:https://api.ibb.gov.tr/iett/FiloDurum/SeferGerceklesme.asmx
GetKazaLokasyon_json:https://api.ibb.gov.tr/iett/FiloDurum/SeferGerceklesme.asmx



Özet

IETT hat, durak ve garaj verilerini SOAP/ASMX ile sunan servis.

Notlar

WSDL aktif. GetHat_json/GetDurak_json cagrilari HatKodu/DurakKodu ile 200 dondu.

Kullanım Senaryoları

Hat ve durak eslestirme
Toplu tasima veri entegrasyonu

GetHat_json:https://api.ibb.gov.tr/iett/UlasimAnaVeri/HatDurakGuzergah.asmx
GetDurak_json:https://api.ibb.gov.tr/iett/UlasimAnaVeri/HatDurakGuzergah.asmx
GetGaraj_json:https://api.ibb.gov.tr/iett/UlasimAnaVeri/HatDurakGuzergah.asmx


