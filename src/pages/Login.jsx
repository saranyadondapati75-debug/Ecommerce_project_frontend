
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);

  // Toast states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // FIXED: State names match input names
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [role, setRole] = useState(
    location.state?.role || "user"
  );

  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Handle input changes
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  // Toast function
  function showBootstrapToast(message, type = "success") {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  }

  // LOGIN FUNCTION
  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.email.trim()) {
      showBootstrapToast("Email required", "danger");
      return;
    }

    if (!formData.password) {
      showBootstrapToast("Password required", "danger");
      return;
    }

    try {
      setLoginLoading(true);

      const url =
        role === "admin"
          ? "https://ecommerce-flask.duckdns.org/admin/login"
          : "https://ecommerce-flask.duckdns.org/user/login";

      // FIXED: Flask expects email and password
      const payload = {
        email: formData.email.trim(),
        password: formData.password
      };

      console.log("Login URL:", url);
      console.log("Login role:", role);
      console.log("Login payload:", {
        email: payload.email,
        password: "[HIDDEN]"
      });

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

      console.log("Login response:", res.data);

      if (res.data.status !== "success") {
        showBootstrapToast(
          res.data.message || "Login failed",
          "danger"
        );
        return;
      }

      if (role === "admin") {
        if (!res.data.admin) {
          showBootstrapToast(
            "Admin details missing in server response",
            "danger"
          );
          return;
        }

        localStorage.setItem(
          "admin",
          JSON.stringify(res.data.admin)
        );

        showBootstrapToast(
          res.data.message || "Admin login successful",
          "success"
        );

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);

      } else {
        if (!res.data.user) {
          showBootstrapToast(
            "User details missing in server response",
            "danger"
          );
          return;
        }

        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );

        showBootstrapToast(
          res.data.message || "Login successful",
          "success"
        );

        setTimeout(() => {
          navigate("/user-dashboard");
        }, 1000);
      }

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);

      showBootstrapToast(
        error.response?.data?.message ||
        "Login failed. Please try again.",
        "danger"
      );

    } finally {
      setLoginLoading(false);
    }
  }

  // FORGOT PASSWORD FUNCTION
  async function handleForgotPassword(e) {
    e.preventDefault();

    if (!forgotEmail.trim()) {
      showBootstrapToast(
        "Please enter your registered email address",
        "danger"
      );
      return;
    }

    try {
      setForgotLoading(true);

      const url =
        role === "admin"
          ? "https://ecommerce-flask.duckdns.org/admin/forgotpassword"
          : "https://ecommerce-flask.duckdns.org/user/forgotpassword";

      const res = await axios.post(
        url,
        {
          email: forgotEmail.trim()
        },
        {
          withCredentials: true
        }
      );

      showBootstrapToast(
        res.data.message ||
        "Password reset instructions have been sent",
        "success"
      );

      setShowForgotPassword(false);
      setForgotEmail("");

    } catch (error) {
      console.error("FORGOT PASSWORD ERROR:", error);

      showBootstrapToast(
        error.response?.data?.message ||
        "Unable to process your request. Please try again.",
        "danger"
      );

    } finally {
      setForgotLoading(false);
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
        .login-page {
          min-height: 100vh;
          background: #f1f5f9;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
        }

        .login-card {
          width: 100%;
          max-width: 500px;
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .login-title {
          text-align: center;
          font-size: 38px;
          font-weight: bold;
          color: #0f172a;
          margin-bottom: 35px;
        }

        .form-label {
          font-weight: 600;
          color: #334155;
        }

        .form-control {
          border-radius: 10px;
          padding: 12px;
        }

        .login-btn {
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

        .login-btn:hover {
          background: #38bdf8;
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .register-link {
          text-align: center;
          margin-top: 20px;
          color: #64748b;
        }

        .register-link a {
          color: #38bdf8;
          text-decoration: none;
          font-weight: 600;
        }

        .forgot-password-link {
          display: block;
          text-align: right;
          margin-top: 10px;
          color: #0d6efd;
          text-decoration: none;
          font-weight: 600;
          cursor: pointer;
        }

        .forgot-password-link:hover {
          text-decoration: underline;
        }

        .back-login-link {
          display: block;
          text-align: center;
          margin-top: 15px;
          color: #0d6efd;
          text-decoration: none;
          cursor: pointer;
        }

        .custom-toast {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          min-width: 320px;
          border-radius: 12px;
        }

        @media(max-width:768px) {
          .login-card {
            padding: 25px;
          }

          .login-title {
            font-size: 30px;
          }

          .custom-toast {
            right: 10px;
            left: 10px;
            min-width: auto;
          }
        }
      `}</style>

      {/* Toast notification */}
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

      <div className="login-page">
        <div className="login-card">

          <h1 className="login-title">
            {showForgotPassword
              ? "Forgot Password"
              : role === "admin"
              ? "Admin Login"
              : "User Login"}
          </h1>

          {/* Forgot Password Form */}
          {showForgotPassword ? (
            <>
              <p className="text-muted text-center mb-4">
                Enter your registered email address to request a password reset.
              </p>

              <form onSubmit={handleForgotPassword}>
                <div className="mb-4">
                  <label className="form-label">
                    Email Address
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your registered email"
                    value={forgotEmail}
                    onChange={(e) =>
                      setForgotEmail(e.target.value)
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="login-btn"
                  disabled={forgotLoading}
                >
                  {forgotLoading
                    ? "Sending..."
                    : "Reset Password"}
                </button>
              </form>

              <a
                href="#"
                className="back-login-link"
                onClick={(e) => {
                  e.preventDefault();
                  setShowForgotPassword(false);
                  setForgotEmail("");
                }}
              >
                Back to Login
              </a>
            </>
          ) : (
            <>
              {/* Select User or Admin */}
              <div className="mb-4">
                <label className="form-label d-block">
                  Login As
                </label>

                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="role"
                    value="user"
                    checked={role === "user"}
                    onChange={(e) => setRole(e.target.value)}
                  />

                  <label className="form-check-label">
                    User
                  </label>
                </div>

                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === "admin"}
                    onChange={(e) => setRole(e.target.value)}
                  />

                  <label className="form-check-label">
                    Admin
                  </label>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label">
                    Email Address
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    Password
                  </label>

                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      name="password"
                      placeholder="Enter Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />

                    <span
                      className="input-group-text bg-primary text-white"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword
                        ? <FaEyeSlash />
                        : <FaEye />}
                    </span>
                  </div>

                  {/* Forgot Password Link */}
                  <a
                    href="#"
                    className="forgot-password-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowForgotPassword(true);
                      setForgotEmail(formData.email);
                    }}
                  >
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="login-btn"
                  disabled={loginLoading}
                >
                  {loginLoading ? "Logging in..." : "Login"}
                </button>

              </form>

              <div className="register-link">
                Don’t have an account?{" "}
                <Link to="/register">
                  Register
                </Link>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}

export default Login;
