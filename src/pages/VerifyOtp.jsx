import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  // Safely look for email or fallback to an empty string if navigated directly
  const emailFromRegister = location.state?.email || "";
  const role = location.state?.role || "user";

  const [otpData, setOtpData] = useState({
    otp: "",
    useremail: emailFromRegister,
  });

  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  function handleChange(e) {
    setOtpData({
      ...otpData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const url =
        role === "admin"
          ? "https://ecommerce-flask.duckdns.org/admin/otpverify"
          : "https://ecommerce-flask.duckdns.org/user/otpverify";

      const payload =
        role === "admin"
          ? {
              otp: otpData.otp.trim(),
              useremail: otpData.useremail.trim(),
            }
          : {
              otp: otpData.otp.trim(),
              user_email: otpData.useremail.trim(),
            };

      console.log("Sending:", payload);

      const res = await axios.post(url, payload);

      setMessage(res.data.message);
      setAlertType("success");

      setTimeout(() => {
        navigate("/login", { state: { role } });
      }, 1500);
    } catch (error) {
      console.log(error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Invalid OTP");
      setAlertType("danger");
    }
  }

  return (
    <>
      {/* Bootstrap 5.0.2 */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <style>{`
        .otp-page {
          min-height: 100vh;
          background: #f1f5f9;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .otp-card {
          width: 100%;
          max-width: 450px;
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .otp-title {
          text-align: center;
          font-size: 36px;
          font-weight: bold;
          color: #0f172a;
          margin-bottom: 30px;
        }

        .form-label {
          font-weight: 600;
          color: #334155;
        }

        .form-control {
          border-radius: 10px;
          padding: 12px;
        }

        .verify-btn {
          width: 100%;
          background: #0f172a;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 10px;
          font-size: 18px;
          font-weight: 600;
          transition: 0.3s;
        }

        .verify-btn:hover {
          background: #38bdf8;
        }

        @media(max-width: 768px) {
          .otp-card {
            padding: 25px;
          }
          .otp-title {
            font-size: 28px;
          }
        }
      `}</style>

      <div className="otp-page">
        <div className="otp-card">
          <h1 className="otp-title">Verify OTP</h1>

          <p className="text-center text-muted">
            {role === "admin" ? "Admin Verification" : "User Verification"}
          </p>

          {message && (
            <div className={`alert alert-${alertType}`}>{message}</div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Input Field */}
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="useremail"
                className="form-control"
                placeholder="Enter your email"
                value={otpData.useremail}
                onChange={handleChange}
                required
              />
            </div>

            {/* OTP Input Field */}
            <div className="mb-4">
              <label className="form-label">Enter OTP</label>
              <input
                type="text"
                name="otp"
                className="form-control"
                placeholder="Enter OTP"
                value={otpData.otp}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="verify-btn">
              Verify OTP
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default VerifyOtp;
