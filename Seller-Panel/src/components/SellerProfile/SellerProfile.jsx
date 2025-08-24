import React from "react";
import { useSelector } from "react-redux";
import styles from "./SellerProfile.module.css";

const SellerProfile = () => {
  const { profile, loading, error } = useSelector((state) => state.seller);

  if (loading) {
    return <div className={styles.sellerProfile}>Loading seller data...</div>;
  }

  if (error) {
    return <div className={styles.sellerProfileError}>{error}</div>;
  }

  if (!profile) {
    return <div className={styles.sellerProfile}>No seller profile found</div>;
  }

  const seller = profile; // profile already comes from redux

  return (
    <div className={styles.sellerProfile}>
      {/* Header */}
      <div className={styles.profileHeader}>
        <div className={styles.profileAvatar}>
          {seller.sellerName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2>{seller.sellerName}</h2>
          <p className={styles.storeName}>{seller.storeName}</p>
          <span
            className={`${styles.status} ${styles[seller.status]}`}
          >
            {seller.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Contact Info */}
      <div className={styles.profileSection}>
        <h3>Contact Information</h3>
        <p><strong>Email:</strong> {seller.email}</p>
        <p><strong>Phone:</strong> {seller.phone}</p>
        <p><strong>Joined:</strong> {new Date(seller.dateJoined).toLocaleDateString()}</p>
      </div>

      {/* Business Info */}
      <div className={styles.profileSection}>
        <h3>Business Details</h3>
        <p><strong>Business Type:</strong> {seller.businessType}</p>
        {seller.gstNumber && <p><strong>GST Number:</strong> {seller.gstNumber}</p>}
        {seller.registrationNumber && <p><strong>Reg. Number:</strong> {seller.registrationNumber}</p>}
        {seller.businessAddress && (
          <p>
            <strong>Address:</strong>{" "}
            {`${seller.businessAddress.street || ""}, ${seller.businessAddress.city || ""}, ${seller.businessAddress.state || ""}, ${seller.businessAddress.country || ""} - ${seller.businessAddress.postalCode || ""}`}
          </p>
        )}
      </div>

      {/* Bank Info */}
      <div className={styles.profileSection}>
        <h3>Banking Details</h3>
        {seller.bankDetails ? (
          <>
            <p><strong>Account Holder:</strong> {seller.bankDetails.accountHolderName}</p>
            <p><strong>Account Number:</strong> {seller.bankDetails.accountNumber}</p>
            <p><strong>IFSC Code:</strong> {seller.bankDetails.ifscCode}</p>
            <p><strong>UPI ID:</strong> {seller.bankDetails.upiId}</p>
          </>
        ) : (
          <p>No bank details available</p>
        )}
      </div>

      {/* Stats */}
      <div className={styles.profileStats}>
        <div>
          <h4>{seller.totalProducts}</h4>
          <p>Products</p>
        </div>
        <div>
          <h4>{seller.totalOrders}</h4>
          <p>Orders</p>
        </div>
        <div>
          <h4>{seller.ratings}</h4>
          <p>Rating</p>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
