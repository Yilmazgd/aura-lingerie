"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Sparkles,
  FileText,
  Phone,
  Mail,
  MapPin,
  Lock,
  CheckCircle2,
  MessageSquare,
  Send
} from "lucide-react";

type LegalTab = "gizlilik" | "hijyen" | "sozlesme" | "iletisim";

function LegalContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as LegalTab | null;

  const [activeTab, setActiveTab] = useState<LegalTab>("gizlilik");

  // İletişim Formu State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState(
    "Beden & Kalıp Danışmanlığı"
  );
  const [contactMessage, setContactMessage] = useState("");
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    if (
      tabParam &&
      ["gizlilik", "hijyen", "sozlesme", "iletisim"].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setContactName("");
    setContactEmail("");
    setContactMessage("");
  };

  const tabs: { id: LegalTab; label: string; icon: React.ElementType }[] = [
    {
      id: "gizlilik",
      label: "Gizli Paketleme & Mahremiyet",
      icon: Lock
    },
    {
      id: "hijyen",
      label: "Hijyen & İade Şartları",
      icon: ShieldCheck
    },
    {
      id: "sozlesme",
      label: "Mesafeli Satış & KVKK",
      icon: FileText
    },
    {
      id: "iletisim",
      label: "Bize Ulaşın (İletişim)",
      icon: MessageSquare
    }
  ];

  return (
    <div className="bg-stone-50 text-stone-900 py-12 lg:py-16 min-h-[80vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs tracking-[0.25em] uppercase text-rose-900 font-medium">
            AURA LINGERIE KURUMSAL GÜVENCE MERKEZİ
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 font-normal">
            Kurumsal İlkeler, Yasal Bilgiler &amp; İletişim
          </h1>
          <p className="text-sm text-stone-600 font-light max-w-2xl mx-auto">
            %100 gizli kargo standartlarımız, hijyen emniyet bandı uygulamamız,
            mesafeli satış sözleşmemiz ve VIP müşteri ilişkileri hattımız.
          </p>
        </div>

        {/* Sekme Başlıkları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  isActive
                    ? "bg-stone-900 text-stone-50 border-stone-900 shadow-md"
                    : "bg-white text-stone-700 border-stone-200 hover:border-rose-900"
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? "text-rose-300" : "text-rose-900"
                  }`}
                />
                <span className="text-xs font-medium tracking-wide">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sekme İçeriği */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-xs">
          {activeTab === "gizlilik" && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <span className="text-xs tracking-[0.2em] uppercase text-rose-900 font-medium">
                  %100 MAHREMİYET STANDARDI
                </span>
                <h2 className="text-2xl font-serif text-stone-900 mt-1">
                  Gizli Paketleme ve Mahremiyet Politikası
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                  <h3 className="text-sm font-serif font-medium text-stone-900">
                    1. Dış Koli ve Kargo Poşeti Gizliliği
                  </h3>
                  <p className="text-xs text-stone-600 font-light leading-relaxed">
                    Siparişleriniz içi görünmeyen, darbe koruyuculu mat dış
                    kutularda sevk edilir. Dış ambalaj üzerinde &ldquo;AURA
                    Lingerie&rdquo;, &ldquo;İç Giyim&rdquo; veya ürün görseli/logosu
                    kesinlikle bulunmaz.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                  <h3 className="text-sm font-serif font-medium text-stone-900">
                    2. Kurye Barkodu ve Fatura Güvenliği
                  </h3>
                  <p className="text-xs text-stone-600 font-light leading-relaxed">
                    Kargo görevlisinin gördüğü teslimat barkodunda ürün içeriği
                    yazmaz. Gönderici unvanı yalnızca kurumsal şirket adımız olan{" "}
                    <strong>&ldquo;Aura Tekstil A.Ş.&rdquo;</strong> olarak yer
                    alır; e-Arşiv faturanız yalnızca şahsi e-posta adresinize
                    iletilir.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                  <h3 className="text-sm font-serif font-medium text-stone-900">
                    3. Banka Ekstresi Mahremiyeti
                  </h3>
                  <p className="text-xs text-stone-600 font-light leading-relaxed">
                    Kredi kartı veya banka kartı hesap özetinizde işlem açıklaması
                    yalnızca <strong>&ldquo;AURA TEKSTİL İSTANBUL&rdquo;</strong>{" "}
                    olarak görünür. Ev veya iş yeri adresinize gönül rahatlığıyla
                    sipariş verebilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "hijyen" && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <span className="text-xs tracking-[0.2em] uppercase text-rose-900 font-medium">
                  STERİL PAKETLEME &amp; KOŞULSUZ MEMNUNİYET
                </span>
                <h2 className="text-2xl font-serif text-stone-900 mt-1">
                  Hijyen Kuralları ve İade / Değişim Şartları
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                  <h3 className="text-base font-serif font-medium text-stone-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-rose-900" />
                    <span>
                      Pijama, Sabahlık, Ev Giyim ve Üst Grup Ürünlerde 14 Gün
                      Koşulsuz İade
                    </span>
                  </h3>
                  <p>
                    Saf ipek pijama takımları, gelin sabahlıkları, kaşmir/modal
                    ev takımları, büstiyer ve bralet üst gruplarında teslimat
                    tarihinden itibaren <strong>14 gün</strong> içerisinde
                    etiketleri koparılmamış ve yıkanmamış olması koşuluyla
                    ücretsiz beden değişimi veya tam ücret iadesi
                    yapabilirsiniz.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                  <h3 className="text-base font-serif font-medium text-stone-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-rose-900" />
                    <span>
                      Alt İç Giyim Grubunda Hijyen Emniyet Bandı Kuralı
                    </span>
                  </h3>
                  <p>
                    AURA Lingerie&apos;den satın aldığınız her alt iç giyim
                    ürünü, atölyemizde el değmeden dezenfekte edilerek özel{" "}
                    <strong>Koruyucu Hijyen Emniyet Bandı</strong> ile
                    mühürlenir. Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15.
                    maddesi uyarınca; sağlık ve hijyen açısından yalnızca{" "}
                    <strong>
                      koruyucu hijyen bandı açılmamış, sökülmemiş ve denenmemiş
                    </strong>{" "}
                    alt grup ürünlerinde değişim ve iade kabul edilmektedir.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "sozlesme" && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <span className="text-xs tracking-[0.2em] uppercase text-rose-900 font-medium">
                  6502 SAYILI KANUN &amp; 6698 SAYILI KVKK
                </span>
                <h2 className="text-2xl font-serif text-stone-900 mt-1">
                  Mesafeli Satış Sözleşmesi &amp; KVKK Aydınlatma Özeti
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                  <h3 className="text-sm font-serif font-medium text-stone-900">
                    Madde 1 — Taraflar ve Konu
                  </h3>
                  <p>
                    İşbu Mesafeli Satış Sözleşmesi, satıcı{" "}
                    <strong>Aura Tekstil A.Ş.</strong> (Abdi İpekçi Cad. No: 42
                    Nişantaşı/İstanbul) ile elektronik ortamda sipariş veren
                    Alıcı arasında, 6502 sayılı Tüketicinin Korunması Hakkında
                    Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri
                    uyarınca düzenlenmiştir.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                  <h3 className="text-sm font-serif font-medium text-stone-900">
                    Madde 2 — Sevkiyat, Teslimat ve Cayma Hakkı
                  </h3>
                  <p>
                    Sipariş konusu ürünler, Alıcı&apos;nın belirttiği adrese en
                    geç 24-48 saat içerisinde gizli paketleme standardıyla
                    kargoya teslim edilir. Alıcı, hijyen koruma bandı
                    bozulmamış ürünlerde 14 (ondört) gün içinde herhangi bir
                    gerekçe göstermeksizin cayma hakkına sahiptir.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                  <h3 className="text-sm font-serif font-medium text-stone-900">
                    Madde 3 — Kişisel Verilerin Korunması (KVKK)
                  </h3>
                  <p>
                    6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında
                    müşterilerimizin kimlik, iletişim ve teslimat bilgileri
                    yalnızca sipariş teslimatı ve faturalandırma amacıyla
                    işlenir; üçüncü şahıslarla reklam veya pazarlama amacıyla
                    kesinlikle paylaşılmaz. Ödeme işlemleri 256-Bit SSL ve
                    iyzico PCI-DSS güvenlik altyapısıyla gerçekleştirilir.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "iletisim" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 space-y-5">
                <div>
                  <span className="text-xs tracking-[0.2em] uppercase text-rose-900 font-medium">
                    VIP MÜŞTERİ İLİŞKİLERİ
                  </span>
                  <h2 className="text-2xl font-serif text-stone-900 mt-1">
                    Bize Ulaşın
                  </h2>
                  <p className="text-xs text-stone-500 font-light mt-1">
                    Beden ve kupa ölçüsü danışmanlığı, çeyiz seti hazırlığı veya
                    sipariş sorularınız için ekibimiz yanınızda.
                  </p>
                </div>

                <div className="space-y-3 text-xs text-stone-700">
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center gap-3">
                    <Phone className="w-5 h-5 text-rose-900 shrink-0" />
                    <div>
                      <strong className="block text-stone-900">
                        Müşteri Destek &amp; WhatsApp VIP Hattı
                      </strong>
                      <span>0850 300 28 72 • +90 (532) 300 28 72</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center gap-3">
                    <Mail className="w-5 h-5 text-rose-900 shrink-0" />
                    <div>
                      <strong className="block text-stone-900">
                        Kurumsal E-posta
                      </strong>
                      <span>concierge@auralingerie.com.tr</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-rose-900 shrink-0" />
                    <div>
                      <strong className="block text-stone-900">
                        Nişantaşı Özel Randevu Showroom
                      </strong>
                      <span>
                        Abdi İpekçi Cad. No: 42 Kat: 2 Şişli / İstanbul
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                {contactSent ? (
                  <div className="bg-stone-50 rounded-2xl border border-rose-900/30 p-8 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-rose-900 mx-auto" />
                    <h3 className="text-xl font-serif text-stone-900">
                      Mesajınız Stil Danışmanımıza İletildi
                    </h3>
                    <p className="text-xs text-stone-600 font-light max-w-md mx-auto">
                      Müşteri ilişkileri ekibimiz en geç 2 saat içerisinde
                      e-posta adresiniz üzerinden size dönüş sağlayacaktır.
                    </p>
                    <button
                      type="button"
                      onClick={() => setContactSent(false)}
                      className="px-6 py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider rounded-xl"
                    >
                      Yeni Mesaj Gönder
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleContactSubmit}
                    className="bg-stone-50 p-6 rounded-2xl border border-stone-200/80 space-y-4"
                  >
                    <h3 className="text-base font-serif text-stone-900">
                      Hızlı İletişim &amp; Stil Danışmanlığı Formu
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs text-stone-600 mb-1">
                          Adınız Soyadınız *
                        </label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Selin Yılmaz"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-stone-600 mb-1">
                          E-posta Adresiniz *
                        </label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="ornek@eposta.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-stone-600 mb-1">
                        Konu *
                      </label>
                      <select
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs"
                      >
                        <option value="Beden & Kalıp Danışmanlığı">
                          Beden &amp; Kupa Ölçüsü Danışmanlığı
                        </option>
                        <option value="Sipariş & Gizli Kargo Durumu">
                          Sipariş &amp; Gizli Kargo Durumu
                        </option>
                        <option value="İade & Değişim Talebi">
                          İade &amp; Değişim Talebi
                        </option>
                        <option value="Çeyiz & Özel Hediye Paketi">
                          Çeyiz &amp; Özel Hediye Paketi Talebi
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-stone-600 mb-1">
                        Mesajınız *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Sorunuzu veya talebinizi buraya yazabilirsiniz..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-rose-900 hover:bg-rose-950 text-stone-50 text-xs tracking-wider uppercase font-medium rounded-xl transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Mesajı Gönder</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LegalPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm text-stone-500">
          Kurumsal bilgiler yükleniyor...
        </div>
      }
    >
      <LegalContent />
    </Suspense>
  );
}
