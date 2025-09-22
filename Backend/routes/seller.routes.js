// not in use 


const express = require("express");
const multer = require("multer");
const Product = require("../models/product.model");
const cloudinary = require("../seedFile/configcloud");
const streamifier = require("streamifier");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/uploadSellerProducts", upload.array("images"), async (req, res) => {
  try {
    const { sellerName, occupation, storeName, products } = req.body;
    const files = req.files;

    const productsArray = JSON.parse(products);

    const savedProducts = await Promise.all(
      productsArray.map(async (prod, index) => {
        // Function to upload to Cloudinary as a promise
        const uploadToCloudinary = (fileBuffer) => {
          return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "SellerProducts" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            streamifier.createReadStream(fileBuffer).pipe(uploadStream);
          });
        };

        const uploadedImage = await uploadToCloudinary(files[index].buffer);

        // Save product with Cloudinary URL and tags included
        const newProduct = new Product({
          name: prod.name,
          description: prod.description,
          price: parseFloat(prod.price) || 0,
          originalPrice: prod.originalPrice !== "" ? parseFloat(prod.originalPrice) : null,
          discountPercentage: prod.discountPercentage !== "" ? parseFloat(prod.discountPercentage) : null,
          category: prod.category,
          subcategory: prod.subcategory || "",
          tags: prod.tags || [], // ✅ added tags here
          sellerName,
          occupation,
          storeName,
          images: [uploadedImage.secure_url],
        });

        return await newProduct.save();
      })
    );

    res.status(201).json({
      message: "Seller products uploaded successfully",
      products: savedProducts,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error during upload" });
  }
});

module.exports = router;
