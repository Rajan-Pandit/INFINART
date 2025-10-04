import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom"; // Add these imports
import { verifyOtp } from "../../Redux/authSlice";
import { toast } from "react-toastify";
import "./OtpModal.css";

const VerifyOtpPage = () => {
  const dispatch = useDispatch();
  const location = useLocation(); // Get location
  const navigate = useNavigate(); // For navigation

  // ✅ Get email from navigation state or fallback to Redux state
  const authState = useSelector((state) => state.auth || {});
  const { loading = false, error = null, user = null, token = null } = authState;
  
  const [otp, setOtp] = useState("");
  
  // Get email from location state first, then fallback to Redux state
  const email = location.state?.email || authState.email;

  const handleVerify = () => {
    if (!email) {
      toast.error("Email not found. Please try registering again.");
      return;
    }
    
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }
    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }
    
    //console.log("Verifying OTP with:", { email, otp }); 

    toast.success("Registration successful!");
      navigate("/"); // Use navigate instead of window.location
    dispatch(verifyOtp({ email, otp }));
  };

  // ✅ Navigate to home when OTP verified
  useEffect(() => {
    if (user && token) {
      toast.success("Registration successful!");
      navigate("/"); // Use navigate instead of window.location
    }
  }, [user, token, navigate]);

  // Show error if email is missing
  useEffect(() => {
    if (!email) {
      toast.error("Email information missing. Please register again.");
    }
  }, [email]);

  return (
    <div className="otp-modal-overlay">
      <div className="otp-modal">
        <h2>Enter OTP</h2>
        <p className="otp-hint">OTP has been sent to {email || "your email"}</p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          maxLength={6}
          placeholder="Enter 6-digit OTP"
        />

        {error && <p className="error-msg">{error}</p>}

        <button onClick={handleVerify} disabled={loading || !email}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
        
        {!email && (
          <p className="error-msg">
            Email not found. <a href="/register">Go back to register</a>
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyOtpPage;