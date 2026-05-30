export const MOCK_ORDERS = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001847',
    customerName: 'Nia Lestari',
    customerPhone: '628111000004',
    customerAvatar: 'NL',
    avatarColor: 'bg-teal-500',
    date: '2024-01-15',
    time: '14:32',
    items: 3,
    grandTotal: 2450000,
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'paid',
    orderStatus: 'completed',
    itemsSummary: 'Gift Box Premium x2, Hampers Corporate x1'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-001846',
    customerName: 'Andi Pratama',
    customerPhone: '6281234567890',
    customerAvatar: 'AP',
    avatarColor: 'bg-cyan-500',
    date: '2024-01-15',
    time: '13:45',
    items: 5,
    grandTotal: 1875000,
    paymentMethod: 'OVO',
    paymentStatus: 'paid',
    orderStatus: 'processing',
    itemsSummary: 'Hampers Hari Raya x3, Gift Box x2'
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-001845',
    customerName: 'Rika Putri',
    customerPhone: '6281987654321',
    customerAvatar: 'RP',
    avatarColor: 'bg-lime-500',
    date: '2024-01-15',
    time: '12:18',
    items: 8,
    grandTotal: 4200000,
    paymentMethod: 'Credit Card',
    paymentStatus: 'pending',
    orderStatus: 'pending',
    itemsSummary: 'Corporate Hamper Large x5, Premium Gift Set x3'
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-001844',
    customerName: 'Farhan Maulana',
    customerPhone: '6285712345678',
    customerAvatar: 'FM',
    avatarColor: 'bg-purple-500',
    date: '2024-01-15',
    time: '11:05',
    items: 2,
    grandTotal: 890000,
    paymentMethod: 'GoPay',
    paymentStatus: 'paid',
    orderStatus: 'shipped',
    itemsSummary: 'Birthday Hamper x1, Thank You Gift x1'
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-001843',
    customerName: 'Siti Rahma',
    customerPhone: '6282123456789',
    customerAvatar: 'SR',
    avatarColor: 'bg-orange-500',
    date: '2024-01-14',
    time: '16:42',
    items: 4,
    grandTotal: 1560000,
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'failed',
    orderStatus: 'cancelled',
    itemsSummary: 'Wedding Gift Box x2, Souvenir Set x2'
  },
  {
    id: '6',
    orderNumber: 'ORD-2024-001842',
    customerName: 'Budi Santoso',
    customerPhone: '6281311112222',
    customerAvatar: 'BS',
    avatarColor: 'bg-amber-700',
    date: '2024-01-14',
    time: '10:30',
    items: 10,
    grandTotal: 8500000,
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'paid',
    orderStatus: 'completed',
    itemsSummary: 'Corporate Gift Package Large x10'
  },
  {
    id: '7',
    orderNumber: 'ORD-2024-001841',
    customerName: 'Dewi Anggraeni',
    customerPhone: '6281566667777',
    customerAvatar: 'DA',
    avatarColor: 'bg-red-500',
    date: '2024-01-14',
    time: '09:15',
    items: 1,
    grandTotal: 350000,
    paymentMethod: 'DANA',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    itemsSummary: 'Premium Hamper x1'
  },
  {
    id: '8',
    orderNumber: 'ORD-2024-001840',
    customerName: 'Ahmad Rizki',
    customerPhone: '6281788889999',
    customerAvatar: 'AR',
    avatarColor: 'bg-indigo-500',
    date: '2024-01-13',
    time: '15:55',
    items: 6,
    grandTotal: 3200000,
    paymentMethod: 'Credit Card',
    paymentStatus: 'paid',
    orderStatus: 'processing',
    itemsSummary: 'Festival Hamper Set x4, Custom Gift Box x2'
  }
];

export const ORDER_STATS = {
  totalOrders: MOCK_ORDERS.length,
  totalRevenue: MOCK_ORDERS.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.grandTotal, 0),
  pendingPayment: MOCK_ORDERS.filter(o => o.paymentStatus === 'pending').length,
  completedOrders: MOCK_ORDERS.filter(o => o.orderStatus === 'completed').length
};

export const ORDER_STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: '⏳' },
  processing: { label: 'Diproses', color: 'bg-blue-100 text-blue-700', icon: '⚙️' },
  shipped: { label: 'Dikirim', color: 'bg-purple-100 text-purple-700', icon: '🚚' },
  delivered: { label: 'Diterima', color: 'bg-teal-100 text-teal-700', icon: '✓' },
  completed: { label: 'Selesai', color: 'bg-green-100 text-green-700', icon: '✅' },
  cancelled: { label: 'Batal', color: 'bg-gray-100 text-gray-500', icon: '✕' }
};

export const PAYMENT_STATUS_CONFIG = {
  pending: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-700' },
  paid: { label: 'Lunas', color: 'bg-green-100 text-green-700' },
  failed: { label: 'Gagal', color: 'bg-red-100 text-red-700' }
};
