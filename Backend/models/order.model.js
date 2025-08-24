const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Human-readable grouped id for the entire order (e.g., ORD20250822-AB12CD)
  orderId: {
    type: String,
    unique: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      // Unique id per item in an order for tracking at item level
      itemId: { type: String, index: true },
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending',
  },
  deliveryStatus: {
    type: String,
    enum: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Processing',
  },
  //DOUBT
  // Is this address gonna derived from AddressModel of User if yes how ?
  shippingAddress: {
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
  cancelledAt: {
    type: Date,
    default: null,
  },

  //Reviews - should be renamed - yea i know it gonna contribute in rating
  // this rating is related to product and only one - but should derive from the review 
  // or this is over all rating on order 
  rating: {
    stars: { type: Number, min: 1, max: 5 },
    text: String,
    photos: [{ type: String }],
    submittedAt: { type: Date, default: Date.now }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//How these Genrated Ordered Will remain Unique

// Helpers to generate unique IDs
function generateBaseNumericId() {
  const timestampPart = Date.now().toString(); // 13 digits
  const randomPart = String(Math.floor(10000 + Math.random() * 90000)); // 5 digits
  return `${timestampPart}${randomPart}`; // 18 digits
}

function generateOrderIdAndBase() {
  const base = generateBaseNumericId();
  // Order ID prefixed with OD + base numeric id
  const orderId = `OD${base}`;
  return { orderId, base };
}

function generateItemIdFromBase(baseNumericId, index) {
  try {
    const baseBig = BigInt(baseNumericId);
    return String(baseBig + BigInt(index));
  } catch (_) {
    // Fallback to concatenation if BigInt fails (shouldn't happen for numeric strings)
    return `${baseNumericId}${index}`;
  }
}

// Pre-save hook to ensure orderId and per-item itemId are set
orderSchema.pre('save', async function (next) {
  try {
    let baseForItems = null;
    if (!this.orderId) {
      //why only looping till 5 here 
      for (let i = 0; i < 5; i++) {
        const { orderId, base } = generateOrderIdAndBase();
        const exists = await this.constructor.findOne({ orderId }).lean();
        if (!exists) {
          this.orderId = orderId;
          baseForItems = base;
          break;
        }
      }
      if (!this.orderId) {
        const fallback = generateOrderIdAndBase();
        this.orderId = fallback.orderId;
        baseForItems = fallback.base;
      }
    }

    // Derive base from orderId if not set in this cycle
    if (!baseForItems && typeof this.orderId === 'string' && this.orderId.startsWith('OD')) {
      baseForItems = this.orderId.slice(2);
    }

    if (Array.isArray(this.products)) {
      this.products = this.products.map((p, idx) => {
        if (!p.itemId) {
          const base = baseForItems || generateBaseNumericId();
          p.itemId = generateItemIdFromBase(base, idx);
        }
        return p;
      });
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Order', orderSchema);