"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Lock,
  ShieldCheck,
  Gift,
  CreditCard,
  CheckCircle2,
  Truck,
  ArrowRight,
  Sparkles,
  PackageSearch,
  UserCheck
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useStore, Order } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";

const FREE_SHIPPING_THRESHOLD = 1000;
const GIFT_BOX_FEE = 49;

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { createOrder } = useStore();
  const { currentUser } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("İstanbul");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");

  const [packagingType, setPackagingType] = useState<"standard" | "gift">(
    "standard"
  );
  const [giftNote, setGiftNote] = useState("");

  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Giriş yapmış kullanıcının kayıtlı profil ve adres bilgilerini otomatik doldur
  useEffect(() => {
    if (currentUser) {
      const parts = currentUser.fullName.trim().split(" ");
      const fName = parts[0] || "";
      const lName = parts.slice(1).join(" ") || "";
      setFirstName((prev) => prev || fName);
      setLastName((prev) => prev || lName);
      setEmail((prev) => prev || currentUser.email);
      setPhone((prev) => prev || currentUser.phone);
      setCity((prev) => prev || currentUser.city || "İstanbul");
      setDistrict((prev) => prev || currentUser.district);
      setAddress((prev) => prev || currentUser.address);
      setCardHolder(
        (prev) => prev || currentUser.fullName.toUpperCase()
      );
    }
  }, [currentUser]);

  const shippingCost =
    totalPrice === 0 || totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 89;
  const packagingCost = packagingType === "gift" ? GIFT_BOX_FEE : 0;
  const grandTotal = totalPrice + shippingCost + packagingCost;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0
    }).format(price);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      setExpiryDate(`${digits.slice(0, 2)}/${digits.slice(2)}`);
    } else {
      setExpiryDate(digits);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder = await createOrder({
      customerName:
        `${firstName} ${lastName}`.trim() || "Değerli Müşterimiz",
      email,
      phone,
      city,
      district,
      address,
      items,
      packagingType,
      giftNote: packagingType === "gift" ? giftNote : undefined,
      subtotal: totalPrice,
      shippingCost,
      packagingCost,
      totalAmount: grandTotal
    });
    setCreatedOrder(newOrder);
    clearCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (createdOrder) {
    return (
      <div className="bg-stone-50 text-stone-900 py-16 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-12 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-rose-900/10 text-rose-900 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9 stroke-[1.75]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs tracking-[0.25em] uppercase text-rose-900 font-medium">
              SİPARİŞİNİZ ONAYLANDI
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 font-normal">
              Teşekkürler, {createdOrder.customerName}
            </h1>
            <p className="text-sm text-stone-600 font-light">
              Sipariş numaranız:{" "}
              <strong className="font-mono font-semibold text-stone-900 bg-stone-100 px-3 py-1 rounded-lg">
                {createdOrder.orderNumber}
              </strong>
            </p>
          </div>

          <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200/80 text-left space-y-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-rose-900 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-stone-700 font-light leading-relaxed">
                <strong className="font-medium text-stone-900 block">
                  %100 Gizli Kargo &amp; Hijyen Bandı Güvencesi
                </strong>
                Siparişiniz dışarıdan içeriği kesinlikle belli olmayan kapalı
                kutuda, gönderici adı yalnızca{" "}
                <strong>&ldquo;Aura Tekstil A.Ş.&rdquo;</strong> olarak
                kargoya teslim edilecektir.
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-sm">
              <span className="text-stone-500">Ödenen Genel Toplam</span>
              <span className="text-lg font-serif font-medium text-stone-900">
                {formatPrice(createdOrder.totalAmount)}
              </span>
            </div>
          </div>

          <div className="bg-rose-900/5 border border-rose-900/20 rounded-2xl p-4 text-xs sm:text-sm text-stone-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <PackageSearch className="w-5 h-5 text-rose-900 shrink-0" />
              <span>
                Siparişinizi{" "}
                <strong className="font-mono text-stone-900">
                  {createdOrder.orderNumber}
                </strong>{" "}
                koduyla anlık takip edebilirsiniz.
              </span>
            </div>
            <Link
              href={`/order-tracking?order=${encodeURIComponent(
                createdOrder.orderNumber
              )}`}
              className="px-4 py-2 bg-stone-900 hover:bg-rose-900 text-stone-50 text-xs tracking-wider uppercase font-medium rounded-xl transition-colors shrink-0"
            >
              Siparişi Takip Et
            </Link>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/account"
              className="inline-flex items-center gap-2 px-6 py-4 bg-white border border-stone-300 hover:border-stone-900 text-stone-900 text-xs tracking-[0.18em] uppercase font-medium rounded-full transition-all"
            >
              <span>Sipariş Geçmişimi Gör</span>
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-rose-900 hover:bg-rose-950 text-stone-50 text-xs tracking-[0.2em] uppercase font-medium rounded-full transition-all shadow-sm"
            >
              <span>Alışverişe Devam Et</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 text-stone-900 py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-8 border-b border-stone-200/80 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs tracking-[0.22em] uppercase text-rose-900 font-medium flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>256-BİT SSL GÜVENLİ ÖDEME</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 mt-1 font-normal">
              Siparişi Tamamla
            </h1>
          </div>

          {currentUser ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
              <UserCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>{currentUser.fullName}</strong> olarak kayıtlı teslimat
                adresiniz otomatik dolduruldu.
              </span>
            </div>
          ) : (
            <Link
              href="/account"
              className="text-xs text-rose-900 hover:underline font-medium"
            >
              Kayıtlı adresinizi kullanmak için Giriş Yapın →
            </Link>
          )}
        </div>

        <form
          onSubmit={handleSubmitOrder}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8"
        >
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-xs space-y-5">
              <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <span className="w-7 h-7 rounded-full bg-rose-900 text-stone-50 text-xs font-medium flex items-center justify-center">
                  1
                </span>
                <h2 className="text-xl font-serif text-stone-900 font-normal">
                  Teslimat &amp; İletişim Bilgileri
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-stone-600 mb-1.5">
                    Adınız *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Örn: Selin"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-rose-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-600 mb-1.5">
                    Soyadınız *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Örn: Yılmaz"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-rose-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-600 mb-1.5">
                    E-posta Adresi *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@eposta.com"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-rose-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-600 mb-1.5">
                    Telefon Numarası *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XX XXX XX XX"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-rose-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-600 mb-1.5">
                    Şehir *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="İstanbul"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-rose-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-600 mb-1.5">
                    İlçe *
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Şişli / Nişantaşı"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-rose-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-stone-600 mb-1.5">
                    Açık Teslimat Adresi *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Mahalle, cadde, sokak, bina ve daire numarası..."
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-rose-900"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-xs space-y-5">
              <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <span className="w-7 h-7 rounded-full bg-rose-900 text-stone-50 text-xs font-medium flex items-center justify-center">
                  2
                </span>
                <h2 className="text-xl font-serif text-stone-900 font-normal">
                  Paketleme Tercihi (İç Giyime Özel)
                </h2>
              </div>

              <div className="space-y-3.5">
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                    packagingType === "standard"
                      ? "border-rose-900 bg-rose-900/5"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="packaging"
                    checked={packagingType === "standard"}
                    onChange={() => setPackagingType("standard")}
                    className="mt-1 text-rose-900 focus:ring-rose-900"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-stone-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-rose-900" />
                        <span>Standart %100 Gizli Paketleme</span>
                      </span>
                      <span className="text-xs font-medium text-rose-900">
                        Ücretsiz
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 font-light mt-1">
                      Dış kutuda marka ve içerik bilgisi yer almaz.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                    packagingType === "gift"
                      ? "border-rose-900 bg-rose-900/5"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="packaging"
                    checked={packagingType === "gift"}
                    onChange={() => setPackagingType("gift")}
                    className="mt-1 text-rose-900 focus:ring-rose-900"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-stone-900 flex items-center gap-1.5">
                        <Gift className="w-4 h-4 text-rose-900" />
                        <span>
                          Özel İpek Kurdeleli Hediye Kutusu + Gizli Dış Kargo
                        </span>
                      </span>
                      <span className="text-xs font-medium text-stone-900">
                        +49 TL
                      </span>
                    </div>
                  </div>
                </label>

                {packagingType === "gift" && (
                  <div className="pt-2 pl-2">
                    <label className="block text-xs text-stone-600 mb-1.5">
                      Hediye Notunuz (İsteğe Bağlı)
                    </label>
                    <textarea
                      rows={2}
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                      placeholder="Özel mühürlü zarf içerisine yazılmasını istediğiniz not..."
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-rose-900 bg-stone-50"
                    />
                  </div>
                )}
              </div>
            </section>

            <section className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-rose-900 text-stone-50 text-xs font-medium flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-xl font-serif text-stone-900 font-normal">
                    Ödeme Bilgileri
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-[11px] font-medium flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-rose-900" />
                  <span>iyzico Korumalı Ödeme</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-stone-600 mb-1.5">
                    Kart Üzerindeki İsim *
                  </label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="AD SOYAD"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-rose-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs text-stone-600 mb-1.5">
                    Kart Numarası *
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="0000 0000 0000 0000"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm font-mono tracking-wider focus:outline-none focus:border-rose-900"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-600 mb-1.5">
                    Son Kullanma Tarihi (AA/YY) *
                  </label>
                  <input
                    type="text"
                    required
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm font-mono focus:outline-none focus:border-rose-900"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-600 mb-1.5">
                    CVV Güvenlik Kodu *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    placeholder="123"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm font-mono focus:outline-none focus:border-rose-900"
                  />
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm sticky top-28 space-y-6">
              <h2 className="text-xl font-serif text-stone-900 border-b border-stone-100 pb-4">
                Sipariş Özeti
              </h2>

              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="flex items-center gap-3.5"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-14 h-16 rounded-lg object-cover bg-stone-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-serif text-stone-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-stone-500">
                        Beden: {item.selectedSize} | Renk: {item.selectedColor}{" "}
                        × {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-serif font-medium text-stone-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-stone-200/80 space-y-2.5 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Ara Toplam</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-rose-900" />
                    <span>Gizli Kargo Ücreti</span>
                  </span>
                  <span>
                    {shippingCost === 0 ? "Ücretsiz" : formatPrice(shippingCost)}
                  </span>
                </div>
                {packagingType === "gift" && (
                  <div className="flex justify-between text-stone-600">
                    <span>İpek Kurdeleli Hediye Kutusu</span>
                    <span>{formatPrice(GIFT_BOX_FEE)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                  <span className="text-base font-medium text-stone-900">
                    Genel Toplam
                  </span>
                  <span className="text-2xl font-serif font-medium text-rose-900">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-rose-900 hover:bg-rose-950 text-stone-50 text-xs tracking-[0.2em] uppercase font-medium rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Siparişi Onayla ve Öde</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 text-center">
                <Sparkles className="w-3.5 h-3.5 text-rose-900 shrink-0" />
                <span>
                  Ekstrenizde ve kargo paketinde sadece &ldquo;Aura Tekstil
                  A.Ş.&rdquo; görünür.
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
