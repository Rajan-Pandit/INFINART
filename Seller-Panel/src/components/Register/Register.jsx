import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Registersection.css";

import { useDispatch, useSelector } from "react-redux";
import { registerUser, verifyOtp } from "../../Redux/"; // updated import

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const { user, token, email: otpEmail, loading, error, msg } = useSelector(
    (state) => state.auth
  );

  // Step 1: Register form submit
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const userData = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email,
      password,
    };
    dispatch(registerUser(userData));
  };

  // Step 2: OTP verify submit
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    dispatch(verifyOtp({ email: otpEmail, otp }));
  };

  useEffect(() => {
    if (user && token) {
      navigate("/");
    }
  }, [user, token, navigate]);

  return (
    <div className="register-background">
      <div className="register-container">
        {!otpEmail ? (
          <>
            <h2>Register</h2>
            <form onSubmit={handleRegisterSubmit}>
              <label>First Name</label>
              <input
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                placeholder="Enter your first name"
              />

              <label>Last Name</label>
              <input
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                placeholder="Enter your last name"
              />

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

              <button type="submit" disabled={loading}>
                {loading ? "Sending OTP..." : "Register"}
              </button>
            </form>
            {error && <p className="error-msg">{error}</p>}
            <p>
              Have an account? <Link to="/login">Login</Link>
            </p>
          </>
        ) : (
          <>
            <h2>Verify OTP</h2>
            <p className="otp-msg">
              {msg || `We sent an OTP to ${otpEmail}`}
            </p>
            <form onSubmit={handleOtpSubmit}>
              <label>Enter OTP</label>
              <input
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                type="text"
                placeholder="Enter OTP"
              />
              <button type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
            {error && <p className="error-msg">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
