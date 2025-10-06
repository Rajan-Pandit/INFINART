import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Loginsection.css";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../Redux/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Get auth state
  const { user, loading, error, token } = useSelector((state) => state.auth || {});

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    
    try {
      // ✅ Wait for the login to complete and check result
      const result = await dispatch(loginUser({ email, password })).unwrap();
     
      // ✅ Check if we have user and token in the result
      if (result.user && result.token) {
      
        navigate("/");
      } 
        
    } catch (error) {
      console.error("❌ Login failed:", error);
      // Error is already handled by Redux, no need to do anything here
    }
  };

  // ✅ Check localStorage for existing session on component mount
  useEffect(() => {
    const checkExistingAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          if (parsed?.user && parsed?.token) {
            console.log("🔄 Auto-redirecting from existing session");
            navigate("/");
          }
        }
      } catch (err) {
        console.error("❌ Error checking localStorage:", err);
      }
    };

    checkExistingAuth();
  }, [navigate]);

  // ✅ Backup redirect - if Redux state gets updated
  useEffect(() => {
    if (user && token) {

      navigate("/");
    }
  }, [user, token, navigate]);

  return (
    <div className="login-background">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email"
          />

          <label>Password</label>
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter your password"
          />

          <div className="login-options">
            <label>
              <input type="checkbox" />
              Remember Me
            </label>
            <a href="#">Forget Password</a>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        {error && <p className="error-msg">Error: {error}</p>}

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;