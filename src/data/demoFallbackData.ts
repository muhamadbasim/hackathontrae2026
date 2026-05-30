// Fallback data
export const campaignsData = [
  { id: 'camp-001', name: 'Diskon Umum', objective: 'Leads', spend: 3250000, leads: 96, cpl: 33854, qualifiedRate: 0.42, status: 'Warning', flag: 'CPL naik 37%' },
  { id: 'camp-002', name: 'Retargeting Warm Leads', objective: 'Conversion', spend: 2100000, leads: 88, cpl: 23863, qualifiedRate: 0.61, status: 'Healthy', flag: 'Stabil' },
  { id: 'camp-003', name: 'Lookalike High Intent', objective: 'Leads', spend: 4800000, leads: 174, cpl: 27586, qualifiedRate: 0.55, status: 'Healthy', flag: 'Scale candidate' },
  { id: 'camp-004', name: 'Promo WhatsApp Click', objective: 'Messages', spend: 2700000, leads: 124, cpl: 21774, qualifiedRate: 0.48, status: 'Monitor', flag: 'High volume' },
];

export const contactsData = [
  { id: 'contact-001', name: 'Budi Santoso', phone: '628111222333', email: 'budi@example.com', lead_score: 85, tags: ['warm', 'promo-click'], source: 'whatsapp' },
  { id: 'contact-002', name: 'Siti Aminah', phone: '628222333444', email: 'siti@example.com', lead_score: 90, tags: ['hot', 'retargeting'], source: 'whatsapp' },
  { id: 'contact-003', name: 'Agus Wijaya', phone: '628333444555', email: 'agus@example.com', lead_score: 40, tags: ['cold'], source: 'whatsapp' },
  { id: 'contact-004', name: 'Rina Melati', phone: '628444555666', email: 'rina@example.com', lead_score: 75, tags: ['warm', 'lookalike'], source: 'whatsapp' },
];

export const conversationsData = [
  { id: 'conv-001', contact_id: 'contact-001', channel: 'whatsapp', status: 'open', priority: 'high', last_message: 'Apakah promo masih berlaku?', unread_count: 1 },
  { id: 'conv-002', contact_id: 'contact-002', channel: 'whatsapp', status: 'resolved', priority: 'medium', last_message: 'Terima kasih informasinya.', unread_count: 0 },
  { id: 'conv-003', contact_id: 'contact-003', channel: 'whatsapp', status: 'open', priority: 'low', last_message: 'Saya ingin bertanya soal produk.', unread_count: 2 },
  { id: 'conv-004', contact_id: 'contact-004', channel: 'whatsapp', status: 'open', priority: 'medium', last_message: 'Bisa minta katalog?', unread_count: 1 },
];

export const messagesData = [
  { id: 'msg-001', conversation_id: 'conv-001', direction: 'inbound', sender_type: 'customer', content: 'Apakah promo masih berlaku?' },
  { id: 'msg-002', conversation_id: 'conv-002', direction: 'inbound', sender_type: 'customer', content: 'Terima kasih informasinya.' },
  { id: 'msg-003', conversation_id: 'conv-003', direction: 'inbound', sender_type: 'customer', content: 'Saya ingin bertanya soal produk.' },
  { id: 'msg-004', conversation_id: 'conv-003', direction: 'outbound', sender_type: 'agent', content: 'Tentu, silakan tanyakan produk yang mana?' },
  { id: 'msg-005', conversation_id: 'conv-004', direction: 'inbound', sender_type: 'customer', content: 'Bisa minta katalog?' },
  { id: 'msg-006', conversation_id: 'conv-004', direction: 'outbound', sender_type: 'bot', content: 'Ini link katalog kami: https://example.com/katalog' },
];

export const handoverRequestsData = [
  { id: 'ho-001', conversation_id: 'conv-001', status: 'pending', ai_reason: 'User asks complex product question.' },
  { id: 'ho-002', conversation_id: 'conv-003', status: 'approved', ai_reason: 'User requested human agent explicitly.' },
  { id: 'ho-003', conversation_id: 'conv-004', status: 'pending', ai_reason: 'Sentiment analysis detected frustration.' },
];

export const ordersData = [
  { id: 'ord-001', order_number: 'ORD-2026-001', contact_id: 'contact-001', order_status: 'completed', grand_total: 150000, payment_status: 'PAID' },
  { id: 'ord-002', order_number: 'ORD-2026-002', contact_id: 'contact-002', order_status: 'pending', grand_total: 300000, payment_status: 'NOT_PAID' },
  { id: 'ord-003', order_number: 'ORD-2026-003', contact_id: 'contact-003', order_status: 'cancelled', grand_total: 50000, payment_status: 'NOT_PAID' },
  { id: 'ord-004', order_number: 'ORD-2026-004', contact_id: 'contact-004', order_status: 'completed', grand_total: 750000, payment_status: 'PAID' },
];

export const productsData = [
  { id: 'prod-001', name: 'Paket Basic', sku: 'PKG-BSC', price: 150000, stock: 100, is_active: true },
  { id: 'prod-002', name: 'Paket Pro', sku: 'PKG-PRO', price: 300000, stock: 50, is_active: true },
  { id: 'prod-003', name: 'Add-on A', sku: 'ADD-A', price: 50000, stock: 200, is_active: true },
  { id: 'prod-004', name: 'Add-on B', sku: 'ADD-B', price: 75000, stock: 0, is_active: false },
];

export const broadcastJobsData = [
  { id: 'bc-001', title: 'Promo Akhir Bulan', status: 'completed', total_recipients: 1000, success_count: 950, failed_count: 50 },
  { id: 'bc-002', title: 'Update Kebijakan', status: 'draft', total_recipients: 0, success_count: 0, failed_count: 0 },
  { id: 'bc-003', title: 'Flash Sale Alert', status: 'running', total_recipients: 5000, success_count: 2000, failed_count: 10 },
];

export const flowsData = [
  { id: 'flow-001', name: 'WhatsApp Lead Qualification', active: true, description: 'Qualify incoming leads based on intent' },
  { id: 'flow-002', name: 'CPL Alert Auto Pause', active: true, description: 'Pause campaigns when CPL exceeds threshold' },
  { id: 'flow-003', name: 'Broadcast Follow-up', active: false, description: 'Follow up after broadcast' },
];

export const aiAgentsData = [
  { id: 'agent-001', name: 'Campaign Analyst', persona: 'Data-driven marketer', is_active: true, description: 'Monitors CPL and ROAS' },
  { id: 'agent-002', name: 'CRM Qualifier', persona: 'Friendly sales rep', is_active: true, description: 'Scores leads based on chat' },
  { id: 'agent-003', name: 'WhatsApp Reply Assistant', persona: 'Helpful support', is_active: true, description: 'Auto-replies to FAQs' },
];

export const knowledgeSourcesData = [
  { id: 'ks-001', title: 'Product Catalog 2026', type: 'document', status: 'ready' },
  { id: 'ks-002', title: 'Return Policy', type: 'text', status: 'ready' },
  { id: 'ks-003', title: 'Promo Guidelines', type: 'text', status: 'ready' },
  { id: 'ks-004', title: 'Company FAQ', type: 'document', status: 'processing' },
];

export const settingsSummary = {
  waStatus: 'Connected',
  workerUrl: 'http://localhost:3001',
  insforgeEnv: false,
};
