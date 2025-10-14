import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom"; // Add these imports
import { verifyOtp, resendOtp } from "../../Redux/authSlice";
import { toast } from "react-toastify";
import "./OtpModal.css";

const VerifyOtpPage = () => {
  const dispatch = useDispatch();
  const location = useLocation(); // Get location
  const navigate = useNavigate(); // For navigation

  // ✅ Get email from navigation state or fallback to Redux state
  const authState = useSelector((state) => state.auth || {});
  const {
    loading = false,
    error = null,
    user = null,
    token = null,
  } = authState;

  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0); // seconds remaining until resend allowed
  const COOLDOWN_SECONDS = 30;

  // Get email from location state first, then fallback to Redux state
  const email = location.state?.email || authState.email;

  const handleVerify = async () => {
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

    try {
      // Wait for the thunk to finish. unwrap() will throw if the thunk was rejected.
      await dispatch(verifyOtp({ email, otp })).unwrap();
      toast.success("Registration successful!");
      navigate("/");
    } catch (err) {
      // Show server/validation error and DO NOT navigate
      const message =
        err?.message || err?.data || "Invalid OTP. Please try again.";
      toast.error(message);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email not found. Cannot resend OTP.");
      return;
    }

    try {
      await dispatch(resendOtp({ email })).unwrap();
      toast.success("OTP resent. Check your email.");
      setCooldown(COOLDOWN_SECONDS);
    } catch (err) {
      const message = err?.message || err?.data || "Failed to resend OTP.";
      toast.error(message);
    }
  };

  // Show error if email is missing
  useEffect(() => {
    if (!email) {
      toast.error("Email information missing. Please register again.");
    }
  }, [email]);

  // Cooldown timer for resend button
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => {
      setCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [cooldown]);

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
        <div style={{ marginTop: 12 }}>
          <button
            onClick={handleResend}
            disabled={loading || cooldown > 0 || !email}
            className="resend-btn"
          >
            {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
          </button>
        </div>
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
