export type ProductCategory =
  | "Kadın İç Giyim"
  | "Pijama & Ev Giyim"
  | "Erkek İç Giyim"
  | "Çeyiz & Özel Koleksiyon";

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number;
  oldPrice?: number;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  isNew: boolean;
  description: string;
}

export const products: Product[] = [
  {
    id: "prd-1",
    name: "Mulberry Saf İpek Biyeli Pijama Takımı",
    slug: "mulberry-saf-ipek-biyeli-pijama-takimi",
    category: "Pijama & Ev Giyim",
    price: 4250,
    oldPrice: 4950,
    images: [
      "https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=85"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Gül Kurusu", hex: "#C88EA7" },
      { name: "Bordo", hex: "#5C1D2E" },
      { name: "İnci Kremi", hex: "#F5EFE6" }
    ],
    isNew: true,
    description:
      "22 Momme %100 saf Mulberry ipeğinden üretilen, kontrast bordo biyeli gömlek yaka pijama takımı ve uyku maskesi. Cildin doğal nem dengesini koruyan nefes alabilir dokusuyla dört mevsim lüks uyku deneyimi sunar."
  },
  {
    id: "prd-2",
    name: "Fransız Dantelli Saten Büstiyer & Bralet Set",
    slug: "fransiz-dantelli-saten-bustiyer-bralet-set",
    category: "Kadın İç Giyim",
    price: 2190,
    oldPrice: 2650,
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1000&q=85"
    ],
    sizes: ["75B", "80B", "85B", "80C", "85C"],
    colors: [
      { name: "Kırık Beyaz", hex: "#FAF7F2" },
      { name: "Şampanya", hex: "#E8D8C8" },
      { name: "Antrasit", hex: "#292524" }
    ],
    isNew: true,
    description:
      "Zarif Chantilly Fransız danteli ve yumuşak ipek saten dokunun kusursuz uyumu. Balensiz, cildi tahriş etmeyen iç dikişleri ve ayarlanabilir ince askıları ile gün boyu zarif destek ve konfor sağlar."
  },
  {
    id: "prd-3",
    name: "İnci Beyazı Dantel İşlemeli Gelin İpek Sabahlık",
    slug: "inci-beyazi-dantel-islemeli-gelin-ipek-sabahlik",
    category: "Çeyiz & Özel Koleksiyon",
    price: 3890,
    images: [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=85"
    ],
    sizes: ["S", "M", "L"],
    colors: [
      { name: "İnci Beyazı", hex: "#FBF9F5" },
      { name: "Pudra", hex: "#EAD5D1" }
    ],
    isNew: true,
    description:
      "Çeyiz ve özel hazırlık sabahları için tasarlanan, kol uçları el işçiliği Fransız güpür dantelli kimono kesim saf ipek sabahlık. Çıkarılabilir saten kuşağı ve özel saklama kesesi ile gönderilir."
  },
  {
    id: "prd-4",
    name: "Organik Pima Pamuklu Erkek Lounge & Ev Takımı",
    slug: "organik-pima-pamuklu-erkek-lounge-ev-takimi",
    category: "Erkek İç Giyim",
    price: 2450,
    oldPrice: 2890,
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Koyu Antrasit", hex: "#262626" },
      { name: "Taş Grisi", hex: "#A8A29E" },
      { name: "Gece Mavisi", hex: "#1E293B" }
    ],
    isNew: false,
    description:
      "Uzun lifli %100 organik Pima pamuğundan üretilen bisiklet yaka üst ve ayarlanabilir kordonlu rahat kesim alt takım. Terletmeyen süprem dokusu ve tüylenme yapmayan özel iplik teknolojisi ile maksimum ev konforu."
  },
  {
    id: "prd-5",
    name: "Kaşmir & Modal Karışımlı Fitilli Ev Giyim Takımı",
    slug: "kasmir-modal-karisimli-fitilli-ev-giyim-takimi",
    category: "Pijama & Ev Giyim",
    price: 3490,
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=1000&q=85"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Yulaf Beji", hex: "#D6C7B2" },
      { name: "Vizon", hex: "#9E8C7A" },
      { name: "Krem", hex: "#F5F2EB" }
    ],
    isNew: false,
    description:
      "Kayın ağacı liflerinden elde edilen doğal modal ve saf kaşmir karışımlı, düğmeli hırka ve geniş paça pantolondan oluşan fitilli triko ev takımı. Yumuşak dökümlü yapısı ile gün boyu sıcak ve zarif bir silüet sunar."
  },
  {
    id: "prd-6",
    name: "Bordo İpek Saten Dantel İşlemeli Gecelik",
    slug: "bordo-ipek-saten-dantel-islemeli-gecelik",
    category: "Kadın İç Giyim",
    price: 2790,
    oldPrice: 3290,
    images: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Mürdüm Bordo", hex: "#581C2F" },
      { name: "Gece Siyahı", hex: "#1C1917" },
      { name: "Gül Kurusu", hex: "#B87D8F" }
    ],
    isNew: true,
    description:
      "V yaka göğüs ve yırtmaç detaylarında zarif Fransız danteli kullanılan, verev kesim akışkan ipek saten gecelik. Ayarlanabilir ince spagetti askıları ve ten üzerinde kayan hafif dokusuyla zamansız bir şıklık."
  }
];
