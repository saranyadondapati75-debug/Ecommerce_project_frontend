
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function NewPassword() {

  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [loading, setLoading] = useState(false);

  // Get reset token from URL
  const queryParams = new URLSearchParams(location.search);

  const token =
    queryParams.get("token") ||
    location.state?.token ||
    "";

  // Get role
  const role = location.state?.role || "user";

  // Handle input changes
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  // Toast notification
  function showBootstrapToast(message, type = "success") {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  }

  // RESET PASSWORD FUNCTION
  async function handleSubmit(e) {
    e.preventDefault();

    // Check new password
    if (!formData.newPassword || !formData.confirmPassword) {
      showBootstrapToast(
        "Please enter both passwords.",
        "danger"
      );
      return;
    }

    // Check password length
    if (formData.newPassword.length < 8) {
      showBootstrapToast(
        "Password must contain at least 8 characters.",
        "danger"
      );
      return;
    }

    // Check matching passwords
    if (formData.newPassword !== formData.confirmPassword) {
      showBootstrapToast(
        "Passwords do not match!",
        "danger"
      );
      return;
    }

    // Check token
    if (!token.trim()) {
      showBootstrapToast(
        "Reset token is missing. Please request a new reset link.",
        "danger"
      );
      return;
    }

    try {
      setLoading(true);

      const url =
        `https://ecommerce-flask.duckdns.org/user/resetpassword/${encodeURIComponent(token)}`;

      const payload = {
        new_password: formData.newPassword,
        confirm_password: formData.confirmPassword
      };

      console.log("Reset password URL:", url);

      const res = await axios.post(
        url,
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Reset password response:", res.data);

      if (res.data.status !== "success") {
        showBootstrapToast(
          res.data.message || "Password reset failed.",
          "danger"
        );
        return;
      }

      showBootstrapToast(
        res.data.message || "Password changed successfully!",
        "success"
      );

      setFormData({
        newPassword: "",
        confirmPassword: ""
      });

      setTimeout(() => {
        navigate("/login", {
          state: { role: role }
        });
      }, 1500);

    } catch (error) {

      console.error("RESET PASSWORD ERROR:", error);

      console.log(
        "STATUS:",
        error.response?.status
      );

      console.log(
        "DATA:",
        error.response?.data
      );

      showBootstrapToast(
        error.response?.data?.message ||
        "Unable to reset password. Please try again.",
        "danger"
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Bootstrap CSS */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />

      {/* Custom CSS */}
      <style>{`
        .new-password-page {
          min-height: 100vh;
          background: #f1f5f9;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
        }

        .new-password-card {
          width: 100%;
          max-width: 500px;
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .new-password-title {
          text-align: center;
          font-size: 36px;
          font-weight: bold;
          color: #0f172a;
          margin-bottom: 20px;
        }

        .new-password-description {
          text-align: center;
          color: #64748b;
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

        .password-btn {
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

        .password-btn:hover {
          background: #38bdf8;
        }

        .password-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .back-login-link {
          display: block;
          text-align: center;
          margin-top: 20px;
          color: #38bdf8;
          text-decoration: none;
          font-weight: 600;
        }

        .back-login-link:hover {
          text-decoration: underline;
        }

        .custom-toast {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          min-width: 320px;
          border-radius: 12px;
        }

        @media(max-width: 768px) {
          .new-password-card {
            padding: 25px;
          }

          .new-password-title {
            font-size: 30px;
          }

          .custom-toast {
            right: 10px;
            left: 10px;
            min-width: auto;
          }
        }
      `}</style>

      {/* Toast message */}
      {showToast && (
        <div
          className={`toast show align-items-center text-white bg-${toastType} border-0 custom-toast`}
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body">
              {toastMessage}
            </div>

            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setShowToast(false)}
            ></button>
          </div>
        </div>
      )}

      {/* New Password Page */}
      <div className="new-password-page">

        <div className="new-password-card">

          <h1 className="new-password-title">
            New Password
          </h1>

          <p className="new-password-description">
            Enter your new password and confirm it below.
          </p>

          <form onSubmit={handleSubmit}>

            {/* New Password */}
            <div className="mb-4">

              <label className="form-label">
                New Password
              </label>

              <div className="input-group">

                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  name="newPassword"
                  placeholder="Enter New Password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  minLength={8}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="input-group-text bg-primary text-white"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label="Toggle new password visibility"
                >
                  {showPassword
                    ? <FaEyeSlash />
                    : <FaEye />}
                </button>

              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-4">

              <label className="form-label">
                Confirm Password
              </label>

              <div className="input-group">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  className="form-control"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength={8}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="input-group-text bg-primary text-white"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword
                    ? <FaEyeSlash />
                    : <FaEye />}
                </button>

              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="password-btn"
              disabled={loading}
            >
              {loading
                ? "Updating..."
                : "Update Password"}
            </button>

          </form>

          {/* Back to Login */}
          <Link
            to="/login"
            state={{ role: role }}
            className="back-login-link"
          >
            Back to Login
          </Link>

        </div>
      </div>
    </>
  );
}

export default NewPassword;
