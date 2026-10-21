"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Sparkles,
  Truck,
  Heart,
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import { Product, ProductCategory } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function HomePage() {
  const { products } = useStore();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(
    {}
  );
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>(
    {}
  );

  const categories: {
    title: ProductCategory;
    subtitle: string;
    href: string;
    image: string;
    itemCount: string;
  }[] = [
    {
      title: "Kadın İç Giyim",
      subtitle: "Fransız Danteli & İpek Saten Seçkisi",
      href: "/shop?category=Kad%C4%B1n%20%C4%B0%C3%A7%20Giyim",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85",
      itemCount: "48 Parça"
    },
    {
      title: "Pijama & Ev Giyim",
      subtitle: "Saf Mulberry İpeği & Kaşmir Modal",
      href: "/shop?category=Pijama%20%26%20Ev%20Giyim",
      image:
        "https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=900&q=85",
      itemCount: "36 Parça"
    },
    {
      title: "Erkek İç Giyim",
      subtitle: "Organik Pima Pamuğu & Rahat Kesim",
      href: "/shop?category=Erkek%20%C4%B0%C3%A7%20Giyim",
      image:
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=85",
      itemCount: "24 Parça"
    },
    {
      title: "Çeyiz & Özel Koleksiyon",
      subtitle: "Gelin Kimonoları & Özel Kutu Setleri",
      href: "/shop?category=%C3%87eyiz%20%26%20%C3%96zel%20Koleksiyon",
      image:
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=85",
      itemCount: "18 Parça"
    }
  ];

  const filteredProducts =
    selectedCategory === "Tümü"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleSelectSize = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleSelectColor = (productId: string, colorName: string) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: colorName }));
  };

  const handleAddToCart = (product: Product) => {
    const chosenSize = selectedSizes[product.id] || product.sizes[0];
    const chosenColor = selectedColors[product.id] || product.colors[0].name;
    addToCart(product, chosenSize, chosenColor, 1);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0
    }).format(price);

  return (
    <div className="bg-stone-50 text-stone-900">
      <section className="relative overflow-hidden border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-900/10 border border-rose-900/20 text-rose-900 text-xs tracking-[0.2em] uppercase font-medium">
                <span>2026 Sonbahar / Kış Koleksiyonu</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-serif text-stone-900 leading-[1.15] font-normal">
                Konforun En Zarif Hali{" "}
                <span className="block text-rose-900 italic font-light mt-1">
                  Yeni Sezon Ev &amp; İç Giyim Koleksiyonu
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 font-light leading-relaxed max-w-xl">
                Cildinizle bütünleşen 22 Momme saf Mulberry ipeği, el işçiliği
                Fransız dantelleri ve nefes alan organik Pima pamuğu ile
                evdeki her anınızı dingin bir lükse dönüştürün.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-rose-900 hover:bg-rose-950 text-stone-50 text-xs tracking-[0.2em] uppercase font-medium rounded-full transition-all shadow-sm"
                >
                  <span>Koleksiyonu Keşfet</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/shop?category=%C3%87eyiz%20%26%20%C3%96zel%20Koleksiyon"
                  className="inline-flex items-center gap-2 px-7 py-4 bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 text-xs tracking-[0.2em] uppercase font-medium rounded-full transition-all"
                >
                  <span>Çeyiz &amp; Özel Seçki</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-xl bg-stone-200 aspect-[4/3] lg:aspect-[16/11]">
                <img
                  src="https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=1400&q=85"
                  alt="AURA Lingerie Yeni Sezon İpek Ev ve İç Giyim Koleksiyonu"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="guvence-seridi"
        className="bg-stone-100/80 border-b border-stone-200/80 py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 bg-stone-50 p-6 rounded-xl border border-stone-200/70 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-rose-900/10 text-rose-900 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h2 className="text-base font-serif text-stone-900 font-medium">
                  Gizli ve Özenli Paketleme
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 font-light mt-1 leading-relaxed">
                  Kargo poşeti ve kutu üzerinde marka adı, logo veya ürün
                  içeriğine dair hiçbir ibare yer almaz.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-stone-50 p-6 rounded-xl border border-stone-200/70 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-rose-900/10 text-rose-900 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h2 className="text-base font-serif text-stone-900 font-medium">
                  %100 Doğal Pamuk &amp; İpek Dokular
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 font-light mt-1 leading-relaxed">
                  Cildinize nefes aldıran OEKO-TEX® sertifikalı saf Mulberry
                  ipeği, organik Pima pamuğu ve Fransız danteli.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-stone-50 p-6 rounded-xl border border-stone-200/70 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-rose-900/10 text-rose-900 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h2 className="text-base font-serif text-stone-900 font-medium">
                  Hızlı Gönderim &amp; Hijyen Bandı Güvencesi
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 font-light mt-1 leading-relaxed">
                  Siparişleriniz 24 saat içinde özenle hazırlanır ve koruyucu
                  hijyen emniyet bandı ile mühürlenerek gönderilir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="kategoriler" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs tracking-[0.25em] uppercase text-rose-900 font-medium">
                KOLEKSİYON SEÇKİSİ
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mt-1 font-normal">
                Kategorilere Göre Keşfedin
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs tracking-[0.18em] uppercase text-rose-900 hover:text-rose-950 font-medium flex items-center gap-1.5"
            >
              <span>Tüm Mağazayı Aç</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.title}
                href={cat.href}
                className="group relative rounded-2xl overflow-hidden bg-stone-200 aspect-[3/4] shadow-sm hover:shadow-xl transition-all block"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/25 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6 text-stone-50">
                  <p className="text-xs text-rose-200 font-light tracking-wide">
                    {cat.subtitle}
                  </p>
                  <h3 className="text-xl font-serif mt-1 font-normal">
                    {cat.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        id="cok-satanlar"
        className="py-16 lg:py-24 bg-stone-100/60 border-t border-stone-200/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
            <div>
              <span className="text-xs tracking-[0.25em] uppercase text-rose-900 font-medium">
                FAVORİ PARÇALAR ({filteredProducts.length})
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mt-1 font-normal">
                Çok Satanlar Vitrini
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "Tümü",
                "Kadın İç Giyim",
                "Pijama & Ev Giyim",
                "Erkek İç Giyim",
                "Çeyiz & Özel Koleksiyon"
              ].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs tracking-wider transition-all ${
                    selectedCategory === cat
                      ? "bg-rose-900 text-stone-50 font-medium shadow-sm"
                      : "bg-stone-50 text-stone-700 hover:bg-stone-200/70 border border-stone-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const activeSize =
                selectedSizes[product.id] || product.sizes[0];
              const activeColor =
                selectedColors[product.id] || product.colors[0].name;
              const isFav = isInWishlist(product.id);

              return (
                <article
                  key={product.id}
                  className="group bg-stone-50 rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col"
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
                      className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-stone-50/90 backdrop-blur-sm flex items-center justify-center text-stone-700 hover:text-rose-900 transition-colors shadow-sm"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFav
                            ? "fill-rose-900 text-rose-900"
                            : "stroke-[1.5]"
                        }`}
                      />
                    </button>

                    <div className="absolute inset-x-3 bottom-3 bg-stone-50/95 backdrop-blur-md p-3 rounded-xl border border-stone-200/90 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                      <div className="flex flex-wrap gap-1.5">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => handleSelectSize(product.id, size)}
                            className={`flex-1 min-w-[42px] py-1.5 text-xs rounded-lg border transition-colors ${
                              activeSize === size
                                ? "bg-stone-900 text-stone-50 border-stone-900 font-medium"
                                : "bg-white text-stone-700 border-stone-300 hover:border-rose-900"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] tracking-[0.15em] uppercase text-rose-900 font-medium">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {product.colors.map((color) => (
                            <button
                              key={color.name}
                              type="button"
                              title={color.name}
                              onClick={() =>
                                handleSelectColor(product.id, color.name)
                              }
                              style={{ backgroundColor: color.hex }}
                              className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                                activeColor === color.name
                                  ? "ring-2 ring-rose-900 ring-offset-1 scale-110 border-stone-400"
                                  : "border-stone-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <Link
                        href={`/product/${product.slug}`}
                        className="block text-lg font-serif text-stone-900 mt-1.5 font-normal hover:text-rose-900 transition-colors"
                      >
                        {product.name}
                      </Link>

                      <p className="text-xs text-stone-600 font-light mt-2 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between gap-4">
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
                        onClick={() => handleAddToCart(product)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-rose-900 text-stone-50 text-xs tracking-wider uppercase font-medium rounded-xl transition-colors"
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
        </div>
      </section>
    </div>
  );
}
