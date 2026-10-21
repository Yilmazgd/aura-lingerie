"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  Heart,
  ShoppingBag,
  RotateCcw,
  X
} from "lucide-react";
import { Product } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const ALL_CATEGORIES = [
  "Tümü",
  "Kadın İç Giyim",
  "Pijama & Ev Giyim",
  "Erkek İç Giyim",
  "Çeyiz & Özel Koleksiyon"
];

const ALL_SIZES = ["75B", "80B", "85B", "80C", "85C", "XS", "S", "M", "L", "XL"];

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const { products } = useStore();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string | null>(
    null
  );
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);



  useEffect(() => {
    if (!categoryParam) {
      setSelectedCategory("Tümü");
      setOnlyDiscounted(false);
    } else if (categoryParam === "İndirim") {
      setSelectedCategory("Tümü");
      setOnlyDiscounted(true);
    } else if (ALL_CATEGORIES.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
      setOnlyDiscounted(false);
    }
  }, [categoryParam]);

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "Tümü" || product.category === selectedCategory;
      const matchesSize =
        !selectedSizeFilter || product.sizes.includes(selectedSizeFilter);
      const matchesDiscount = !onlyDiscounted || Boolean(product.oldPrice);
      return matchesCategory && matchesSize && matchesDiscount;
    });

    const sorted = [...filtered];
    if (sortBy === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    }
    return sorted;
  }, [products, selectedCategory, selectedSizeFilter, onlyDiscounted, sortBy]);

  const resetFilters = () => {
    setSelectedCategory("Tümü");
    setSelectedSizeFilter(null);
    setOnlyDiscounted(false);
    setSortBy("recommended");
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0
    }).format(price);

  const handleCardAddToCart = (product: Product) => {
    const size = selectedSizeFilter || product.sizes[0];
    const color = product.colors[0]?.name || "Standart";
    addToCart(product, size, color, 1);
  };

  return (
    <div className="bg-stone-50 text-stone-900 py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-8 border-b border-stone-200/80 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs tracking-[0.22em] uppercase text-rose-900 font-medium">
              AURA LINGERIE MAĞAZA
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 mt-1 font-normal">
              {onlyDiscounted && selectedCategory === "Tümü"
                ? "Özel İndirim Seçkisi"
                : selectedCategory === "Tümü"
                ? "Tüm Koleksiyonlar"
                : selectedCategory}
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-medium text-stone-800"
            >
              <SlidersHorizontal className="w-4 h-4 text-rose-900" />
              <span>Filtreler</span>
            </button>

            <span className="text-xs text-stone-500">
              Toplam{" "}
              <strong className="text-stone-900 font-medium">
                {filteredAndSortedProducts.length}
              </strong>{" "}
              ürün bulundu
            </span>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Ürünleri Sırala"
              className="px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-stone-800 focus:outline-none focus:border-rose-900"
            >
              <option value="recommended">Sıralama: Önerilen</option>
              <option value="price-asc">Fiyat: En Düşükten En Yükseğe</option>
              <option value="price-desc">Fiyat: En Yüksekten En Düşüğe</option>
              <option value="newest">En Yeniler</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
          <aside
            className={`lg:col-span-3 space-y-6 ${
              mobileFilterOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h2 className="text-base font-serif text-stone-900 font-medium flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-rose-900" />
                  <span>Filtrele</span>
                </h2>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-xs text-rose-900 hover:underline font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Filtreleri Temizle</span>
                </button>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-xs tracking-[0.16em] uppercase text-stone-500 font-medium">
                  Kategoriler
                </h3>
                <div className="flex flex-col space-y-1.5">
                  {ALL_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                        selectedCategory === cat
                          ? "bg-rose-900 text-stone-50 font-medium"
                          : "text-stone-700 hover:bg-stone-100"
                      }`}
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && (
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-50" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs tracking-[0.16em] uppercase text-stone-500 font-medium">
                    Beden / Kupa Filtresi
                  </h3>
                  {selectedSizeFilter && (
                    <button
                      type="button"
                      onClick={() => setSelectedSizeFilter(null)}
                      className="text-[11px] text-stone-400 hover:text-stone-800 flex items-center gap-0.5"
                    >
                      <X className="w-3 h-3" />
                      <span>Kaldır</span>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {ALL_SIZES.map((size) => {
                    const active = selectedSizeFilter === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() =>
                          setSelectedSizeFilter(active ? null : size)
                        }
                        className={`py-2 text-xs rounded-lg border transition-colors ${
                          active
                            ? "bg-stone-900 text-stone-50 border-stone-900 font-medium"
                            : "bg-stone-50 text-stone-700 border-stone-200 hover:border-rose-900"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-medium text-stone-800">
                    Sadece İndirimdekiler
                  </span>
                  <input
                    type="checkbox"
                    checked={onlyDiscounted}
                    onChange={(e) => setOnlyDiscounted(e.target.checked)}
                    className="w-4 h-4 rounded border-stone-300 text-rose-900 focus:ring-rose-900"
                  />
                </label>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-9">
            {filteredAndSortedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
                <p className="text-base text-stone-600 font-light">
                  Seçtiğiniz filtre kombinasyonuna uygun ürün bulunamadı.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-6 py-3 bg-rose-900 text-stone-50 text-xs tracking-wider uppercase font-medium rounded-full"
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((product) => {
                  const isFav = isInWishlist(product.id);

                  return (
                    <article
                      key={product.id}
                      className="group bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-lg transition-all flex flex-col"
                    >
                      <div className="relative aspect-[4/3] bg-stone-200 overflow-hidden">
                        <Link
                          href={`/product/${product.slug}`}
                          className="block w-full h-full"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                          />
                        </Link>

                        <button
                          type="button"
                          onClick={() => toggleWishlist(product)}
                          aria-label={`${product.name} favorilere ekle`}
                          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-stone-50/90 backdrop-blur-xs flex items-center justify-center text-stone-700 hover:text-rose-900 transition-colors shadow-sm"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isFav
                                ? "fill-rose-900 text-rose-900"
                                : "stroke-[1.5]"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <span className="text-[10px] tracking-[0.15em] uppercase text-rose-900 font-medium">
                            {product.category}
                          </span>
                          <Link
                            href={`/product/${product.slug}`}
                            className="block text-base font-serif text-stone-900 mt-1.5 hover:text-rose-900 transition-colors"
                          >
                            {product.name}
                          </Link>
                        </div>

                        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                          <div>
                            {product.oldPrice && (
                              <span className="text-xs text-stone-400 line-through block">
                                {formatPrice(product.oldPrice)}
                              </span>
                            )}
                            <span className="text-lg font-serif font-medium text-stone-900">
                              {formatPrice(product.price)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCardAddToCart(product)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-rose-900 text-stone-50 text-xs tracking-wider uppercase font-medium rounded-xl transition-colors"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Sepete Ekle</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm text-stone-500">
          Koleksiyon yükleniyor...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
