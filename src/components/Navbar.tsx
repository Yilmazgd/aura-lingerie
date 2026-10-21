"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ShieldCheck,
  PackageSearch,
  LayoutDashboard
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import SearchModal from "@/components/SearchModal";

export default function Navbar() {
  const { totalItems, openCart } = useCart();
  const { totalWishlistItems } = useWishlist();
  const { currentUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const navLinks = [
    { label: "Tüm Mağaza", href: "/shop" },
    {
      label: "Kadın İç Giyim",
      href: "/shop?category=Kad%C4%B1n%20%C4%B0%C3%A7%20Giyim"
    },
    {
      label: "Pijama & Ev Giyim",
      href: "/shop?category=Pijama%20%26%20Ev%20Giyim"
    },
    {
      label: "Erkek İç Giyim",
      href: "/shop?category=Erkek%20%C4%B0%C3%A7%20Giyim"
    },
    {
      label: "Çeyiz & Özel Koleksiyon",
      href: "/shop?category=%C3%87eyiz%20%26%20%C3%96zel%20Koleksiyon"
    },
    {
      label: "İndirim",
      href: "/shop?category=%C4%B0ndirim",
      highlight: true
    }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-stone-50/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
        <div className="bg-stone-900 text-stone-100 text-[11px] sm:text-xs tracking-wider py-2 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5">
            <div className="flex items-center justify-center gap-2 text-center font-light">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-300 shrink-0" />
              <span>
                1000 TL Üzeri Ücretsiz Kargo | %100 Gizli Paketleme Güvencesi
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-medium">
              <Link
                href="/order-tracking"
                className="inline-flex items-center gap-1.5 text-stone-200 hover:text-rose-300 transition-colors"
              >
                <PackageSearch className="w-3.5 h-3.5 text-rose-300" />
                <span>Sipariş Takibi</span>
              </Link>
              <span className="text-stone-700">|</span>
              <Link
                href="/legal"
                className="text-stone-300 hover:text-rose-300 transition-colors"
              >
                Kurumsal &amp; Gizlilik
              </Link>
              <span className="text-stone-700">|</span>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-rose-300 hover:text-stone-50 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Yönetici Paneli (Admin)</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 -ml-2 text-stone-700 hover:text-rose-900 transition-colors"
                aria-label="Menüyü Aç/Kapat"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

              <Link href="/" className="group flex flex-col">
                <span className="text-2xl sm:text-3xl font-serif tracking-[0.22em] text-stone-900 font-normal">
                  AURA
                </span>
                <span className="text-[9px] tracking-[0.38em] text-rose-900 uppercase -mt-1 font-medium">
                  Lingerie &amp; Lounge
                </span>
              </Link>
            </div>

            <nav className="hidden lg:flex items-center space-x-6">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm tracking-wide transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-rose-900 hover:after:w-full after:transition-all ${
                    item.highlight
                      ? "text-rose-900 font-medium"
                      : "text-stone-700 hover:text-stone-900"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-1.5 sm:space-x-2.5">
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="p-2.5 text-stone-700 hover:text-rose-900 transition-colors rounded-full hover:bg-stone-100"
                aria-label="Canlı Arama Penceresini Aç"
              >
                <Search className="w-5 h-5 stroke-[1.5]" />
              </button>

              <Link
                href="/account"
                className="relative p-2.5 text-stone-700 hover:text-rose-900 transition-colors rounded-full hover:bg-stone-100"
                aria-label="Hesabım"
                title={
                  currentUser
                    ? `Hesabım (${currentUser.fullName})`
                    : "Giriş Yap / Üye Ol"
                }
              >
                <User className="w-5 h-5 stroke-[1.5]" />
                {currentUser && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-stone-50" />
                )}
              </Link>

              <Link
                href="/wishlist"
                className="relative p-2.5 text-stone-700 hover:text-rose-900 transition-colors rounded-full hover:bg-stone-100"
                aria-label="Favorilerim"
              >
                <Heart
                  className={`w-5 h-5 stroke-[1.5] ${
                    totalWishlistItems > 0 ? "text-rose-900" : ""
                  }`}
                />
                {totalWishlistItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-rose-900 text-stone-50 text-[10px] font-medium flex items-center justify-center shadow-xs">
                    {totalWishlistItems}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={openCart}
                className="relative p-2.5 text-stone-800 hover:text-rose-900 transition-colors rounded-full hover:bg-stone-100 flex items-center gap-1.5"
                aria-label="Sepetim"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                <span className="-top-0.5 -right-0.5 absolute w-5 h-5 rounded-full bg-rose-900 text-stone-50 text-[11px] font-medium flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-stone-50 border-t border-stone-200 px-6 py-6 space-y-4 shadow-lg">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base py-1.5 border-b border-stone-200/60 ${
                    item.highlight
                      ? "text-rose-900 font-medium"
                      : "text-stone-800"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base py-1.5 border-b border-stone-200/60 text-stone-800 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-rose-900" />
                  <span>Hesabım (/account)</span>
                </span>
                {currentUser && (
                  <span className="text-xs text-emerald-700 font-medium">
                    {currentUser.fullName}
                  </span>
                )}
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base py-1.5 border-b border-stone-200/60 text-stone-800 flex items-center justify-between"
              >
                <span>Favorilerim</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-900 text-stone-50">
                  {totalWishlistItems}
                </span>
              </Link>
              <Link
                href="/order-tracking"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base py-1.5 border-b border-stone-200/60 text-stone-800 flex items-center gap-2"
              >
                <PackageSearch className="w-4 h-4 text-rose-900" />
                <span>Sipariş Takibi</span>
              </Link>
              <Link
                href="/legal"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base py-1.5 border-b border-stone-200/60 text-stone-800 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-rose-900" />
                <span>Kurumsal &amp; Yasal Bilgiler (/legal)</span>
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base py-1.5 border-b border-stone-200/60 text-rose-900 font-medium flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Yönetici Paneli (Admin)</span>
              </Link>
            </nav>
          </div>
        )}
      </header>

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}
