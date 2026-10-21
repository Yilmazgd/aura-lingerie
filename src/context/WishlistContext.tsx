"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo
} from "react";
import { Product } from "@/data/products";
import { useStore } from "@/context/StoreContext";

interface WishlistContextType {
  wishlistItems: Product[];
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  totalWishlistItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

const WISHLIST_STORAGE_KEY = "aura_lingerie_wishlist_v1";

export function WishlistProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const { products } = useStore();
  const [wishlistIds, setWishlistIds] = useState<string[]>(["prd-1"]);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setWishlistIds(parsed);
        }
      }
    } catch {
      // localStorage erişim hatası varsa varsayılan liste ile devam et
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(wishlistIds)
      );
    } catch {
      // localStorage yazma hatasını yoksay
    }
  }, [wishlistIds, isHydrated]);

  const toggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  const clearWishlist = () => setWishlistIds([]);

  const wishlistItems = useMemo(
    () => products.filter((p) => wishlistIds.includes(p.id)),
    [products, wishlistIds]
  );

  const totalWishlistItems = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        totalWishlistItems
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error(
      "useWishlist bir WishlistProvider içinde kullanılmalıdır."
    );
  }
  return context;
}
