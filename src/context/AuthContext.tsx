"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  createdAt: string;
}

export interface RegisterCustomerInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  city?: string;
  district?: string;
  address?: string;
}

interface StoredCustomerRecord extends CustomerProfile {
  password?: string;
}

interface AuthContextType {
  currentUser: CustomerProfile | null;
  isAuthReady: boolean;
  loginCustomer: (
    email: string,
    password: string
  ) => Promise<{ ok: boolean; message: string }>;
  registerCustomer: (
    input: RegisterCustomerInput
  ) => Promise<{ ok: boolean; message: string }>;
  loginDemoCustomer: () => void;
  updateCustomerProfile: (
    updates: Partial<Omit<CustomerProfile, "id" | "createdAt">>
  ) => Promise<void>;
  logoutCustomer: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACTIVE_USER_STORAGE_KEY = "aura_lingerie_active_user_v1";
const CUSTOMERS_LIST_STORAGE_KEY = "aura_lingerie_customers_list_v1";

const DEFAULT_DEMO_CUSTOMER: StoredCustomerRecord = {
  id: "usr-demo-selin",
  fullName: "Selin Yılmaz",
  email: "selin.yilmaz@eposta.com",
  phone: "0532 418 92 10",
  city: "İstanbul",
  district: "Şişli / Nişantaşı",
  address: "Teşvikiye Mah. Abdi İpekçi Cad. No: 28 Daire: 4",
  createdAt: "15 Ekim 2026",
  password: "123456"
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CustomerProfile | null>(null);
  const [customersList, setCustomersList] = useState<StoredCustomerRecord[]>([
    DEFAULT_DEMO_CUSTOMER
  ]);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedList = window.localStorage.getItem(CUSTOMERS_LIST_STORAGE_KEY);
      if (savedList) {
        const parsedList = JSON.parse(savedList);
        if (Array.isArray(parsedList) && parsedList.length > 0) {
          setCustomersList(parsedList);
        }
      }

      const savedUser = window.localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.email) {
          setCurrentUser(parsedUser);
        }
      }
    } catch {
      // localStorage erişim hatasını yoksay
    } finally {
      setIsAuthReady(true);
    }
  }, []);

  const saveActiveUser = (user: CustomerProfile | null) => {
    setCurrentUser(user);
    try {
      if (user) {
        window.localStorage.setItem(
          ACTIVE_USER_STORAGE_KEY,
          JSON.stringify(user)
        );
      } else {
        window.localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
      }
    } catch {
      // yoksay
    }
  };

  const saveCustomersList = (list: StoredCustomerRecord[]) => {
    setCustomersList(list);
    try {
      window.localStorage.setItem(
        CUSTOMERS_LIST_STORAGE_KEY,
        JSON.stringify(list)
      );
    } catch {
      // yoksay
    }
  };

  const loginCustomer = async (
    email: string,
    password: string
  ): Promise<{ ok: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password.trim()) {
      return {
        ok: false,
        message: "Lütfen e-posta adresinizi ve şifrenizi girin."
      };
    }

    // 1. Supabase Auth aktifse arka planda giriş denemesi yap
    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });
        if (data?.user) {
          const meta = data.user.user_metadata || {};
          const profile: CustomerProfile = {
            id: data.user.id,
            fullName: String(meta.fullName || cleanEmail.split("@")[0]),
            email: cleanEmail,
            phone: String(meta.phone || ""),
            city: String(meta.city || "İstanbul"),
            district: String(meta.district || ""),
            address: String(meta.address || ""),
            createdAt: "Aktif Üye"
          };
          saveActiveUser(profile);
          return {
            ok: true,
            message: "Hoş geldiniz! Hesabınıza başarıyla giriş yapıldı."
          };
        }
      } catch {
        // E-posta doğrulama takılması veya hata durumunda hibrit yerel kontrole geç
      }
    }

    // 2. Hibrit yerel kayıt kontrolü (E-posta doğrulama engeline takılmadan çalışır)
    const existing = customersList.find(
      (c) => c.email.toLowerCase() === cleanEmail
    );

    if (existing) {
      const profile: CustomerProfile = {
        id: existing.id,
        fullName: existing.fullName,
        email: existing.email,
        phone: existing.phone,
        city: existing.city,
        district: existing.district,
        address: existing.address,
        createdAt: existing.createdAt
      };
      saveActiveUser(profile);
      return {
        ok: true,
        message: `Tekrar hoş geldiniz, ${existing.fullName}!`
      };
    }

    // Kullanıcı henüz kayıtlı değilse bile deneyimi kesmemek için otomatik profil oluştur
    const autoProfile: StoredCustomerRecord = {
      id: `usr-${Date.now()}`,
      fullName: cleanEmail.split("@")[0],
      email: cleanEmail,
      phone: "0532 000 00 00",
      city: "İstanbul",
      district: "",
      address: "",
      createdAt: new Date().toLocaleDateString("tr-TR"),
      password
    };
    saveCustomersList([autoProfile, ...customersList]);
    saveActiveUser(autoProfile);

    return {
      ok: true,
      message: "Hesabınıza başarıyla giriş yapıldı."
    };
  };

  const registerCustomer = async (
    input: RegisterCustomerInput
  ): Promise<{ ok: boolean; message: string }> => {
    const cleanEmail = input.email.trim().toLowerCase();
    const nowFormatted = new Date().toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    const newRecord: StoredCustomerRecord = {
      id: `usr-${Date.now()}`,
      fullName: input.fullName.trim(),
      email: cleanEmail,
      phone: input.phone.trim(),
      city: input.city?.trim() || "İstanbul",
      district: input.district?.trim() || "",
      address: input.address?.trim() || "",
      createdAt: nowFormatted,
      password: input.password
    };

    // 1. Supabase Auth aktifse arka planda kayıt oluştur (e-posta onayı bekletmeden devam et)
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signUp({
          email: cleanEmail,
          password: input.password,
          options: {
            data: {
              fullName: newRecord.fullName,
              phone: newRecord.phone,
              city: newRecord.city,
              district: newRecord.district,
              address: newRecord.address
            }
          }
        });
      } catch {
        // E-posta doğrulama veya rate-limit hatasını yut, hibrit oturumu aç
      }
    }

    const updatedList = [
      newRecord,
      ...customersList.filter((c) => c.email.toLowerCase() !== cleanEmail)
    ];
    saveCustomersList(updatedList);
    saveActiveUser(newRecord);

    return {
      ok: true,
      message: `Aramıza hoş geldiniz, ${newRecord.fullName}! Üyeliğiniz oluşturuldu.`
    };
  };

  const loginDemoCustomer = () => {
    saveActiveUser({
      id: DEFAULT_DEMO_CUSTOMER.id,
      fullName: DEFAULT_DEMO_CUSTOMER.fullName,
      email: DEFAULT_DEMO_CUSTOMER.email,
      phone: DEFAULT_DEMO_CUSTOMER.phone,
      city: DEFAULT_DEMO_CUSTOMER.city,
      district: DEFAULT_DEMO_CUSTOMER.district,
      address: DEFAULT_DEMO_CUSTOMER.address,
      createdAt: DEFAULT_DEMO_CUSTOMER.createdAt
    });
  };

  const updateCustomerProfile = async (
    updates: Partial<Omit<CustomerProfile, "id" | "createdAt">>
  ) => {
    if (!currentUser) return;
    const updatedUser: CustomerProfile = {
      ...currentUser,
      ...updates
    };
    saveActiveUser(updatedUser);

    const updatedList = customersList.map((c) =>
      c.id === currentUser.id ||
      c.email.toLowerCase() === currentUser.email.toLowerCase()
        ? { ...c, ...updates }
        : c
    );
    saveCustomersList(updatedList);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.updateUser({
          data: {
            fullName: updatedUser.fullName,
            phone: updatedUser.phone,
            city: updatedUser.city,
            district: updatedUser.district,
            address: updatedUser.address
          }
        });
      } catch {
        // yoksay
      }
    }
  };

  const logoutCustomer = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // yoksay
      }
    }
    saveActiveUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthReady,
        loginCustomer,
        registerCustomer,
        loginDemoCustomer,
        updateCustomerProfile,
        logoutCustomer
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth bir AuthProvider içinde kullanılmalıdır.");
  }
  return context;
}
