"use client";

import React, { useState, useMemo } from "react";
import {
  Lock,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  ShieldCheck,
  Gift,
  TrendingUp,
  Check,
  X,
  LogOut,
  Database,
  RefreshCw
} from "lucide-react";
import {
  useStore,
  OrderStatus,
  NewProductInput
} from "@/context/StoreContext";
import { Product, ProductCategory } from "@/data/products";

const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  "Sipariş Alındı",
  "Hazırlanıyor",
  "Gizli Paketle Kargoya Verildi",
  "Teslim Edildi"
];

const CATEGORY_OPTIONS: ProductCategory[] = [
  "Kadın İç Giyim",
  "Pijama & Ev Giyim",
  "Erkek İç Giyim",
  "Çeyiz & Özel Koleksiyon"
];

export default function AdminPage() {
  const {
    products,
    orders,
    isCloudConnected,
    isLoadingCloud,
    syncError,
    refreshFromCloud,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
    updateOrderStatus
  } = useStore();

  // PIN Giriş Durumu
  const [pinInput, setPinInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState("");

  // Aktif Sekme: "dashboard" | "orders" | "products"
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "orders" | "products"
  >("dashboard");

  // Ürün Ekleme / Düzenleme Modalı
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] =
    useState<ProductCategory>("Kadın İç Giyim");
  const [formPrice, setFormPrice] = useState("");
  const [formOldPrice, setFormOldPrice] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formSizes, setFormSizes] = useState("S, M, L");
  const [formDescription, setFormDescription] = useState("");

  const totalRevenue = useMemo(
    () => orders.reduce((sum, ord) => sum + ord.totalAmount, 0),
    [orders]
  );

  const vipPackagingCount = useMemo(
    () => orders.filter((ord) => ord.packagingType === "gift").length,
    [orders]
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0
    }).format(price);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === "1234") {
      setIsAuthenticated(true);
      setPinError("");
    } else {
      setPinError("Hatalı PIN kodu! Lütfen demo şifresi olan 1234'ü girin.");
    }
  };

  const openNewProductModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormCategory("Kadın İç Giyim");
    setFormPrice("");
    setFormOldPrice("");
    setFormImageUrl(
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85"
    );
    setFormSizes("S, M, L");
    setFormDescription("");
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormPrice(String(product.price));
    setFormOldPrice(product.oldPrice ? String(product.oldPrice) : "");
    setFormImageUrl(product.images[0] || "");
    setFormSizes(product.sizes.join(", "));
    setFormDescription(product.description);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSizes = formSizes
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

    if (editingProduct) {
      await updateProduct(editingProduct.id, {
        name: formName.trim(),
        category: formCategory,
        price: Number(formPrice) || editingProduct.price,
        oldPrice: formOldPrice ? Number(formOldPrice) : undefined,
        images: [
          formImageUrl.trim() || editingProduct.images[0],
          ...editingProduct.images.slice(1)
        ],
        sizes: parsedSizes.length > 0 ? parsedSizes : editingProduct.sizes,
        description: formDescription.trim()
      });
    } else {
      const input: NewProductInput = {
        name: formName,
        category: formCategory,
        price: Number(formPrice) || 1990,
        oldPrice: formOldPrice ? Number(formOldPrice) : undefined,
        imageUrl: formImageUrl,
        sizes: parsedSizes.length > 0 ? parsedSizes : ["S", "M", "L"],
        description: formDescription
      };
      await addProduct(input);
    }

    setIsProductModalOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-stone-50 text-stone-900 py-16 px-4 min-h-[75vh] flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200/90 p-8 shadow-xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-900/10 text-rose-900 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] tracking-[0.22em] uppercase text-rose-900 font-medium">
              AURA LINGERIE YÖNETİM
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 font-normal">
              Yönetici Girişi
            </h1>
            <p className="text-xs text-stone-500 font-light">
              Siparişleri, gizli kargo durumlarını ve mağaza ürünlerini yönetmek
              için PIN kodunu girin.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border bg-stone-50 border-stone-200 text-stone-700">
            <span>
              {isCloudConnected
                ? "🟢 Bulut Veritabanı (Supabase) Aktif"
                : "🟡 Yerel Hafıza Modu"}
            </span>
          </div>

          <div className="bg-stone-100/80 border border-stone-200 rounded-xl p-3 text-xs text-stone-700">
            💡 <strong>Demo Erişim İpucu:</strong> Şifre alanına{" "}
            <code className="px-2 py-0.5 bg-white rounded font-mono font-semibold text-rose-900 border border-stone-200">
              1234
            </code>{" "}
            yazarak giriş yapabilirsiniz.
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="PIN Kodu (1234)"
              className="w-full px-4 py-3.5 text-center tracking-[0.4em] font-mono text-lg rounded-xl border border-stone-300 focus:outline-none focus:border-rose-900"
            />
            {pinError && <p className="text-xs text-rose-800">{pinError}</p>}
            <button
              type="submit"
              className="w-full py-3.5 bg-stone-900 hover:bg-rose-900 text-stone-50 text-xs tracking-[0.2em] uppercase font-medium rounded-xl transition-colors"
            >
              Panele Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 text-stone-900 py-8 lg:py-12 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* ÜST VERİTABANI BAĞLANTI DURUMU BARI */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:px-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isCloudConnected
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                    isCloudConnected
                      ? "bg-emerald-50/90 text-emerald-800 border-emerald-300"
                      : "bg-amber-50/90 text-amber-800 border-amber-300"
                  }`}
                >
                  {isCloudConnected
                    ? "🟢 Bulut Veritabanı (Supabase) Aktif"
                    : "🟡 Yerel Hafıza Modu"}
                </span>
                {isLoadingCloud && (
                  <span className="text-xs text-stone-400 animate-pulse">
                    Senkronize ediliyor...
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 font-light mt-1">
                {isCloudConnected
                  ? "Tüm ürün ve sipariş işlemleri gerçek zamanlı olarak Supabase bulut veritabanına kaydediliyor."
                  : "Supabase anahtarları girilmediği için veriler tarayıcı hafızasında (localStorage) tutuluyor. src/lib/supabase.ts veya .env.local üzerinden bağlayabilirsiniz."}
              </p>
              {syncError && (
                <p className="text-xs text-rose-800 mt-1">
                  Bilgi: {syncError}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => refreshFromCloud()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 hover:border-stone-900 text-xs font-medium text-stone-700 transition-colors shrink-0 self-start sm:self-center"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoadingCloud ? "animate-spin" : ""}`}
            />
            <span>Veritabanını Yenile</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* SOL SIDEBAR MENÜ */}
          <aside className="lg:col-span-3">
            <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 space-y-6 sticky top-28 shadow-lg">
              <div className="border-b border-stone-800 pb-4">
                <span className="text-[10px] tracking-[0.28em] uppercase text-rose-300 block">
                  AURA ADMIN
                </span>
                <h2 className="text-xl font-serif font-normal mt-0.5">
                  Mağaza Yönetim Paneli
                </h2>
              </div>

              <nav className="space-y-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs tracking-wider uppercase font-medium transition-colors ${
                    activeTab === "dashboard"
                      ? "bg-rose-900 text-stone-50"
                      : "text-stone-300 hover:bg-stone-800"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>1. Genel Bakış</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs tracking-wider uppercase font-medium transition-colors ${
                    activeTab === "orders"
                      ? "bg-rose-900 text-stone-50"
                      : "text-stone-300 hover:bg-stone-800"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4" />
                    <span>2. Siparişlerim</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-stone-800 text-stone-100 text-[10px]">
                    {orders.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("products")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs tracking-wider uppercase font-medium transition-colors ${
                    activeTab === "products"
                      ? "bg-rose-900 text-stone-50"
                      : "text-stone-300 hover:bg-stone-800"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Package className="w-4 h-4" />
                    <span>3. Ürün Yönetimi</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-stone-800 text-stone-100 text-[10px]">
                    {products.length}
                  </span>
                </button>
              </nav>

              <div className="pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAuthenticated(false);
                    setPinInput("");
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Oturumu Kapat</span>
                </button>
              </div>
            </div>
          </aside>

          {/* SAĞ İÇERİK ALANI */}
          <div className="lg:col-span-9 space-y-6">
            {/* SEKME 1: GENEL BAKIŞ (DASHBOARD) */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span>Toplam Ciro</span>
                      <TrendingUp className="w-4 h-4 text-rose-900" />
                    </div>
                    <p className="text-2xl font-serif font-medium text-stone-900">
                      {formatPrice(totalRevenue)}
                    </p>
                    <span className="text-[11px] text-stone-400 block">
                      Gerçek zamanlı mağaza geliri
                    </span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span>Toplam Sipariş</span>
                      <ShoppingBag className="w-4 h-4 text-rose-900" />
                    </div>
                    <p className="text-2xl font-serif font-medium text-stone-900">
                      {orders.length} Adet
                    </p>
                    <span className="text-[11px] text-stone-400 block">
                      Tüm aktif ve tamamlananlar
                    </span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span>Gizli / VIP Paket</span>
                      <Gift className="w-4 h-4 text-rose-900" />
                    </div>
                    <p className="text-2xl font-serif font-medium text-stone-900">
                      {orders.length} Gizli ({vipPackagingCount} VIP)
                    </p>
                    <span className="text-[11px] text-stone-400 block">
                      %100 mahremiyet standardı
                    </span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span>Toplam Ürün</span>
                      <Package className="w-4 h-4 text-rose-900" />
                    </div>
                    <p className="text-2xl font-serif font-medium text-stone-900">
                      {products.length} Model
                    </p>
                    <span className="text-[11px] text-stone-400 block">
                      Vitrinde aktif sergilenen
                    </span>
                  </div>
                </div>

                {/* Son Siparişler Özeti */}
                <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                    <h3 className="text-lg font-serif text-stone-900">
                      Son Gelen Siparişler
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab("orders")}
                      className="text-xs text-rose-900 hover:underline font-medium"
                    >
                      Tüm Siparişleri Yönet →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-100 text-stone-600 uppercase">
                        <tr>
                          <th className="py-3 px-4">Sipariş No</th>
                          <th className="py-3 px-4">Müşteri</th>
                          <th className="py-3 px-4">Paketleme</th>
                          <th className="py-3 px-4">Tutar</th>
                          <th className="py-3 px-4">Durum</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200/70">
                        {orders.slice(0, 5).map((ord) => (
                          <tr key={ord.id}>
                            <td className="py-3.5 px-4 font-mono font-medium text-stone-900">
                              {ord.orderNumber}
                            </td>
                            <td className="py-3.5 px-4">{ord.customerName}</td>
                            <td className="py-3.5 px-4">
                              {ord.packagingType === "gift"
                                ? "VIP İpek Hediye Kutusu"
                                : "Standart Gizli Kargo"}
                            </td>
                            <td className="py-3.5 px-4 font-medium">
                              {formatPrice(ord.totalAmount)}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-1 rounded-full bg-rose-900/10 text-rose-900 font-medium">
                                {ord.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SEKME 2: SİPARİŞLERİM */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl border border-stone-200/90 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-serif text-stone-900">
                      Gelen Siparişler ({orders.length})
                    </h2>
                    <p className="text-xs text-stone-500 font-light mt-0.5">
                      Sipariş durumunu değiştirdiğinizde hem Supabase hem de
                      müşterinin Sipariş Takip ekranı anında güncellenir.
                    </p>
                  </div>
                </div>

                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-base font-semibold text-stone-900">
                            {ord.orderNumber}
                          </span>
                          <span className="text-xs text-stone-400">
                            • {ord.createdAt}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-stone-800 mt-1">
                          {ord.customerName} —{" "}
                          <span className="text-xs font-normal text-stone-500">
                            {ord.phone} | {ord.email}
                          </span>
                        </p>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Adres: {ord.address} ({ord.district} / {ord.city})
                        </p>
                      </div>

                      <div className="flex flex-col sm:items-end gap-2">
                        <label className="text-[11px] uppercase tracking-wider text-stone-400">
                          Sipariş Durumu Güncelle
                        </label>
                        <select
                          value={ord.status}
                          onChange={(e) =>
                            updateOrderStatus(
                              ord.orderNumber,
                              e.target.value as OrderStatus
                            )
                          }
                          className="px-3.5 py-2 rounded-xl bg-stone-900 text-stone-50 text-xs font-medium focus:outline-none"
                        >
                          {ORDER_STATUS_OPTIONS.map((statusOption) => (
                            <option key={statusOption} value={statusOption}>
                              {statusOption}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-7 space-y-2">
                        {ord.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-200/60"
                          >
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-10 h-12 rounded-lg object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-stone-900 truncate">
                                {item.product.name}
                              </p>
                              <p className="text-stone-500">
                                Beden: <strong>{item.selectedSize}</strong> |
                                Renk: <strong>{item.selectedColor}</strong> ×{" "}
                                {item.quantity}
                              </p>
                            </div>
                            <span className="font-medium text-stone-900">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="md:col-span-5 bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-2 text-xs">
                        <div className="flex items-center gap-2 font-medium text-stone-900">
                          {ord.packagingType === "gift" ? (
                            <>
                              <Gift className="w-4 h-4 text-rose-900" />
                              <span>
                                VIP İpek Kurdeleli Hediye Kutusu (+49 TL)
                              </span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-4 h-4 text-rose-900" />
                              <span>Standart %100 Gizli Kargo (Ücretsiz)</span>
                            </>
                          )}
                        </div>
                        {ord.giftNote && (
                          <p className="text-stone-600 italic bg-white p-2 rounded-lg border border-stone-200/70">
                            Hediye Notu: &ldquo;{ord.giftNote}&rdquo;
                          </p>
                        )}
                        <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-sm font-serif font-medium text-rose-900">
                          <span>Toplam Tutar:</span>
                          <span>{formatPrice(ord.totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SEKME 3: ÜRÜN YÖNETİMİ */}
            {activeTab === "products" && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-stone-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-serif text-stone-900">
                      Ürün Yönetimi ({products.length} Ürün)
                    </h2>
                    <p className="text-xs text-stone-500 font-light mt-0.5">
                      Eklediğiniz veya güncellediğiniz ürünler Supabase
                      veritabanına kaydedilir ve vitrinde anında yayınlanır.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => resetProducts()}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-medium text-stone-700 hover:border-stone-900 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Varsayılan Ürünlere Sıfırla</span>
                    </button>

                    <button
                      type="button"
                      onClick={openNewProductModal}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-stone-50 text-xs tracking-wider uppercase font-medium transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Yeni Ürün Ekle</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-100 text-stone-600 uppercase">
                        <tr>
                          <th className="py-3.5 px-4">Görsel</th>
                          <th className="py-3.5 px-4">Ürün Adı</th>
                          <th className="py-3.5 px-4">Kategori</th>
                          <th className="py-3.5 px-4">Bedenler</th>
                          <th className="py-3.5 px-4">Fiyat</th>
                          <th className="py-3.5 px-4 text-right">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200/70">
                        {products.map((prd) => (
                          <tr key={prd.id} className="hover:bg-stone-50/80">
                            <td className="py-3 px-4">
                              <img
                                src={prd.images[0]}
                                alt={prd.name}
                                className="w-12 h-14 rounded-lg object-cover bg-stone-200"
                              />
                            </td>
                            <td className="py-3 px-4 font-serif text-sm text-stone-900 font-medium">
                              {prd.name}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
                                {prd.category}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-stone-500">
                              {prd.sizes.join(", ")}
                            </td>
                            <td className="py-3 px-4 font-medium text-stone-900">
                              {formatPrice(prd.price)}
                              {prd.oldPrice && (
                                <span className="block text-[11px] text-stone-400 line-through">
                                  {formatPrice(prd.oldPrice)}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => openEditProductModal(prd)}
                                  className="p-2 rounded-lg border border-stone-200 text-stone-700 hover:border-stone-900 transition-colors"
                                  aria-label="Düzenle"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteProduct(prd.id)}
                                  className="p-2 rounded-lg border border-stone-200 text-rose-900 hover:bg-rose-900 hover:text-stone-50 transition-colors"
                                  aria-label="Sil"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* YENİ ÜRÜN EKLE / DÜZENLE MODALI */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-stone-50 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-xl font-serif text-stone-900">
                {editingProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-stone-500 hover:text-stone-900 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-600 mb-1">Ürün Adı *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Örn: Fransız Güpürlü İpek Kimono"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-600 mb-1">Kategori *</label>
                  <select
                    value={formCategory}
                    onChange={(e) =>
                      setFormCategory(e.target.value as ProductCategory)
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white text-xs"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-600 mb-1">
                    Satış Fiyatı (TL) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="2850"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 mb-1">
                    Eski Fiyat (İsteğe Bağlı)
                  </label>
                  <input
                    type="number"
                    value={formOldPrice}
                    onChange={(e) => setFormOldPrice(e.target.value)}
                    placeholder="3400"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 mb-1">
                  Görsel URL *
                </label>
                <input
                  type="text"
                  required
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1">
                  Beden Seçenekleri (Virgülle ayırın: S, M, L veya 75B, 80B,
                  85B) *
                </label>
                <input
                  type="text"
                  required
                  value={formSizes}
                  onChange={(e) => setFormSizes(e.target.value)}
                  placeholder="75B, 80B, 85B"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1">
                  Ürün Açıklaması *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Kumaş içeriği, kalıp ve bakım detayları..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-stone-50 font-medium flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProduct ? "Güncelle" : "Ürünü Kaydet"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
