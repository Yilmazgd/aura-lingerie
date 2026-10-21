"use client";

import React from "react";
import Link from "next/link";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Lock,
  Truck,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useCart } from "@/context/CartContext";

const FREE_SHIPPING_THRESHOLD = 1000;

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice
  } = useCart();

  if (!isCartOpen) return null;

  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - totalPrice
  );
  const progressPercentage = Math.min(
    100,
    Math.round((totalPrice / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0
    }).format(price);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-stone-950/50 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-50 text-stone-900 shadow-2xl flex flex-col justify-between border-l border-stone-200">
          <div className="p-6 bg-white border-b border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-rose-900 stroke-[1.75]" />
                <h2 className="text-lg font-serif text-stone-900 font-medium">
                  Alışveriş Sepetim ({totalItems})
                </h2>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="p-2 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
                aria-label="Sepeti Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/90 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-stone-700">
                  <Truck className="w-4 h-4 text-rose-900 shrink-0" />
                  {remainingForFreeShipping === 0 ? (
                    <span className="font-medium text-rose-900">
                      Tebrikler, Kargonuz Ücretsiz!
                    </span>
                  ) : (
                    <span>
                      Ücretsiz kargo için{" "}
                      <strong className="text-stone-900 font-medium">
                        {formatPrice(remainingForFreeShipping)}
                      </strong>{" "}
                      kaldı
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium text-stone-500">
                  %{progressPercentage}
                </span>
              </div>

              <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-900 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-200/70 flex items-center justify-center text-stone-500">
                  <ShoppingBag className="w-7 h-7 stroke-[1.25]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-serif text-stone-900">
                    Sepetiniz Şu An Boş
                  </h3>
                  <p className="text-xs text-stone-500 font-light max-w-xs">
                    Saf Mulberry ipeği pijamalar ve Fransız dantelli özel
                    koleksiyonumuzu keşfetmeye başlayın.
                  </p>
                </div>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="mt-2 px-6 py-3 bg-stone-900 hover:bg-rose-900 text-stone-50 text-xs tracking-[0.15em] uppercase font-medium rounded-full transition-colors"
                >
                  Alışverişe Başla
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const itemKey = `${item.product.id}-${item.selectedSize}-${item.selectedColor}`;
                const colorObj = item.product.colors.find(
                  (c) => c.name === item.selectedColor
                );

                return (
                  <div
                    key={itemKey}
                    className="flex gap-4 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs hover:border-stone-300 transition-all"
                  >
                    <Link
                      href={`/product/${item.product.slug}`}
                      onClick={closeCart}
                      className="w-20 h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover object-center"
                      />
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/product/${item.product.slug}`}
                            onClick={closeCart}
                            className="text-sm font-serif text-stone-900 hover:text-rose-900 transition-colors line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(
                                item.product.id,
                                item.selectedSize,
                                item.selectedColor
                              )
                            }
                            className="text-stone-400 hover:text-rose-900 transition-colors p-0.5"
                            aria-label={`${item.product.name} ürününü sepetten çıkar`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-stone-500">
                          <span className="px-2 py-0.5 bg-stone-100 rounded-md text-stone-700 font-medium">
                            Beden: {item.selectedSize}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-stone-100 rounded-md text-stone-700">
                            {colorObj && (
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-stone-300"
                                style={{ backgroundColor: colorObj.hex }}
                              />
                            )}
                            <span>{item.selectedColor}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-100">
                        <div className="inline-flex items-center border border-stone-200 rounded-lg bg-stone-50">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedSize,
                                item.selectedColor,
                                -1
                              )
                            }
                            className="p-1.5 text-stone-600 hover:text-rose-900 transition-colors"
                            aria-label="Adet Azalt"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-medium text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedSize,
                                item.selectedColor,
                                1
                              )
                            }
                            className="p-1.5 text-stone-600 hover:text-rose-900 transition-colors"
                            aria-label="Adet Artır"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          {item.product.oldPrice && (
                            <span className="text-[11px] text-stone-400 line-through block">
                              {formatPrice(
                                item.product.oldPrice * item.quantity
                              )}
                            </span>
                          )}
                          <span className="text-sm font-serif font-medium text-stone-900">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-stone-200 space-y-4">
              <div className="flex items-start gap-2.5 bg-rose-900/5 border border-rose-900/15 p-3 rounded-xl">
                <Lock className="w-4 h-4 text-rose-900 shrink-0 mt-0.5" />
                <p className="text-[11px] text-stone-700 leading-relaxed font-light">
                  🔒 Siparişiniz{" "}
                  <strong className="font-medium text-stone-900">
                    %100 Gizli Paketleme
                  </strong>{" "}
                  ile gönderilir, dış pakette marka/ürün bilgisi yer almaz.
                </p>
              </div>

              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>Kargo</span>
                  <span>
                    {remainingForFreeShipping === 0
                      ? "Ücretsiz"
                      : formatPrice(89)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-stone-700 font-medium">Ara Toplam</span>
                  <span className="text-xl font-serif font-medium text-stone-900">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-4 bg-rose-900 hover:bg-rose-950 text-stone-50 text-xs tracking-[0.18em] uppercase font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Güvenli Ödemeye Geç</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
                <Sparkles className="w-3.5 h-3.5 text-rose-900" />
                <span>256-Bit SSL Güvenceli Ödeme &amp; Hijyen Mühürlü Kutu</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
