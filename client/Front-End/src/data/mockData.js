/**
 * Realistic Mock Data for Retail ERP (Demo & Offline Fallback)
 */

export const INITIAL_PRODUCTS = [
  { id: 1, name: 'UltraHD 4K Smart Monitor 27"', category: 'Electronics', price: 349.99, stockQuantity: 28, description: 'IPS panel with 144Hz refresh rate and USB-C hub.' },
  { id: 2, name: 'Ergonomic Wireless Mechanical Keyboard', category: 'Electronics', price: 119.50, stockQuantity: 45, description: 'Hot-swappable switches with RGB backlight.' },
  { id: 3, name: 'Precision Wireless Gaming Mouse', category: 'Electronics', price: 79.99, stockQuantity: 62, description: 'Ultra-lightweight 26k DPI optical sensor.' },
  { id: 4, name: 'Noise-Cancelling Over-Ear Headphones', category: 'Audio', price: 249.00, stockQuantity: 18, description: 'Active noise cancellation with 40h battery life.' },
  { id: 5, name: 'Executive High-Back Mesh Desk Chair', category: 'Furniture', price: 289.99, stockQuantity: 8, description: 'Adjustable lumbar support with breathable mesh.' },
  { id: 6, name: 'Solid Oak Dual-Motor Standing Desk', category: 'Furniture', price: 549.00, stockQuantity: 4, description: 'Memory preset controller with steel frame.' },
  { id: 7, name: 'Anodized Aluminum Laptop Stand', category: 'Accessories', price: 39.99, stockQuantity: 84, description: 'Elevates laptops up to 6 inches for better posture.' },
  { id: 8, name: '100W GaN 4-Port Fast Wall Charger', category: 'Accessories', price: 49.99, stockQuantity: 110, description: 'Dual USB-C and dual USB-A PD 3.0 fast charging.' },
  { id: 9, name: 'Braided Thunderbolt 4 Cable (2m)', category: 'Accessories', price: 29.99, stockQuantity: 95, description: '40Gbps data transfer with 100W power delivery.' },
  { id: 10, name: 'Smart LED Lightbar Screen Monitor Mount', category: 'Lighting', price: 59.99, stockQuantity: 3, description: 'Auto-dimming eye protection with touch controls.' }
];

export const INITIAL_CUSTOMERS = [
  { id: 1, name: 'Alexander Wright', contact: '+1 (555) 234-5678', email: 'alex.wright@techsolutions.com', address: '742 Evergreen Terrace, Seattle, WA', tier: 'VIP' },
  { id: 2, name: 'Sophia Chen', contact: '+1 (555) 876-5432', email: 'sophia.chen@innovate.io', address: '104 Silicon Blvd, San Jose, CA', tier: 'VIP' },
  { id: 3, name: 'Marcus Johnson', contact: '+1 (555) 345-6789', email: 'marcus.j@apexlogistics.net', address: '890 Commerce Way, Chicago, IL', tier: 'Regular' },
  { id: 4, name: 'Elena Rostova', contact: '+1 (555) 456-7890', email: 'elena.rostova@designworks.com', address: '320 Creative Loop, Austin, TX', tier: 'Regular' },
  { id: 5, name: 'David Kim', contact: '+1 (555) 567-8901', email: 'david.kim@quantumscale.org', address: '55 Financial Plaza, New York, NY', tier: 'New' }
];

export const INITIAL_BILLS = [
  {
    id: 1,
    billDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    customerId: 1,
    customer: INITIAL_CUSTOMERS[0],
    totalAmount: 789.48,
    paymentMethod: 'Credit Card',
    status: 'Paid',
    items: [
      { id: 101, productId: 1, product: INITIAL_PRODUCTS[0], quantity: 2, unitPrice: 349.99, itemTotal: 699.98 },
      { id: 102, productId: 3, product: INITIAL_PRODUCTS[2], quantity: 1, unitPrice: 79.99, itemTotal: 79.99 }
    ]
  },
  {
    id: 2,
    billDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    customerId: 2,
    customer: INITIAL_CUSTOMERS[1],
    totalAmount: 368.99,
    paymentMethod: 'UPI',
    status: 'Paid',
    items: [
      { id: 103, productId: 2, product: INITIAL_PRODUCTS[1], quantity: 1, unitPrice: 119.50, itemTotal: 119.50 },
      { id: 104, productId: 4, product: INITIAL_PRODUCTS[3], quantity: 1, unitPrice: 249.00, itemTotal: 249.00 }
    ]
  },
  {
    id: 3,
    billDate: new Date().toISOString(),
    customerId: 3,
    customer: INITIAL_CUSTOMERS[2],
    totalAmount: 588.99,
    paymentMethod: 'Cash',
    status: 'Paid',
    items: [
      { id: 105, productId: 6, product: INITIAL_PRODUCTS[5], quantity: 1, unitPrice: 549.00, itemTotal: 549.00 },
      { id: 106, productId: 7, product: INITIAL_PRODUCTS[6], quantity: 1, unitPrice: 39.99, itemTotal: 39.99 }
    ]
  }
];
