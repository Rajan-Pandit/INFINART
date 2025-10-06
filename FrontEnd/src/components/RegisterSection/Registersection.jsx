import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Registersection.css';

import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../Redux/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userEmail, setUserEmail] = useState(""); 
  const [password, setPassword] = useState("");

  const authState = useSelector((state) => state.auth || {});
  const { loading = false, error = null } = authState;

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: userEmail,
      password,
    };

    //console.log("Sending userData:", userData);
    dispatch(registerUser(userData));

    // ✅ Navigate immediately to verify OTP page
navigate("/verifyotp", { state: { email: userEmail } });
  };

  return (
    <div className="register-background">
      <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
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
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
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
      </div>
    </div>
  );
};

export default Register;
