"use client";

import React from "react";
import Link from "next/link";
import {
  Heart,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0
    }).format(price);

  return (
    <div className="bg-stone-50 text-stone-900 py-12 lg:py-16 min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 border-b border-stone-200/80 gap-4">
          <div>
            <span className="text-xs tracking-[0.22em] uppercase text-rose-900 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ÖZEL SEÇKİNİZ</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 mt-1 font-normal">
              Favori Listem ({wishlistItems.length})
            </h1>
          </div>

          {wishlistItems.length > 0 && (
            <button
              type="button"
              onClick={clearWishlist}
              className="text-xs tracking-wider uppercase text-stone-500 hover:text-rose-900 transition-colors underline underline-offset-4 self-start sm:self-auto"
            >
              Tüm Favorileri Temizle
            </button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center max-w-lg mx-auto my-12 space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-rose-900/10 text-rose-900 flex items-center justify-center mx-auto">
              <Heart className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h2 className="text-2xl font-serif text-stone-900 font-normal">
              Favori Listeniz Henüz Boş
            </h2>
            <p className="text-sm text-stone-600 font-light leading-relaxed">
              Beğendiğiniz ipek pijama takımlarını, Fransız dantelli braletleri
              ve çeyiz parçalarını kalp ikonuna tıklayarak favorilerinize
              kaydedebilirsiniz.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-rose-900 hover:bg-rose-950 text-stone-50 text-xs tracking-[0.18em] uppercase font-medium rounded-full transition-colors mt-2"
            >
              <span>Koleksiyonu Keşfet</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
            {wishlistItems.map((product) => (
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
                    onClick={() => removeFromWishlist(product.id)}
                    aria-label="Favorilerden Çıkar"
                    className="absolute top-3.5 right-3.5 px-3 py-1.5 rounded-full bg-stone-50/95 backdrop-blur-xs text-rose-900 hover:bg-rose-900 hover:text-stone-50 text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Favorilerden Çıkar</span>
                  </button>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[11px] tracking-[0.15em] uppercase text-rose-900 font-medium">
                      {product.category}
                    </span>
                    <Link
                      href={`/product/${product.slug}`}
                      className="block text-lg font-serif text-stone-900 mt-1 hover:text-rose-900 transition-colors"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-stone-500 font-light mt-1.5 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-stone-500">Fiyat</span>
                      <div className="text-right">
                        {product.oldPrice && (
                          <span className="text-xs text-stone-400 line-through mr-2">
                            {formatPrice(product.oldPrice)}
                          </span>
                        )}
                        <span className="text-lg font-serif font-medium text-stone-900">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <Link
                        href={`/product/${product.slug}`}
                        className="py-2.5 px-3 rounded-xl border border-stone-300 text-stone-800 hover:border-stone-900 text-xs tracking-wider uppercase font-medium text-center transition-colors"
                      >
                        Ürüne Git
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          addToCart(
                            product,
                            product.sizes[0],
                            product.colors[0].name,
                            1
                          )
                        }
                        className="py-2.5 px-3 rounded-xl bg-rose-900 hover:bg-rose-950 text-stone-50 text-xs tracking-wider uppercase font-medium flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Sepete Ekle</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
