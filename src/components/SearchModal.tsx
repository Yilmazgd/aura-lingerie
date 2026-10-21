"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import { useStore } from "@/context/StoreContext";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { products } = useStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 4);
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [products, query]);

  if (!isOpen) return null;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0
    }).format(price);

  const quickKeywords = [
    "İpek Pijama",
    "Fransız Danteli",
    "Gelin Sabahlık",
    "Kaşmir",
    "Pima Pamuk"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-2xl bg-stone-50 rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        <div className="p-4 sm:p-5 bg-white border-b border-stone-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-rose-900 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ürün adı, kategori veya kumaş dokusu ara (örn: İpek, Bralet, Çeyiz)..."
            className="w-full bg-transparent text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs text-stone-400 hover:text-stone-700 px-2 py-1"
            >
              Temizle
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
            aria-label="Aramayı Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-3 bg-stone-100/70 border-b border-stone-200/80 flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-stone-500 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-rose-900" />
            Popüler:
          </span>
          {quickKeywords.map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => setQuery(kw)}
              className="text-xs px-2.5 py-1 rounded-full bg-white border border-stone-200 text-stone-700 hover:border-rose-900 hover:text-rose-900 transition-colors"
            >
              {kw}
            </button>
          ))}
        </div>

        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>
              {query.trim()
                ? `"${query}" için ${filteredResults.length} sonuç bulundu`
                : "Öne Çıkan Koleksiyon Parçaları"}
            </span>
            <Link
              href="/shop"
              onClick={onClose}
              className="text-rose-900 hover:underline font-medium flex items-center gap-1"
            >
              <span>Tüm Mağazayı Gör</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {filteredResults.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <p className="text-sm text-stone-600 font-light">
                Aradığınız kriterlere uygun ürün bulunamadı.
              </p>
              <p className="text-xs text-stone-400">
                Farklı bir anahtar kelime deneyebilir veya tüm koleksiyonu
                inceleyebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-stone-200/70">
              {filteredResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="group py-3 flex items-center gap-4 hover:bg-white px-3 rounded-xl transition-colors"
                >
                  <div className="w-16 h-20 rounded-xl overflow-hidden bg-stone-200 shrink-0">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] tracking-[0.15em] uppercase text-rose-900 font-medium block">
                      {product.category}
                    </span>
                    <h4 className="text-sm sm:text-base font-serif text-stone-900 group-hover:text-rose-900 transition-colors truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-stone-500 font-light line-clamp-1 mt-0.5">
                      {product.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {product.oldPrice && (
                      <span className="text-xs text-stone-400 line-through block">
                        {formatPrice(product.oldPrice)}
                      </span>
                    )}
                    <span className="text-sm sm:text-base font-serif font-medium text-stone-900">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
