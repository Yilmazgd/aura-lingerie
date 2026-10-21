"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Sparkles,
  FileText,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  PackageSearch,
  LayoutDashboard,
  User,
  MessageSquare
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="border-b border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-2">
              <span className="text-xs tracking-[0.25em] uppercase text-rose-300 font-medium">
                AURA PRIVATE CLUB
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-stone-50 font-normal">
                Yeni Koleksiyonlar ve Özel Davetlerden İlk Siz Haberdar Olun
              </h3>
              <p className="text-sm text-stone-400 font-light max-w-xl">
                Bültenimize kayıt olarak ilk siparişinize özel %10 hoş geldin
                ayrıcalığı ve sezon öncesi sınırlı üretim koleksiyonlara erken
                erişim kazanın.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="bg-stone-800/90 border border-rose-900/50 rounded-xl p-4 flex items-center gap-3 text-stone-100">
                  <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0" />
                  <p className="text-sm font-light">
                    Kaydınız başarıyla alındı. İlk siparişinize özel{" "}
                    <strong className="font-medium text-rose-300">
                      AURA10
                    </strong>{" "}
                    indirim kodunuz e-posta adresinize iletildi.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E-posta adresinizi girin..."
                      className="w-full pl-11 pr-4 py-3.5 bg-stone-800/80 border border-stone-700 rounded-lg text-sm text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-rose-400 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-7 py-3.5 bg-rose-900 hover:bg-rose-800 text-stone-50 text-xs tracking-[0.15em] uppercase font-medium rounded-lg transition-colors shrink-0"
                  >
                    Abone Ol
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-serif tracking-[0.22em] text-stone-50 block">
                AURA
              </span>
              <span className="text-[9px] tracking-[0.38em] text-rose-300 uppercase block -mt-1">
                Lingerie &amp; Lounge
              </span>
            </Link>
            <p className="text-sm text-stone-400 font-light leading-relaxed max-w-sm">
              Saf Mulberry ipeği, sertifikalı organik Pima pamuğu ve zarif
              Fransız dantelleriyle cildinize nefes aldıran zamansız iç giyim ve
              ev giyim koleksiyonları.
            </p>
            <div className="pt-2 space-y-2 text-xs text-stone-400">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-rose-300" />
                <span>Müşteri İlişkileri: 0850 300 28 72 (09:00 - 20:00)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-rose-300" />
                <span>Nişantaşı Showroom, Abdi İpekçi Cad. No: 42 İstanbul</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs tracking-[0.2em] uppercase text-stone-100 font-medium">
              Koleksiyonlar
            </h4>
            <ul className="space-y-2.5 text-sm font-light text-stone-400">
              <li>
                <Link
                  href="/shop?category=Kad%C4%B1n%20%C4%B0%C3%A7%20Giyim"
                  className="hover:text-stone-100 transition-colors"
                >
                  Kadın İç Giyim
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Pijama%20%26%20Ev%20Giyim"
                  className="hover:text-stone-100 transition-colors"
                >
                  Pijama &amp; Ev Giyim
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Erkek%20%C4%B0%C3%A7%20Giyim"
                  className="hover:text-stone-100 transition-colors"
                >
                  Erkek Koleksiyonu
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=%C3%87eyiz%20%26%20%C3%96zel%20Koleksiyon"
                  className="hover:text-stone-100 transition-colors"
                >
                  Çeyiz &amp; Gelin Seçkisi
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=%C4%B0ndirim"
                  className="text-rose-300 hover:text-rose-200 transition-colors"
                >
                  İndirimdekiler
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs tracking-[0.2em] uppercase text-stone-100 font-medium">
              Hesabım &amp; Sipariş Yönetimi
            </h4>
            <ul className="space-y-2.5 text-sm font-light text-stone-400">
              <li>
                <Link
                  href="/account"
                  className="hover:text-stone-100 transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-rose-300 shrink-0" />
                  <span>Müşteri Hesabım (/account)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/order-tracking"
                  className="hover:text-stone-100 transition-colors flex items-center gap-2"
                >
                  <PackageSearch className="w-4 h-4 text-rose-300 shrink-0" />
                  <span>Sipariş Takibi (/order-tracking)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="hover:text-stone-100 transition-colors"
                >
                  Favori Listem (/wishlist)
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-rose-300 hover:text-stone-100 transition-colors flex items-center gap-2 font-medium"
                >
                  <LayoutDashboard className="w-4 h-4 text-rose-300 shrink-0" />
                  <span>Yönetici Paneli (/admin)</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs tracking-[0.2em] uppercase text-stone-100 font-medium">
              Kurumsal &amp; Yasal Bilgiler
            </h4>
            <ul className="space-y-2.5 text-sm font-light text-stone-400">
              <li>
                <Link
                  href="/legal?tab=gizlilik"
                  className="hover:text-stone-100 transition-colors flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-rose-300 shrink-0" />
                  <span>%100 Gizli Paketleme Politikası</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/legal?tab=hijyen"
                  className="hover:text-stone-100 transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-rose-300 shrink-0" />
                  <span>Hijyen Bandı ve İade Şartları</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/legal?tab=sozlesme"
                  className="hover:text-stone-100 transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-rose-300 shrink-0" />
                  <span>Mesafeli Satış Sözleşmesi &amp; KVKK</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/legal?tab=iletisim"
                  className="hover:text-stone-100 transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-rose-300 shrink-0" />
                  <span>Bize Ulaşın (VIP Destek)</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-800/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400 font-light">
          <p>© 2026 AURA Lingerie &amp; Loungewear. Tüm hakları saklıdır.</p>
          <p className="text-stone-400">
            Paket üzerinde marka logosu veya ürün içeriği bilgisi kesinlikle yer
            almaz.
          </p>
        </div>
      </div>
    </footer>
  );
}
