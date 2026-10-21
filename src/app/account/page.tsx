"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Package,
  LogOut,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Gift,
  PackageSearch
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";

export default function AccountPage() {
  const {
    currentUser,
    loginCustomer,
    registerCustomer,
    loginDemoCustomer,
    updateCustomerProfile,
    logoutCustomer
  } = useAuth();
  const { orders } = useStore();

  // Giriş / Kayıt Sekmesi
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regCity, setRegCity] = useState("İstanbul");
  const [regDistrict, setRegDistrict] = useState("");
  const [regAddress, setRegAddress] = useState("");

  // Hesabım İçi Sekme ("profile" | "orders")
  const [accountTab, setAccountTab] = useState<"profile" | "orders">("profile");

  // Profil ve Adres Güncelleme State
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileCity, setProfileCity] = useState("İstanbul");
  const [profileDistrict, setProfileDistrict] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.fullName);
      setProfileEmail(currentUser.email);
      setProfilePhone(currentUser.phone);
      setProfileCity(currentUser.city || "İstanbul");
      setProfileDistrict(currentUser.district || "");
      setProfileAddress(currentUser.address || "");
    }
  }, [currentUser]);

  // Kullanıcının e-postasına, telefonuna veya adına ait siparişleri filtrele
  const myOrders = useMemo(() => {
    if (!currentUser) return [];
    const userEmail = currentUser.email.trim().toLowerCase();
    const userPhoneDigits = currentUser.phone.replace(/\D/g, "");
    const userName = currentUser.fullName.trim().toLowerCase();

    return orders.filter((ord) => {
      const ordEmail = (ord.email || "").trim().toLowerCase();
      const ordPhoneDigits = (ord.phone || "").replace(/\D/g, "");
      const ordName = (ord.customerName || "").trim().toLowerCase();

      return (
        (userEmail && ordEmail === userEmail) ||
        (userPhoneDigits.length >= 7 && ordPhoneDigits === userPhoneDigits) ||
        (userName && ordName === userName)
      );
    });
  }, [orders, currentUser]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0
    }).format(price);

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await loginCustomer(loginEmail, loginPassword);
    showFeedback(res.message);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await registerCustomer({
      fullName: regFullName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      city: regCity,
      district: regDistrict,
      address: regAddress
    });
    showFeedback(res.message);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCustomerProfile({
      fullName: profileName.trim(),
      email: profileEmail.trim(),
      phone: profilePhone.trim(),
      city: profileCity.trim(),
      district: profileDistrict.trim(),
      address: profileAddress.trim()
    });
    showFeedback(
      "Profil bilgileriniz ve kayıtlı teslimat adresiniz güncellendi. Ödeme sayfasında otomatik olarak kullanılacaktır."
    );
  };

  if (!currentUser) {
    return (
      <div className="bg-stone-50 text-stone-900 py-12 lg:py-16 min-h-[80vh]">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-10 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <span className="text-[11px] tracking-[0.25em] uppercase text-rose-900 font-medium">
                AURA PRIVATE CLUB
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 font-normal">
                Müşteri Hesabım
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 font-light">
                Siparişlerinizi takip etmek ve hızlı ödeme için adresinizi
                kaydetmek üzere giriş yapın veya üye olun.
              </p>
            </div>

            {/* Hızlı Demo Müşteri Girişi */}
            <div className="bg-rose-900/5 border border-rose-900/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-stone-700 space-y-0.5 text-center sm:text-left">
                <strong className="text-stone-900 block font-medium">
                  ✨ Tek Tıkla Örnek Müşteri Girişi
                </strong>
                <span>
                  Selin Yılmaz (Kayıtlı adres + #AURA-84920 sipariş geçmişi ile)
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  loginDemoCustomer();
                  showFeedback("Selin Yılmaz hesabıyla giriş yapıldı.");
                }}
                className="px-4 py-2 bg-rose-900 hover:bg-rose-950 text-stone-50 text-xs tracking-wider uppercase font-medium rounded-xl transition-colors shrink-0"
              >
                Demo Giriş Yap
              </button>
            </div>

            {/* Sekme Seçici */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setAuthTab("login")}
                className={`py-2.5 text-xs tracking-wider uppercase font-medium rounded-xl transition-all ${
                  authTab === "login"
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                Giriş Yap
              </button>
              <button
                type="button"
                onClick={() => setAuthTab("register")}
                className={`py-2.5 text-xs tracking-wider uppercase font-medium rounded-xl transition-all ${
                  authTab === "register"
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                Üye Ol
              </button>
            </div>

            {authTab === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-stone-600 mb-1.5">
                    E-posta Adresiniz *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="selin.yilmaz@eposta.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-rose-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-stone-600 mb-1.5">
                    Şifreniz *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-rose-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-stone-900 hover:bg-rose-900 text-stone-50 text-xs tracking-[0.2em] uppercase font-medium rounded-xl transition-colors"
                >
                  Giriş Yap
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-stone-600 mb-1">
                      Adınız Soyadınız *
                    </label>
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="Örn: Elif Kaya"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-rose-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-600 mb-1">
                      E-posta Adresi *
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="ornek@eposta.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-rose-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-600 mb-1">
                      Telefon Numarası *
                    </label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="05XX XXX XX XX"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-rose-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-stone-600 mb-1">
                      Şifre Oluşturun *
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="En az 6 karakter"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-rose-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-600 mb-1">
                      Şehir (İsteğe Bağlı)
                    </label>
                    <input
                      type="text"
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      placeholder="İstanbul"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-rose-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-600 mb-1">
                      İlçe (İsteğe Bağlı)
                    </label>
                    <input
                      type="text"
                      value={regDistrict}
                      onChange={(e) => setRegDistrict(e.target.value)}
                      placeholder="Kadıköy / Şişli"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-rose-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-stone-600 mb-1">
                      Teslimat Adresi (Ödeme ekranında otomatik dolar)
                    </label>
                    <textarea
                      rows={2}
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      placeholder="Mahalle, cadde, sokak ve daire numarası..."
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-rose-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-rose-900 hover:bg-rose-950 text-stone-50 text-xs tracking-[0.2em] uppercase font-medium rounded-xl transition-colors"
                >
                  Üyeliği Tamamla ve Giriş Yap
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 text-stone-900 py-10 lg:py-14 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {feedbackMessage && (
          <div className="bg-emerald-900 text-stone-50 px-5 py-3.5 rounded-2xl shadow-md flex items-center gap-3 text-xs sm:text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Üst Karşılama Bandı */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-900 text-stone-50 font-serif text-2xl flex items-center justify-center shrink-0">
              {currentUser.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-[11px] tracking-[0.22em] uppercase text-rose-900 font-medium block">
                AURA PRIVATE CLUB ÜYESİ
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 font-normal">
                Merhaba, {currentUser.fullName}
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                {currentUser.email} • {currentUser.phone}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/checkout"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-stone-50 text-xs tracking-wider uppercase font-medium transition-colors"
            >
              <span>Kayıtlı Adresle Ödemeye Git</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => logoutCustomer()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 hover:border-stone-900 text-xs font-medium text-stone-700 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sol Menü */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-stone-200/90 p-4 space-y-2 shadow-xs">
              <button
                type="button"
                onClick={() => setAccountTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs tracking-wider uppercase font-medium transition-colors ${
                  accountTab === "profile"
                    ? "bg-stone-900 text-stone-50"
                    : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profil &amp; Kayıtlı Adresim</span>
              </button>

              <button
                type="button"
                onClick={() => setAccountTab("orders")}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs tracking-wider uppercase font-medium transition-colors ${
                  accountTab === "orders"
                    ? "bg-stone-900 text-stone-50"
                    : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Package className="w-4 h-4" />
                  <span>Sipariş Geçmişim</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-900 text-stone-50 text-[10px]">
                  {myOrders.length}
                </span>
              </button>
            </div>
          </aside>

          {/* Sağ İçerik */}
          <div className="lg:col-span-9">
            {accountTab === "profile" ? (
              <form
                onSubmit={handleProfileSave}
                className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-xs space-y-6"
              >
                <div className="border-b border-stone-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-serif text-stone-900">
                      Profil Bilgilerim &amp; Kayıtlı Teslimat Adresim
                    </h2>
                    <p className="text-xs text-stone-500 font-light mt-0.5">
                      Buraya kaydettiğiniz adres, ödeme sayfasına (/checkout)
                      gittiğinizde otomatik olarak form alanlarına doldurulur.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs text-rose-900 font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Otomatik Checkout Doldurma Aktif</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-stone-600 mb-1.5">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
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
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
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
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
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
                      value={profileCity}
                      onChange={(e) => setProfileCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-rose-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-stone-600 mb-1.5">
                      İlçe / Semt *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileDistrict}
                      onChange={(e) => setProfileDistrict(e.target.value)}
                      placeholder="Örn: Şişli / Nişantaşı"
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
                      value={profileAddress}
                      onChange={(e) => setProfileAddress(e.target.value)}
                      placeholder="Mahalle, cadde, sokak, bina ve daire numarası..."
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-rose-900"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-rose-900 hover:bg-rose-950 text-stone-50 text-xs tracking-[0.2em] uppercase font-medium rounded-xl transition-colors"
                  >
                    Bilgilerimi ve Adresimi Kaydet
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs">
                  <h2 className="text-xl font-serif text-stone-900">
                    Sipariş Geçmişim ({myOrders.length})
                  </h2>
                  <p className="text-xs text-stone-500 font-light mt-0.5">
                    {currentUser.email} e-posta adresinize veya{" "}
                    {currentUser.phone} telefon numaranıza ait tüm siparişler
                    listelenmektedir.
                  </p>
                </div>

                {myOrders.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
                    <p className="text-base font-serif text-stone-800">
                      Henüz bu hesaba ait bir siparişiniz bulunmuyor.
                    </p>
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2 px-7 py-3.5 bg-rose-900 text-stone-50 text-xs tracking-wider uppercase font-medium rounded-full"
                    >
                      <span>Koleksiyonu Keşfet</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  myOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-base font-semibold text-stone-900">
                              {ord.orderNumber}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-rose-900/10 text-rose-900 text-xs font-medium">
                              {ord.status}
                            </span>
                          </div>
                          <p className="text-xs text-stone-400 mt-1">
                            Sipariş Tarihi: {ord.createdAt}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-lg font-serif font-medium text-stone-900">
                            {formatPrice(ord.totalAmount)}
                          </span>
                          <Link
                            href={`/order-tracking?order=${encodeURIComponent(
                              ord.orderNumber
                            )}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-rose-900 text-stone-50 text-xs font-medium transition-colors"
                          >
                            <PackageSearch className="w-3.5 h-3.5" />
                            <span>Canlı Takip</span>
                          </Link>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-8 space-y-2">
                          {ord.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-200/60"
                            >
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-11 h-14 rounded-lg object-cover shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-serif text-sm text-stone-900 truncate">
                                  {item.product.name}
                                </p>
                                <p className="text-stone-500">
                                  Beden: <strong>{item.selectedSize}</strong> |
                                  Renk: <strong>{item.selectedColor}</strong> ×{" "}
                                  {item.quantity}
                                </p>
                              </div>
                              <span className="font-medium text-stone-900">
                                {formatPrice(
                                  item.product.price * item.quantity
                                )}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="md:col-span-4 bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-2 text-xs text-stone-600">
                          <div className="flex items-center gap-1.5 font-medium text-stone-900">
                            {ord.packagingType === "gift" ? (
                              <>
                                <Gift className="w-4 h-4 text-rose-900" />
                                <span>VIP İpek Hediye Kutusu</span>
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="w-4 h-4 text-rose-900" />
                                <span>%100 Gizli Paketleme</span>
                              </>
                            )}
                          </div>
                          <p className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-rose-900 shrink-0 mt-0.5" />
                            <span>
                              {ord.address} ({ord.district} / {ord.city})
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
