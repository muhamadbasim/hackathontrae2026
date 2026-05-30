export type Product = {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  is_active: boolean
  category: string
  description?: string
  image?: string
  weight?: number
  unit?: string
  min_order?: number
  created_at?: string
  updated_at?: string
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Paket Hemat Mingguan',
    sku: 'PKT-HEMAT-001',
    price: 150000,
    stock: 50,
    is_active: true,
    category: 'Paket langganan',
    description: 'Paket sayuran dan buah segar untuk kebutuhan mingguan keluarga',
    weight: 5,
    unit: 'kg',
    min_order: 1,
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-03-20T10:30:00Z'
  },
  {
    id: '2',
    name: 'Gift Box Premium - Small',
    sku: 'GFX-PREM-S',
    price: 250000,
    stock: 30,
    is_active: true,
    category: 'Gift Box',
    description: 'Kotak hadiah premium dengan pilihan produk segar berkualitas tinggi',
    weight: 2,
    unit: 'pcs',
    min_order: 1,
    created_at: '2024-01-20T09:00:00Z',
    updated_at: '2024-03-18T14:20:00Z'
  },
  {
    id: '3',
    name: 'Gift Box Premium - Large',
    sku: 'GFX-PREM-L',
    price: 450000,
    stock: 20,
    is_active: true,
    category: 'Gift Box',
    description: 'Kotak hadiah premium size besar dengan assorted produk premium',
    weight: 4,
    unit: 'pcs',
    min_order: 1,
    created_at: '2024-01-20T09:05:00Z',
    updated_at: '2024-03-15T11:45:00Z'
  },
  {
    id: '4',
    name: 'Paket Corporate Event',
    sku: 'PKT-CORP-EVT',
    price: 850000,
    stock: 15,
    is_active: true,
    category: 'Corporate',
    description: 'Paket lengkap untuk acara kantor dengan berbagai pilihan snack dan minuman',
    weight: 10,
    unit: 'pax',
    min_order: 20,
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-03-22T16:00:00Z'
  },
  {
    id: '5',
    name: 'Buah Impor Premium Box',
    sku: 'FRT-IMPOR-BOX',
    price: 350000,
    stock: 25,
    is_active: true,
    category: 'Buah Segar',
    description: 'Mix buah impor pilihan: apple, pear, grape, kiwi',
    weight: 3,
    unit: 'box',
    min_order: 1,
    created_at: '2024-02-05T08:30:00Z',
    updated_at: '2024-03-19T09:15:00Z'
  },
  {
    id: '6',
    name: 'Sayuran Organik Mix',
    sku: 'SYR-ORGN-MIX',
    price: 125000,
    stock: 40,
    is_active: true,
    category: 'Sayuran Segar',
    description: 'Campuran sayuran organik segar dari petani lokal',
    weight: 2,
    unit: 'kg',
    min_order: 1,
    created_at: '2024-02-10T07:00:00Z',
    updated_at: '2024-03-21T08:45:00Z'
  },
  {
    id: '7',
    name: 'Paket Bulanan Keluarga',
    sku: 'PKT-BLN-KLR',
    price: 450000,
    stock: 35,
    is_active: true,
    category: 'Paket langganan',
    description: 'Paket sayuran dan buah untuk kebutuhan bulanan keluarga',
    weight: 20,
    unit: 'kg',
    min_order: 1,
    created_at: '2024-02-12T09:20:00Z',
    updated_at: '2024-03-23T10:00:00Z'
  },
  {
    id: '8',
    name: 'Custom Gift Box Corporate',
    sku: 'GFX-CUST-CORP',
    price: 750000,
    stock: 10,
    is_active: true,
    category: 'Gift Box',
    description: 'Gift box dengan branding custom untuk corporate gift',
    weight: 3,
    unit: 'pcs',
    min_order: 50,
    created_at: '2024-02-15T11:00:00Z',
    updated_at: '2024-03-20T15:30:00Z'
  },
  {
    id: '9',
    name: 'Snack Box Meeting',
    sku: 'SNK-BOX-MTG',
    price: 175000,
    stock: 45,
    is_active: true,
    category: 'Corporate',
    description: 'Variasi snack dan minuman untuk meeting atau diskusi',
    weight: 1.5,
    unit: 'box',
    min_order: 10,
    created_at: '2024-02-18T10:30:00Z',
    updated_at: '2024-03-22T12:20:00Z'
  },
  {
    id: '10',
    name: 'Paket Ulang Tahun',
    sku: 'PKT-ULT',
    price: 550000,
    stock: 18,
    is_active: true,
    category: 'Special Occasion',
    description: 'Paket lengkap untuk perayaan ulang tahun dengan dekorasi',
    weight: 5,
    unit: 'pcs',
    min_order: 1,
    created_at: '2024-02-20T08:00:00Z',
    updated_at: '2024-03-19T14:00:00Z'
  },
  {
    id: '11',
    name: 'Coffee Break Premium',
    sku: 'CFB-PREM',
    price: 95000,
    stock: 100,
    is_active: true,
    category: 'Corporate',
    description: 'Paket coffee break dengan kopi premium dan pastry',
    weight: 0.8,
    unit: 'pax',
    min_order: 15,
    created_at: '2024-02-22T09:00:00Z',
    updated_at: '2024-03-21T11:30:00Z'
  },
  {
    id: '12',
    name: 'Fruit Bowl Mix',
    sku: 'FRT-BOWL-MIX',
    price: 185000,
    stock: 28,
    is_active: true,
    category: 'Buah Segar',
    description: 'Campuran buah segar dalam mangkuk, siap saji',
    weight: 2.5,
    unit: 'bowl',
    min_order: 1,
    created_at: '2024-02-25T10:00:00Z',
    updated_at: '2024-03-20T13:45:00Z'
  },
  {
    id: '13',
    name: 'Paket Diet Sehat',
    sku: 'PKT-DIET',
    price: 275000,
    stock: 22,
    is_active: false,
    category: 'Paket langganan',
    description: 'Paket sayuran dan buah rendah kalori untuk program diet',
    weight: 3,
    unit: 'kg',
    min_order: 1,
    created_at: '2024-03-01T08:30:00Z',
    updated_at: '2024-03-18T16:00:00Z'
  },
  {
    id: '14',
    name: 'Custom Snack Box',
    sku: 'SNK-CUST',
    price: 220000,
    stock: 0,
    is_active: true,
    category: 'Corporate',
    description: 'Snack box dengan pilihan produk yang bisa dikustomisasi',
    weight: 2,
    unit: 'box',
    min_order: 20,
    created_at: '2024-03-05T11:00:00Z',
    updated_at: '2024-03-23T09:00:00Z'
  },
  {
    id: '15',
    name: 'Parcel Natal & Tahun Baru',
    sku: 'PRCL-HOLIDAY',
    price: 650000,
    stock: 12,
    is_active: false,
    category: 'Special Occasion',
    description: 'Parcel spesial untuk momen Natal dan Tahun Baru',
    weight: 4,
    unit: 'pcs',
    min_order: 1,
    created_at: '2024-03-10T09:30:00Z',
    updated_at: '2024-03-15T14:30:00Z'
  }
]

export const PRODUCT_CATEGORIES = [
  'Semua',
  'Paket langganan',
  'Gift Box',
  'Corporate',
  'Buah Segar',
  'Sayuran Segar',
  'Special Occasion'
]

export const PRODUCT_STATS = {
  total_products: 15,
  active_products: 12,
  inactive_products: 3,
  out_of_stock: 1,
  total_stock_value: 4850000,
  categories: 7
}
