"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo
} from "react";
import { Product, products as defaultProducts } from "@/data/products";

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (
    product: Product,
    selectedSize: string,
    selectedColor: string,
    quantity?: number
  ) => void;
  removeFromCart: (
    productId: string,
    selectedSize: string,
    selectedColor: string
  ) => void;
  updateQuantity: (
    productId: string,
    selectedSize: string,
    selectedColor: string,
    delta: number
  ) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEY = "aura_lingerie_cart_v1";

const DEFAULT_INITIAL_CART: CartItem[] = [
  {
    product: defaultProducts[0],
    selectedSize: "S",
    selectedColor: "Gül Kurusu",
    quantity: 1
  }
];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(DEFAULT_INITIAL_CART);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // localStorage erişim hatası varsa varsayılan sepet ile devam et
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage yazma hatasını yoksay
    }
  }, [items, isHydrated]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (
    product: Product,
    selectedSize: string,
    selectedColor: string,
    quantity: number = 1
  ) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      }

      return [
        ...prevItems,
        {
          product,
          selectedSize,
          selectedColor,
          quantity
        }
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (
    productId: string,
    selectedSize: string,
    selectedColor: string
  ) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
          )
      )
    );
  };

  const updateQuantity = (
    productId: string,
    selectedSize: string,
    selectedColor: string,
    delta: number
  ) => {
    setItems((prevItems) =>
      prevItems
        .map((item) => {
          if (
            item.product.id === productId &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
          ) {
            return {
              ...item,
              quantity: Math.max(0, item.quantity + delta)
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart bir CartProvider içinde kullanılmalıdır.");
  }
  return context;
}
