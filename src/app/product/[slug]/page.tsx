"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  Ruler,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Lock,
  ArrowLeft
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductDetailPage() {
  const routeParams = useParams<{ slug?: string | string[] }>();
  const resolvedSlug = Array.isArray(routeParams?.slug)
    ? routeParams.slug[0]
    : routeParams?.slug;

  const { products } = useStore();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const product = useMemo(
    () => products.find((p) => p.slug === resolvedSlug) || products[0],
    [products, resolvedSlug]
  );

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.colors[0]?.name || ""
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product?.sizes[0] || ""
  );
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [openAccordion, setOpenAccordion] = useState<string>("ozellikler");

  useEffect(() => {
    if (!product) return;
    setActiveImageIndex(0);
    setSelectedColor(product.colors[0]?.name || "");
    setSelectedSize(product.sizes[0] || "");
  }, [product]);

  if (!product) return null;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0
    }).format(price);

  const isFav = isInWishlist(product.id);

  const accordionItems = [
    {
      id: "ozellikler",
      title: "Ürün Özellikleri & Kumaş Bakımı",
      icon: Sparkles,
      content:
        "OEKO-TEX® Standard 100 sertifikalı doğal ipliklerden üretilmiştir. İpek ve Fransız dantelli dokuların formunu uzun yıllar koruması için maksimum 30°C'de elde veya hassas programda, ağartıcı içermeyen ipek şampuanı ile yıkanması önerilir."
    },
    {
      id: "hijyen",
      title: "Hijyen Bandı ve İade Koşulları",
      icon: ShieldCheck,
      content:
        "İç giyim alt grup ürünlerinde hijyen koruma bandı açılmamış, denenmemiş ve orijinal ambalajı bozulmamış ürünlerde teslimat tarihinden itibaren 14 gün içinde ücretsiz değişim ve iade imkanı sunulmaktadır."
    },
    {
      id: "gizli-kargo",
      title: "Gizli Kargo Güvencesi",
      icon: Lock,
      content:
        "Kargo poşeti, dış kutu ve kargo teslimat fişi üzerinde 'İç Giyim / Lingerie' ibaresi veya ürün içeriği kesinlikle bulunmaz. Gönderici bilgisi yalnızca kurumsal şirket unvanımız olan 'Aura Tekstil A.Ş.' şeklinde yer alır."
    }
  ];

  return (
    <div className="bg-stone-50 text-stone-900 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 pb-6 border-b border-stone-200/80 text-xs text-stone-500"
        >
          <Link
            href="/"
            className="hover:text-stone-900 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ana Sayfa</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link
            href={`/shop?category=${encodeURIComponent(product.category)}`}
            className="hover:text-stone-900 transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-900 font-medium truncate">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pt-8">
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] sm:aspect-[4/4] rounded-2xl overflow-hidden bg-stone-200 border border-stone-200/80 shadow-sm">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-200 border transition-all ${
                    activeImageIndex === idx
                      ? "ring-2 ring-rose-900 ring-offset-2 border-rose-900"
                      : "border-stone-200 opacity-75 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs tracking-[0.22em] uppercase text-rose-900 font-medium">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-stone-900 mt-1.5 font-normal">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-2xl sm:text-3xl font-serif font-medium text-stone-900">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-base text-stone-400 line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>

              <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed mt-4">
                {product.description}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">
                  Beden / Kupa: <strong>{selectedSize}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-900 font-medium underline"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>📏 Beden Tablosu</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 rounded-xl border text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 ${
                      selectedSize === size
                        ? "bg-stone-900 text-stone-50 border-stone-900 font-medium"
                        : "bg-white text-stone-700 border-stone-300 hover:border-rose-900"
                    }`}
                  >
                    {selectedSize === size && <Check className="w-3.5 h-3.5" />}
                    <span>{size}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  addToCart(product, selectedSize, selectedColor, 1)
                }
                className="flex-1 py-4 px-6 bg-rose-900 hover:bg-rose-950 text-stone-50 text-xs tracking-[0.2em] uppercase font-medium rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Sepete Ekle — {formatPrice(product.price)}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label="Favorilere Ekle"
                className={`p-4 rounded-xl border transition-colors ${
                  isFav
                    ? "bg-rose-900/10 border-rose-900 text-rose-900"
                    : "bg-white border-stone-300 text-stone-700 hover:border-rose-900"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFav ? "fill-rose-900 text-rose-900" : ""
                  }`}
                />
              </button>
            </div>

            <div className="pt-4 border-t border-stone-200/80 divide-y divide-stone-200/80">
              {accordionItems.map((item) => {
                const Icon = item.icon;
                const isOpen = openAccordion === item.id;
                return (
                  <div key={item.id} className="py-3.5">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenAccordion(isOpen ? "" : item.id)
                      }
                      className="w-full flex items-center justify-between text-left py-1"
                    >
                      <span className="flex items-center gap-2.5 text-sm font-serif text-stone-900 font-medium">
                        <Icon className="w-4 h-4 text-rose-900 shrink-0" />
                        <span>{item.title}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-stone-500 transition-transform ${
                          isOpen ? "rotate-180 text-rose-900" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="pt-2.5 text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                        {item.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-stone-50 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-lg font-serif text-stone-900">
                AURA Lingerie Beden Tablosu
              </h3>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                className="p-1 text-stone-500 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-stone-600">
              XS (34): Göğüs 80-84 cm | S (36): Göğüs 85-89 cm | M (38): Göğüs
              90-94 cm | L (40): Göğüs 95-99 cm | XL (42): Göğüs 100-105 cm
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
