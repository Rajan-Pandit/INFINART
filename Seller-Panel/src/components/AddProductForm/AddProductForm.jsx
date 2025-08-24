import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../Redux/productSlice"; // adjust path if needed
import Select from "react-select";
import styles from "./AddProductForm.module.css";

export default function AddProductForm() {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.products);
  const { seller, token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    discount: "",
    category: "",
    subcategory: "",
    rating: 1,
    inStock: "",
    tags: [],
    images: [],
  });

  const categories = {
    Painting: ["Oil Painting", "Watercolor", "Acrylic", "Digital"],
    Craft: ["Paper Craft", "Wood Craft", "Metal Craft", "Textile Craft"],
    Sculpture: ["Stone Sculpture", "Wood Sculpture", "Clay Sculpture"],
    Jewelry: ["Necklaces", "Bracelets", "Earrings", "Rings"],
  };

  const tagOptions = [
    { value: "diy", label: "DIY" },
    { value: "paper", label: "Paper" },
    { value: "origami", label: "Origami" },
    { value: "creative", label: "Creative" },
    { value: "paper crafts", label: "Paper Crafts" },
    { value: "Valentine Gift", label: "Valentine Gift" },
    { value: "House Party", label: "House Party" },
    { value: "Dinner Dates", label: "Dinner Dates" },
    { value: "Baby Shower", label: "Baby Shower" },
    { value: "Anniversaries", label: "Anniversaries" },
    { value: "Diwali Lights", label: "Diwali Lights" },
    { value: "Eid", label: "Eid" },
    { value: "Christmas Eve", label: "Christmas Eve" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, images: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleTagsChange = (selectedOptions) => {
    setFormData({
      ...formData,
      tags: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // include seller info in payload
    const productData = {
      ...formData,
      sellerId: seller?._id,
      sellerName: seller?.name,
      storeName: seller?.storeName,
    };

    dispatch(addProduct(productData));
  };

  return (
    <div className={styles["add-product"]}>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit} className={styles["product-form"]}>
        {/* Product Name */}
        <label>Product Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />

        {/* Description */}
        <label>Product Description</label>
        <textarea
          className={styles["big-textarea"]}
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        {/* Price Fields */}
        <div className={styles["form-row"]}>
          <div className={styles["form-col"]}>
            <label>Price</label>
            <input
              type="number"
              name="price"
              min="0"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div className={styles["form-col"]}>
            <label>Original Price</label>
            <input
              type="number"
              name="originalPrice"
              min="0"
              value={formData.originalPrice}
              onChange={handleChange}
            />
          </div>
          <div className={styles["form-col"]}>
            <label>Discount %</label>
            <input
              type="number"
              name="discount"
              min="0"
              value={formData.discount}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Category & Subcategory */}
        <div className={styles["form-row"]}>
          <div className={styles["form-col"]}>
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value, subcategory: "" })
              }
            >
              <option value="">-- Select Category --</option>
              {Object.keys(categories).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className={styles["form-col"]}>
            <label>Subcategory</label>
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              disabled={!formData.category}
            >
              <option value="">-- Select Subcategory --</option>
              {formData.category &&
                categories[formData.category].map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div className={styles["form-row"]}>
          <div className={styles["form-col"]}>
            <label>Tags</label>
            <Select
              isMulti
              name="tags"
              options={tagOptions}
              className="seller_product-select"
              classNamePrefix="select"
              placeholder="Select or add tags"
              onChange={handleTagsChange}
              value={formData.tags.map((tag) => ({ value: tag, label: tag }))}
            />
          </div>
        </div>

        {/* Rating, Stock, Images */}
        <div className={styles["form-row"]}>
          <div className={styles["form-col"]}>
            <label>Rating</label>
            <input
              type="number"
              min="1"
              max="5"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
            />
          </div>
          <div className={styles["form-col"]}>
            <label>In Stock</label>
            <input
              type="number"
              name="inStock"
              min="0"
              placeholder="Enter quantity"
              value={formData.inStock}
              onChange={handleChange}
            />
          </div>
          <div className={styles["form-col"]}>
            <label>Images</label>
            <input type="file" name="images" multiple onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className={styles["publish-btn"]} disabled={loading}>
          {loading ? "Publishing..." : "Publish and View"}
        </button>

        {/* Feedback */}
        {error && <p style={{ color: "red" }}>❌ {error}</p>}
        {success && <p style={{ color: "green" }}>✅ Product added successfully!</p>}
      </form>
    </div>
  );
}
