"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import {
  products as initialProducts,
  Product,
  ProductCategory,
  ProductColor
} from "@/data/products";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export type OrderStatus =
  | "Sipariş Alındı"
  | "Hazırlanıyor"
  | "Gizli Paketle Kargoya Verildi"
  | "Teslim Edildi";

export interface OrderItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  items: OrderItem[];
  packagingType: "standard" | "gift";
  giftNote?: string;
  subtotal: number;
  shippingCost: number;
  packagingCost: number;
  totalAmount: number;
  status: OrderStatus;
}

export interface NewProductInput {
  name: string;
  category: ProductCategory;
  price: number;
  oldPrice?: number;
  imageUrl: string;
  sizes: string[];
  colors?: ProductColor[];
  isNew?: boolean;
  description: string;
}

export interface CreateOrderInput {
  customerName: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  items: OrderItem[];
  packagingType: "standard" | "gift";
  giftNote?: string;
  subtotal: number;
  shippingCost: number;
  packagingCost: number;
  totalAmount: number;
}

interface StoreContextType {
  products: Product[];
  orders: Order[];
  isCloudConnected: boolean;
  isLoadingCloud: boolean;
  syncError: string | null;
  refreshFromCloud: () => Promise<void>;
  addProduct: (input: NewProductInput) => Promise<Product>;
  updateProduct: (id: string, updated: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  resetProducts: () => Promise<void>;
  createOrder: (input: CreateOrderInput) => Promise<Order>;
  updateOrderStatus: (orderNumber: string, status: OrderStatus) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const PRODUCTS_STORAGE_KEY = "aura_lingerie_store_products_v1";
const ORDERS_STORAGE_KEY = "aura_lingerie_store_orders_v1";

const slugifyTurkish = (text: string) => {
  const trMap: Record<string, string> = {
    ç: "c",
    Ç: "c",
    ğ: "g",
    Ğ: "g",
    ı: "i",
    İ: "i",
    ö: "o",
    Ö: "o",
    ş: "s",
    Ş: "s",
    ü: "u",
    Ü: "u"
  };
  return text
    .split("")
    .map((ch) => trMap[ch] || ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const INITIAL_SAMPLE_ORDERS: Order[] = [
  {
    id: "#AURA-84920",
    orderNumber: "#AURA-84920",
    createdAt: "15 Ekim 2026, 14:30",
    customerName: "Selin Yılmaz",
    email: "selin.yilmaz@eposta.com",
    phone: "0532 418 92 10",
    city: "İstanbul",
    district: "Şişli / Nişantaşı",
    address: "Teşvikiye Mah. Abdi İpekçi Cad. No: 28 Daire: 4",
    items: [
      {
        product: initialProducts[0],
        selectedSize: "S",
        selectedColor: "Gül Kurusu",
        quantity: 1
      },
      {
        product: initialProducts[1],
        selectedSize: "80B",
        selectedColor: "Kırık Beyaz",
        quantity: 1
      }
    ],
    packagingType: "gift",
    giftNote:
      "Yeni yaşın sana ipek gibi zarif ve huzurlu günler getirsin. İyi ki doğdun!",
    subtotal: 6440,
    shippingCost: 0,
    packagingCost: 49,
    totalAmount: 6489,
    status: "Gizli Paketle Kargoya Verildi"
  },
  {
    id: "#AURA-73105",
    orderNumber: "#AURA-73105",
    createdAt: "15 Ekim 2026, 11:15",
    customerName: "Mert Demir",
    email: "mert.demir@eposta.com",
    phone: "0544 892 31 04",
    city: "İstanbul",
    district: "Kadıköy / Suadiye",
    address: "Suadiye Mah. Bağdat Cad. No: 382 Kat: 3 Daire: 9",
    items: [
      {
        product: initialProducts[2],
        selectedSize: "M",
        selectedColor: "İnci Beyazı",
        quantity: 1
      }
    ],
    packagingType: "standard",
    subtotal: 3890,
    shippingCost: 0,
    packagingCost: 0,
    totalAmount: 3890,
    status: "Hazırlanıyor"
  }
];

// Supabase tablosuna gönderilecek Product satırı formatı
const toDbProductRow = (p: Product) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  category: p.category,
  price: Number(p.price),
  oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
  images: p.images,
  sizes: p.sizes,
  colors: p.colors,
  isNew: Boolean(p.isNew),
  description: p.description
});

// Supabase tablosundan gelen Product satırını uygulama tipine dönüştürme
const fromDbProductRow = (row: Record<string, unknown>): Product => ({
  id: String(row.id || ""),
  name: String(row.name || ""),
  slug: String(row.slug || ""),
  category: (row.category as ProductCategory) || "Kadın İç Giyim",
  price: Number(row.price || 0),
  oldPrice:
    row.oldPrice !== null && row.oldPrice !== undefined
      ? Number(row.oldPrice)
      : undefined,
  images: Array.isArray(row.images) ? (row.images as string[]) : [],
  sizes: Array.isArray(row.sizes) ? (row.sizes as string[]) : ["S", "M", "L"],
  colors: Array.isArray(row.colors)
    ? (row.colors as ProductColor[])
    : [{ name: "İnci Kremi", hex: "#F5EFE6" }],
  isNew: Boolean(row.isNew),
  description: String(row.description || "")
});

// Supabase orders tablosuna gönderilecek satır formatı
// Kolonlar: id, "customerName", email, phone, city, district, address, items, "packagingType", "giftNote", "totalAmount", status, "createdAt"
const toDbOrderRow = (o: Order) => ({
  id: o.orderNumber,
  customerName: o.customerName,
  email: o.email,
  phone: o.phone,
  city: o.city,
  district: o.district,
  address: o.address,
  items: o.items,
  packagingType: o.packagingType,
  giftNote: o.giftNote || null,
  totalAmount: Number(o.totalAmount),
  status: o.status,
  createdAt: o.createdAt
});

// Supabase orders tablosundan gelen satırı Order tipine dönüştürme
const fromDbOrderRow = (row: Record<string, unknown>): Order => {
  const rawId = String(row.id || "");
  const orderNumber = rawId.startsWith("#AURA-")
    ? rawId
    : String(row.orderNumber || `#AURA-${rawId.slice(-5)}`);
  const packagingType =
    row.packagingType === "gift" ? "gift" : ("standard" as const);
  const totalAmount = Number(row.totalAmount || 0);
  const packagingCost = packagingType === "gift" ? 49 : 0;
  const items = Array.isArray(row.items) ? (row.items as OrderItem[]) : [];
  const computedSubtotal = items.reduce(
    (sum, item) => sum + Number(item?.product?.price || 0) * Number(item?.quantity || 1),
    0
  );

  return {
    id: orderNumber,
    orderNumber,
    createdAt: String(row.createdAt || ""),
    customerName: String(row.customerName || "Değerli Müşterimiz"),
    email: String(row.email || ""),
    phone: String(row.phone || ""),
    city: String(row.city || "İstanbul"),
    district: String(row.district || ""),
    address: String(row.address || ""),
    items,
    packagingType,
    giftNote: row.giftNote ? String(row.giftNote) : undefined,
    subtotal: computedSubtotal || Math.max(0, totalAmount - packagingCost),
    shippingCost: 0,
    packagingCost,
    totalAmount,
    status: (row.status as OrderStatus) || "Sipariş Alındı"
  };
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(INITIAL_SAMPLE_ORDERS);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);
  const [isLoadingCloud, setIsLoadingCloud] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // 1. Önce localStorage yedeğini yükle
  useEffect(() => {
    try {
      const savedProducts = window.localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      }
      const savedOrders = window.localStorage.getItem(ORDERS_STORAGE_KEY);
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        if (Array.isArray(parsedOrders) && parsedOrders.length > 0) {
          setOrders(parsedOrders);
        }
      }
    } catch {
      // localStorage erişim hatası varsa varsayılan verilerle devam et
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // 2. Supabase aktifse gerçek verileri çek ve products tablosu boşsa Auto-Seed yap
  const refreshFromCloud = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setIsCloudConnected(false);
      return;
    }

    setIsLoadingCloud(true);
    setSyncError(null);

    try {
      // A) PRODUCTS TABLOSU KONTROLÜ & AUTO-SEEDING
      const { data: dbProducts, error: prodError } = await supabase
        .from("products")
        .select("*");

      if (prodError) {
        throw prodError;
      }

      if (!dbProducts || dbProducts.length === 0) {
        // Tablo boşsa varsayılan 6 iç giyim ürününü otomatik olarak Supabase'e insert et
        const seedPayload = initialProducts.map(toDbProductRow);
        const { data: insertedProducts, error: seedError } = await supabase
          .from("products")
          .insert(seedPayload)
          .select("*");

        if (seedError) {
          throw seedError;
        }

        if (insertedProducts && insertedProducts.length > 0) {
          setProducts(insertedProducts.map(fromDbProductRow));
        } else {
          setProducts(initialProducts);
        }
      } else {
        setProducts(dbProducts.map(fromDbProductRow));
      }

      // B) ORDERS TABLOSU KONTROLÜ & AUTO-SEEDING
      const { data: dbOrders, error: ordError } = await supabase
        .from("orders")
        .select("*");

      if (ordError) {
        throw ordError;
      }

      if (!dbOrders || dbOrders.length === 0) {
        const seedOrdersPayload = INITIAL_SAMPLE_ORDERS.map(toDbOrderRow);
        const { data: insertedOrders, error: seedOrdError } = await supabase
          .from("orders")
          .insert(seedOrdersPayload)
          .select("*");

        if (!seedOrdError && insertedOrders && insertedOrders.length > 0) {
          setOrders(insertedOrders.map(fromDbOrderRow));
        }
      } else {
        setOrders(dbOrders.map(fromDbOrderRow));
      }

      setIsCloudConnected(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Supabase bağlantısı kurulamadı, yerel hafıza kullanılıyor.";
      setSyncError(message);
      setIsCloudConnected(false);
    } finally {
      setIsLoadingCloud(false);
    }
  }, []);

