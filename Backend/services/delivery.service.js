const axios = require('axios');

/**
 * Delivery service to communicate with 3rd-party delivery partner
 * Configuration via environment variables:
 * - DELIVERY_API_BASE (e.g. https://partner.example.com)
 * - DELIVERY_API_KEY (if using API key)
 * - DELIVERY_AUTH_METHOD ('API_KEY' | 'BEARER') default 'API_KEY'
 */

const DELIVERY_BASE = process.env.DELIVERY_API_BASE || '';
const DELIVERY_API_KEY = process.env.DELIVERY_API_KEY || process.env.DELIVERY_KEY || '';
const DELIVERY_AUTH_METHOD = (process.env.DELIVERY_AUTH_METHOD || 'API_KEY').toUpperCase();

async function createShipment({ orderId, items, seller, buyer, pickupAddress }) {
  if (!DELIVERY_BASE) {
    throw new Error('Delivery base URL not configured (DELIVERY_API_BASE)');
  }

  const url = `${DELIVERY_BASE.replace(/\/$/, '')}/api/v1/create-order`;

  const payload = {
    external_order_id: orderId,
    items: items.map((it) => ({
      name: it.name || it.productName || 'Item',
      quantity: it.quantity || 1,
    })),
    seller: {
      id: seller.id || seller._id || null,
      name: seller.sellerName || seller.name || '',
      phone: seller.phone || seller.contact || '',
      address: pickupAddress || seller.address || {},
    },
    recipient: {
      name: buyer.fullName || buyer.name || '',
      phone: buyer.phone || buyer.contact || '',
      address: buyer.address || buyer,
    },
  };

  const headers = {
    'Content-Type': 'application/json',
  };

  if (DELIVERY_API_KEY) {
    if (DELIVERY_AUTH_METHOD === 'BEARER') {
      headers['Authorization'] = `Bearer ${DELIVERY_API_KEY}`;
    } else {
      headers['x-api-key'] = DELIVERY_API_KEY;
    }
  }

  try {
    const resp = await axios.post(url, payload, { headers, timeout: 15000 });
    // Expecting response like { tracking_id: 'XYZ123', status: 'created', eta: '...' }
    return resp.data;
  } catch (err) {
    // normalize error
    const message = err.response?.data || err.message || err.toString();
    const error = new Error('Delivery partner API error');
    error.details = message;
    throw error;
  }
}

module.exports = {
  createShipment,
};
