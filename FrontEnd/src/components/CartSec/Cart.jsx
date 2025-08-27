import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  removeFromCart,
  decreaseQuantity,
  addToCartWithBackendSync,
  clearCart,
} from "../../Redux/cartSlice";
import "./Cart.css";


const CartPage = () => {
  const navigate = useNavigate();
  const { category, subcategory, productName } = useParams();
  const { cartItems, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user); // access auth state

  // const getProductURL = (product) => {
  //   // More robust slugify function
  //   const slugify = (str) => {
  //     if (!str) return '';
  //     return str
  //       .toLowerCase()
  //       .replace(/[^a-z0-9]+/g, "-")
  //       .replace(/^-|-$/g, "");
  //   };
  
  //   const categorySlug = product.category && slugify(product.category) 
  //     ? slugify(product.category) 
  //     : "products";
    
  //   const subcategorySlug = product.subcategory && slugify(product.subcategory)
  //     ? slugify(product.subcategory)
  //     : "general";
    
  //   // Handle both title and name properties
  //   const productName = product.title || product.name || 'product';
  //   const productNameSlug = slugify(productName);
  
  //   return `/${categorySlug}/${subcategorySlug}/${productNameSlug}`;
  // };

  // 🔐 Redirect if user not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null; // prevent component from rendering before redirect

  if (cartItems.length === 0) return <h2>Your cart is empty!</h2>;

  return (
    <div className="cart-container">
      <div className="cart-items-section">
        <h2 className="cart-title">Shopping Cart</h2>
        {cartItems.map((item) => (
          <div
            key={item.productId}
            className="cart-item"
            // onClick={(e) => {
            //   if (!e.target.closest('.cart-actions')) {
            //     e.stopPropagation();
            //     const productURL = getProductURL({
            //       category: item.category,
            //       subcategory: item.subcategory,
            //       title: item.title,
            //       name: item.name
            //     });
            //     navigate(productURL);
            //   }
            // }}
            // style={{ cursor: "pointer" }}
          >
            <img src={item.image} alt={item.title} />
            <div className="cart-details">
              <h4>{item.title}</h4>
              <p>₹{item.price}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
            <div className="cart-actions">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent navigation when clicking buttons
                  dispatch(decreaseQuantity(item.productId));
                }}
              >
                -
              </button>
              <button
                onClick={async (e) => {
                  e.stopPropagation(); // Prevent navigation when clicking buttons
                  try {
                    await dispatch(
                      addToCartWithBackendSync({
                        id: item.productId,
                        name: item.title,
                        price: item.price,
                        image: item.image,
                        category: item.category,        // ← Add these
                        subcategory: item.subcategory,  // ← Add these
                      })
                    ).unwrap();
                  } catch (error) {
                    console.error("Failed to update cart:", error);
                  }
                }}
              >
                +
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent navigation when clicking buttons
                  dispatch(removeFromCart(item.productId));
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-summary-title">Summary</div>
        <div className="cart-total">Total: ₹{totalAmount}</div>
        <button
          className="clear-cart-btn"
          onClick={() => dispatch(clearCart())}
        >
          Clear Cart
        </button>
        <button
          className="place-order-btn"
          onClick={() => navigate("/order-checkout")}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CartPage;