  useEffect(() => {
    refreshFromCloud();
  }, [refreshFromCloud]);

  // 3. Değişiklikleri her zaman localStorage'a da yedekle
  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(
        PRODUCTS_STORAGE_KEY,
        JSON.stringify(products)
      );
    } catch {
      // yoksay
    }
  }, [products, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // yoksay
    }
  }, [orders, isHydrated]);

  // ÜRÜN EKLEME (State + Supabase Insert)
  const addProduct = async (input: NewProductInput): Promise<Product> => {
    const id = `prd-${Date.now()}`;
    const baseSlug = slugifyTurkish(input.name) || `urun-${Date.now()}`;
    const newProduct: Product = {
      id,
      name: input.name.trim(),
      slug: `${baseSlug}-${id.slice(-4)}`,
      category: input.category,
      price: Number(input.price),
      oldPrice:
        input.oldPrice && Number(input.oldPrice) > Number(input.price)
          ? Number(input.oldPrice)
          : undefined,
      images: [
        input.imageUrl.trim() || initialProducts[0].images[0],
        initialProducts[0].images[1],
        initialProducts[1].images[0]
      ],
      sizes: input.sizes.length > 0 ? input.sizes : ["S", "M", "L"],
      colors:
        input.colors && input.colors.length > 0
          ? input.colors
          : [
              { name: "İnci Kremi", hex: "#F5EFE6" },
              { name: "Mürdüm Bordo", hex: "#581C2F" }
            ],
      isNew: input.isNew ?? true,
      description: input.description.trim()
    };

    // Önce ekranı (state) anında güncelle
    setProducts((prev) => [newProduct, ...prev]);

    // Supabase aktifse buluta kaydet
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("products")
        .insert([toDbProductRow(newProduct)]);
      if (error) {
        setSyncError(`Ürün buluta kaydedilemedi: ${error.message}`);
      }
    }

    return newProduct;
  };

  // ÜRÜN GÜNCELLEME (State + Supabase Update)
  const updateProduct = async (
    id: string,
    updated: Partial<Product>
  ): Promise<void> => {
    let updatedProductObj: Product | null = null;

    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          updatedProductObj = { ...item, ...updated };
          return updatedProductObj;
        }
        return item;
      })
    );

    if (isSupabaseConfigured && supabase && updatedProductObj) {
      const { error } = await supabase
        .from("products")
        .update(toDbProductRow(updatedProductObj))
        .eq("id", id);
      if (error) {
        setSyncError(`Ürün güncellenemedi: ${error.message}`);
      }
    }
  };

  // ÜRÜN SİLME (State + Supabase Delete)
  const deleteProduct = async (id: string): Promise<void> => {
    setProducts((prev) => prev.filter((item) => item.id !== id));

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        setSyncError(`Ürün silinemedi: ${error.message}`);
      }
    }
  };

  // VARSAYILAN ÜRÜNLERE SIFIRLAMA
  const resetProducts = async (): Promise<void> => {
    setProducts(initialProducts);
    try {
      window.localStorage.setItem(
        PRODUCTS_STORAGE_KEY,
        JSON.stringify(initialProducts)
      );
    } catch {
      // yoksay
    }

    if (isSupabaseConfigured && supabase) {
      await supabase
        .from("products")
        .upsert(initialProducts.map(toDbProductRow));
    }
  };

  // YENİ SİPARİŞ OLUŞTURMA (State + Supabase Insert)
  const createOrder = async (input: CreateOrderInput): Promise<Order> => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `#AURA-${randomNum}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const newOrder: Order = {
      id: orderNumber,
      orderNumber,
      createdAt: formattedDate,
      customerName: input.customerName,
      email: input.email,
      phone: input.phone,
      city: input.city,
      district: input.district,
      address: input.address,
      items: input.items,
      packagingType: input.packagingType,
      giftNote: input.giftNote,
      subtotal: input.subtotal,
      shippingCost: input.shippingCost,
      packagingCost: input.packagingCost,
      totalAmount: input.totalAmount,
      status: "Sipariş Alındı"
    };

    // Ekranı anında güncelle
    setOrders((prev) => [newOrder, ...prev]);

    // Supabase aktifse orders tablosuna kaydet
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("orders")
        .insert([toDbOrderRow(newOrder)]);
      if (error) {
        setSyncError(`Sipariş buluta kaydedilemedi: ${error.message}`);
      }
    }

    return newOrder;
  };

  // SİPARİŞ DURUMU GÜNCELLEME (State + Supabase Update)
  const updateOrderStatus = async (
    orderNumber: string,
    status: OrderStatus
  ): Promise<void> => {
    let targetId = orderNumber;

    setOrders((prev) =>
      prev.map((ord) => {
        if (
          ord.orderNumber.toLowerCase() === orderNumber.toLowerCase() ||
          ord.id.toLowerCase() === orderNumber.toLowerCase()
        ) {
          targetId = ord.id;
          return { ...ord, status };
        }
        return ord;
      })
    );

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", targetId);
      if (error) {
        setSyncError(`Sipariş durumu güncellenemedi: ${error.message}`);
      }
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        isCloudConnected,
        isLoadingCloud,
        syncError,
        refreshFromCloud,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProducts,
        createOrder,
        updateOrderStatus
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore bir StoreProvider içinde kullanılmalıdır.");
  }
  return context;
}
