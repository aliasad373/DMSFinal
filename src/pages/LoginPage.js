import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { loginUser } from "../api/authApi"; // Adjust the import path as needed

import digiKhataLogo from "../assets/digikhata-logo.PNG";
import "./LoginPage.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
   const [error, setError] = useState("");

  const handleInputChange = (event) => {
    const { name, value, checked, type } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Remove the field error as the user starts typing.
    if (errors[name]) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        [name]: "",
      }));
    }

    setApiError("");
    setSuccessMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    const username = formData.username.trim();
    const password = formData.password.trim();

    if (!username) {
      newErrors.username = "Email or username is required.";
    } else if (username.length < 3) {
      newErrors.username =
        "Email or username must contain at least 3 characters.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password =
        "Password must contain at least 6 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.username.trim()) {
      setError("Please enter username.");
      return;
    }

    if (!formData.password.trim()) {
      setError("Please enter password.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await loginUser(
        formData.username.trim(),
        formData.password
      );

      console.log("Login API Response:", response);

      /*
       * We don't yet know the exact response structure
       * returned by your backend.
       *
       * These are common possibilities:
       *
       * response.token
       * response.accessToken
       * response.data.token
       * response.data.accessToken
       */

      const token =
        response?.token ||
        response?.accessToken ||
        response?.data?.token ||
        response?.data?.accessToken;

      if (token) {
        localStorage.setItem("dms_token", token);
      }

      /*
       * Store login information if backend returns
       * user/admin information.
       */

      const user =
        response?.user ||
        response?.data?.user ||
        response?.data;

      if (user) {
        localStorage.setItem(
          "dms_user",
          JSON.stringify(user)
        );
      }

      /*
       * Login successful
       */

      navigate("/dashboard", {
        replace: true,
      });

    } catch (err) {
      console.log(err)
      console.error("Login Error:", "Error");

      let message = "Unable to login. Please try again.";

      if (err.response) {
        /*
         * Backend returned an error response
         */

        console.log(
          "Login error response:",
          err.response.data
        );

        message =
          err.response.data?.message ||
          err.response.data?.error ||
          "Invalid username or password.";

      } else if (err.request) {
        /*
         * Request was sent but no response received
         */

        message =
          "Unable to connect to the server. Please check your connection.";

      } else {
        message = err.message;
      }

      setError(message);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-container">
        <aside className="login-brand-section">
          <div className="brand-circuit brand-circuit-top" />

          <div className="brand-content">
            <img
              src={digiKhataLogo}
              alt="DigiKhata"
              className="brand-logo"
            />

            <h1 className="brand-title">
              Discount Management
              <span>System</span>
            </h1>

            <div className="brand-divider" />

            <p className="brand-description">
              Manage banks, cards and discounts
              <span>all in one place.</span>
            </p>
          </div>

          <div
            className="brand-finance-icons"
            aria-hidden="true"
          >
            <div className="discount-symbol">%</div>
            <div className="bank-symbol">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="card-symbol">
              <div className="card-stripe" />
              <div className="card-chip" />
            </div>
          </div>

          <div className="brand-circle" />
          <div className="brand-dots" />
        </aside>

        <section className="login-form-section">
          <div className="login-form-wrapper">
            <header className="login-header">
              <img
                src={digiKhataLogo}
                alt="DigiKhata"
                className="mobile-logo"
              />

              <h2>Welcome Back!</h2>

              <p>Sign in to continue to your account</p>
            </header>

            <form
              className="login-form"
              onSubmit={handleLogin}
              noValidate
            >
              {apiError && (
                <div
                  className="form-message form-message-error"
                  role="alert"
                >
                  {apiError}
                </div>
              )}

              {successMessage && (
                <div
                  className="form-message form-message-success"
                  role="status"
                >
                  {successMessage}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="username">
                  Email or Username
                </label>

                <div
                  className={`input-wrapper ${
                    errors.username ? "input-error" : ""
                  }`}
                >
                  <PersonOutlinedIcon className="input-icon" />

                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your email or username"
                    autoComplete="username"
                    disabled={isLoading}
                  />
                </div>

                {errors.username && (
                  <span className="error-text">
                    {errors.username}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Password
                </label>

                <div
                  className={`input-wrapper ${
                    errors.password ? "input-error" : ""
                  }`}
                >
                  <LockOutlinedIcon className="input-icon" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={isLoading}
                  />

                  <button
                    type="button"
                    className="password-visibility-button"
                    onClick={() =>
                      setShowPassword(
                        (previousValue) => !previousValue
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <VisibilityOutlinedIcon />
                    ) : (
                      <VisibilityOffOutlinedIcon />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <span className="error-text">
                    {errors.password}
                  </span>
                )}
              </div>

              <label className="remember-container">
                <input
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />

                <span className="custom-checkbox" />

                <span className="remember-text">
                  Remember me
                </span>
              </label>

              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="button-spinner" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>

          <footer className="login-footer">
            © {new Date().getFullYear()} DigiKhata. All rights
            reserved.
          </footer>
        </section>
      </section>
    </main>
  );
};

export default LoginPage;