"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  PackageSearch,
  Search,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  Gift,
  MapPin,
  Phone,
  ArrowRight
} from "lucide-react";
import { useStore, OrderStatus } from "@/context/StoreContext";

const ORDER_STEPS: {
  status: OrderStatus;
  title: string;
  desc: string;
  icon: React.ElementType;
}[] = [
  {
    status: "Sipariş Alındı",
    title: "Sipariş Alındı",
    desc: "Ödemeniz onaylandı ve siparişiniz sisteme kaydedildi.",
    icon: Clock
  },
  {
    status: "Hazırlanıyor",
    title: "Özenle Hazırlanıyor",
    desc: "Ürünleriniz kalite kontrol ve hijyen bandı mühürleme aşamasında.",
    icon: ShieldCheck
  },
  {
    status: "Gizli Paketle Kargoya Verildi",
    title: "Gizli Paketle Kargoya Verildi",
    desc: "Dış yüzeyinde marka/ürün bilgisi yer almayan kapalı kutu kargoya teslim edildi.",
    icon: Truck
  },
  {
    status: "Teslim Edildi",
    title: "Teslim Edildi",
    desc: "Siparişiniz alıcıya güvenle teslim edildi.",
    icon: PackageCheck
  }
];

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("order") || "#AURA-84920";

  const { orders } = useStore();
  const [queryInput, setQueryInput] = useState(initialQuery);
  const [searchedCode, setSearchedCode] = useState(initialQuery);

  useEffect(() => {
    const paramOrder = searchParams.get("order");
    if (paramOrder) {
      setQueryInput(paramOrder);
      setSearchedCode(paramOrder);
    }
  }, [searchParams]);

  const normalizedQuery = searchedCode.trim().toUpperCase();
  const matchedOrder = orders.find(
    (o) =>
      o.orderNumber.toUpperCase() === normalizedQuery ||
      o.orderNumber.replace("#", "").toUpperCase() ===
        normalizedQuery.replace("#", "")
  );

  const currentStepIndex = matchedOrder
    ? ORDER_STEPS.findIndex((s) => s.status === matchedOrder.status)
    : -1;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0
    }).format(price);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedCode(queryInput);
  };

  return (
    <div className="bg-stone-50 text-stone-900 py-12 lg:py-16 min-h-[75vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs tracking-[0.22em] uppercase text-rose-900 font-medium">
            <PackageSearch className="w-4 h-4" />
            <span>MÜŞTERİ SİPARİŞ SORGULAMA</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 font-normal">
            Sipariş Takip Merkezi
          </h1>
          <p className="text-sm text-stone-600 font-light max-w-lg mx-auto">
            Size iletilen <code className="font-mono">#AURA-...</code> sipariş
            numaranızı girerek gizli kargo ve hazırlık sürecini anlık olarak
            takip edebilirsiniz.
          </p>
        </div>

        {/* Sorgulama Kutusu */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Örn: #AURA-84920"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-stone-300 text-sm font-mono uppercase focus:outline-none focus:border-rose-900"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 bg-rose-900 hover:bg-rose-950 text-stone-50 text-xs tracking-[0.18em] uppercase font-medium rounded-xl transition-colors"
            >
              Siparişi Sorgula
            </button>
          </form>

          {/* Hızlı Test Sipariş Numaraları */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-stone-500">
            <span>Hızlı Sorgula (Mevcut Siparişler):</span>
            {orders.map((ord) => (
              <button
                key={ord.id}
                type="button"
                onClick={() => {
                  setQueryInput(ord.orderNumber);
                  setSearchedCode(ord.orderNumber);
                }}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs border transition-colors ${
                  matchedOrder?.orderNumber === ord.orderNumber
                    ? "bg-stone-900 text-stone-50 border-stone-900"
                    : "bg-stone-50 text-stone-700 border-stone-200 hover:border-rose-900"
                }`}
              >
                {ord.orderNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Sorgu Sonucu */}
        {!matchedOrder ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center space-y-3">
            <p className="text-base font-serif text-stone-900">
              &ldquo;{searchedCode}&rdquo; numaralı sipariş bulunamadı.
            </p>
            <p className="text-xs text-stone-500 font-light">
              Lütfen sipariş numaranızı kontrol edin veya yukarıdaki örnek
              sipariş numaralarından birine tıklayın.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
            {/* Üst Bilgi Bandı */}
            <div className="p-6 sm:p-8 bg-stone-900 text-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] tracking-[0.2em] uppercase text-rose-300 block">
                  SİPARİŞ DETAYI
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <h2 className="text-2xl font-mono font-semibold">
                    {matchedOrder.orderNumber}
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-rose-900 text-stone-50 text-xs font-medium">
                    {matchedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  Sipariş Tarihi: {matchedOrder.createdAt}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-stone-400 block">
                  Toplam Tutar
                </span>
                <span className="text-2xl font-serif font-medium text-rose-300">
                  {formatPrice(matchedOrder.totalAmount)}
                </span>
              </div>
            </div>

            {/* 4 Aşamalı İlerleme Çubuğu */}
            <div className="p-6 sm:p-8 border-b border-stone-200/80 bg-stone-50/60">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {ORDER_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <div
                      key={step.status}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCurrent
                          ? "bg-white border-rose-900 ring-2 ring-rose-900/20 shadow-xs"
                          : isCompleted
                          ? "bg-white border-stone-300"
                          : "bg-stone-100/70 border-stone-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isCompleted
                              ? "bg-rose-900 text-stone-50"
                              : "bg-stone-200 text-stone-500"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {isCompleted && (
                          <CheckCircle2 className="w-4 h-4 text-rose-900" />
                        )}
                      </div>
                      <h3 className="text-xs font-serif font-medium text-stone-900">
                        {step.title}
                      </h3>
                      <p className="text-[11px] text-stone-500 font-light mt-1 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Teslimat, Paketleme ve Ürün Listesi */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-5 space-y-4">
                <h3 className="text-xs tracking-[0.18em] uppercase text-stone-500 font-medium">
                  Teslimat &amp; Paketleme
                </h3>
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-2.5 text-xs text-stone-700">
                  <p className="font-medium text-stone-900 text-sm">
                    {matchedOrder.customerName}
                  </p>
                  <p className="flex items-center gap-2 text-stone-600">
                    <Phone className="w-3.5 h-3.5 text-rose-900 shrink-0" />
                    <span>{matchedOrder.phone}</span>
                  </p>
                  <p className="flex items-start gap-2 text-stone-600">
                    <MapPin className="w-3.5 h-3.5 text-rose-900 shrink-0 mt-0.5" />
                    <span>
                      {matchedOrder.address} ({matchedOrder.district} /{" "}
                      {matchedOrder.city})
                    </span>
                  </p>
                  <div className="pt-2 border-t border-stone-200/80 flex items-start gap-2">
                    {matchedOrder.packagingType === "gift" ? (
                      <>
                        <Gift className="w-4 h-4 text-rose-900 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-stone-900 block">
                            VIP İpek Hediye Kutusu + Gizli Kargo
                          </strong>
                          {matchedOrder.giftNote && (
                            <p className="text-stone-500 italic mt-0.5">
                              Not: &ldquo;{matchedOrder.giftNote}&rdquo;
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-rose-900 shrink-0 mt-0.5" />
                        <span>
                          Standart %100 Gizli Paketleme (Dış kutuda marka/ürün
                          bilgisi yer almaz)
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 space-y-4">
                <h3 className="text-xs tracking-[0.18em] uppercase text-stone-500 font-medium">
                  Sipariş Edilen Ürünler ({matchedOrder.items.length})
                </h3>
                <div className="space-y-3">
                  {matchedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-3.5 rounded-2xl border border-stone-200/80 bg-stone-50/50"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-14 h-16 rounded-xl object-cover bg-stone-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-serif text-stone-900 truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Beden: <strong>{item.selectedSize}</strong> | Renk:{" "}
                          <strong>{item.selectedColor}</strong> | Adet:{" "}
                          <strong>{item.quantity}</strong>
                        </p>
                      </div>
                      <span className="text-sm font-serif font-medium text-stone-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-xs tracking-wider uppercase text-rose-900 font-medium hover:underline"
                  >
                    <span>Mağazaya Dön</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm text-stone-500">
          Sipariş takip ekranı yükleniyor...
        </div>
      }
    >
      <OrderTrackingContent />
    </Suspense>
  );
}
