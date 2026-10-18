import api from './api';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_BILLS } from '../data/mockData';

// Local storage keys for offline mock mode
const STORAGE_PRODUCTS = 'retail_erp_mock_products';
const STORAGE_CUSTOMERS = 'retail_erp_mock_customers';
const STORAGE_BILLS = 'retail_erp_mock_bills';
const STORAGE_MODE = 'retail_erp_force_mock';

function getStored(key, initial) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return initial;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

let isUsingMock = false;

export const erpService = {
  isMockActive: () => isUsingMock,
  setForceMock: (force) => {
    localStorage.setItem(STORAGE_MODE, force ? 'true' : 'false');
  },

  // Products
  async getProducts({ search, minStock } = {}) {
    try {
      if (localStorage.getItem(STORAGE_MODE) === 'true') throw new Error('Force mock');
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (minStock !== undefined && minStock !== '') params.append('minStock', minStock);
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const data = await api.get(`/products${queryString}`);
      isUsingMock = false;
      return data;
    } catch (err) {
      isUsingMock = true;
      let items = getStored(STORAGE_PRODUCTS, INITIAL_PRODUCTS);
      if (search) {
        const lower = search.toLowerCase();
        items = items.filter(p => p.name?.toLowerCase().includes(lower) || p.category?.toLowerCase().includes(lower));
      }
      if (minStock !== undefined && minStock !== '') {
        const min = Number(minStock);
        items = items.filter(p => Number(p.stockQuantity) >= min);
      }
      return items;
    }
  },

  async createProduct(product) {
    try {
      if (isUsingMock || localStorage.getItem(STORAGE_MODE) === 'true') throw new Error('Mock mode');
      return await api.post('/products', product);
    } catch {
      const items = getStored(STORAGE_PRODUCTS, INITIAL_PRODUCTS);
      const newProduct = { ...product, id: Date.now() };
      items.unshift(newProduct);
      setStored(STORAGE_PRODUCTS, items);
      return newProduct;
    }
  },

  async updateProduct(id, product) {
    try {
      if (isUsingMock || localStorage.getItem(STORAGE_MODE) === 'true') throw new Error('Mock mode');
      return await api.put(`/products/${id}`, product);
    } catch {
      let items = getStored(STORAGE_PRODUCTS, INITIAL_PRODUCTS);
      items = items.map(p => p.id === id ? { ...p, ...product } : p);
      setStored(STORAGE_PRODUCTS, items);
      return product;
    }
  },

  async deleteProduct(id) {
    try {
      if (isUsingMock || localStorage.getItem(STORAGE_MODE) === 'true') throw new Error('Mock mode');
      return await api.delete(`/products/${id}`);
    } catch {
      let items = getStored(STORAGE_PRODUCTS, INITIAL_PRODUCTS);
      items = items.filter(p => p.id !== id);
      setStored(STORAGE_PRODUCTS, items);
      return true;
    }
  },

  // Customers
  async getCustomers() {
    try {
      if (localStorage.getItem(STORAGE_MODE) === 'true') throw new Error('Force mock');
      const data = await api.get('/customers');
      isUsingMock = false;
      return data;
    } catch {
      isUsingMock = true;
      return getStored(STORAGE_CUSTOMERS, INITIAL_CUSTOMERS);
    }
  },

  async createCustomer(customer) {
    try {
      if (isUsingMock || localStorage.getItem(STORAGE_MODE) === 'true') throw new Error('Mock mode');
      return await api.post('/customers', customer);
    } catch {
      const items = getStored(STORAGE_CUSTOMERS, INITIAL_CUSTOMERS);
      const newCustomer = { ...customer, id: Date.now() };
      items.unshift(newCustomer);
      setStored(STORAGE_CUSTOMERS, items);
      return newCustomer;
    }
  },

  async updateCustomer(id, customer) {
    try {
      if (isUsingMock || localStorage.getItem(STORAGE_MODE) === 'true') throw new Error('Mock mode');
      return await api.put(`/customers/${id}`, customer);
    } catch {
      let items = getStored(STORAGE_CUSTOMERS, INITIAL_CUSTOMERS);
      items = items.map(c => c.id === id ? { ...c, ...customer } : c);
      setStored(STORAGE_CUSTOMERS, items);
      return customer;
    }
  },

  async deleteCustomer(id) {
    try {
      if (isUsingMock || localStorage.getItem(STORAGE_MODE) === 'true') throw new Error('Mock mode');
      return await api.delete(`/customers/${id}`);
    } catch {
      let items = getStored(STORAGE_CUSTOMERS, INITIAL_CUSTOMERS);
      items = items.filter(c => c.id !== id);
      setStored(STORAGE_CUSTOMERS, items);
      return true;
    }
  },

  // Bills
  async getBills() {
    try {
      if (localStorage.getItem(STORAGE_MODE) === 'true') throw new Error('Force mock');
      const data = await api.get('/bills');
      isUsingMock = false;
      return data;
    } catch {
      isUsingMock = true;
      return getStored(STORAGE_BILLS, INITIAL_BILLS);
    }
  },

  async createBill(billData) {
    try {
      if (isUsingMock || localStorage.getItem(STORAGE_MODE) === 'true') throw new Error('Mock mode');
      return await api.post('/bills', billData);
    } catch {
      const bills = getStored(STORAGE_BILLS, INITIAL_BILLS);
      const customers = getStored(STORAGE_CUSTOMERS, INITIAL_CUSTOMERS);
      const customer = customers.find(c => c.id === Number(billData.customerId));

      const newBill = {
        ...billData,
        id: Date.now(),
        billDate: new Date().toISOString(),
        customer: customer || { name: 'Customer' },
        status: 'Paid'
      };
      bills.unshift(newBill);
      setStored(STORAGE_BILLS, bills);
      return newBill;
    }
  },

  async deleteBill(id) {
    try {
      if (isUsingMock || localStorage.getItem(STORAGE_MODE) === 'true') throw new Error('Mock mode');
      return await api.delete(`/bills/${id}`);
    } catch {
      let bills = getStored(STORAGE_BILLS, INITIAL_BILLS);
      bills = bills.filter(b => b.id !== id);
      setStored(STORAGE_BILLS, bills);
      return true;
    }
  }
};

export default erpService;
