const express = require("express");
const multer = require("multer");
const cloudinary = require("../seedFile/configcloud");
const streamifier = require("streamifier");
const Product = require("../models/product.model");
const { protect } = require("../Middleware/sellerPanelauthMidWar");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// helper function for cloudinary upload
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

// 👇 Protect route so only logged-in sellers can upload
router.post("/", protect, upload.array("images"), async (req, res) => {
  try {
    console.log("📩 Incoming product data:", req.body);
    console.log("📸 Incoming files:", req.files?.map(f => f.originalname));

    const {
      name,
      description,
      price,
      originalPrice,
      discount,
      category,
      subcategory,
      tags,
      rating,
      inStock,
    } = req.body;

    // seller info comes from token now
    const sellerId = req.seller._id;
    const sellerName = req.seller.sellerName;
    const occupation = req.seller.occupation;
    const storeName = req.seller.storeName;

    // Upload all images to cloudinary
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      console.log("🚀 Uploading images to Cloudinary...");
      imageUrls = await Promise.all(
        req.files.map(async (file) => {
          const result = await uploadToCloudinary(file.buffer);
          console.log("✅ Uploaded image URL:", result.secure_url);
          return result.secure_url;
        })
      );
    }

    // Parse tags if it's JSON/stringified array
    let parsedTags = [];
    try {
      parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
    } catch {
      parsedTags = Array.isArray(tags) ? tags : [];
    }

    const newProduct = new Product({
      name,
      description,
      price: parseFloat(price) || 0,
      originalPrice: originalPrice !== "" ? parseFloat(originalPrice) : null,
      discountPercentage: discount !== "" ? parseFloat(discount) : null,
      category,
      subcategory: subcategory || "",
      tags: parsedTags,
      rating: parseInt(rating) || 1,
      inStock: parseInt(inStock) || 0,
      sellerId,     // from token
      sellerName,   // from token
      occupation,   // from token
      storeName,    // from token
      images: imageUrls,
    });

    console.log("🛠️ Saving product to DB:", newProduct);

    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "Product uploaded successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ message: "Server error during product upload" });
  }
});

module.exports = router;
