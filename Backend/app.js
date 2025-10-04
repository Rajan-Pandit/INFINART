const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');// Allow cross-origin requests
const userRoutes = require('./routes/user.routes'); // Import user routes

const blogRoutes = require('./routes/blogs.routes');
const shipAddRoutes = require('./routes/shipAddress.routes');
const favortiesRoutes = require('./routes/favorites.routes');
const cartRoutes = require('./routes/cart.routes');

const productRoutes = require('./routes/product.routes'); // Import product routes
const sellerRoutes = require('./routes/seller.routes'); // Import seller routes
const orderRoutes = require('./routes/order.routes'); // Import order routes
const sellerPanelRoutes = require('./routes/SellerPanel.routes');
const addProductRoutes = require("./routes/addProduct.routes");
const addressRoutes = require("./routes/address.routes");
const invoiceRoutes = require('./routes/invoice.routes');

const dashboardRoutes = require('./routes-seller-panel/dashboard.routes');
const productInfoRoutes = require("./routes-seller-panel/productInfo.routes");

const connectDB = require('./db/db'); 
connectDB(); // Connect to MongoDB
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use("/uploads", express.static("uploads"));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/check', (req, res) => {
  res.send('Hello World!');
});

app.use('/users', userRoutes);    // Use user routes for API

//new file 24 aug
app.use('/users',shipAddRoutes);
app.use('/users',blogRoutes);
app.use('/users',favortiesRoutes);
app.use('/users',cartRoutes);

app.use('/products', productRoutes); // Use product routes for API
app.use("/api/products", addProductRoutes); 
app.use('/seller', sellerRoutes); // Use seller routes for API
app.use("/api/orders", orderRoutes); // ✅ Mount orders route

app.get('/api/document', (req, res) => {
  res.send('Hello document!');
});

app.use("/api/document", invoiceRoutes); // Mount Invoice Route

app.use("/api/addresses", addressRoutes); // ✅ Mount address routes
// Seller Panel Routes
app.use("/api/seller", sellerPanelRoutes);
app.use("/api/dashboard", dashboardRoutes); 
app.use("/api/productinfo", productInfoRoutes);




module.exports = app;