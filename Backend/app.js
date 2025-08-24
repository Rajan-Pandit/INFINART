const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');// Allow cross-origin requests
const userRoutes = require('./routes/user.routes'); // Import user routes
const productRoutes = require('./routes/product.routes'); // Import product routes
const sellerRoutes = require('./routes/seller.routes'); // Import seller routes
const orderRoutes = require('./routes/order.routes'); // Import order routes
const sellerPanelRoutes = require('./routes/SellerPanel.routes');
const addProductRoutes = require("./routes/addProduct.routes");

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

app.use('/users', userRoutes); // Use user routes for API
app.use('/products', productRoutes); // Use product routes for API
app.use("/api/products", addProductRoutes); 
app.use('/seller', sellerRoutes); // Use seller routes for API
app.use("/api/orders", orderRoutes); // ✅ Mount orders route

app.use("/api/seller", sellerPanelRoutes);



module.exports = app;